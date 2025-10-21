import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages (we'll create these next)
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import PlannerDashboard from './pages/PlannerDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import SupportDashboard from './pages/SupportDashboard';
import CustomerOnboarding from './pages/CustomerOnboarding';
import AssetInventory from './pages/AssetInventory';
import NetworkTopology from './pages/NetworkTopology';
import DeploymentTasks from './pages/DeploymentTasks';
import SupportDeactivation from './pages/SupportDeactivation';
import AuditLogs from './pages/AuditLogs';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate to={`/${user.role.toLowerCase()}-dashboard`} replace />
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
          <Route 
            path="/audit-logs" 
            element={
              <ProtectedRoute user={user} allowedRoles={['Admin']}>
                <AuditLogs />
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
          <Route 
            path="/network-topology" 
            element={
              <ProtectedRoute user={user} allowedRoles={['Planner', 'Admin']}>
                <NetworkTopology />
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
          <Route 
            path="/deployment-tasks" 
            element={
              <ProtectedRoute user={user} allowedRoles={['Technician', 'Admin']}>
                <DeploymentTasks />
              </ProtectedRoute>
            } 
          />

          {/* Support Routes */}
          <Route 
            path="/support-dashboard" 
            element={
              <ProtectedRoute user={user} allowedRoles={['Support']}>
                <SupportDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/support-deactivation" 
            element={
              <ProtectedRoute user={user} allowedRoles={['Support', 'Admin']}>
                <SupportDeactivation />
              </ProtectedRoute>
            } 
          />

          {/* Shared Routes */}
          <Route 
            path="/customer-onboarding" 
            element={
              <ProtectedRoute user={user} allowedRoles={['Admin', 'Support']}>
                <CustomerOnboarding />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/asset-inventory" 
            element={
              <ProtectedRoute user={user} allowedRoles={['Admin', 'Planner', 'Technician']}>
                <AssetInventory />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;