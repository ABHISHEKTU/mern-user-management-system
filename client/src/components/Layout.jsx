import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "../context/useAuth.js";
import { cn } from "../lib/cn.js";
import Badge from "./ui/Badge.jsx";
import Button from "./ui/Button.jsx";

const linkClass = ({ isActive }) =>
  cn(
    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-indigo-50 text-indigo-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  );

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-indigo-600">
              <ShieldCheck className="h-6 w-6" />
              <span className="hidden sm:inline">UserHub</span>
            </Link>
            <nav className="flex items-center gap-1">
              <NavLink to="/dashboard" className={linkClass}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                <UserRound className="h-4 w-4" />
                Profile
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-slate-700 sm:inline">{user.name}</span>
            <Badge variant={user.role}>{user.role}</Badge>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
