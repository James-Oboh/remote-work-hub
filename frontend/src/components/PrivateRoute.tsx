// src/components/PrivateRoute.tsx
// This component is crucial for protecting routes. It checks the auth state
// and either renders the children or redirects to the login page.
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { token, loading } = useContext(AuthContext);

    // Don't render anything while the auth state is loading from localStorage.
    if (loading) {
        return <div className="loading-state">Loading...</div>;
    }

    // If a token exists, render the child components (e.g., Dashboard).
    // Otherwise, redirect the user to the login page.
    return token ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
