import React from 'react';
import './Button.css';

/**
 * Reusable Atomic Button Component
 * @param {'primary'|'secondary'|'orange'|'outline'|'ghost'} variant
 * @param {'sm'|'md'|'lg'} size
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="btn-icon" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      <span>{children}</span>
    </button>
  );
}
