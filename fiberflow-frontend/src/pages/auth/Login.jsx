import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Admin'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 'Admin', icon: 'shield-lock-fill', color: 'danger', label: 'Administrator' },
    { value: 'Planner', icon: 'diagram-3-fill', color: 'primary', label: 'Network Planner' },
    { value: 'Technician', icon: 'tools', color: 'success', label: 'Field Technician' },
    { value: 'SupportAgent', icon: 'headset', color: 'info', label: 'Support Agent' },
    { value: 'FieldEngineer', icon: 'person-badge-fill', color: 'warning', label: 'Field Engineer' },
    { value: 'DeploymentLead', icon: 'boxes', color: 'secondary', label: 'Deployment Lead' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      
      localStorage.setItem('token', response.data.token);
      
      const userData = {
        userId: response.data.userId,
        username: response.data.username,
        role: response.data.role
      };
      
      onLogin(userData);
      
      // Update last login
      await api.post('/auth/update-last-login', { userId: response.data.userId });
      
      // Navigate based on role
      const roleRoutes = {
        'Admin': '/admin-dashboard',
        'Planner': '/planner-dashboard',
        'Technician': '/technician-dashboard',
        'SupportAgent': '/support-dashboard',
        'FieldEngineer': '/field-engineer-dashboard',
        'DeploymentLead': '/deployment-lead-dashboard'
      };
      
      navigate(roleRoutes[response.data.role] || '/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden" 
         style={{ 
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
           fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
         }}>
      
      {/* Animated Background Elements */}
      <div className="position-absolute w-100 h-100" style={{ opacity: 0.1 }}>
        <div className="position-absolute rounded-circle" 
             style={{ 
               width: '400px', 
               height: '400px', 
               background: 'white', 
               top: '-100px', 
               left: '-100px' 
             }}></div>
        <div className="position-absolute rounded-circle" 
             style={{ 
               width: '300px', 
               height: '300px', 
               background: 'white', 
               bottom: '-50px', 
               right: '-50px' 
             }}></div>
      </div>

      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            
            {/* Login Card */}
            <div className="card border-0 shadow-lg" 
                 style={{ 
                   borderRadius: '20px',
                   backdropFilter: 'blur(10px)',
                   background: 'rgba(255, 255, 255, 0.95)'
                 }}>
              
              <div className="card-body p-5">
                
                {/* Logo & Title */}
                <div className="text-center mb-5">
                  <div className="mb-3">
                    <i className="bi bi-hdd-network-fill" 
                       style={{ 
                         fontSize: '4rem', 
                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                         WebkitBackgroundClip: 'text',
                         WebkitTextFillColor: 'transparent',
                         backgroundClip: 'text'
                       }}></i>
                  </div>
                  <h2 className="fw-bold mb-2" style={{ color: '#2d3748' }}>
                    Welcome to <span style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>FiberFlow</span>
                  </h2>
                  <p className="text-muted">Network Management System</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4" 
                       role="alert"
                       style={{ borderRadius: '12px', border: 'none' }}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{error}</div>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  
                  {/* Username */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-person-fill me-2"></i>Username
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      style={{ 
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        padding: '12px 20px'
                      }}
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                      autoFocus
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-lock-fill me-2"></i>Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      style={{ 
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        padding: '12px 20px'
                      }}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  {/* Role Selection */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark mb-3">
                      <i className="bi bi-person-badge-fill me-2"></i>Select Your Role
                    </label>
                    <div className="row g-3">
                      {roles.map((role) => (
                        <div key={role.value} className="col-6">
                          <input
                            type="radio"
                            className="btn-check"
                            name="role"
                            id={`role-${role.value}`}
                            value={role.value}
                            checked={formData.role === role.value}
                            onChange={handleChange}
                          />
                          <label
                            className={`btn btn-outline-${role.color} w-100 py-3`}
                            htmlFor={`role-${role.value}`}
                            style={{ 
                              borderRadius: '12px',
                              border: '2px solid',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <i className={`bi bi-${role.icon} d-block fs-3 mb-2`}></i>
                            <small className="fw-semibold">{role.label}</small>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn btn-lg w-100 text-white fw-semibold"
                    style={{
                      borderRadius: '12px',
                      padding: '14px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-4 p-4 rounded" 
                     style={{ 
                       background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                       borderRadius: '12px'
                     }}>
                  <div className="text-center mb-3">
                    <small className="text-muted fw-semibold">
                      <i className="bi bi-info-circle-fill me-2"></i>Demo Credentials
                    </small>
                  </div>
                  <div className="row g-2 small">
                    <div className="col-6">
                      <div className="text-muted">Username:</div>
                      <div className="fw-semibold">admin / planner</div>
                    </div>
                    <div className="col-6">
                      <div className="text-muted">Password:</div>
                      <div className="fw-semibold">password123</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-white small mb-0">
                © 2025 FiberFlow. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;