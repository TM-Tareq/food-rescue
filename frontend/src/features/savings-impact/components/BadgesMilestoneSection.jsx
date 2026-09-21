import React from 'react';
import {
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Gift,
  Calendar,
  ShieldCheck,
  Trophy
} from 'lucide-react';
import Card from '../../../components/Card/Card';
import './BadgesMilestoneSection.css';

export default function BadgesMilestoneSection() {
  return (
    <div className="badges-section-container">
      {/* Header Row */}
      <div className="badges-header-row">
        <div>
          <h2 className="badges-title">Badges & Milestone Achievements</h2>
          <p className="badges-subtitle">Collect sustainability credentials verified on the Dhaka Food Rescue ledger.</p>
        </div>
        <div className="badges-summary-pill">
          <Trophy size={15} className="trophy-icon" />
          <span>3 of 5 Badges Achieved (60%)</span>
        </div>
      </div>

      {/* 3 Grid Cards */}
      <div className="badges-grid">
        {/* Badge 1: Zero Waste Champion */}
        <Card className="badge-card card-unlocked-green">
          <div className="badge-card-top">
            <div className="badge-icon-wrapper bg-green">
              <ShieldCheck size={24} />
            </div>
            <span className="status-chip chip-unlocked-green">
              <CheckCircle2 size={13} /> UNLOCKED
            </span>
          </div>

          <h3 className="badge-name">Zero Waste Champion</h3>
          <p className="badge-desc">
            Rescued at least 15 surplus meals within scheduled expiry warning window.
          </p>

          <div className="badge-footer">
            <Calendar size={13} className="calendar-icon" />
            <span>Unlocked on Mar 12, 2026</span>
          </div>
        </Card>

        {/* Badge 2: Bargain Hunter */}
        <Card className="badge-card card-unlocked-gold">
          <div className="badge-card-top">
            <div className="badge-icon-wrapper bg-gold">
              <Zap size={24} />
            </div>
            <span className="status-chip chip-unlocked-gold">
              <CheckCircle2 size={13} /> UNLOCKED
            </span>
          </div>

          <h3 className="badge-name">Bargain Hunter</h3>
          <p className="badge-desc">
            Saved over ৳4,000 BDT through verified 50%+ food rescue discounts in Dhaka.
          </p>

          <div className="badge-footer">
            <Calendar size={13} className="calendar-icon" />
            <span>Unlocked on Feb 03, 2026</span>
          </div>
        </Card>

        {/* Badge 3: 25 Meals Rescued Club */}
        <Card className="badge-card card-in-progress">
          <div className="badge-card-top">
            <div className="badge-icon-wrapper bg-slate">
              <Trophy size={24} />
            </div>
            <span className="status-chip chip-progress">
              <Lock size={13} /> IN-PROGRESS (72%)
            </span>
          </div>

          <h3 className="badge-name">25 Meals Rescued Club</h3>
          <p className="badge-desc">
            Rescue 25 meals to unlock a complementary ৳100 BDT voucher for your next order.
          </p>

          {/* Mini Progress */}
          <div className="badge-progress-box">
            <div className="badge-progress-labels">
              <span>18 Rescued</span>
              <span>7 meals remaining</span>
            </div>
            <div className="badge-progress-track">
              <div className="badge-progress-bar" style={{ width: '72%' }}></div>
            </div>
          </div>

          <div className="badge-reward-tag">
            <Gift size={13} className="gift-icon" />
            <span>Reward: ৳100 Discount Voucher</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
