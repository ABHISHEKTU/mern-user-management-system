import { cn } from "../../lib/cn.js";

export default function Card({ className, children }) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-6 shadow-sm", className)}>
      {children}
    </div>
  );
}
