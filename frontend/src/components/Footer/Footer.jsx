import React from 'react';
import { Leaf, Heart, Shield } from 'lucide-react';
import Badge from '../Badge/Badge';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="navbar-logo">
              <div className="logo-icon-wrapper">
                <Leaf size={20} />
              </div>
              <span className="logo-text">Food<span className="logo-highlight">Rescue</span></span>
            </div>
            <p className="footer-tagline">
              Logistical excellence for food waste reduction, community impact, and affordable meal access.
            </p>
            <div className="footer-badges">
              <Badge icon={Shield} theme="dark">Sustainability First</Badge>
              <Badge icon={Heart} theme="dark">Community Driven</Badge>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h4>Platform</h4>
              <a href="#deals">Discount Deals</a>
              <a href="#ngo-feed">NGO Claims</a>
              <a href="#matching">Smart Matching</a>
              <a href="#safety">Safety Rules</a>
            </div>

            <div className="footer-col">
              <h4>Partners</h4>
              <a href="#restaurants">For Restaurants</a>
              <a href="#ngos">For NGOs</a>
              <a href="#volunteers">For Volunteers</a>
              <a href="#verification">Partner Verification</a>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <a href="#about">About Us</a>
              <a href="#impact">Impact Report</a>
              <a href="#contact">Contact Support</a>
              <a href="#legal">Legal Waiver & Safety</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} FoodRescue. All rights reserved. Hybrid Surplus Rescue & Marketplace.</p>
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#portal">Partner Portal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
