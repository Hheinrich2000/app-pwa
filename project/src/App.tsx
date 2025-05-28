import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import LoadingScreen from './components/ui/LoadingScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';

// Lazy loaded components
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const WorkerCodeLogin = lazy(() => import('./pages/auth/WorkerCodeLogin'));
const WorkerDashboard = lazy(() => import('./pages/worker/WorkerDashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const GodDashboard = lazy(() => import('./pages/god/GodDashboard'));
const ManageWorkplaces = lazy(() => import('./pages/admin/ManageWorkplaces'));
const ManageWorkers = lazy(() => import('./pages/admin/ManageWorkers'));
const TaskAssignment = lazy(() => import('./pages/admin/TaskAssignment'));
const Reports = lazy(() => import('./pages/admin/Reports'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/worker-login" element={<WorkerCodeLogin />} />
          
          {/* Special god access route */}
          <Route 
            path="/god-access/:secretKey" 
            element={<RoleRoute allowedRoles={['god']} element={<GodDashboard />} />} 
          />
          
          {/* Protected routes - Worker */}
          <Route 
            path="/worker/*" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['worker']} element={<WorkerDashboard />} />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected routes - Admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['admin', 'god']} element={<AdminDashboard />} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/workplaces" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['admin', 'god']} element={<ManageWorkplaces />} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/workers" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['admin', 'god']} element={<ManageWorkers />} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/tasks" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['admin', 'god']} element={<TaskAssignment />} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['admin', 'god']} element={<Reports />} />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect from root to appropriate dashboard based on role */}
          <Route path="/" element={<Navigate to="/login\" replace />} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;