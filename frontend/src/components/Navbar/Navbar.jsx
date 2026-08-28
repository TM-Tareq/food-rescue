import React from 'react';
import { Leaf, User, ShieldCheck } from 'lucide-react';
import Button from '../Button/Button';
import './Navbar.css';

export default function Navbar({ onOpenAuth }) {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-logo">
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

        {/* Reusable Button Actions */}
        <div className="navbar-actions">
          <Button
            variant="outline"
            size="md"
            icon={User}
            onClick={() => onOpenAuth('signin')}
          >
            Partner Sign In
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={ShieldCheck}
            onClick={() => onOpenAuth('signup')}
          >
            Join Movement
          </Button>
        </div>
      </div>
    </header>
  );
}
