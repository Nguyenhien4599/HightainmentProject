import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
    element: React.ReactElement;
}

const PrivateRoute = ({ element }: Props) => {
    const token = localStorage.getItem('token') || true;

    return token ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
