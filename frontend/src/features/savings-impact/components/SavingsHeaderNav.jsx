import React from 'react';
import {
  Leaf,
  MapPin,
  Search,
  ShoppingBag,
  User,
  ChevronDown,
  Sparkles,
  Clock,
  Wallet
} from 'lucide-react';
import Button from '../../../components/Button/Button';
import Badge from '../../../components/Badge/Badge';
import './SavingsHeaderNav.css';

export default function SavingsHeaderNav({ activeTab = 'savings', onTabChange }) {
  return (
    <header className="savings-header">
      {/* Top Navbar Row */}
      <div className="savings-top-bar">
        <div className="savings-nav-container">
          {/* Brand Logo */}
          <div className="savings-brand">
            <div className="brand-logo-icon">
              <Leaf size={20} className="leaf-icon" />
            </div>
            <div className="brand-name">
              <span className="brand-primary">FoodRescue</span>
              <span className="brand-badge">Market</span>
            </div>
          </div>

          {/* Location Picker */}
          <button className="location-picker-btn">
            <MapPin size={15} className="location-icon" />
            <span className="location-text">Banani, Dhaka (2 km)</span>
            <ChevronDown size={14} className="chevron-icon" />
          </button>

          {/* Promo Pill */}
          <div className="promo-badge-pill">
            <Sparkles size={14} className="sparkle-icon" />
            <span>50% OFF SURPLUS</span>
          </div>

          {/* Search Bar */}
          <div className="header-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search food rescue deals, bakery, groceries..."
              className="header-search-input"
            />
          </div>

          {/* Right Action Controls */}
          <div className="header-actions">
            {/* Saved Balance Pill */}
            <div className="saved-balance-pill">
              <Wallet size={15} className="wallet-icon" />
              <div className="balance-info">
                <span className="balance-label">Saved</span>
                <span className="balance-value">৳4,500</span>
              </div>
            </div>

            {/* Cart Button */}
            <button className="header-cart-btn">
              <ShoppingBag size={18} />
              <span className="cart-label">Cart</span>
              <span className="cart-badge">0</span>
              <span className="cart-total">৳0</span>
            </button>

            {/* User Profile Pill */}
            <div className="user-profile-pill">
              <div className="user-avatar">
                <User size={16} />
              </div>
              <span className="user-name">Farhan Rahman</span>
              <ChevronDown size={14} className="user-chevron" />
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="savings-subnav-bar">
        <div className="savings-nav-container subnav-flex">
          <nav className="subnav-links">
            <button
              className={`subnav-item ${activeTab === 'grocery' ? 'active' : ''}`}
              onClick={() => onTabChange && onTabChange('grocery')}
            >
              Surplus Grocery <span className="subnav-count">14</span>
            </button>
            <button
              className={`subnav-item ${activeTab === 'mystery' ? 'active' : ''}`}
              onClick={() => onTabChange && onTabChange('mystery')}
            >
              Mystery Orders & Meal Bundles
            </button>
            <button
              className={`subnav-item active-savings ${activeTab === 'savings' ? 'active' : ''}`}
              onClick={() => onTabChange && onTabChange('savings')}
            >
              <Leaf size={14} className="tab-icon" />
              My Savings & Impact
            </button>
          </nav>

          {/* Pickup Window Indicator */}
          <div className="pickup-window-tag">
            <Clock size={14} className="clock-icon" />
            <span>Express Pickup Window: <strong>06:30 PM - 08:00 PM</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
}
