import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TechnicianDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    pendingInstallations: 0,
    tasksDueToday: 0,
    upcomingAppointments: 0,
    completedThisWeek: 0
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/technician/dashboard');
      setTasks(response.data.tasks);
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      alert('Task status updated successfully!');
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Scheduled': { bg: 'info', icon: 'calendar-check' },
      'InProgress': { bg: 'warning', icon: 'hourglass-split' },
      'Completed': { bg: 'success', icon: 'check-circle' },
      'Rescheduled': { bg: 'secondary', icon: 'arrow-repeat' }
    };
    return badges[status] || badges['Scheduled'];
  };

  const getPriorityColor = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'danger';
    if (diffDays === 0) return 'warning';
    if (diffDays <= 2) return 'info';
    return 'secondary';
  };

  const filteredTasks = tasks.filter(task => 
    !statusFilter || task.status === statusFilter
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold mb-1">
            <i className="bi bi-tools me-2 text-success"></i>
            Technician Dashboard
          </h2>
          <p className="text-muted mb-0">Manage your installation and maintenance tasks</p>
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
        <div className="col-md-6 col-xl-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-2 small fw-semibold text-uppercase">Pending Installations</p>
                  <h3 className="fw-bold mb-0">{stats.pendingInstallations}</h3>
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
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-2 small fw-semibold text-uppercase">Tasks Due Today</p>
                  <h3 className="fw-bold mb-0">{stats.tasksDueToday}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ 
                       width: '50px', 
                       height: '50px', 
                       background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                       boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                     }}>
                  <i className="bi bi-exclamation-triangle-fill text-white fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-2 small fw-semibold text-uppercase">Upcoming</p>
                  <h3 className="fw-bold mb-0">{stats.upcomingAppointments}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ 
                       width: '50px', 
                       height: '50px', 
                       background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                       boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                     }}>
                  <i className="bi bi-calendar-event text-white fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-2 small fw-semibold text-uppercase">Completed This Week</p>
                  <h3 className="fw-bold mb-0">{stats.completedThisWeek}</h3>
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
      </div>

      {/* Task List */}
      <div className="card border-0">
        <div className="card-header bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-list-task me-2 text-primary"></i>
              My Tasks ({filteredTasks.length})
            </h5>
            <select 
              className="form-select form-select-sm w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="card-body p-0">
          {filteredTasks.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-0 ps-4">Task Type</th>
                    <th className="border-0">Customer</th>
                    <th className="border-0">Address</th>
                    <th className="border-0">Due Date</th>
                    <th className="border-0">Status</th>
                    <th className="border-0">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => {
                    const badge = getStatusBadge(task.status);
                    const priorityColor = getPriorityColor(task.scheduledDate);
                    
                    return (
                      <tr key={task.taskId}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center">
                            <i className={`bi bi-${badge.icon} text-${badge.bg} me-2 fs-5`}></i>
                            <span className="fw-semibold">{task.taskType}</span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-semibold">{task.customerName}</div>
                            <small className="text-muted">ID: #{task.customerId}</small>
                          </div>
                        </td>
                        <td>
                          <small className="text-muted">
                            <i className="bi bi-geo-alt me-1"></i>
                            {task.customerAddress}
                          </small>
                        </td>
                        <td>
                          <span className={`badge bg-${priorityColor}`}>
                            <i className="bi bi-calendar me-1"></i>
                            {new Date(task.scheduledDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${badge.bg}`}>
                            {task.status}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            {task.status === 'Scheduled' && (
                              <button 
                                className="btn btn-warning"
                                onClick={() => handleStatusChange(task.taskId, 'InProgress')}
                                title="Start Task"
                              >
                                <i className="bi bi-play-fill"></i>
                              </button>
                            )}
                            {task.status === 'InProgress' && (
                              <button 
                                className="btn btn-success"
                                onClick={() => handleStatusChange(task.taskId, 'Completed')}
                                title="Complete Task"
                              >
                                <i className="bi bi-check-lg"></i>
                              </button>
                            )}
                            <button 
                              className="btn btn-outline-primary"
                              onClick={() => setSelectedTask(task)}
                              title="View Details"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
              <h5 className="text-muted">No tasks assigned</h5>
              <p className="text-muted small">Check back later for new assignments</p>
            </div>
          )}
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                  Task Details
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setSelectedTask(null)}
                ></button>
              </div>
              
              <div className="modal-body px-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Task Type</label>
                    <p className="mb-0 fw-semibold">{selectedTask.taskType}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Status</label>
                    <p className="mb-0">
                      <span className={`badge bg-${getStatusBadge(selectedTask.status).bg} px-3 py-2`}>
                        {selectedTask.status}
                      </span>
                    </p>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold small text-muted">Customer</label>
                    <p className="mb-0 fw-semibold">{selectedTask.customerName}</p>
                    <small className="text-muted">{selectedTask.customerAddress}</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Scheduled Date</label>
                    <p className="mb-0">
                      <i className="bi bi-calendar-check me-2"></i>
                      {new Date(selectedTask.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Assigned To</label>
                    <p className="mb-0">
                      <i className="bi bi-person-badge me-2"></i>
                      {selectedTask.technicianName}
                    </p>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold small text-muted">Description</label>
                    <p className="mb-0 text-muted">{selectedTask.description}</p>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 pt-0 px-4 pb-4">
                <button 
                  type="button" 
                  className="btn btn-light"
                  onClick={() => setSelectedTask(null)}
                >
                  Close
                </button>
                {selectedTask.status === 'Scheduled' && (
                  <button 
                    type="button" 
                    className="btn btn-warning"
                    onClick={() => {
                      handleStatusChange(selectedTask.taskId, 'InProgress');
                      setSelectedTask(null);
                    }}
                  >
                    <i className="bi bi-play-fill me-2"></i>
                    Start Task
                  </button>
                )}
                {selectedTask.status === 'InProgress' && (
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={() => {
                      handleStatusChange(selectedTask.taskId, 'Completed');
                      setSelectedTask(null);
                    }}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Mark Complete
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

export default TechnicianDashboard;