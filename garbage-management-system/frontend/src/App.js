import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RequestForm from './pages/RequestForm';
import TrackingPage from './pages/TrackingPage';
import AdminRequestsPage from './pages/AdminRequestsPage';
import AdminUsersPage from './pages/AdminUsersPage';

// Auth helpers
import { getUser, isAdmin } from './services/authService';

/**
 * ProtectedRoute: Wraps routes that need authentication.
 * Redirects to /login if no token found.
 */
function ProtectedRoute({ children }) {
  const user = getUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/**
 * AdminRoute: Only allows ADMIN users.
 * Redirects others to user dashboard.
 */
function AdminRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/dashboard" replace />;
  return children;
}

/**
 * App: Root component with all route definitions.
 *
 * Route map:
 *   /             → redirect to /login
 *   /login        → Login page (public)
 *   /register     → Register page (public)
 *   /dashboard    → User dashboard (protected)
 *   /request/new  → New request form (protected)
 *   /track        → Status tracking (protected)
 *   /admin        → Admin dashboard (admin only)
 *   /admin/requests → All requests (admin only)
 *   /admin/users  → User management (admin only)
 */
function App() {
  return (
    <Router>
      {/* Toast notifications (success/error popups) */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.9rem',
          },
          success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><UserDashboard /></ProtectedRoute>
        } />
        <Route path="/request/new" element={
          <ProtectedRoute><RequestForm /></ProtectedRoute>
        } />
        <Route path="/track" element={
          <ProtectedRoute><TrackingPage /></ProtectedRoute>
        } />

        {/* Admin-only Routes */}
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="/admin/requests" element={
          <AdminRoute><AdminRequestsPage /></AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute><AdminUsersPage /></AdminRoute>
        } />

        {/* Catch-all → redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
