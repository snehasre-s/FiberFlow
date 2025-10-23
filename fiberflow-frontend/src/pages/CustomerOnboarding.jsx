import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CustomerOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Step 1: Customer Details
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    servicePlan: 'Basic',
    
    // Step 2: Deployment Zone
    deploymentZone: '',
    fdhLocation: '',
    splitterPort: '',
    
    // Step 3: Device Allocation
    ontSerialNumber: '',
    routerSerialNumber: '',
    cableLength: '',
    
    // Step 4: Additional Info
    installationDate: '',
    technician: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        break;
      
      case 2:
        if (!formData.deploymentZone.trim()) newErrors.deploymentZone = 'Deployment zone is required';
        if (!formData.fdhLocation.trim()) newErrors.fdhLocation = 'FDH location is required';
        if (!formData.splitterPort.trim()) newErrors.splitterPort = 'Splitter port is required';
        break;
      
      case 3:
        if (!formData.ontSerialNumber.trim()) newErrors.ontSerialNumber = 'ONT serial number is required';
        if (!formData.routerSerialNumber.trim()) newErrors.routerSerialNumber = 'Router serial number is required';
        if (!formData.cableLength.trim()) newErrors.cableLength = 'Cable length is required';
        break;
      
      case 4:
        if (!formData.installationDate) newErrors.installationDate = 'Installation date is required';
        if (!formData.technician.trim()) newErrors.technician = 'Technician assignment is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(4)) return;
    
    setLoading(true);
    
    try {
      const response = await api.post('/customers/onboard', formData);
      
      // Show success message
      alert(`Customer onboarded successfully! Customer ID: ${response.data.id}`);
      
      // Reset form and go back to step 1
      setFormData({
        name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
        servicePlan: 'Basic', deploymentZone: '', fdhLocation: '', splitterPort: '',
        ontSerialNumber: '', routerSerialNumber: '', cableLength: '',
        installationDate: '', technician: '', notes: ''
      });
      setCurrentStep(1);
      
      // Navigate to support dashboard or stay
      // navigate('/support-dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to onboard customer');
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = () => {
    const steps = [
      { number: 1, label: 'Customer Details' },
      { number: 2, label: 'Deployment Zone' },
      { number: 3, label: 'Device Allocation' },
      { number: 4, label: 'Summary' }
    ];

    return (
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          {steps.map((step, index) => (
            <div key={step.number} className="flex-grow-1 d-flex align-items-center">
              <div className="text-center" style={{ minWidth: '100px' }}>
                <div
                  className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2
                    ${currentStep >= step.number ? 'bg-primary text-white' : 'bg-light text-muted'}`}
                  style={{ width: '40px', height: '40px', fontWeight: 'bold' }}
                >
                  {currentStep > step.number ? (
                    <i className="bi bi-check-lg"></i>
                  ) : (
                    step.number
                  )}
                </div>
                <div className={`small ${currentStep >= step.number ? 'text-primary fw-bold' : 'text-muted'}`}>
                  {step.label}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className="flex-grow-1 mx-2"
                  style={{
                    height: '2px',
                    backgroundColor: currentStep > step.number ? '#0d6efd' : '#dee2e6'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label fw-semibold">Full Name *</label>
        <input
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter customer name"
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>
      
      <div className="col-md-6">
        <label className="form-label fw-semibold">Email Address *</label>
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="customer@example.com"
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      
      <div className="col-md-6">
        <label className="form-label fw-semibold">Phone Number *</label>
        <input
          type="tel"
          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="9876543210"
          maxLength="10"
        />
        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
      </div>
      
      <div className="col-md-6">
        <label className="form-label fw-semibold">Service Plan *</label>
        <select
          className="form-select"
          name="servicePlan"
          value={formData.servicePlan}
          onChange={handleChange}
        >
          <option value="Basic">Basic - 50 Mbps</option>
          <option value="Standard">Standard - 100 Mbps</option>
          <option value="Premium">Premium - 200 Mbps</option>
          <option value="Enterprise">Enterprise - 500 Mbps</option>
        </select>
      </div>
      
      <div className="col-12">
        <label className="form-label fw-semibold">Address *</label>
        <textarea
          className={`form-control ${errors.address ? 'is-invalid' : ''}`}
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter full address"
          rows="2"
        />
        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
      </div>
      
      <div className="col-md-4">
        <label className="form-label fw-semibold">City *</label>
        <input
          type="text"
          className={`form-control ${errors.city ? 'is-invalid' : ''}`}
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Bangalore"
        />
        {errors.city && <div className="invalid-feedback">{errors.city}</div>}
      </div>
      
      <div className="col-md-4">
        <label className="form-label fw-semibold">State *</label>
        <input
          type="text"
          className={`form-control ${errors.state ? 'is-invalid' : ''}`}
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="Karnataka"
        />
        {errors.state && <div className="invalid-feedback">{errors.state}</div>}
      </div>
      
      <div className="col-md-4">
        <label className="form-label fw-semibold">Pincode *</label>
        <input
          type="text"
          className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="560001"
          maxLength="6"
        />
        {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label fw-semibold">Deployment Zone *</label>
        <select
          className={`form-select ${errors.deploymentZone ? 'is-invalid' : ''}`}
          name="deploymentZone"
          value={formData.deploymentZone}
          onChange={handleChange}
        >
          <option value="">Select deployment zone</option>
          <option value="Zone-A-North">Zone A - North Bangalore</option>
          <option value="Zone-B-South">Zone B - South Bangalore</option>
          <option value="Zone-C-East">Zone C - East Bangalore</option>
          <option value="Zone-D-West">Zone D - West Bangalore</option>
        </select>
        {errors.deploymentZone && <div className="invalid-feedback">{errors.deploymentZone}</div>}
      </div>
      
      <div className="col-md-6">
        <label className="form-label fw-semibold">FDH Location *</label>
        <select
          className={`form-select ${errors.fdhLocation ? 'is-invalid' : ''}`}
          name="fdhLocation"
          value={formData.fdhLocation}
          onChange={handleChange}
        >
          <option value="">Select FDH location</option>
          <option value="FDH-001">FDH-001 - Main Street Hub</option>
          <option value="FDH-002">FDH-002 - Park Avenue Hub</option>
          <option value="FDH-003">FDH-003 - Central Square Hub</option>
          <option value="FDH-004">FDH-004 - Tech Park Hub</option>
        </select>
        {errors.fdhLocation && <div className="invalid-feedback">{errors.fdhLocation}</div>}
      </div>
      
      <div className="col-md-6">
        <label className="form-label fw-semibold">Splitter Port *</label>
        <select
          className={`form-select ${errors.splitterPort ? 'is-invalid' : ''}`}
          name="splitterPort"
          value={formData.splitterPort}
          onChange={handleChange}
        >
          <option value="">Select available port</option>
          <option value="SP1-Port-01">Splitter 1 - Port 01</option>
          <option value="SP1-Port-02">Splitter 1 - Port 02</option>
          <option value="SP2-Port-01">Splitter 2 - Port 01</option>
          <option value="SP2-Port-03">Splitter 2 - Port 03</option>
        </select>
        {errors.splitterPort && <div className="invalid-feedback">{errors.splitterPort}</div>}
      </div>
      
      <div className="col-12">
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Network Path Preview:</strong> Headend → {formData.fdhLocation || 'FDH'} → {formData.splitterPort || 'Splitter Port'} → Customer ONT
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label fw-semibold">ONT Serial Number *</label>
        <input
          type="text"
          className={`form-control ${errors.ontSerialNumber ? 'is-invalid' : ''}`}
          name="ontSerialNumber"
          value={formData.ontSerialNumber}
          onChange={handleChange}
          placeholder="ONT-2024-XXXX"
        />
        {errors.ontSerialNumber && <div className="invalid-feedback">{errors.ontSerialNumber}</div>}
      </div>
      
      <div className="col-md-6">
        <label className="form-label fw-semibold">Router Serial Number *</label>
        <input
          type="text"
          className={`form-control ${errors.routerSerialNumber ? 'is-invalid' : ''}`}
          name="routerSerialNumber"
          value={formData.routerSerialNumber}
          onChange={handleChange}
          placeholder="RTR-2024-XXXX"
        />
        {errors.routerSerialNumber && <div className="invalid-feedback">{errors.routerSerialNumber}</div>}
      </div>
      
      <div className="col-md-6">
        <label className="form-label fw-semibold">Cable Length (meters) *</label>
        <input
          type="number"
          className={`form-control ${errors.cableLength ? 'is-invalid' : ''}`}
          name="cableLength"
          value={formData.cableLength}
          onChange={handleChange}
          placeholder="e.g., 150"
          min="1"
        />
        {errors.cableLength && <div className="invalid-feedback">{errors.cableLength}</div>}
      </div>
      
      <div className="col-12">
        <div className="card bg-light">
          <div className="card-body">
            <h6 className="mb-3">Allocated Devices:</h6>
            <div className="row">
              <div className="col-md-4">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-router text-primary me-2 fs-4"></i>
                  <div>
                    <small className="text-muted d-block">ONT Device</small>
                    <strong>{formData.ontSerialNumber || 'Not assigned'}</strong>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-hdd-network text-success me-2 fs-4"></i>
                  <div>
                    <small className="text-muted d-block">Router</small>
                    <strong>{formData.routerSerialNumber || 'Not assigned'}</strong>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-diagram-3 text-info me-2 fs-4"></i>
                  <div>
                    <small className="text-muted d-block">Cable</small>
                    <strong>{formData.cableLength ? `${formData.cableLength}m` : 'Not specified'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label fw-semibold">Installation Date *</label>
        <input
          type="date"
          className={`form-control ${errors.installationDate ? 'is-invalid' : ''}`}
          name="installationDate"
          value={formData.installationDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
        />
        {errors.installationDate && <div className="invalid-feedback">{errors.installationDate}</div>}
      </div>
      
      <div className="col-md-6">
        <label className="form-label fw-semibold">Assign Technician *</label>
        <select
          className={`form-select ${errors.technician ? 'is-invalid' : ''}`}
          name="technician"
          value={formData.technician}
          onChange={handleChange}
        >
          <option value="">Select technician</option>
          <option value="tech-001">John Smith (Available)</option>
          <option value="tech-002">Sarah Johnson (Available)</option>
          <option value="tech-003">Mike Williams (Busy)</option>
        </select>
        {errors.technician && <div className="invalid-feedback">{errors.technician}</div>}
      </div>
      
      <div className="col-12">
        <label className="form-label fw-semibold">Installation Notes</label>
        <textarea
          className="form-control"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any special instructions for installation..."
          rows="3"
        />
      </div>
      
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h6 className="mb-0"><i className="bi bi-file-text me-2"></i>Onboarding Summary</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong>Customer Information:</strong>
                <ul className="list-unstyled mt-2 ms-3">
                  <li><i className="bi bi-person me-2 text-primary"></i>{formData.name}</li>
                  <li><i className="bi bi-envelope me-2 text-primary"></i>{formData.email}</li>
                  <li><i className="bi bi-telephone me-2 text-primary"></i>{formData.phone}</li>
                  <li><i className="bi bi-geo-alt me-2 text-primary"></i>{formData.address}, {formData.city}</li>
                </ul>
              </div>
              
              <div className="col-md-6 mb-3">
                <strong>Service Details:</strong>
                <ul className="list-unstyled mt-2 ms-3">
                  <li><i className="bi bi-speedometer2 me-2 text-success"></i>Plan: {formData.servicePlan}</li>
                  <li><i className="bi bi-diagram-3 me-2 text-success"></i>Zone: {formData.deploymentZone}</li>
                  <li><i className="bi bi-hdd-network me-2 text-success"></i>FDH: {formData.fdhLocation}</li>
                  <li><i className="bi bi-link-45deg me-2 text-success"></i>Port: {formData.splitterPort}</li>
                </ul>
              </div>
              
              <div className="col-md-6 mb-3">
                <strong>Devices Allocated:</strong>
                <ul className="list-unstyled mt-2 ms-3">
                  <li><i className="bi bi-router me-2 text-info"></i>ONT: {formData.ontSerialNumber}</li>
                  <li><i className="bi bi-hdd-network me-2 text-info"></i>Router: {formData.routerSerialNumber}</li>
                  <li><i className="bi bi-rulers me-2 text-info"></i>Cable: {formData.cableLength}m</li>
                </ul>
              </div>
              
              <div className="col-md-6 mb-3">
                <strong>Installation:</strong>
                <ul className="list-unstyled mt-2 ms-3">
                  <li><i className="bi bi-calendar-check me-2 text-warning"></i>Date: {formData.installationDate}</li>
                  <li><i className="bi bi-person-badge me-2 text-warning"></i>Technician: {formData.technician}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">
            <i className="bi bi-person-plus me-2 text-primary"></i>
            Customer Onboarding
          </h2>
          <p className="text-muted">Complete the wizard to onboard a new customer</p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              {renderProgressBar()}
              
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}

                <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Previous
                  </button>

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={nextStep}
                    >
                      Next
                      <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Complete Onboarding
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOnboarding;