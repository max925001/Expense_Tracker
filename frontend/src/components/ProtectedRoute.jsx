import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, isLoggedIn, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-green-50">Loading...</div>;
  }

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;