import React from 'react';
import { Leaf, User, ArrowRight } from 'lucide-react';
import Button from '../Button/Button';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar({ onOpenAuth, onOpenPortal }) {
  const { user } = useAuth();

  const handleOpenPortalClick = () => {
    if (onOpenPortal) {
      onOpenPortal(user?.role || 'RESTAURANT');
    }
  };

  const getRoleAvatar = (roleStr) => {
    switch (roleStr?.toUpperCase()) {
      case 'VOLUNTEER': return '🛵';
      case 'NGO': return '🏠';
      case 'RESTAURANT': return '🏪';
      case 'CONSUMER': return '👨‍💼';
      case 'ADMIN': return '👨‍💻';
      default: return '👤';
    }
  };

  const avatarDisplay = user?.avatar || getRoleAvatar(user?.role);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-logo" onClick={() => window.location.href = '/'}>
          <div className="logo-icon-wrapper">
            <Leaf className="logo-icon" size={22} />
          </div>
          <span className="logo-text">Food<span className="logo-highlight">Rescue</span></span>
        </div>

        {/* Navigation Links */}
        <nav className="navbar-links">
          <a href="#deals" className="nav-link">Browse Deals</a>
          <a href="#ngo-feed" className="nav-link">Free NGO Feed</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#impact" className="nav-link">Impact</a>
        </nav>

        {/* Actions Bar */}
        <div className="navbar-actions">
          {user ? (
            /* ONLY OPEN APP BUTTON WHEN LOGGED IN */
            <button 
              className="btn-open-app-only"
              onClick={handleOpenPortalClick}
              title={`Open ${user.role} Dashboard`}
            >
              <span className="user-avatar-badge">{avatarDisplay}</span>
              <span className="btn-app-text">Open App</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            /* GUEST MODE: SIGN IN BUTTON */
            <Button
              variant="primary"
              size="md"
              icon={User}
              onClick={() => onOpenAuth('signin')}
            >
              Partner Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
