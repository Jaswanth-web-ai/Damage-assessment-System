import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  const localToken = localStorage.getItem("access_token");
  const sessionToken = sessionStorage.getItem("access_token");

  const token = localToken || sessionToken;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;