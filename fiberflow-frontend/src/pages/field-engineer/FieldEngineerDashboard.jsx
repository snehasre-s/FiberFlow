import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const FieldEngineerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({
    todayCreated: 0,
    weekCreated: 0,
    pendingActivation: 0
  });

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    neighborhood: '',
    plan: 'Basic 50 Mbps',
    connectionType: 'Wired'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/field-engineer/dashboard');
      setCustomers(response.data.recentCustomers);
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Customer name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Neighborhood is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      const response = await api.post('/field-engineer/create-customer', formData);
      
      // Success notification
      alert(`Customer created successfully! Customer ID: ${response.data.customerId}`);
      
      // Reset form
      setFormData({
        name: '',
        address: '',
        neighborhood: '',
        plan: 'Basic 50 Mbps',
        connectionType: 'Wired'
      });
      
      setShowCreateModal(false);
      
      // Refresh dashboard data
      fetchDashboardData();
      
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create customer');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Active': { bg: 'success', text: 'Active' },
      'Pending': { bg: 'warning', text: 'Pending Activation' },
      'Inactive': { bg: 'secondary', text: 'Inactive' }
    };
    return badges[status] || badges['Pending'];
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
            <i className="bi bi-person-badge-fill me-2" style={{ color: '#f59e0b' }}></i>
            Field Engineer Dashboard
          </h2>
          <p className="text-muted mb-0">Create and manage customer profiles</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Create New Customer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-2 small fw-semibold text-uppercase">Created Today</p>
                  <h3 className="fw-bold mb-0">{stats.todayCreated}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ 
                       width: '50px', 
                       height: '50px', 
                       background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                       boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                     }}>
                  <i className="bi bi-calendar-check-fill text-white fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-2 small fw-semibold text-uppercase">This Week</p>
                  <h3 className="fw-bold mb-0">{stats.weekCreated}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ 
                       width: '50px', 
                       height: '50px', 
                       background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                       boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                     }}>
                  <i className="bi bi-graph-up-arrow text-white fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-2 small fw-semibold text-uppercase">Pending Activation</p>
                  <h3 className="fw-bold mb-0">{stats.pendingActivation}</h3>
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

      {/* Recent Customers */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-people-fill me-2 text-primary"></i>
                Recently Created Customers
              </h5>
            </div>
            <div className="card-body p-0">
              {customers.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 ps-4">Customer ID</th>
                        <th className="border-0">Name</th>
                        <th className="border-0">Neighborhood</th>
                        <th className="border-0">Plan</th>
                        <th className="border-0">Connection Type</th>
                        <th className="border-0">Status</th>
                        <th className="border-0">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.customerId}>
                          <td className="ps-4">
                            <span className="badge bg-primary bg-opacity-10 text-primary">
                              #{customer.customerId}
                            </span>
                          </td>
                          <td className="fw-semibold">{customer.name}</td>
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
                            <span className={`badge ${customer.connectionType === 'Wired' ? 'bg-success' : 'bg-warning'} bg-opacity-10`}
                                  style={{ color: customer.connectionType === 'Wired' ? '#059669' : '#d97706' }}>
                              <i className={`bi bi-${customer.connectionType === 'Wired' ? 'ethernet' : 'wifi'} me-1`}></i>
                              {customer.connectionType}
                            </span>
                          </td>
                          <td>
                            <span className={`badge bg-${getStatusBadge(customer.status).bg}`}>
                              {getStatusBadge(customer.status).text}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(customer.createdAt).toLocaleDateString()}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
                  <p className="text-muted mb-3">No customers created yet</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Create Your First Customer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Customer Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-person-plus-fill me-2 text-primary"></i>
                  Create New Customer
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body px-4">
                  
                  {/* Customer Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Customer Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter customer's full name"
                      style={{ borderRadius: '8px' }}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Address <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter full address"
                      rows="2"
                      style={{ borderRadius: '8px' }}
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>

                  {/* Neighborhood */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Neighborhood <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.neighborhood ? 'is-invalid' : ''}`}
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      placeholder="e.g., Koramangala, Indiranagar"
                      style={{ borderRadius: '8px' }}
                    />
                    {errors.neighborhood && <div className="invalid-feedback">{errors.neighborhood}</div>}
                  </div>

                  <div className="row">
                    {/* Service Plan */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Service Plan <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="plan"
                        value={formData.plan}
                        onChange={handleChange}
                        style={{ borderRadius: '8px' }}
                      >
                        <option value="Basic 50 Mbps">Basic 50 Mbps</option>
                        <option value="Standard 100 Mbps">Standard 100 Mbps</option>
                        <option value="Premium 200 Mbps">Premium 200 Mbps</option>
                        <option value="Enterprise 500 Mbps">Enterprise 500 Mbps</option>
                      </select>
                    </div>

                    {/* Connection Type */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Connection Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="connectionType"
                        value={formData.connectionType}
                        onChange={handleChange}
                        style={{ borderRadius: '8px' }}
                      >
                        <option value="Wired">Wired (Fiber to Home)</option>
                        <option value="Wireless">Wireless (WiFi)</option>
                      </select>
                    </div>
                  </div>

                  {/* Info Alert */}
                  <div className="alert alert-info d-flex align-items-start" 
                       style={{ borderRadius: '8px', border: 'none', background: '#e0f2fe' }}>
                    <i className="bi bi-info-circle-fill me-2 mt-1"></i>
                    <div>
                      <small>
                        <strong>Note:</strong> After creating the customer profile, the system will automatically 
                        generate a deployment task for asset assignment and installation scheduling.
                      </small>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0 px-4 pb-4">
                  <button 
                    type="button" 
                    className="btn btn-light"
                    onClick={() => setShowCreateModal(false)}
                    style={{ borderRadius: '8px' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting}
                    style={{ borderRadius: '8px' }}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Create Customer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldEngineerDashboard;