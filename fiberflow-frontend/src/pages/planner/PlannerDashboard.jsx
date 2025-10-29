import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PlannerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    networkMetrics: {
      totalFDH: 0,
      totalSplitters: 0,
      totalPorts: 0,
      usedPorts: 0,
      activeConnections: 0,
      faults: 0
    },
    regionalData: [],
    capacityData: [],
    recentActivities: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/planner/dashboard');
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const calculateUtilization = (used, total) => {
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
  };

  const getUtilizationColor = (percentage) => {
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    if (percentage >= 50) return 'info';
    return 'success';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const utilization = calculateUtilization(
    dashboardData.networkMetrics.usedPorts, 
    dashboardData.networkMetrics.totalPorts
  );

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold mb-1">
            <i className="bi bi-diagram-3-fill me-2 text-primary"></i>
            Planner Dashboard
          </h2>
          <p className="text-muted mb-0">Network planning and capacity management</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-primary" onClick={fetchDashboardData}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Network Overview Metrics */}
      <div className="row g-4 mb-4">
        <div className="col-md-4 col-xl-2">
          <div className="card border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-hdd-rack-fill text-primary fs-1 mb-2"></i>
              <h3 className="fw-bold mb-0">{dashboardData.networkMetrics.totalFDH}</h3>
              <small className="text-muted">FDH Units</small>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-xl-2">
          <div className="card border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-diagram-3-fill text-info fs-1 mb-2"></i>
              <h3 className="fw-bold mb-0">{dashboardData.networkMetrics.totalSplitters}</h3>
              <small className="text-muted">Splitters</small>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-xl-2">
          <div className="card border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-plug-fill text-success fs-1 mb-2"></i>
              <h3 className="fw-bold mb-0">{dashboardData.networkMetrics.totalPorts}</h3>
              <small className="text-muted">Total Ports</small>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-xl-2">
          <div className="card border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-check-circle-fill text-success fs-1 mb-2"></i>
              <h3 className="fw-bold mb-0">{dashboardData.networkMetrics.usedPorts}</h3>
              <small className="text-muted">Used Ports</small>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-xl-2">
          <div className="card border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-people-fill text-primary fs-1 mb-2"></i>
              <h3 className="fw-bold mb-0">{dashboardData.networkMetrics.activeConnections}</h3>
              <small className="text-muted">Active</small>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-xl-2">
          <div className="card border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-2"></i>
              <h3 className="fw-bold mb-0">{dashboardData.networkMetrics.faults}</h3>
              <small className="text-muted">Faults</small>
            </div>
          </div>
        </div>
      </div>

      {/* Capacity Overview */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card border-0 h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-pie-chart-fill me-2 text-primary"></i>
                Overall Capacity Utilization
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Port Usage</span>
                <span className="fw-bold fs-4">{utilization}%</span>
              </div>
              <div className="progress mb-3" style={{ height: '30px' }}>
                <div 
                  className={`progress-bar bg-${getUtilizationColor(utilization)}`}
                  style={{ width: `${utilization}%` }}
                >
                  {dashboardData.networkMetrics.usedPorts} / {dashboardData.networkMetrics.totalPorts}
                </div>
              </div>
              
              <div className="row g-3 mt-4">
                <div className="col-6">
                  <div className="p-3 bg-light rounded text-center">
                    <div className="fw-bold fs-5">{dashboardData.networkMetrics.totalPorts - dashboardData.networkMetrics.usedPorts}</div>
                    <small className="text-muted">Available Ports</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded text-center">
                    <div className="fw-bold fs-5">
                      {Math.round(dashboardData.networkMetrics.activeConnections / dashboardData.networkMetrics.totalSplitters) || 0}
                    </div>
                    <small className="text-muted">Avg per Splitter</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-bar-chart-fill me-2 text-success"></i>
                Regional Distribution
              </h5>
            </div>
            <div className="card-body">
              {dashboardData.regionalData.length > 0 ? (
                dashboardData.regionalData.map((region, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold">{region.name}</span>
                      <span className="text-muted">
                        {region.connections} connections
                      </span>
                    </div>
                    <div className="progress" style={{ height: '20px' }}>
                      <div 
                        className="progress-bar bg-primary"
                        style={{ width: `${(region.connections / dashboardData.networkMetrics.activeConnections) * 100}%` }}
                      >
                        {Math.round((region.connections / dashboardData.networkMetrics.activeConnections) * 100)}%
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-geo-alt fs-1 d-block mb-2"></i>
                  <p className="mb-0">No regional data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FDH Capacity & Recent Activities */}
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-hdd-network-fill me-2 text-info"></i>
                FDH Capacity Status
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0 ps-4">FDH Name</th>
                      <th className="border-0">Region</th>
                      <th className="border-0">Splitters</th>
                      <th className="border-0">Capacity</th>
                      <th className="border-0">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.capacityData.length > 0 ? (
                      dashboardData.capacityData.map((fdh) => {
                        const fdhUtilization = calculateUtilization(fdh.usedPorts, fdh.totalCapacity);
                        return (
                          <tr key={fdh.fdhId}>
                            <td className="ps-4 fw-semibold">{fdh.name}</td>
                            <td>
                              <i className="bi bi-geo-alt me-1 text-muted"></i>
                              {fdh.region}
                            </td>
                            <td>
                              <span className="badge bg-info">{fdh.splitterCount}</span>
                            </td>
                            <td>
                              <div style={{ width: '150px' }}>
                                <div className="progress" style={{ height: '20px' }}>
                                  <div 
                                    className={`progress-bar bg-${getUtilizationColor(fdhUtilization)}`}
                                    style={{ width: `${fdhUtilization}%` }}
                                  >
                                    {fdhUtilization}%
                                  </div>
                                </div>
                                <small className="text-muted">
                                  {fdh.usedPorts}/{fdh.totalCapacity}
                                </small>
                              </div>
                            </td>
                            <td>
                              {fdhUtilization >= 90 ? (
                                <span className="badge bg-danger">Critical</span>
                              ) : fdhUtilization >= 75 ? (
                                <span className="badge bg-warning">High</span>
                              ) : (
                                <span className="badge bg-success">Normal</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-4">
                          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                          No FDH data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-clock-history me-2 text-warning"></i>
                Recent Planning Activities
              </h5>
            </div>
            <div className="card-body">
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {dashboardData.recentActivities.length > 0 ? (
                  dashboardData.recentActivities.map((activity, index) => (
                    <div key={index} className="d-flex align-items-start mb-3 pb-3 border-bottom">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                        <i className="bi bi-activity text-primary"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{activity.action}</div>
                        <small className="text-muted">{activity.description}</small>
                        <div className="mt-1">
                          <small className="text-muted">
                            <i className="bi bi-clock me-1"></i>
                            {new Date(activity.timestamp).toLocaleString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    <p className="mb-0">No recent activities</p>
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

export default PlannerDashboard;