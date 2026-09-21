import React from 'react';
import { 
  TrendingUp, Award, Sparkles, Heart, Flame, ShieldCheck, 
  ChevronRight, ArrowUpRight, DollarSign, Leaf, Utensils
} from 'lucide-react';

export default function SavingsImpactTab() {
  return (
    <div className="savings-impact-container">
      {/* Hero Savings Card */}
      <div className="impact-stats-hero">
        <div className="total-saved-block">
          <span className="saved-lbl">Total Personal Savings</span>
          <h2 className="saved-amount">৳4,500 <span className="currency-unit">BDT</span></h2>
          <span className="saving-trend-tag">
            <ArrowUpRight size={14} /> 64% Avg Discount per Meal
          </span>
        </div>

        <div className="tier-badge-box">
          <Award size={28} className="award-icon" />
          <div>
            <h4 className="tier-name">Level 3 • Food Saver Hero</h4>
            <p className="tier-sub">Rank #14 in Dhaka District</p>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards Grid */}
      <div className="impact-kpi-row">
        <div className="kpi-card-box">
          <div className="kpi-icon-wrapper bg-green">
            <Utensils size={20} color="#059669" />
          </div>
          <div className="kpi-data">
            <span className="kpi-val">28 Meals</span>
            <span className="kpi-lbl">Rescued from Waste</span>
          </div>
        </div>

        <div className="kpi-card-box">
          <div className="kpi-icon-wrapper bg-blue">
            <Leaf size={20} color="#2563eb" />
          </div>
          <div className="kpi-data">
            <span className="kpi-val">42.5 kg</span>
            <span className="kpi-lbl">CO2 Emissions Avoided</span>
          </div>
        </div>

        <div className="kpi-card-box">
          <div className="kpi-icon-wrapper bg-amber">
            <Sparkles size={20} color="#d97706" />
          </div>
          <div className="kpi-data">
            <span className="kpi-val">350 Pts</span>
            <span className="kpi-lbl">Green Karma Rewards</span>
          </div>
        </div>
      </div>

      {/* Badges & Milestones Section */}
      <div className="milestones-card-section">
        <h3>Unlocked Achievement Badges</h3>

        <div className="badges-grid flex-row">
          <div className="badge-item active-badge">
            <span className="badge-emoji">👑</span>
            <div className="badge-info">
              <strong>Smart Saver Titan</strong>
              <p>Saved over ৳4,000 BDT on food</p>
            </div>
          </div>

          <div className="badge-item active-badge">
            <span className="badge-emoji">🌱</span>
            <div className="badge-info">
              <strong>Zero Waste Champion</strong>
              <p>Rescued 25+ surplus meals</p>
            </div>
          </div>

          <div className="badge-item active-badge">
            <span className="badge-emoji">🌙</span>
            <div className="badge-info">
              <strong>Midnight Bargainer</strong>
              <p>Claimed 5 late-night bakery deals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
