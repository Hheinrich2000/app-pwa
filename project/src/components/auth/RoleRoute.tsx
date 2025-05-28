import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';

interface RoleRouteProps {
  allowedRoles: UserRole[];
  element: React.ReactNode;
}

const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, element }) => {
  const { user } = useAuthStore();
  
  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect based on the user's actual role
    if (user) {
      switch (user.role) {
        case 'worker':
          return <Navigate to="/worker\" replace />;
        case 'admin':
          return <Navigate to="/admin" replace />;
        case 'god':
          return <Navigate to="/god-dashboard" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }
    
    return <Navigate to="/login" replace />;
  }
  
  return <>{element}</>;
};

export default RoleRoute;