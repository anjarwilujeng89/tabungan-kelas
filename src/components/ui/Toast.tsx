import create from "zustand";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastVariant = "default" | "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id, variant: toast.variant || "default" },
      ],
    }));

    // Auto remove after duration
    const duration = toast.duration || 3000;
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },
}));

export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast);

  return {
    success: (message: string, duration?: number) =>
      addToast({ message, variant: "success", duration }),
    error: (message: string, duration?: number) =>
      addToast({ message, variant: "error", duration }),
    info: (message: string, duration?: number) =>
      addToast({ message, variant: "info", duration }),
    default: (message: string, duration?: number) =>
      addToast({ message, variant: "default", duration }),
  };
};

// Toast Container Component
export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md space-y-2">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle className="h-5 w-5 text-green-600" />,
          error: <AlertCircle className="h-5 w-5 text-red-600" />,
          info: <Info className="h-5 w-5 text-blue-600" />,
          default: <Info className="h-5 w-5 text-gray-600" />,
        };

        const bgColors = {
          success:
            "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900",
          error:
            "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900",
          info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900",
          default:
            "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-900",
        };

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-lg border p-4 shadow-md ${bgColors[toast.variant || "default"]}`}
          >
            {icons[toast.variant || "default"]}
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
