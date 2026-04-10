import { Navigate, Outlet } from 'react-router-dom';
import { api } from '../services/api';

const ProtectedRoute = () => {
  if (!api.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
