import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Flame, Sparkles, TrendingUp, Sun, Moon, 
  MapPin, Clock, ShieldCheck, Search, Filter, User, ChevronRight,
  Heart, Tag, CreditCard, QrCode, Settings, LogOut
} from 'lucide-react';
import DealExplorerTab from './components/DealExplorerTab';
import ActiveOrdersTab from './components/ActiveOrdersTab';
import SavingsImpactTab from './components/SavingsImpactTab';
import CartCheckoutModal from './components/CartCheckoutModal';
import QrCodePassModal from './components/QrCodePassModal';
import UserProfileModal from './components/UserProfileModal';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './ConsumerMarketplace.css';

export default function ConsumerMarketplace({ onLogout }) {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer', 'orders', 'impact'
  const { roleThemes, toggleRoleTheme } = useTheme();
  const themeMode = roleThemes.consumer;
  
  // User Profile & Settings State
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('foodrescue_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: 'Farhan Ahmed',
      phone: '+880 1712-345678',
      address: 'House 42, Road 11, Block D, Banani, Dhaka',
      avatarEmoji: '👨‍💼',
      level: 'Level 3 Food Saver'
    };
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Cart & Checkout State
  const [cartItems, setCartItems] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  
  // Orders & Digital QR Pass State (Persisted in LocalStorage)
  const [activeOrders, setActiveOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('foodrescue_consumer_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out legacy fake seed order
          return parsed.filter(o => o.id !== 'PASS-98402');
        }
      }
    } catch (e) {
      console.warn('Failed to parse active orders from localStorage:', e);
    }
    return [];
  });

  const [selectedQrOrder, setSelectedQrOrder] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Sync active orders to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('foodrescue_consumer_orders', JSON.stringify(activeOrders));
    } catch (e) {
      console.warn('Failed to save active orders:', e);
    }
  }, [activeOrders]);

  // Toggle Theme Mode Effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  // User Profile Update Handler
  const handleUpdateUserInfo = (updatedInfo) => {
    setUserInfo(prev => {
      const updated = { ...prev, ...updatedInfo };
      try {
        localStorage.setItem('foodrescue_user_profile', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Cart Management Handlers
  const handleAddToCart = (deal) => {
    if (!cartItems.some(item => item.id === deal.id)) {
      setCartItems(prev => [...prev, deal]);
    }
  };

  const handleRemoveFromCart = (dealId) => {
    setCartItems(prev => prev.filter(item => item.id !== dealId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckoutSuccess = (newOrder) => {
    setActiveOrders(prev => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem('foodrescue_consumer_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setActiveTab('orders'); // Switch tab to Active Orders (Foodpanda live order tracker)
  };

  const handleOpenQrPass = (order) => {
    setSelectedQrOrder(order);
    setIsQrModalOpen(true);
  };

  return (
    <div className={`consumer-marketplace-wrapper theme-${themeMode}`}>
      {/* Top Header Navigation Bar */}
      <header className="marketplace-navbar">
        <div className="nav-brand-group">
          <span className="brand-logo-icon">🍲</span>
          <div>
            <h1 className="brand-title">FoodRescue <span className="highlight-text">Marketplace</span></h1>
            <p className="brand-subtitle">50% - 70% OFF Discounted Surplus Deals • Zero Waste</p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="nav-actions-group">
          {/* Theme Switcher Toggle */}
          <button 
            className="theme-switch-btn"
            onClick={() => toggleRoleTheme('consumer')}
            title="Toggle Light / Dark Mode"
          >
            {themeMode === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#059669" />}
            <span>{themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Interactive User Profile Badge & Settings Trigger */}
          <div 
            className="user-profile-badge clickable-profile-badge"
            onClick={() => setIsProfileModalOpen(true)}
            title="Click to Edit Profile Settings"
          >
            <div className="avatar-circle">{userInfo.avatarEmoji}</div>
            <div className="user-meta">
              <span className="user-name">{userInfo.name}</span>
              <span className="user-level">🏆 {userInfo.level}</span>
            </div>
            <Settings size={15} className="settings-gear-icon" />
          </div>

          {/* Cart Drawer Trigger Button */}
          <button 
            className="btn-open-cart"
            onClick={() => setIsCartModalOpen(true)}
          >
            <ShoppingBag size={18} />
            <span>Cart</span>
            <span className="cart-count-badge">{cartItems.length}</span>
          </button>

          {/* Sign Out Button */}
          <button 
            className="theme-switch-btn"
            onClick={() => {
              logout();
              if (onLogout) onLogout();
            }}
            style={{ borderColor: '#ef4444', color: '#dc2626' }}
            title="Sign Out of Account"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Sub-Tab Navigation Bar */}
      <nav className="sub-tabs-bar">
        <button 
          className={`tab-link-btn ${activeTab === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveTab('explorer')}
        >
          🔥 Surplus Deals Explorer
        </button>

        <button 
          className={`tab-link-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          🎟️ Active Takeaway Passes ({activeOrders.length})
        </button>

        <button 
          className={`tab-link-btn ${activeTab === 'impact' ? 'active' : ''}`}
          onClick={() => setActiveTab('impact')}
        >
          📊 My Savings & Impact (৳4,500 BDT)
        </button>
      </nav>

      {/* Main Content Pane */}
      <main className="marketplace-body-content">
        {activeTab === 'explorer' && (
          <DealExplorerTab 
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
            onOpenCart={() => setIsCartModalOpen(true)}
          />
        )}

        {activeTab === 'orders' && (
          <ActiveOrdersTab 
            orders={activeOrders}
            onOpenQrPass={handleOpenQrPass}
          />
        )}

        {activeTab === 'impact' && (
          <SavingsImpactTab />
        )}
      </main>

      {/* Cart & Escrow Checkout Modal */}
      <CartCheckoutModal 
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cartItems={cartItems}
        userInfo={userInfo}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* Scannable Digital QR Pass Modal */}
      <QrCodePassModal 
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        order={selectedQrOrder}
      />

      {/* User Profile Settings Modal */}
      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userInfo={userInfo}
        onUpdateUserInfo={handleUpdateUserInfo}
      />
    </div>
  );
}
