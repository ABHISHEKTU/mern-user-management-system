import { ShieldCheck } from "lucide-react";

export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-linear-to-br from-indigo-600 to-indigo-800 p-12 text-white lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <ShieldCheck className="h-6 w-6" />
          UserHub
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight">Manage users securely.</h2>
          <p className="mt-4 max-w-md text-indigo-100">
            Register, sign in, update your profile, and let admins manage accounts, all behind
            token-based authentication.
          </p>
        </div>
        <p className="text-sm text-indigo-200">MERN stack | JWT auth | Role-based access</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 text-lg font-semibold text-indigo-600 lg:hidden">
            <ShieldCheck className="h-6 w-6" />
            UserHub
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-slate-600">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <p className="mt-6 text-center text-sm text-slate-600">{footer}</p>}
        </div>
      </div>
    </div>
  );
}
