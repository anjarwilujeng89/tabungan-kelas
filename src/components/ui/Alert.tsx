import React from "react";
import { cn } from "@/utils/helpers";
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "warning";
  title?: string;
  description?: string;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    { className, variant = "default", title, description, children, ...props },
    ref,
  ) => {
    const variants = {
      default:
        "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20",
      destructive:
        "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20",
      success:
        "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20",
      warning:
        "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20",
    };

    const textVariants = {
      default: "text-blue-800 dark:text-blue-300",
      destructive: "text-red-800 dark:text-red-300",
      success: "text-green-800 dark:text-green-300",
      warning: "text-yellow-800 dark:text-yellow-300",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-lg border p-4",
          variants[variant],
          className,
        )}
        {...props}
      >
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            {variant === "destructive" && (
              <AlertCircle className={cn("h-5 w-5", textVariants[variant])} />
            )}
            {variant === "success" && (
              <CheckCircle className={cn("h-5 w-5", textVariants[variant])} />
            )}
            {variant === "warning" && (
              <AlertTriangle className={cn("h-5 w-5", textVariants[variant])} />
            )}
            {variant === "default" && (
              <Info className={cn("h-5 w-5", textVariants[variant])} />
            )}
          </div>
          <div className="flex-1">
            {title && (
              <h5 className={cn("font-medium", textVariants[variant])}>
                {title}
              </h5>
            )}
            {description && (
              <p className={cn("text-sm", textVariants[variant])}>
                {description}
              </p>
            )}
            {children && !description && !title && (
              <div className={cn("text-sm", textVariants[variant])}>
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

Alert.displayName = "Alert";
