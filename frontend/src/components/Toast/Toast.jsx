import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import './Toast.css';

export default function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 size={18} color="#059669" />,
    warning: <AlertTriangle size={18} color="#d97706" />,
    info: <Info size={18} color="#2563eb" />
  };

  return (
    <div className={`toast-banner toast-${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-text">{message}</span>
      {onClose && (
        <button className="toast-close" onClick={onClose}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}
