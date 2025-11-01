import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      // Login without role - backend will return the user's role
      const response = await api.post('/auth/login', {
        username: formData.username,
        password: formData.password
      });
      
      localStorage.setItem('token', response.data.token);
      
      const userData = {
        userId: response.data.userId,
        username: response.data.username,
        role: response.data.role
      };
      
      onLogin(userData);
      
      await api.post('/auth/update-last-login', { userId: response.data.userId });
      
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
      console.error('Login error:', err.response);
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
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            
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

                {/* Demo Credentials Info */}
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
                    <div className="col-12">
                      <table className="table table-sm table-borderless mb-0">
                        <thead>
                          <tr>
                            <th className="text-muted">Role</th>
                            <th className="text-muted">Username</th>
                            <th className="text-muted">Password</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-danger fw-semibold">Admin</td>
                            <td><code>admin</code></td>
                            <td><code>admin123</code></td>
                          </tr>
                          <tr>
                            <td className="text-primary fw-semibold">Planner</td>
                            <td><code>planner</code></td>
                            <td><code>planner123</code></td>
                          </tr>
                          <tr>
                            <td className="text-success fw-semibold">Technician</td>
                            <td><code>technician</code></td>
                            <td><code>tech123</code></td>
                          </tr>
                          <tr>
                            <td className="text-info fw-semibold">Support</td>
                            <td><code>support</code></td>
                            <td><code>support123</code></td>
                          </tr>
                          <tr>
                            <td className="text-warning fw-semibold">Field Engineer</td>
                            <td><code>fieldengineer</code></td>
                            <td><code>field123</code></td>
                          </tr>
                          <tr>
                            <td className="text-secondary fw-semibold">Deploy Lead</td>
                            <td><code>deploymentlead</code></td>
                            <td><code>deploy123</code></td>
                          </tr>
                        </tbody>
                      </table>
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