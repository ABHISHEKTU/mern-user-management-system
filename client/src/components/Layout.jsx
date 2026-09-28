import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="navbar">
        <div className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </div>
        <div className="nav-user">
          <span>{user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
