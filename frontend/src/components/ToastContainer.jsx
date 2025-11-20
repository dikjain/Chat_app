import { useEffect } from "react";

const ToastContainer = ({ toasts, removeToast, position = "bottom" }) => {
  const positionClasses = {
    top: "top-4",
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    bottom: "bottom-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const statusColors = {
    success: "bg-green-500 border-green-600",
    error: "bg-gray-800 border-gray-700",
    warning: "bg-gray-700 border-gray-600",
    info: "bg-gray-700 border-gray-600",
  };

  const positionClass = positionClasses[position] || positionClasses.bottom;

  return (
    <div
      className={`fixed ${positionClass} z-50 flex flex-col gap-2 max-w-md w-full px-4`}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${statusColors[toast.status]} text-white px-4 py-3 rounded-lg shadow-lg border-2 flex items-start justify-between animate-slide-in`}
        >
          <div className="flex-1">
            <div className="font-semibold">{toast.title}</div>
            {toast.description && (
              <div className="text-sm mt-1 opacity-90">{toast.description}</div>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-white hover:text-gray-200 font-bold text-lg"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

