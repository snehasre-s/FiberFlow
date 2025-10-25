import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ user, onLogout }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <Header user={user} onLogout={onLogout} />

      {/* Main Content Area */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        {user && <Sidebar user={user} />}

        {/* Main Content */}
        <main className="flex-grow-1 bg-light" style={{ minHeight: 'calc(100vh - 70px - 73px)' }}>
          <div className="container-fluid p-4">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;