import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DeploymentTasks = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [checklist, setChecklist] = useState([
    { id: 1, item: 'Signal strength test', completed: false },
    { id: 2, item: 'ONT installation and configuration', completed: false },
    { id: 3, item: 'Router setup and testing', completed: false },
    { id: 4, item: 'Cable routing and management', completed: false },
    { id: 5, item: 'Connection speed verification', completed: false },
    { id: 6, item: 'Customer handover and training', completed: false }
  ]);
  
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchTechnicians();
  }, []);

  useEffect(() => {
    if (selectedTask) {
      // Load task-specific data
      fetchTaskDetails(selectedTask.taskId);
    }
  }, [selectedTask]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await api.get('/tasks/technicians');
      setTechnicians(response.data);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const fetchTaskDetails = async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}/details`);
      setChecklist(response.data.checklist || checklist);
      setNotes(response.data.notes || []);
    } catch (error) {
      console.error('Error fetching task details:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      alert('Task status updated successfully!');
      fetchTasks();
      if (selectedTask?.taskId === taskId) {
        setSelectedTask({ ...selectedTask, status: newStatus });
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleChecklistToggle = async (itemId) => {
    const updatedChecklist = checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updatedChecklist);
    
    try {
      await api.put(`/tasks/${selectedTask.taskId}/checklist`, { 
        checklist: updatedChecklist 
      });
    } catch (error) {
      console.error('Error updating checklist:', error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      const response = await api.post(`/tasks/${selectedTask.taskId}/notes`, { 
        content: newNote 
      });
      setNotes([...notes, response.data]);
      setNewNote('');
    } catch (error) {
      alert('Failed to add note');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Scheduled': { bg: 'info', icon: 'calendar-check' },
      'InProgress': { bg: 'warning', icon: 'hourglass-split' },
      'Completed': { bg: 'success', icon: 'check-circle' },
      'Rescheduled': { bg: 'secondary', icon: 'arrow-repeat' },
      'Cancelled': { bg: 'danger', icon: 'x-circle' }
    };
    return badges[status] || badges['Scheduled'];
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
            <i className="bi bi-list-check me-2 text-primary"></i>
            Deployment Tasks
          </h2>
          <p className="text-muted mb-0">Manage installation and deployment tasks</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-primary" onClick={fetchTasks}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      <div className="row">
        {/* Task List */}
        <div className="col-lg-5">
          <div className="card border-0 mb-3">
            <div className="card-header bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Tasks ({filteredTasks.length})</h5>
                <select 
                  className="form-select form-select-sm w-auto"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>
              </div>
            </div>
            <div className="card-body p-0">
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => {
                    const badge = getStatusBadge(task.status);
                    return (
                      <div 
                        key={task.taskId}
                        className={`p-3 border-bottom cursor-pointer ${
                          selectedTask?.taskId === task.taskId ? 'bg-light' : ''
                        }`}
                        onClick={() => setSelectedTask(task)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-semibold">{task.taskType}</h6>
                            <p className="mb-1 text-muted small">
                              <i className="bi bi-person me-1"></i>
                              {task.customerName}
                            </p>
                            <p className="mb-0 text-muted small">
                              <i className="bi bi-geo-alt me-1"></i>
                              {task.customerAddress}
                            </p>
                          </div>
                          <span className={`badge bg-${badge.bg}`}>
                            <i className={`bi bi-${badge.icon} me-1`}></i>
                            {task.status}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <small className="text-muted">
                            <i className="bi bi-person-badge me-1"></i>
                            {task.technicianName || 'Unassigned'}
                          </small>
                          <small className="text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            {new Date(task.scheduledDate).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                    <p className="text-muted mb-0">No tasks found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Task Details Panel */}
        <div className="col-lg-7">
          {selectedTask ? (
            <div className="card border-0">
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-info-circle me-2 text-primary"></i>
                    Task Details
                  </h5>
                  <button 
                    className="btn-close"
                    onClick={() => setSelectedTask(null)}
                  ></button>
                </div>
              </div>

              {/* Tabs */}
              <div className="card-body pt-0">
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                      onClick={() => setActiveTab('details')}
                    >
                      <i className="bi bi-info-circle me-1"></i>
                      Details
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'checklist' ? 'active' : ''}`}
                      onClick={() => setActiveTab('checklist')}
                    >
                      <i className="bi bi-check-square me-1"></i>
                      Checklist
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'notes' ? 'active' : ''}`}
                      onClick={() => setActiveTab('notes')}
                    >
                      <i className="bi bi-sticky me-1"></i>
                      Notes
                    </button>
                  </li>
                </ul>

                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-muted">Customer</label>
                      <p className="mb-0 fw-semibold">{selectedTask.customerName}</p>
                      <small className="text-muted">{selectedTask.customerAddress}</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-muted">Task Type</label>
                      <p className="mb-0">{selectedTask.taskType}</p>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-muted">Description</label>
                      <p className="mb-0 text-muted">{selectedTask.description}</p>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-muted">Scheduled Date</label>
                      <p className="mb-0">
                        <i className="bi bi-calendar-check me-2"></i>
                        {new Date(selectedTask.scheduledDate).toLocaleString()}
                      </p>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-muted">Assigned Technician</label>
                      <p className="mb-0">
                        <i className="bi bi-person-badge me-2"></i>
                        {selectedTask.technicianName || 'Not assigned'}
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold small text-muted">Current Status</label>
                      <div>
                        <span className={`badge bg-${getStatusBadge(selectedTask.status).bg} fs-6 px-3 py-2`}>
                          {selectedTask.status}
                        </span>
                      </div>
                    </div>

                    <hr />

                    <div className="mt-4">
                      <label className="form-label fw-semibold">Update Status</label>
                      <div className="d-flex gap-2 flex-wrap">
                        <button 
                          className="btn btn-warning"
                          onClick={() => handleStatusChange(selectedTask.taskId, 'InProgress')}
                          disabled={selectedTask.status === 'InProgress' || selectedTask.status === 'Completed'}
                        >
                          <i className="bi bi-play-circle me-1"></i>
                          Start Task
                        </button>
                        <button 
                          className="btn btn-success"
                          onClick={() => handleStatusChange(selectedTask.taskId, 'Completed')}
                          disabled={selectedTask.status === 'Completed'}
                        >
                          <i className="bi bi-check-circle me-1"></i>
                          Mark Complete
                        </button>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => handleStatusChange(selectedTask.taskId, 'Rescheduled')}
                          disabled={selectedTask.status === 'Completed'}
                        >
                          <i className="bi bi-arrow-repeat me-1"></i>
                          Reschedule
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Checklist Tab */}
                {activeTab === 'checklist' && (
                  <div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted">
                          Progress: {checklist.filter(item => item.completed).length}/{checklist.length}
                        </span>
                        <span className="fw-bold">
                          {Math.round((checklist.filter(item => item.completed).length / checklist.length) * 100)}%
                        </span>
                      </div>
                      <div className="progress mb-4" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar bg-success"
                          style={{ 
                            width: `${(checklist.filter(item => item.completed).length / checklist.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="list-group">
                      {checklist.map((item) => (
                        <div 
                          key={item.id}
                          className="list-group-item d-flex align-items-center cursor-pointer"
                          onClick={() => handleChecklistToggle(item.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="form-check">
                            <input 
                              className="form-check-input"
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => {}}
                            />
                          </div>
                          <span className={`ms-2 ${item.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                            {item.item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                  <div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Add New Note</label>
                      <div className="input-group">
                        <textarea
                          className="form-control"
                          placeholder="Enter notes, remarks, or observations..."
                          rows="3"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                        ></textarea>
                      </div>
                      <button 
                        className="btn btn-primary mt-2"
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                      >
                        <i className="bi bi-plus-circle me-1"></i>
                        Add Note
                      </button>
                    </div>

                    <hr />

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {notes.length > 0 ? (
                        notes.map((note, index) => (
                          <div key={index} className="card mb-2">
                            <div className="card-body py-2">
                              <div className="d-flex justify-content-between align-items-start">
                                <small className="text-muted">
                                  <i className="bi bi-clock me-1"></i>
                                  {new Date(note.createdAt).toLocaleString()}
                                </small>
                                <small className="text-muted">{note.author}</small>
                              </div>
                              <p className="mb-0 mt-2">{note.content}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted py-4">
                          <i className="bi bi-chat-left-text fs-1 d-block mb-2"></i>
                          <p className="mb-0">No notes yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card border-0">
              <div className="card-body text-center py-5">
                <i className="bi bi-hand-index fs-1 text-muted d-block mb-3"></i>
                <h5 className="text-muted">Select a task to view details</h5>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeploymentTasks;
