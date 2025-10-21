import { NavLink } from 'react-router-dom';

const Sidebar = ({ user }) => {
  const getMenuItems = () => {
    switch (user.role) {
      case 'Admin':
        return [
          { path: '/admin-dashboard', icon: 'speedometer2', label: 'Dashboard' },
          { path: '/customer-onboarding', icon: 'person-plus', label: 'Customer Onboarding' },
          { path: '/asset-inventory', icon: 'box-seam', label: 'Asset Inventory' },
          { path: '/network-topology', icon: 'diagram-3', label: 'Network Topology' },
          { path: '/deployment-tasks', icon: 'list-task', label: 'Deployment Tasks' },
          { path: '/audit-logs', icon: 'file-text', label: 'Audit Logs' },
        ];
      case 'Planner':
        return [
          { path: '/planner-dashboard', icon: 'speedometer2', label: 'Dashboard' },
          { path: '/network-topology', icon: 'diagram-3', label: 'Network Topology' },
          { path: '/asset-inventory', icon: 'box-seam', label: 'Asset Inventory' },
        ];
      case 'Technician':
        return [
          { path: '/technician-dashboard', icon: 'speedometer2', label: 'Dashboard' },
          { path: '/deployment-tasks', icon: 'list-task', label: 'My Tasks' },
          { path: '/asset-inventory', icon: 'box-seam', label: 'Asset Inventory' },
        ];
      case 'Support':
        return [
          { path: '/support-dashboard', icon: 'speedometer2', label: 'Dashboard' },
          { path: '/customer-onboarding', icon: 'person-plus', label: 'Customer Onboarding' },
          { path: '/support-deactivation', icon: 'person-x', label: 'Deactivation' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="sidebar bg-dark text-white" style={{ width: '250px' }}>
      <div className="p-3">
        <h6 className="text-muted text-uppercase mb-3">Menu</h6>
        <nav className="nav flex-column">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? 'active bg-primary' : ''}`
              }
            >
              <i className={`bi bi-${item.icon} me-2`}></i>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;