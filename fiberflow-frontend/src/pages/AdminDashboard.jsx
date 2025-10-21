import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalAssets: 0,
      activeUsers: 0,
      pendingTasks: 0,
      totalCustomers: 0
    },
    recentActivities: [],
    userLogs: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">
            <i className="bi bi-speedometer2 me-2 text-primary"></i>
            Admin Dashboard
          </h2>
          <p className="text-muted">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card stat-card border-start border-primary border-4 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Assets</p>
                  <h3 className="mb-0 fw-bold">{dashboardData.stats.totalAssets}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="bi bi-box-seam text-primary fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card stat-card border-start border-success border-4 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Active Users</p>
                  <h3 className="mb-0 fw-bold">{dashboardData.stats.activeUsers}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <i className="bi bi-people text-success fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card stat-card border-start border-warning border-4 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Pending Tasks</p>
                  <h3 className="mb-0 fw-bold">{dashboardData.stats.pendingTasks}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <i className="bi bi-clock-history text-warning fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card stat-card border-start border-info border-4 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Customers</p>
                  <h3 className="mb-0 fw-bold">{dashboardData.stats.totalCustomers}</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <i className="bi bi-person-check text-info fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Links */}
      <div className="row mb-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="bi bi-lightning-charge me-2 text-warning"></i>
                Quick Access
              </h5>
              <div className="row g-3">
                <div className="col-md-3">
                  <Link to="/customer-onboarding" className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center py-3">
                    <i className="bi bi-person-plus fs-4 me-2"></i>
                    <span>Customer Onboarding</span>
                  </Link>
                </div>
                <div className="col-md-3">
                  <Link to="/asset-inventory" className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center py-3">
                    <i className="bi bi-box-seam fs-4 me-2"></i>
                    <span>Asset Inventory</span>
                  </Link>
                </div>
                <div className="col-md-3">
                  <Link to="/network-topology" className="btn btn-outline-info w-100 d-flex align-items-center justify-content-center py-3">
                    <i className="bi bi-diagram-3 fs-4 me-2"></i>
                    <span>Network Topology</span>
                  </Link>
                </div>
                <div className="col-md-3">
                  <Link to="/audit-logs" className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center py-3">
                    <i className="bi bi-file-text fs-4 me-2"></i>
                    <span>Audit Logs</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent System Activity & User Logs */}
      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <i className="bi bi-activity me-2 text-primary"></i>
                Recent System Activity
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-hover">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th>Time</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Details</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentActivities.length > 0 ? (
                      dashboardData.recentActivities.map((activity) => (
                        <tr key={activity.id}>
                          <td className="text-muted small">{new Date(activity.timestamp).toLocaleString()}</td>
                          <td>
                            <i className="bi bi-person-circle me-1"></i>
                            {activity.username}
                          </td>
                          <td>{activity.action}</td>
                          <td className="text-muted small">{activity.details}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(activity.status)}`}>
                              {activity.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-4">
                          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                          No recent activities
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <i className="bi bi-person-lines-fill me-2 text-success"></i>
                User Login Activity
              </h5>
            </div>
            <div className="card-body">
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {dashboardData.userLogs.length > 0 ? (
                  dashboardData.userLogs.map((log) => (
                    <div key={log.id} className="d-flex align-items-start mb-3 pb-3 border-bottom">
                      <div className={`bg-${getRoleColor(log.role)} bg-opacity-10 p-2 rounded me-3`}>
                        <i className={`bi bi-person-badge text-${getRoleColor(log.role)}`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <strong>{log.username}</strong>
                          <span className="badge bg-secondary">{log.role}</span>
                        </div>
                        <small className="text-muted">
                          <i className="bi bi-clock me-1"></i>
                          {new Date(log.loginTime).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-person-x fs-1 d-block mb-2"></i>
                    No user login activity
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'success':
    case 'completed':
      return 'bg-success';
    case 'pending':
    case 'in progress':
      return 'bg-warning';
    case 'failed':
    case 'error':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
};

const getRoleColor = (role) => {
  switch (role) {
    case 'Admin':
      return 'danger';
    case 'Planner':
      return 'primary';
    case 'Technician':
      return 'success';
    case 'Support':
      return 'info';
    default:
      return 'secondary';
  }
};

export default AdminDashboard;