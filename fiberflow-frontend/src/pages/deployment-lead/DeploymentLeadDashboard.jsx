import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DeploymentLeadDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    assetsAllocated: 0,
    availableAssets: 0,
    pendingAllocations: 0
  });

  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showDeallocateModal, setShowDeallocateModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [allocateForm, setAllocateForm] = useState({
    customerId: '',
    assetId: '',
    assetType: 'ONT'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/deployment-lead/dashboard');
      setCustomers(response.data.customers);
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const fetchAvailableAssets = async (assetType) => {
    try {
      const response = await api.get(`/deployment-lead/available-assets?type=${assetType}`);
      setAvailableAssets(response.data);
    } catch (error) {
      console.error('Error fetching available assets:', error);
    }
  };

  const openAllocateModal = (customer) => {
    setSelectedCustomer(customer);
    setAllocateForm({
      customerId: customer.customerId,
      assetId: '',
      assetType: 'ONT'
    });
    fetchAvailableAssets('ONT');
    setShowAllocateModal(true);
  };

  const openDeallocateModal = (customer, asset) => {
    setSelectedCustomer(customer);
    setSelectedAsset(asset);
    setShowDeallocateModal(true);
  };

  const handleAllocateFormChange = (e) => {
    const { name, value } = e.target;
    setAllocateForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'assetType') {
      fetchAvailableAssets(value);
      setAllocateForm(prev => ({ ...prev, assetId: '' }));
    }
  };

  const handleAllocateAsset = async (e) => {
    e.preventDefault();

    try {
      await api.post('/deployment-lead/allocate-asset', allocateForm);
      alert('Asset allocated successfully!');
      setShowAllocateModal(false);
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to allocate asset');
    }
  };

  const handleDeallocateAsset = async () => {
    try {
      await api.post('/deployment-lead/deallocate-asset', {
        customerId: selectedCustomer.customerId,
        assetId: selectedAsset.assetId
      });
      alert('Asset deallocated successfully!');
      setShowDeallocateModal(false);
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to deallocate asset');
    }
  };

  const getAssetIcon = (type) => {
    const icons = {
      'ONT': 'router',
      'Router': 'hdd-network',
      'Switch': 'diagram-2',
      'CPE': 'router-fill',
      'FDH': 'hdd-rack',
      'Splitter': 'diagram-3',
      'FiberRoll': 'bezier2'
    };
    return icons[type] || 'box';
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
            <i className="bi bi-boxes me-2" style={{ color: '#6c757d' }}></i>
            Deployment Lead Dashboard
          </h2>
          <p className="text-muted mb-0">Manage asset allocation and lifecycle</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-primary" onClick={fetchDashboardData}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-2 small fw-semibold text-uppercase">Total Customers</p>
                  <h3 className="fw-bold mb-0">{stats.totalCustomers}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ 
                       width: '50px', 
                       height: '50px', 
                       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                       boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                     }}>
                  <i className="bi bi-people-fill text-white fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-2 small fw-semibold text-uppercase">Assets Allocated</p>
                  <h3 className="fw-bold mb-0">{stats.assetsAllocated}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ 
                       width: '50px', 
                       height: '50px', 
                       background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                       boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                     }}>
                  <i className="bi bi-check-circle-fill text-white fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-2 small fw-semibold text-uppercase">Available Assets</p>
                  <h3 className="fw-bold mb-0">{stats.availableAssets}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ 
                       width: '50px', 
                       height: '50px', 
                       background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                       boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                     }}>
                  <i className="bi bi-box-seam-fill text-white fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-2 small fw-semibold text-uppercase">Pending</p>
                  <h3 className="fw-bold mb-0">{stats.pendingAllocations}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ 
                       width: '50px', 
                       height: '50px', 
                       background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                       boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                     }}>
                  <i className="bi bi-hourglass-split text-white fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customers with Asset Allocation */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-diagram-2-fill me-2 text-primary"></i>
                Customer Asset Management
              </h5>
            </div>
            <div className="card-body p-0">
              {customers.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 ps-4">Customer</th>
                        <th className="border-0">Location</th>
                        <th className="border-0">Plan</th>
                        <th className="border-0">Allocated Assets</th>
                        <th className="border-0">Status</th>
                        <th className="border-0">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.customerId}>
                          <td className="ps-4">
                            <div>
                              <div className="fw-semibold">{customer.name}</div>
                              <small className="text-muted">ID: #{customer.customerId}</small>
                            </div>
                          </td>
                          <td>
                            <i className="bi bi-geo-alt me-1 text-muted"></i>
                            {customer.neighborhood}
                          </td>
                          <td>
                            <span className="badge bg-info bg-opacity-10 text-info">
                              {customer.plan}
                            </span>
                          </td>
                          <td>
                            {customer.allocatedAssets && customer.allocatedAssets.length > 0 ? (
                              <div className="d-flex flex-wrap gap-1">
                                {customer.allocatedAssets.map((asset) => (
                                  <span 
                                    key={asset.assetId}
                                    className="badge bg-success bg-opacity-10 text-success cursor-pointer"
                                    onClick={() => openDeallocateModal(customer, asset)}
                                    title="Click to deallocate"
                                  >
                                    <i className={`bi bi-${getAssetIcon(asset.assetType)} me-1`}></i>
                                    {asset.assetType}
                                    <i className="bi bi-x-circle ms-1"></i>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted small">No assets allocated</span>
                            )}
                          </td>
                          <td>
                            <span className={`badge bg-${customer.status === 'Active' ? 'success' : customer.status === 'Pending' ? 'warning' : 'secondary'}`}>
                              {customer.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openAllocateModal(customer)}
                            >
                              <i className="bi bi-plus-circle me-1"></i>
                              Allocate Asset
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
                  <p className="text-muted mb-0">No customers found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Allocate Asset Modal */}
      {showAllocateModal && selectedCustomer && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-plus-circle-fill me-2 text-success"></i>
                  Allocate Asset
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowAllocateModal(false)}
                ></button>
              </div>
              
              <form onSubmit={handleAllocateAsset}>
                <div className="modal-body px-4">
                  
                  {/* Customer Info */}
                  <div className="alert alert-info mb-3" style={{ borderRadius: '8px', border: 'none' }}>
                    <strong>Customer:</strong> {selectedCustomer.name}<br />
                    <small className="text-muted">ID: #{selectedCustomer.customerId} | {selectedCustomer.neighborhood}</small>
                  </div>

                  {/* Asset Type */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Asset Type</label>
                    <select
                      className="form-select"
                      name="assetType"
                      value={allocateForm.assetType}
                      onChange={handleAllocateFormChange}
                      style={{ borderRadius: '8px' }}
                      required
                    >
                      <option value="ONT">ONT</option>
                      <option value="Router">Router</option>
                      <option value="Switch">Switch</option>
                      <option value="CPE">CPE</option>
                    </select>
                  </div>

                  {/* Available Assets */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Select Asset</label>
                    <select
                      className="form-select"
                      name="assetId"
                      value={allocateForm.assetId}
                      onChange={handleAllocateFormChange}
                      style={{ borderRadius: '8px' }}
                      required
                    >
                      <option value="">-- Select Available Asset --</option>
                      {availableAssets.map((asset) => (
                        <option key={asset.assetId} value={asset.assetId}>
                          {asset.serialNumber} - {asset.model} ({asset.location})
                        </option>
                      ))}
                    </select>
                    {availableAssets.length === 0 && (
                      <small className="text-danger">No available {allocateForm.assetType} assets</small>
                    )}
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0 px-4 pb-4">
                  <button 
                    type="button" 
                    className="btn btn-light"
                    onClick={() => setShowAllocateModal(false)}
                    style={{ borderRadius: '8px' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={!allocateForm.assetId}
                    style={{ borderRadius: '8px' }}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Allocate Asset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Deallocate Asset Modal */}
      {showDeallocateModal && selectedCustomer && selectedAsset && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-x-circle-fill me-2 text-danger"></i>
                  Deallocate Asset
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDeallocateModal(false)}
                ></button>
              </div>
              
              <div className="modal-body px-4">
                <div className="alert alert-warning" style={{ borderRadius: '8px', border: 'none' }}>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Are you sure you want to deallocate this asset?
                </div>

                <div className="mb-3">
                  <strong>Customer:</strong> {selectedCustomer.name}<br />
                  <strong>Asset Type:</strong> {selectedAsset.assetType}<br />
                  <strong>Serial Number:</strong> {selectedAsset.serialNumber}<br />
                  <strong>Model:</strong> {selectedAsset.model}
                </div>

                <p className="text-muted small mb-0">
                  The asset will be returned to inventory and marked as available.
                </p>
              </div>

              <div className="modal-footer border-0 pt-0 px-4 pb-4">
                <button 
                  type="button" 
                  className="btn btn-light"
                  onClick={() => setShowDeallocateModal(false)}
                  style={{ borderRadius: '8px' }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleDeallocateAsset}
                  style={{ borderRadius: '8px' }}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Deallocate Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentLeadDashboard;