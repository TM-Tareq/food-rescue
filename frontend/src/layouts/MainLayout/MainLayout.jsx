import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './MainLayout.css';

/**
 * Main Layout Wrapper Component
 * Combines Navbar, Main Content Area, and Footer for high reusability across pages
 */
export default function MainLayout({ children, onOpenAuth }) {
  return (
    <div className="main-layout-root">
      {/* Shared Navbar */}
      <Navbar onOpenAuth={onOpenAuth} />

      {/* Dynamic Page Content */}
      <div className="main-layout-content">
        {children}
      </div>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
