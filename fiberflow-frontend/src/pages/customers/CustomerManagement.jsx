import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CustomerManagement = () => {
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Customer Details
    name: '',
    address: '',
    neighborhood: '',
    plan: '',
    connectionType: 'Wired',
    
    // Step 2: Asset Assignment
    ontId: '',
    routerId: '',
    
    // Step 3: Network Assignment
    fdhId: '',
    splitterId: '',
    assignedPort: ''
  });

  // Options for dropdowns
  const [availableONTs, setAvailableONTs] = useState([]);
  const [availableRouters, setAvailableRouters] = useState([]);
  const [fdhs, setFdhs] = useState([]);
  const [splitters, setSplitters] = useState([]);
  const [availablePorts, setAvailablePorts] = useState([]);

  const plans = [
    'Basic 50 Mbps',
    'Standard 100 Mbps',
    'Premium 200 Mbps',
    'Ultra 500 Mbps',
    'Enterprise 1 Gbps'
  ];

  useEffect(() => {
    fetchCustomers();
    fetchAssetOptions();
    fetchNetworkOptions();
  }, []);

  useEffect(() => {
    if (formData.fdhId) {
      fetchSplittersByFDH(formData.fdhId);
    }
  }, [formData.fdhId]);

  useEffect(() => {
    if (formData.splitterId) {
      fetchAvailablePorts(formData.splitterId);
    }
  }, [formData.splitterId]);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers/all');
      setCustomers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  const fetchAssetOptions = async () => {
    try {
      const [ontsRes, routersRes] = await Promise.all([
        api.get('/deployment-lead/available-assets?type=ONT'),
        api.get('/deployment-lead/available-assets?type=Router')
      ]);
      setAvailableONTs(ontsRes.data);
      setAvailableRouters(routersRes.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const fetchNetworkOptions = async () => {
    try {
      const response = await api.get('/customers/network-options');
      setFdhs(response.data.fdhs);
    } catch (error) {
      console.error('Error fetching network options:', error);
    }
  };

  const fetchSplittersByFDH = async (fdhId) => {
    try {
      const response = await api.get(`/customers/splitters-by-fdh/${fdhId}`);
      setSplitters(response.data);
      setFormData(prev => ({ ...prev, splitterId: '', assignedPort: '' }));
    } catch (error) {
      console.error('Error fetching splitters:', error);
    }
  };

  const fetchAvailablePorts = async (splitterId) => {
    try {
      const response = await api.get(`/customers/available-ports/${splitterId}`);
      setAvailablePorts(response.data);
      setFormData(prev => ({ ...prev, assignedPort: '' }));
    } catch (error) {
      console.error('Error fetching available ports:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNewCustomer = () => {
    setEditMode(false);
    setSelectedCustomerId(null);
    setFormData({
      name: '',
      address: '',
      neighborhood: '',
      plan: '',
      connectionType: 'Wired',
      ontId: '',
      routerId: '',
      fdhId: '',
      splitterId: '',
      assignedPort: ''
    });
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleEditCustomer = async (customerId) => {
    try {
      const response = await api.get(`/customers/${customerId}`);
      const customer = response.data;
      
      setEditMode(true);
      setSelectedCustomerId(customerId);
      setFormData({
        name: customer.name,
        address: customer.address,
        neighborhood: customer.neighborhood,
        plan: customer.plan,
        connectionType: customer.connectionType,
        ontId: customer.ontId || '',
        routerId: customer.routerId || '',
        fdhId: customer.fdhId || '',
        splitterId: customer.splitterId || '',
        assignedPort: customer.assignedPort || ''
      });
      setCurrentStep(1);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.address && formData.neighborhood && formData.plan;
      case 2:
        return formData.ontId && formData.routerId;
      case 3:
        return formData.fdhId && formData.splitterId && formData.assignedPort;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    } else {
      alert('Please fill all required fields');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await api.put(`/customers/${selectedCustomerId}`, formData);
        alert('Customer updated successfully!');
      } else {
        await api.post('/customers/create-complete', formData);
        alert('Customer created successfully!');
      }
      
      setShowModal(false);
      fetchCustomers();
      fetchAssetOptions(); // Refresh available assets
    } catch (error) {
      console.error('Error saving customer:', error);
      alert(error.response?.data?.message || 'Failed to save customer');
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Pending': 'warning'
    };
    return statusClasses[status] || 'secondary';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold mb-1">
            <i className="bi bi-people-fill me-2 text-primary"></i>
            Customer Management
          </h2>
          <p className="text-muted mb-0">Complete customer onboarding and management</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={handleNewCustomer}>
            <i className="bi bi-person-plus-fill me-2"></i>
            Add New Customer
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="card border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="border-0 ps-4">Customer Name</th>
                  <th className="border-0">Address</th>
                  <th className="border-0">Neighborhood</th>
                  <th className="border-0">Plan</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Splitter</th>
                  <th className="border-0">Port</th>
                  <th className="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer.customerId}>
                      <td className="ps-4 fw-semibold">{customer.name}</td>
                      <td>
                        <small className="text-muted">{customer.address}</small>
                      </td>
                      <td>
                        <i className="bi bi-geo-alt me-1 text-muted"></i>
                        {customer.neighborhood}
                      </td>
                      <td>
                        <span className="badge bg-info">{customer.plan}</span>
                      </td>
                      <td>
                        <span className={`badge bg-${getStatusBadgeClass(customer.status)}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td>
                        {customer.splitterModel ? (
                          <span className="text-muted small">{customer.splitterModel}</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        {customer.assignedPort ? (
                          <span className="badge bg-secondary">Port {customer.assignedPort}</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditCustomer(customer.customerId)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-5">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      <p className="mb-0">No customers found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Multi-Step Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editMode ? 'Edit Customer' : 'New Customer Onboarding'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              
              <div className="modal-body">
                {/* Progress Steps */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className={`flex-fill text-center ${currentStep >= 1 ? 'text-primary' : 'text-muted'}`}>
                        <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-light'}`} 
                             style={{ width: '50px', height: '50px' }}>
                          <i className="bi bi-person-fill fs-5"></i>
                        </div>
                        <div className="small fw-semibold">Customer Details</div>
                      </div>
                      
                      <div className={`flex-fill ${currentStep >= 2 ? 'border-primary' : 'border-secondary'}`} 
                           style={{ height: '2px', margin: '0 10px', borderTop: '2px solid' }}></div>
                      
                      <div className={`flex-fill text-center ${currentStep >= 2 ? 'text-primary' : 'text-muted'}`}>
                        <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-light'}`} 
                             style={{ width: '50px', height: '50px' }}>
                          <i className="bi bi-box-seam fs-5"></i>
                        </div>
                        <div className="small fw-semibold">Asset Assignment</div>
                      </div>
                      
                      <div className={`flex-fill ${currentStep >= 3 ? 'border-primary' : 'border-secondary'}`} 
                           style={{ height: '2px', margin: '0 10px', borderTop: '2px solid' }}></div>
                      
                      <div className={`flex-fill text-center ${currentStep >= 3 ? 'text-primary' : 'text-muted'}`}>
                        <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-light'}`} 
                             style={{ width: '50px', height: '50px' }}>
                          <i className="bi bi-diagram-3 fs-5"></i>
                        </div>
                        <div className="small fw-semibold">Network Assignment</div>
                      </div>
                      
                      <div className={`flex-fill ${currentStep >= 4 ? 'border-primary' : 'border-secondary'}`} 
                           style={{ height: '2px', margin: '0 10px', borderTop: '2px solid' }}></div>
                      
                      <div className={`flex-fill text-center ${currentStep >= 4 ? 'text-primary' : 'text-muted'}`}>
                        <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${currentStep >= 4 ? 'bg-primary text-white' : 'bg-light'}`} 
                             style={{ width: '50px', height: '50px' }}>
                          <i className="bi bi-check-circle fs-5"></i>
                        </div>
                        <div className="small fw-semibold">Review & Confirm</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="border rounded p-4" style={{ minHeight: '400px' }}>
                  
                  {/* Step 1: Customer Details */}
                  {currentStep === 1 && (
                    <div>
                      <h5 className="mb-4 fw-bold">
                        <i className="bi bi-person-circle me-2 text-primary"></i>
                        Customer Basic Information
                      </h5>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Full Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter customer name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                          />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Plan <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            value={formData.plan}
                            onChange={(e) => handleInputChange('plan', e.target.value)}
                          >
                            <option value="">Select Plan</option>
                            {plans.map(plan => (
                              <option key={plan} value={plan}>{plan}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="col-12">
                          <label className="form-label fw-semibold">
                            Address <span className="text-danger">*</span>
                          </label>
                          <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Enter complete address"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                          ></textarea>
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Neighborhood <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter neighborhood"
                            value={formData.neighborhood}
                            onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                          />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Connection Type <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            value={formData.connectionType}
                            onChange={(e) => handleInputChange('connectionType', e.target.value)}
                          >
                            <option value="Wired">Wired Connection</option>
                            <option value="Wireless">Wireless Connection</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Asset Assignment */}
                  {currentStep === 2 && (
                    <div>
                      <h5 className="mb-4 fw-bold">
                        <i className="bi bi-box-seam me-2 text-success"></i>
                        Assign Equipment (Technician)
                      </h5>
                      <div className="row g-4">
                        <div className="col-md-6">
                          <div className="card border">
                            <div className="card-body">
                              <h6 className="mb-3 fw-semibold">
                                <i className="bi bi-hdd-network me-2 text-primary"></i>
                                ONT (Optical Network Terminal) <span className="text-danger">*</span>
                              </h6>
                              <select
                                className="form-select"
                                value={formData.ontId}
                                onChange={(e) => handleInputChange('ontId', e.target.value)}
                              >
                                <option value="">Select ONT</option>
                                {availableONTs.map(ont => (
                                  <option key={ont.assetId} value={ont.assetId}>
                                    {ont.model} - {ont.serialNumber}
                                  </option>
                                ))}
                              </select>
                              <small className="text-muted d-block mt-2">
                                {availableONTs.length} ONTs available
                              </small>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="card border">
                            <div className="card-body">
                              <h6 className="mb-3 fw-semibold">
                                <i className="bi bi-router me-2 text-info"></i>
                                Router <span className="text-danger">*</span>
                              </h6>
                              <select
                                className="form-select"
                                value={formData.routerId}
                                onChange={(e) => handleInputChange('routerId', e.target.value)}
                              >
                                <option value="">Select Router</option>
                                {availableRouters.map(router => (
                                  <option key={router.assetId} value={router.assetId}>
                                    {router.model} - {router.serialNumber}
                                  </option>
                                ))}
                              </select>
                              <small className="text-muted d-block mt-2">
                                {availableRouters.length} Routers available
                              </small>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-12">
                          <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            <strong>Note:</strong> Selected assets will be marked as "Assigned" and removed from available inventory.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Network Assignment */}
                  {currentStep === 3 && (
                    <div>
                      <h5 className="mb-4 fw-bold">
                        <i className="bi bi-diagram-3 me-2 text-warning"></i>
                        Network Connection (Deployment Lead)
                      </h5>
                      <div className="row g-4">
                        <div className="col-md-4">
                          <div className="card border">
                            <div className="card-body">
                              <h6 className="mb-3 fw-semibold">
                                <i className="bi bi-hdd-rack me-2 text-primary"></i>
                                FDH (Fiber Distribution Hub) <span className="text-danger">*</span>
                              </h6>
                              <select
                                className="form-select"
                                value={formData.fdhId}
                                onChange={(e) => handleInputChange('fdhId', e.target.value)}
                              >
                                <option value="">Select FDH</option>
                                {fdhs.map(fdh => (
                                  <option key={fdh.fdhId} value={fdh.fdhId}>
                                    {fdh.name} - {fdh.region}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-md-4">
                          <div className="card border">
                            <div className="card-body">
                              <h6 className="mb-3 fw-semibold">
                                <i className="bi bi-diagram-2 me-2 text-info"></i>
                                Splitter <span className="text-danger">*</span>
                              </h6>
                              <select
                                className="form-select"
                                value={formData.splitterId}
                                onChange={(e) => handleInputChange('splitterId', e.target.value)}
                                disabled={!formData.fdhId}
                              >
                                <option value="">Select Splitter</option>
                                {splitters.map(splitter => (
                                  <option key={splitter.splitterId} value={splitter.splitterId}>
                                    {splitter.model} - {splitter.location}
                                  </option>
                                ))}
                              </select>
                              {!formData.fdhId && (
                                <small className="text-muted d-block mt-2">
                                  Select FDH first
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-md-4">
                          <div className="card border">
                            <div className="card-body">
                              <h6 className="mb-3 fw-semibold">
                                <i className="bi bi-plug me-2 text-success"></i>
                                Port <span className="text-danger">*</span>
                              </h6>
                              <select
                                className="form-select"
                                value={formData.assignedPort}
                                onChange={(e) => handleInputChange('assignedPort', e.target.value)}
                                disabled={!formData.splitterId}
                              >
                                <option value="">Select Port</option>
                                {availablePorts.map(port => (
                                  <option key={port} value={port}>
                                    Port {port}
                                  </option>
                                ))}
                              </select>
                              {!formData.splitterId && (
                                <small className="text-muted d-block mt-2">
                                  Select Splitter first
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-12">
                          <div className="card bg-light border-0">
                            <div className="card-body">
                              <h6 className="fw-semibold mb-3">Network Hierarchy Preview</h6>
                              <div className="d-flex align-items-center gap-3">
                                <div className="text-center">
                                  <i className="bi bi-hdd-rack-fill fs-2 text-primary d-block mb-1"></i>
                                  <small className="text-muted">
                                    {fdhs.find(f => f.fdhId == formData.fdhId)?.name || 'FDH'}
                                  </small>
                                </div>
                                <i className="bi bi-arrow-right fs-4 text-muted"></i>
                                <div className="text-center">
                                  <i className="bi bi-diagram-2-fill fs-2 text-info d-block mb-1"></i>
                                  <small className="text-muted">
                                    {splitters.find(s => s.splitterId == formData.splitterId)?.model || 'Splitter'}
                                  </small>
                                </div>
                                <i className="bi bi-arrow-right fs-4 text-muted"></i>
                                <div className="text-center">
                                  <i className="bi bi-plug-fill fs-2 text-success d-block mb-1"></i>
                                  <small className="text-muted">
                                    {formData.assignedPort ? `Port ${formData.assignedPort}` : 'Port'}
                                  </small>
                                </div>
                                <i className="bi bi-arrow-right fs-4 text-muted"></i>
                                <div className="text-center">
                                  <i className="bi bi-house-fill fs-2 text-warning d-block mb-1"></i>
                                  <small className="text-muted">{formData.name || 'Customer'}</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review & Confirm */}
                  {currentStep === 4 && (
                    <div>
                      <h5 className="mb-4 fw-bold">
                        <i className="bi bi-check-circle me-2 text-success"></i>
                        Review & Confirm
                      </h5>
                      <div className="row g-4">
                        <div className="col-md-6">
                          <div className="card border">
                            <div className="card-header bg-light">
                              <h6 className="mb-0 fw-semibold">Customer Information</h6>
                            </div>
                            <div className="card-body">
                              <table className="table table-sm table-borderless mb-0">
                                <tbody>
                                  <tr>
                                    <td className="text-muted">Name:</td>
                                    <td className="fw-semibold">{formData.name}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">Address:</td>
                                    <td className="fw-semibold">{formData.address}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">Neighborhood:</td>
                                    <td className="fw-semibold">{formData.neighborhood}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">Plan:</td>
                                    <td><span className="badge bg-info">{formData.plan}</span></td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">Connection:</td>
                                    <td className="fw-semibold">{formData.connectionType}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="card border">
                            <div className="card-header bg-light">
                              <h6 className="mb-0 fw-semibold">Assigned Equipment</h6>
                            </div>
                            <div className="card-body">
                              <div className="mb-3">
                                <div className="fw-semibold text-muted small">ONT</div>
                                <div>
                                  {availableONTs.find(ont => ont.assetId == formData.ontId)?.model || 'N/A'}
                                  <br />
                                  <small className="text-muted">
                                    {availableONTs.find(ont => ont.assetId == formData.ontId)?.serialNumber || ''}
                                  </small>
                                </div>
                              </div>
                              <div>
                                <div className="fw-semibold text-muted small">Router</div>
                                <div>
                                  {availableRouters.find(router => router.assetId == formData.routerId)?.model || 'N/A'}
                                  <br />
                                  <small className="text-muted">
                                    {availableRouters.find(router => router.assetId == formData.routerId)?.serialNumber || ''}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="card border">
                            <div className="card-header bg-light">
                              <h6 className="mb-0 fw-semibold">Network Assignment</h6>
                            </div>
                            <div className="card-body">
                              <table className="table table-sm table-borderless mb-0">
                                <tbody>
                                  <tr>
                                    <td className="text-muted">FDH:</td>
                                    <td className="fw-semibold">
                                      {fdhs.find(f => f.fdhId == formData.fdhId)?.name || 'N/A'}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">Splitter:</td>
                                    <td className="fw-semibold">
                                      {splitters.find(s => s.splitterId == formData.splitterId)?.model || 'N/A'}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">Port:</td>
                                    <td>
                                      <span className="badge bg-success">Port {formData.assignedPort || 'N/A'}</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="alert alert-success">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            <strong>Ready to Submit!</strong> Please review all information before confirming.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              <div className="modal-footer">
                {currentStep > 1 && (
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={handlePrevious}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Previous
                  </button>
                )}
                
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                {currentStep < 4 ? (
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={!validateStep()}
                  >
                    Next
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={handleSubmit}
                  >
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {editMode ? 'Update Customer' : 'Create Customer'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;