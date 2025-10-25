import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Define asset config as a constant outside the component
// This prevents it from being recreated on every render
const ASSET_CONFIG = {
  ont: { label: 'ONT Devices', icon: 'router', color: '#667eea' },
  router: { label: 'Routers', icon: 'hdd-network', color: '#10b981' },
  fdh: { label: 'FDH Units', icon: 'hdd-rack', color: '#f59e0b' },
  splitter: { label: 'Splitters', icon: 'diagram-3', color: '#3b82f6' },
  switch: { label: 'Switches', icon: 'diagram-2', color: '#8b5cf6' },
  cpe: { label: 'CPE', icon: 'router-fill', color: '#ec4899' },
  fiberRoll: { label: 'Fiber Rolls', icon: 'bezier2', color: '#6366f1' }
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalCustomers: 0,
      totalAssets: 0,
      pendingTasks: 0,
      activeTechnicians: 0
    },
    recentAuditLogs: [],
    assetSummary: {
      ont: 0,
      router: 0,
      fdh: 0,
      splitter: 0,
      switch: 0,
      cpe: 0,
      fiberRoll: 0
    }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Set loading to true when refetching
      setLoading(true); 
      const response = await api.get('/admin/dashboard');
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
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
            <i className="bi bi-speedometer2 me-2" style={{ color: '#667eea' }}></i>
            Admin Dashboard
          </h2>
          <p className="text-muted mb-0">Welcome back! Here's your system overview.</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-primary" onClick={fetchDashboardData} disabled={loading}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="row g-4 mb-4">
        {/* Total Customers */}
        <div className="col-md-6 col-xl-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-2 small fw-semibold text-uppercase">Total Customers</p>
                  <h3 className="fw-bold mb-0">{dashboardData.stats.totalCustomers}</h3>
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
              <div className="mt-3">
                <Link to="/customers" className="text-decoration-none small fw-semibold">
                  View All <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Total Assets */}
        <div className="col-md-6 col-xl-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-2 small fw-semibold text-uppercase">Total Assets</p>
                  <h3 className="fw-bold mb-0">{dashboardData.stats.totalAssets}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ 
                       width: '50px', 
                       height: '50px', 
                       background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                       boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                     }}>
                  <i className="bi bi-box-seam-fill text-white fs-4"></i>
                </div>
              </div>
              <div className="mt-3">
                <Link to="/assets" className="text-decoration-none small fw-semibold">
                  Manage Assets <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="col-md-6 col-xl-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-2 small fw-semibold text-uppercase">Pending Tasks</p>
                  <h3 className="fw-bold mb-0">{dashboardData.stats.pendingTasks}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ 
                       width: '50px', 
                       height: '50px', 
                       background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                       boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                     }}>
                  <i className="bi bi-clock-history text-white fs-4"></i>
                </div>
              </div>
              <div className="mt-3">
                <Link to="/deployment-tasks" className="text-decoration-none small fw-semibold">
                  View Tasks <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Active Technicians */}
        <div className="col-md-6 col-xl-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-2 small fw-semibold text-uppercase">Active Technicians</p>
                  <h3 className="fw-bold mb-0">{dashboardData.stats.activeTechnicians}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ 
                       width: '50px', 
                       height: '50px', 
                       background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                       boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                     }}>
                  <i className="bi bi-tools text-white fs-4"></i>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-muted small">Field Staff</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Summary & Quick Actions */}
      <div className="row g-4 mb-4">
        
        {/* Asset Summary */}
        <div className="col-lg-8">
          <div className="card border-0 h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-pie-chart-fill me-2 text-primary"></i>
                Asset Inventory Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {Object.entries(dashboardData.assetSummary).map(([key, value]) => {
                  
                  // --- FIX ---
                  // Set up a default config for keys that might not be in ASSET_CONFIG
                  const defaultConfig = { 
                    label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the key as a fallback label
                    icon: 'question-circle-fill', // A generic icon
                    color: '#6c757d' // A neutral color
                  };

                  // Use the config from ASSET_CONFIG if it exists, otherwise use the default
                  const config = ASSET_CONFIG[key] || defaultConfig;
                  // --- END FIX ---
                  
                  return (
                    <div key={key} className="col-md-6 col-lg-4">
                      <div className="d-flex align-items-center p-3 rounded" 
                           style={{ background: `${config.color}10` }}>
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                             style={{ 
                               width: '45px', 
                               height: '45px', 
                               background: `${config.color}20`
                             }}>
                          <i className={`bi bi-${config.icon} fs-5`} style={{ color: config.color }}></i>
                        </div>
                        <div>
                          <div className="text-muted small">{config.label}</div>
                          <div className="fw-bold fs-5">{value}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="card border-0 h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-lightning-charge-fill me-2 text-warning"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/customer-onboarding" className="btn btn-outline-primary text-start">
                  <i className="bi bi-person-plus me-2"></i>
                  Add New Customer
                </Link>
                <Link to="/assets" className="btn btn-outline-success text-start">
                  <i className="bi bi-box-seam me-2"></i>
                  Manage Assets
                </Link>
                <Link to="/network-topology" className="btn btn-outline-info text-start">
                  <i className="bi bi-diagram-3 me-2"></i>
                  View Network Map
                </Link>
                <Link to="/audit-logs" className="btn btn-outline-secondary text-start">
                  <i className="bi bi-file-text me-2"></i>
                  View Audit Logs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity/Audit Logs */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0">
            <div className="card-header bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-activity me-2 text-primary"></i>
                  Recent Activity
                </h5>
                <Link to="/audit-logs" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
            </div>
            <div className="card-body p-0">
              {dashboardData.recentAuditLogs.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 ps-4">Timestamp</th>
                        <th className="border-0">User</th>
                        <th className="border-0">Action</th>
                        <th className="border-0">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentAuditLogs.map((log) => (
                        <tr key={log.logId}>
                          <td className="ps-4">
                            <small className="text-muted">
                              {new Date(log.timestamp).toLocaleString()}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-2"
                                   style={{ width: '32px', height: '32px' }}>
                                <i className="bi bi-person-fill text-primary small"></i>
                              </div>
                              <span className="fw-semibold">{log.username}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-primary bg-opacity-10 text-primary">
                              {log.actionType}
                            </span>
                          </td>
                          <td className="text-muted">{log.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
                  <p className="text-muted mb-0">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;