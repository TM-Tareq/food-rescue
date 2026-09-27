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

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const scrollables = document.querySelectorAll('.dashboard-main, .ngo-main-content, .admin-main-content');
      scrollables.forEach(el => el.style.overflow = 'hidden');
    } else {
      document.body.style.overflow = '';
      const scrollables = document.querySelectorAll('.dashboard-main, .ngo-main-content, .admin-main-content');
      scrollables.forEach(el => el.style.overflow = '');
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      const scrollables = document.querySelectorAll('.dashboard-main, .ngo-main-content, .admin-main-content');
      scrollables.forEach(el => el.style.overflow = '');
    };
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
