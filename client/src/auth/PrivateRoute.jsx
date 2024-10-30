import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from './api-helper';


const PrivateRoute = () => {
    const ause = isAuthenticated();
    return ause ? <Outlet /> : <Navigate to='/signin' />;
}
export default PrivateRoute;