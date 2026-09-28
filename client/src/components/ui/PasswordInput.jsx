import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/cn.js";

export default function PasswordInput({ label, error, id, className, ...props }) {
  const autoId = useId();
  const inputId = id || autoId;
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "block w-full rounded-lg border bg-white py-2 pl-3 pr-10 text-sm shadow-sm",
            "placeholder:text-slate-400 focus:outline-none focus:ring-2",
            error
              ? "border-red-400 focus:ring-red-500"
              : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
