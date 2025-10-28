import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Layout
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import PlannerDashboard from './pages/planner/PlannerDashboard';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import SupportDashboard from './pages/support/SupportDashboard';
import FieldEngineerDashboard from './pages/field-engineer/FieldEngineerDashboard';
import DeploymentLeadDashboard from './pages/deployment-lead/DeploymentLeadDashboard';
import AssetInventory from './pages/assets/AssetInventory';
import NetworkTopology from './pages/network/NetworkTopology';
import DeploymentTasks from './pages/tasks/DeploymentTasks';


// Placeholder pages
const PlaceholderPage = ({ title }) => (
  <div className="container mt-4">
    <div className="alert alert-info">
      <h3><i className="bi bi-info-circle me-2"></i>{title}</h3>
      <p className="mb-0">This page is under construction. Coming soon!</p>
    </div>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Role-based dashboard routing
  const getDashboardRoute = (role) => {
    const routes = {
      'Admin': '/admin-dashboard',
      'Planner': '/planner-dashboard',
      'Technician': '/technician-dashboard',
      'SupportAgent': '/support-dashboard',
      'FieldEngineer': '/field-engineer-dashboard',
      'DeploymentLead': '/deployment-lead-dashboard'
    };
    return routes[role] || '/admin-dashboard';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Route - Login */}
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate to={getDashboardRoute(user.role)} replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />

        {/* Protected Routes with Layout */}
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          
          {/* Admin Routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute user={user} allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Planner Routes */}
          <Route 
            path="/planner-dashboard" 
            element={
              <ProtectedRoute user={user} allowedRoles={['Planner']}>
                <PlannerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Technician Routes */}
          <Route 
            path="/technician-dashboard" 
            element={
              <ProtectedRoute user={user} allowedRoles={['Technician']}>
                <TechnicianDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Support Agent Routes */}
          <Route 
            path="/support-dashboard" 
            element={
              <ProtectedRoute user={user} allowedRoles={['SupportAgent']}>
                <SupportDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Field Engineer Routes */}
          <Route 
            path="/field-engineer-dashboard" 
            element={
              <ProtectedRoute user={user} allowedRoles={['FieldEngineer']}>
                <FieldEngineerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Deployment Lead Routes */}
          <Route 
            path="/deployment-lead-dashboard" 
            element={
              <ProtectedRoute user={user} allowedRoles={['DeploymentLead']}>
                <DeploymentLeadDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Shared/Placeholder Routes */}
          <Route 
            path="/customers" 
            element={
              <ProtectedRoute user={user}>
                <PlaceholderPage title="Customer Management" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customer-onboarding" 
            element={
              <ProtectedRoute user={user}>
                <PlaceholderPage title="Customer Onboarding" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assets" 
            element={
              <ProtectedRoute user={user}>
                <AssetInventory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/network-topology" 
            element={
              <ProtectedRoute user={user}>
                <NetworkTopology />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/deployment-tasks" 
            element={
              <ProtectedRoute user={user}>
                <DeploymentTasks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/audit-logs" 
            element={
              <ProtectedRoute user={user}>
                <PlaceholderPage title="Audit Logs" />
              </ProtectedRoute>
            } 
          />
          
        </Route>

        {/* Default Routes */}
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to={getDashboardRoute(user.role)} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;