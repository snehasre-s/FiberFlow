import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Admin'
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
      const response = await api.post('/auth/login', formData);
      
      // Store token
      localStorage.setItem('token', response.data.token);
      
      // Store user data
      const userData = {
        id: response.data.id,
        username: response.data.username,
        role: response.data.role
      };
      
      onLogin(userData);
      
      // Navigate to role-specific dashboard
      navigate(`/${response.data.role.toLowerCase()}-dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                {/* Logo */}
                <div className="text-center mb-4">
                  <i className="bi bi-hdd-network text-primary" style={{ fontSize: '3rem' }}></i>
                  <h2 className="mt-2 mb-1">
                    <span className="text-warning">Fiber</span>
                    <span className="text-primary">Flow</span>
                  </h2>
                  <p className="text-muted">Network Management System</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  {/* Username */}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-semibold">
                      <i className="bi bi-person me-2"></i>Username
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">
                      <i className="bi bi-lock me-2"></i>Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />
                  </div>

                  {/* Role Selection */}
                  <div className="mb-4">
                    <label htmlFor="role" className="form-label fw-semibold">
                      <i className="bi bi-person-badge me-2"></i>Select Role
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="Admin">Admin</option>
                      <option value="Planner">Planner</option>
                      <option value="Technician">Technician</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Credentials Info */}
                <div className="mt-4 p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>Demo Credentials:</strong><br />
                    Username: admin / planner / technician / support<br />
                    Password: password123
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;