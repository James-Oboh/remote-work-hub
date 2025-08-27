import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface PrivateRouteProps {
  children?: React.ReactNode;
  requiredRole?: 'ADMIN' | 'TEAM_LEAD' | 'DEVELOPER' | 'MANAGER';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const { token, role, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Check for authentication
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check for role-based access if a requiredRole is specified
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Render the child component if authenticated and authorized
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;