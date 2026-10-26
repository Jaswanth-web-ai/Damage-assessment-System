import { Navigate } from "react-router-dom";

/**
 * AdminRoute Guard
 * 
 * Protects administrative routes and ensures:
 * 1. An admin token exists in admin storage namespace.
 * 2. The authenticated user has the "admin" role.
 * 3. Unauthorized access redirects STRICTLY to the dedicated /admin/login portal,
 *    NEVER leaking or bouncing to the citizen/applicant dashboard.
 */
function AdminRoute({ children }) {
  const adminToken =
    localStorage.getItem("admin_access_token") ||
    sessionStorage.getItem("admin_access_token");

  const storedAdminUser =
    localStorage.getItem("admin_user") ||
    sessionStorage.getItem("admin_user");

  let adminUser = null;
  try {
    adminUser = storedAdminUser ? JSON.parse(storedAdminUser) : null;
  } catch (err) {
    adminUser = null;
  }

  // If not authenticated as admin, redirect directly to dedicated Admin Login
  if (!adminToken || !adminUser || adminUser.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminRoute;
