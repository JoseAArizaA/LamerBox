import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}