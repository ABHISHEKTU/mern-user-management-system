import { cn } from "../../lib/cn.js";

const variants = {
  admin: "bg-indigo-100 text-indigo-700",
  user: "bg-slate-100 text-slate-600",
};

export default function Badge({ variant = "user", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
