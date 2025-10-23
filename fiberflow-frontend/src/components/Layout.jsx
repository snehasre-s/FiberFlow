import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ user, onLogout }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="/">
            <i className="bi bi-hdd-network me-2"></i>
            <span className="text-warning">Fiber</span>Flow
            
          </a>
          {user && (
            <div className="d-flex align-items-center">
              <span className="text-white me-3">
                <i className="bi bi-person-circle me-2"></i>
                {user.username} <span className="badge bg-light text-dark ms-1">{user.role}</span>
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={onLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="d-flex flex-grow-1">
        {user && <Sidebar user={user} />}
        <main className="flex-grow-1 p-4 bg-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;