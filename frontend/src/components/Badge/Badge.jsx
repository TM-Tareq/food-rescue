import React from 'react';
import './Badge.css';

/**
 * Reusable Badge Chip Component
 * @param {'flash'|'fresh'|'ngo'|'orange'|'green'|'dark'} theme
 */
export default function Badge({
  children,
  icon: Icon,
  theme = 'fresh',
  className = ''
}) {
  return (
    <span className={`badge-chip badge-${theme} ${className}`}>
      {Icon && <Icon className="badge-icon" size={14} />}
      <span>{children}</span>
    </span>
  );
}
