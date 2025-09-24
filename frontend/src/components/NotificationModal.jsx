import React from "react";

const NotificationModal = ({ 
  isOpen, 
  onClose, 
  type = "info", // "success", "error", "warning", "info"
  title, 
  message,
  confirmText = "OK",
  showCancel = false,
  cancelText = "Cancel",
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  // Determine icon and colors based on type
  const getTypeConfig = (type) => {
    switch (type) {
      case "success":
        return {
          icon: "✓",
          bgColor: "bg-green-50",
          iconColor: "text-green-500",
          borderColor: "border-green-200",
          titleColor: "text-green-800"
        };
      case "error":
        return {
          icon: "✕",
          bgColor: "bg-red-50",
          iconColor: "text-red-500",
          borderColor: "border-red-200",
          titleColor: "text-red-800"
        };
      case "warning":
        return {
          icon: "⚠",
          bgColor: "bg-yellow-50",
          iconColor: "text-yellow-500",
          borderColor: "border-yellow-200",
          titleColor: "text-yellow-800"
        };
      default:
        return {
          icon: "ℹ",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-500",
          borderColor: "border-blue-200",
          titleColor: "text-blue-800"
        };
    }
  };

  const config = getTypeConfig(type);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className={`p-6 ${config.bgColor} ${config.borderColor} border rounded-t-lg`}>
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.iconColor} bg-white flex items-center justify-center text-lg font-bold`}>
              {config.icon}
            </div>
            <div className="ml-4">
              <h3 className={`text-lg font-medium ${config.titleColor}`}>
                {title}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            {message}
          </p>
          
          <div className="flex justify-end space-x-3">
            {showCancel && (
              <button
                onClick={handleCancel}
                className="btn btn-ghost btn-sm"
                type="button"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`btn btn-sm ${
                type === "error" 
                  ? "btn-error" 
                  : type === "success" 
                  ? "btn-success" 
                  : type === "warning"
                  ? "btn-warning"
                  : "btn-primary"
              }`}
              type="button"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;