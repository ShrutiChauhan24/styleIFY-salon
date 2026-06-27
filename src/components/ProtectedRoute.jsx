import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser,authLoading } = useAuth();

  if(authLoading){
    return null;
  }

  if (!currentUser) {
  return <Navigate to="/admin/login" replace />;
}

return children;
};

export default ProtectedRoute;