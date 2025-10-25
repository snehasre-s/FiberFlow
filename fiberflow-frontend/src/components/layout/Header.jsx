import { useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'Admin': 'danger',
      'Planner': 'primary',
      'Technician': 'success',
      'SupportAgent': 'info',
      'FieldEngineer': 'warning',
      'DeploymentLead': 'secondary'
    };
    return colors[role] || 'secondary';
  };

  const getRoleDisplayName = (role) => {
    const names = {
      'Admin': 'Administrator',
      'Planner': 'Network Planner',
      'Technician': 'Field Technician',
      'SupportAgent': 'Support Agent',
      'FieldEngineer': 'Field Engineer',
      'DeploymentLead': 'Deployment Lead'
    };
    return names[role] || role;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm" 
         style={{ 
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
           minHeight: '70px'
         }}>
      <div className="container-fluid px-4">
        
        {/* Logo */}
        <a className="navbar-brand d-flex align-items-center" href="/">
          <i className="bi bi-hdd-network-fill fs-3 me-2"></i>
          <span className="fw-bold fs-4">FiberFlow</span>
        </a>

        {/* Right Side - User Info */}
        {user && (
          <div className="d-flex align-items-center">
            
            {/* User Info */}
            <div className="d-none d-md-flex flex-column align-items-end me-3">
              <span className="text-white fw-semibold">{user.username}</span>
              <span className={`badge bg-${getRoleBadgeColor(user.role)} small`}>
                {getRoleDisplayName(user.role)}
              </span>
            </div>

            {/* Profile Icon */}
            <div className="dropdown">
              <button 
                className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" 
                style={{ width: '45px', height: '45px' }}
                type="button" 
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-fill fs-5"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-lg" 
                  style={{ minWidth: '200px', borderRadius: '12px' }}>
                <li className="px-3 py-2 border-bottom">
                  <div className="fw-semibold text-dark">{user.username}</div>
                  <small className="text-muted">{getRoleDisplayName(user.role)}</small>
                </li>
                <li>
                  <button className="dropdown-item py-2" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;