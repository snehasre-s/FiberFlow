import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SupportDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      openTickets: 0,
      resolvedToday: 0,
      avgResponseTime: 0,
      totalCustomers: 0
    },
    customers: [],
    recentTickets: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/support/dashboard');
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleViewCustomer = async (customerId) => {
    try {
      const response = await api.get(`/support/customer/${customerId}`);
      setSelectedCustomer(response.data);
      setShowCustomerModal(true);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  const filteredCustomers = dashboardData.customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Pending': 'warning'
    };
    return statusClasses[status] || 'secondary';
  };

  const getTicketPriorityClass = (priority) => {
    const priorityClasses = {
      'High': 'danger',
      'Medium': 'warning',
      'Low': 'info'
    };
    return priorityClasses[priority] || 'secondary';
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
            <i className="bi bi-headset me-2 text-info"></i>
            Support Dashboard
          </h2>
          <p className="text-muted mb-0">Customer support and ticket management</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-primary" onClick={fetchDashboardData}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Support Metrics */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                  <i className="bi bi-ticket-perforated-fill text-warning fs-3"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{dashboardData.metrics.openTickets}</h3>
                  <small className="text-muted">Open Tickets</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                  <i className="bi bi-check-circle-fill text-success fs-3"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{dashboardData.metrics.resolvedToday}</h3>
                  <small className="text-muted">Resolved Today</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                  <i className="bi bi-clock-fill text-info fs-3"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{dashboardData.metrics.avgResponseTime}h</h3>
                  <small className="text-muted">Avg Response Time</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                  <i className="bi bi-people-fill text-primary fs-3"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{dashboardData.metrics.totalCustomers}</h3>
                  <small className="text-muted">Total Customers</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets & Customer List */}
      <div className="row g-4 mb-4">
        <div className="col-lg-5">
          <div className="card border-0">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-ticket-detailed-fill me-2 text-warning"></i>
                Recent Support Tickets
              </h5>
            </div>
            <div className="card-body p-0">
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {dashboardData.recentTickets.length > 0 ? (
                  dashboardData.recentTickets.map((ticket) => (
                    <div key={ticket.ticketId} className="p-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="flex-grow-1">
                          <div className="fw-semibold mb-1">
                            {ticket.customerName}
                            <span className={`badge bg-${getTicketPriorityClass(ticket.priority)} ms-2 small`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <div className="text-muted small mb-2">{ticket.issue}</div>
                          <div className="small text-muted">
                            <i className="bi bi-clock me-1"></i>
                            {new Date(ticket.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <span className={`badge bg-${ticket.status === 'Resolved' ? 'success' : 'warning'}`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-5">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    <p className="mb-0">No recent tickets</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0">
            <div className="card-header bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-people-fill me-2 text-primary"></i>
                  Customer Directory
                </h5>
                <div className="input-group" style={{ maxWidth: '300px' }}>
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table className="table table-hover mb-0">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th className="border-0 ps-4">Customer</th>
                      <th className="border-0">Plan</th>
                      <th className="border-0">Status</th>
                      <th className="border-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <tr key={customer.customerId}>
                          <td className="ps-4">
                            <div className="fw-semibold">{customer.name}</div>
                            <small className="text-muted">
                              <i className="bi bi-geo-alt me-1"></i>
                              {customer.neighborhood}
                            </small>
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
                            <div className="btn-group btn-group-sm">
                              <button 
                                className="btn btn-outline-primary"
                                onClick={() => handleViewCustomer(customer.customerId)}
                                title="View Details"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              <button 
                                className="btn btn-outline-success"
                                title="Call Customer"
                              >
                                <i className="bi bi-telephone"></i>
                              </button>
                              <button 
                                className="btn btn-outline-info"
                                title="Send Email"
                              >
                                <i className="bi bi-envelope"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-5">
                          <i className="bi bi-search fs-1 d-block mb-2"></i>
                          <p className="mb-0">No customers found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-person-circle me-2"></i>
                  Customer Details
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowCustomerModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="small text-muted mb-1">Name</label>
                    <div className="fw-semibold">{selectedCustomer.name}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="small text-muted mb-1">Status</label>
                    <div>
                      <span className={`badge bg-${getStatusBadgeClass(selectedCustomer.status)}`}>
                        {selectedCustomer.status}
                      </span>
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="small text-muted mb-1">Address</label>
                    <div className="fw-semibold">{selectedCustomer.address}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="small text-muted mb-1">Neighborhood</label>
                    <div className="fw-semibold">{selectedCustomer.neighborhood}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="small text-muted mb-1">Plan</label>
                    <div>
                      <span className="badge bg-primary">{selectedCustomer.plan}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="small text-muted mb-1">Connection Type</label>
                    <div className="fw-semibold">{selectedCustomer.connectionType}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="small text-muted mb-1">Created At</label>
                    <div className="fw-semibold">
                      {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Assigned Assets */}
                  {selectedCustomer.assignedAssets && selectedCustomer.assignedAssets.length > 0 && (
                    <div className="col-12 mt-3">
                      <label className="small text-muted mb-2">Assigned Assets</label>
                      <div className="d-flex flex-wrap gap-2">
                        {selectedCustomer.assignedAssets.map((asset, index) => (
                          <span key={index} className="badge bg-info">
                            {asset.assetType} - {asset.serialNumber}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Splitter Info */}
                  {selectedCustomer.splitterInfo && (
                    <div className="col-12 mt-3">
                      <label className="small text-muted mb-2">Connection Info</label>
                      <div className="p-3 bg-light rounded">
                        <div className="row g-2">
                          <div className="col-6">
                            <small className="text-muted">Splitter</small>
                            <div className="fw-semibold">{selectedCustomer.splitterInfo.model}</div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Port</small>
                            <div className="fw-semibold">Port {selectedCustomer.assignedPort}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowCustomerModal(false)}
                >
                  Close
                </button>
                <button type="button" className="btn btn-success">
                  <i className="bi bi-telephone me-2"></i>
                  Call Customer
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="bi bi-ticket-perforated me-2"></i>
                  Create Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportDashboard;