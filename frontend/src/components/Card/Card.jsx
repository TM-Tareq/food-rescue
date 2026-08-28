import React from 'react';
import './Card.css';

/**
 * Reusable Base Container Card Component
 */
export default function Card({
  children,
  className = '',
  topBorder = null, // 'orange' | 'green' | 'dark'
  hover = true,
  onClick,
  ...props
}) {
  return (
    <div
      className={`custom-card ${topBorder ? `card-border-${topBorder}` : ''} ${hover ? 'card-hoverable' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
