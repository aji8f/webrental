import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();

    // The real token is an httpOnly cookie we can't read from JS; this flag is
    // just a UI hint. The backend is still authoritative — any request with an
    // invalid/expired cookie gets a 401/403 that redirects here (see App.jsx).
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');

    if (!isLoggedIn) {
        // Redirect them to the login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/admin" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
