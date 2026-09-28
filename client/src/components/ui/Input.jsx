import { useId } from "react";
import { cn } from "../../lib/cn.js";

export default function Input({ label, error, id, className, ...props }) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          "block w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm",
          "placeholder:text-slate-400 focus:outline-none focus:ring-2",
          error
            ? "border-red-400 focus:ring-red-500"
            : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500",
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
