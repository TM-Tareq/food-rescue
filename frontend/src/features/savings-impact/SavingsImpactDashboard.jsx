import React, { useState } from 'react';
import {
  Calendar,
  Download,
  Share2,
  Gift,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import SavingsHeaderNav from './components/SavingsHeaderNav';
import ImpactMetricsRow from './components/ImpactMetricsRow';
import SavingsAnalyticsSection from './components/SavingsAnalyticsSection';
import BadgesMilestoneSection from './components/BadgesMilestoneSection';
import SavingsOrderTable from './components/SavingsOrderTable';
import ImpactCertificateModal from './components/ImpactCertificateModal';
import ReceiptPassModal from './components/ReceiptPassModal';
import Button from '../../components/Button/Button';
import './SavingsImpactDashboard.css';

export default function SavingsImpactDashboard() {
  const [activeSubTab, setActiveSubTab] = useState('savings');
  const [selectedDateFilter, setSelectedDateFilter] = useState('Last 30 Days (Feb)');
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  const handleShareStory = () => {
    if (navigator.share) {
      navigator.share({
        title: 'FoodRescue Impact',
        text: 'I have saved ৳4,500 BDT and diverted 24.5 kg CO2 using FoodRescue Market in Dhaka!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert('Impact link copied to clipboard! Share on WhatsApp or Instagram.');
    }
  };

  return (
    <div className="savings-impact-page">
      {/* Top Consumer Navbar & Subnav */}
      <SavingsHeaderNav activeTab={activeSubTab} onTabChange={setActiveSubTab} />

      {/* Main Page Content */}
      <main className="savings-dashboard-content">
        <div className="content-container">
          {/* Breadcrumbs & Title Section */}
          <div className="page-header-row">
            <div className="header-titles">
              <nav className="breadcrumbs">
                <span>FoodRescue Market</span>
                <span className="crumb-slash">&gt;</span>
                <span className="crumb-active">Personal Impact &amp; Wallet</span>
                <span className="crumb-slash">&gt;</span>
              </nav>

              <h1 className="main-page-title">My Savings &amp; Eco Impact Analytics</h1>
              <p className="main-page-subtitle">
                Track how much money you have saved while diverting fresh, high-grade surplus food from Dhaka landfills.
              </p>
            </div>

            {/* Top Right Action Controls */}
            <div className="header-actions-group">
              {/* Date Filter Selector Dropdown */}
              <div className="date-filter-dropdown">
                <Calendar size={15} className="dropdown-icon" />
                <select
                  value={selectedDateFilter}
                  onChange={(e) => setSelectedDateFilter(e.target.value)}
                  className="date-select"
                >
                  <option value="Last 30 Days (Feb)">Last 30 Days (Feb)</option>
                  <option value="Last 90 Days">Last 90 Days</option>
                  <option value="Year 2026">Year 2026</option>
                  <option value="All Time">All Time</option>
                </select>
                <ChevronDown size={14} className="dropdown-chevron" />
              </div>

              {/* Export Impact Certificate Button */}
              <Button
                variant="primary"
                size="md"
                icon={Download}
                onClick={() => setIsCertificateOpen(true)}
                className="export-cert-btn"
              >
                Export Impact Certificate
              </Button>
            </div>
          </div>

          {/* Section 1: Metrics Row (3 Cards) */}
          <ImpactMetricsRow />

          {/* Section 2: Dual Bar Chart & Footprint Widget */}
          <SavingsAnalyticsSection />

          {/* Section 3: Badges & Milestone Achievements */}
          <BadgesMilestoneSection />

          {/* Section 4: Detailed Order Breakdown Ledger Table */}
          <SavingsOrderTable onSelectReceipt={(order) => setSelectedReceiptOrder(order)} />

          {/* Section 5: Inspire Dhaka Bottom CTA Banner */}
          <div className="inspire-cta-banner">
            <div className="cta-content-left">
              <div className="cta-tag-pill">
                <Sparkles size={14} />
                <span>AMPLIFY DHAKA'S IMPACT</span>
              </div>
              <h2 className="cta-heading">Inspire Dhaka to Stop Food Waste</h2>
              <p className="cta-body">
                Share your monthly impact story on Instagram or WhatsApp. When your friends rescue their first mystery box, you both get ৳50 BDT credit added to your FoodRescue wallet.
              </p>
            </div>

            <div className="cta-actions-right">
              <button className="cta-share-btn" onClick={handleShareStory}>
                <Share2 size={16} /> Share to Instagram / WA
              </button>
              <button className="cta-invite-btn" onClick={() => alert('Referral Code: FARHAN50 copied!')}>
                <Gift size={16} /> Invite Friends (+৳50)
              </button>
            </div>
          </div>

          {/* Footer Bar */}
          <footer className="savings-footer-bar">
            <div className="footer-badges-list">
              <span className="footer-badge-item">
                <CheckCircle2 size={14} className="f-icon" /> Verified Carbon Offsets
              </span>
              <span className="footer-badge-item">
                <ShieldCheck size={14} className="f-icon" /> Certified Food Hygiene Standards
              </span>
              <span className="footer-badge-item">
                <Sparkles size={14} className="f-icon" /> Dhaka Rescue Network Partner
              </span>
            </div>

            <span className="footer-copyright">
              © 2026 FoodRescue Bangladesh. All rights reserved.
            </span>
          </footer>
        </div>
      </main>

      {/* Impact Certificate Modal */}
      <ImpactCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

      {/* QR Receipt Pass Modal */}
      <ReceiptPassModal
        isOpen={!!selectedReceiptOrder}
        onClose={() => setSelectedReceiptOrder(null)}
        order={selectedReceiptOrder}
      />
    </div>
  );
}
