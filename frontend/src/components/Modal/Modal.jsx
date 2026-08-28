import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

/**
 * Reusable Base Modal Overlay Component
 */
export default function Modal({ isOpen, onClose, children, title, className = '' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal-card ${className}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
