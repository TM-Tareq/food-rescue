import React, { useState } from 'react';
import {
  BarChart3,
  Globe,
  Wind,
  Droplets,
  Award,
  Shield,
  Star,
  Zap,
  Info
} from 'lucide-react';
import Card from '../../../components/Card/Card';
import './SavingsAnalyticsSection.css';

const MONTHLY_DATA = [
  { month: 'Jan', savings: 250, meals: 1 },
  { month: 'Feb', savings: 400, meals: 2 },
  { month: 'Mar', savings: 350, meals: 2 },
  { month: 'Apr', savings: 300, meals: 1 },
  { month: 'May', savings: 450, meals: 2 },
  { month: 'Jun', savings: 500, meals: 2 },
  { month: 'Jul', savings: 300, meals: 1 },
  { month: 'Aug', savings: 400, meals: 2 },
  { month: 'Sep', savings: 350, meals: 2 },
  { month: 'Oct', savings: 950, meals: 4 },
  { month: 'Nov', savings: 1650, meals: 7, highest: true },
  { month: 'Dec', savings: 1200, meals: 5 }
];

export default function SavingsAnalyticsSection() {
  const [hoveredIndex, setHoveredIndex] = useState(10); // Default Nov active

  return (
    <div className="analytics-section-grid">
      {/* Left Column: Dual Bar Chart */}
      <Card className="analytics-card left-chart-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Monthly Money Saved vs. Meals Rescued</h3>
            <p className="chart-subtitle">Annual aggregate performance across partner outlets.</p>
          </div>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-color legend-gold"></span> Savings (BDT)
            </span>
            <span className="legend-item">
              <span className="legend-color legend-green"></span> Rescued Meals
            </span>
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="chart-highlight-pill">
          <Star size={14} className="star-icon" />
          <span>Highest Savings in November: <strong>৳1,650 BDT & 7 Surplus Meals!</strong></span>
        </div>

        {/* Custom SVG Interactive Bar Chart Container */}
        <div className="chart-bars-container">
          {MONTHLY_DATA.map((item, idx) => {
            const savingsHeight = (item.savings / 1800) * 100;
            const mealsHeight = (item.meals / 8) * 100;
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={item.month}
                className={`chart-bar-group ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredIndex(idx)}
              >
                {/* Tooltip on Hover */}
                {isHovered && (
                  <div className="chart-tooltip">
                    <div className="tooltip-month">{item.month} 2026</div>
                    <div className="tooltip-row gold">
                      <span>Saved:</span> <strong>৳{item.savings}</strong>
                    </div>
                    <div className="tooltip-row green">
                      <span>Meals:</span> <strong>{item.meals} Portions</strong>
                    </div>
                  </div>
                )}

                {/* Dual Bars */}
                <div className="bars-flex">
                  <div
                    className="bar bar-gold"
                    style={{ height: `${Math.max(savingsHeight, 8)}%` }}
                  ></div>
                  <div
                    className="bar bar-green"
                    style={{ height: `${Math.max(mealsHeight, 8)}%` }}
                  ></div>
                </div>

                <span className="bar-label">{item.month}</span>
              </div>
            );
          })}
        </div>

        {/* Chart Footer Highlights */}
        <div className="chart-footer-row">
          <div className="footer-stat">
            <Zap size={14} className="stat-icon-amber" />
            <span>Monthly Average: <strong>৳1,500 Saved</strong></span>
          </div>
          <div className="footer-stat">
            <Zap size={14} className="stat-icon-green" />
            <span>Rescue Velocity: <strong>~6 Meals / Month</strong></span>
          </div>
        </div>
      </Card>

      {/* Right Column: Environmental Footprint Diverted */}
      <Card className="analytics-card right-footprint-card">
        <div className="footprint-header">
          <h3 className="chart-title">Environmental Footprint Diverted</h3>
          <p className="chart-subtitle">Direct metrics calculated using Dhaka Solid Waste baseline index.</p>
        </div>

        {/* Footprint Items List */}
        <div className="footprint-list">
          {/* Item 1 */}
          <div className="footprint-item">
            <div className="footprint-icon icon-wind">
              <Wind size={20} />
            </div>
            <div className="footprint-info">
              <span className="footprint-val">8.2 m³ Methane Gas</span>
              <span className="footprint-desc">Rescued from landfill emission</span>
            </div>
            <span className="footprint-tag tag-blue">HIGH RAW</span>
          </div>

          {/* Item 2 */}
          <div className="footprint-item">
            <div className="footprint-icon icon-water">
              <Droplets size={20} />
            </div>
            <div className="footprint-info">
              <span className="footprint-val">7,650 Liters Clean Water</span>
              <span className="footprint-desc">Direct virtual water footprint saved</span>
            </div>
            <span className="footprint-tag tag-cyan">MEGA SAVER</span>
          </div>

          {/* Item 3 */}
          <div className="footprint-item">
            <div className="footprint-icon icon-rank">
              <Award size={20} />
            </div>
            <div className="footprint-info">
              <span className="footprint-val">Top 5% Impact Saver</span>
              <span className="footprint-desc">Banani & Gulshan Donor Leaderboard</span>
            </div>
            <span className="footprint-tag tag-gold">#43 OF 650</span>
          </div>
        </div>

        {/* Flame Protection Tier Progress Widget */}
        <div className="tier-progress-card">
          <div className="tier-header">
            <div className="tier-title-row">
              <Shield size={16} className="shield-icon" />
              <span className="tier-name">Flame Protection (Tier 2)</span>
            </div>
            <span className="tier-count"><strong>18</strong> / 25 Meals (72%)</span>
          </div>

          {/* Progress Bar Track */}
          <div className="tier-bar-track">
            <div className="tier-bar-fill" style={{ width: '72%' }}></div>
          </div>

          <p className="tier-desc">
            Rescue <strong>7 more meals</strong> to unlock permanent 5% platform discount tier & community champion badge!
          </p>
        </div>
      </Card>
    </div>
  );
}
