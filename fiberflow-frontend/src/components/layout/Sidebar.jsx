import { NavLink } from 'react-router-dom';

const Sidebar = ({ user }) => {
  
  const getMenuItems = () => {
    const menus = {
      'Admin': [
        { path: '/admin-dashboard', icon: 'speedometer2', label: 'Dashboard' },
        { path: '/customers', icon: 'people', label: 'Customers' },
        { path: '/assets', icon: 'box-seam', label: 'Asset Inventory' },
        { path: '/network-topology', icon: 'diagram-3', label: 'Network Topology' },
        { path: '/deployment-tasks', icon: 'list-check', label: 'Deployment Tasks' },
        { path: '/audit-logs', icon: 'file-text', label: 'Audit Logs' }
      ],
      'Planner': [
        { path: '/planner-dashboard', icon: 'speedometer2', label: 'Dashboard' },
        { path: '/network-topology', icon: 'diagram-3', label: 'Network Topology' },
        { path: '/assets', icon: 'box-seam', label: 'Asset Inventory' }
      ],
      'Technician': [
        { path: '/technician-dashboard', icon: 'speedometer2', label: 'Dashboard' },
        { path: '/deployment-tasks', icon: 'list-check', label: 'My Tasks' },
        { path: '/assets', icon: 'box-seam', label: 'Asset Inventory' }
      ],
      'SupportAgent': [
        { path: '/support-dashboard', icon: 'speedometer2', label: 'Dashboard' },
        { path: '/customers', icon: 'people', label: 'Customer Management' }
      ],
      'FieldEngineer': [
        { path: '/field-engineer-dashboard', icon: 'speedometer2', label: 'Dashboard' },
        { path: '/customer-onboarding', icon: 'person-plus', label: 'Customer Onboarding' }
      ],
      'DeploymentLead': [
        { path: '/deployment-lead-dashboard', icon: 'speedometer2', label: 'Dashboard' },
        { path: '/assets', icon: 'box-seam', label: 'Asset Management' },
        { path: '/customers', icon: 'people', label: 'Customer Assets' }
      ]
    };

    return menus[user?.role] || [];
  };

  const menuItems = getMenuItems();

  return (
    <div className="sidebar d-flex flex-column shadow-sm" 
         style={{ 
           width: '260px', 
           minHeight: 'calc(100vh - 70px)',
           background: '#2d3748',
           position: 'sticky',
           top: '70px'
         }}>
      
      <div className="p-3 flex-grow-1">
        <h6 className="text-white-50 text-uppercase small fw-bold px-3 mb-3 mt-2">
          Navigation
        </h6>
        
        <nav className="nav flex-column gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center px-3 py-3 rounded text-white ${
                  isActive ? 'active' : ''
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                borderLeft: isActive ? '3px solid #667eea' : '3px solid transparent',
                transition: 'all 0.3s ease'
              })}
            >
              <i className={`bi bi-${item.icon} me-3 fs-5`}></i>
              <span className="fw-semibold">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-top border-secondary">
        <div className="text-center text-white-50 small">
          <i className="bi bi-info-circle me-1"></i>
          FiberFlow v2.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;