import { CircleAlert, CircleCheck } from "lucide-react";
import { cn } from "../../lib/cn.js";

const styles = {
  error: "border-red-200 bg-red-50 text-red-800",
  success: "border-green-200 bg-green-50 text-green-800",
};

export default function Alert({ type = "error", className, children }) {
  const Icon = type === "success" ? CircleCheck : CircleAlert;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={cn("flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm", styles[type], className)}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
