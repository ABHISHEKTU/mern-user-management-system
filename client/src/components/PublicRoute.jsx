import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export default function PublicRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading...</p>;
  if (user) {
    return <Navigate to={location.state?.from?.pathname ?? "/dashboard"} replace />;
  }

  return <Outlet />;
}
