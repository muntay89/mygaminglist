import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from '../components/Loader';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading) {
    return <Loader></Loader>
  }
  if (!isLoggedIn) return <Navigate to="/mygaminglist/login" replace />;
  return children;
}
