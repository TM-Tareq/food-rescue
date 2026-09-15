import React from 'react';
import {
  ShoppingBag,
  Utensils,
  Leaf,
  TrendingUp,
  MapPin,
  Trees
} from 'lucide-react';
import Card from '../../../components/Card/Card';
import './ImpactMetricsRow.css';

export default function ImpactMetricsRow() {
  return (
    <div className="impact-metrics-grid">
      {/* Metric Card 1: Total Money Saved */}
      <Card className="metric-card metric-saved">
        <div className="metric-header-row">
          <div className="metric-icon-box icon-amber">
            <ShoppingBag size={22} />
          </div>
          <div className="metric-badge-tag tag-amber">
            +৳1,200 (40% OFF)
          </div>
        </div>

        <div className="metric-body">
          <span className="metric-label">TOTAL MONEY SAVED</span>
          <div className="metric-value-wrapper">
            <span className="metric-currency">৳</span>
            <span className="metric-value">4,500</span>
            <span className="metric-unit">BDT</span>
          </div>
        </div>

        <div className="metric-footer">
          <TrendingUp size={14} className="footer-icon icon-emerald" />
          <span>Saved <strong>৳2,150</strong> vs ৳6,650 maximum retail price</span>
        </div>
      </Card>

      {/* Metric Card 2: Surplus Meals Rescued */}
      <Card className="metric-card metric-meals">
        <div className="metric-header-row">
          <div className="metric-icon-box icon-emerald">
            <Utensils size={22} />
          </div>
          <div className="metric-badge-tag tag-emerald">
            ⚡ ECO HERO
          </div>
        </div>

        <div className="metric-body">
          <span className="metric-label">SURPLUS MEALS RESCUED</span>
          <div className="metric-value-wrapper">
            <span className="metric-value">18</span>
            <span className="metric-unit-text">Portions</span>
          </div>
        </div>

        <div className="metric-footer">
          <MapPin size={14} className="footer-icon icon-teal" />
          <span><strong>14 Zone Takeaway</strong> + 4 Express Deliveries</span>
        </div>
      </Card>

      {/* Metric Card 3: Carbon Dioxide Prevented */}
      <Card className="metric-card metric-co2">
        <div className="metric-header-row">
          <div className="metric-icon-box icon-cyan">
            <Leaf size={22} />
          </div>
          <div className="metric-badge-tag tag-cyan">
            🍃 1.5X TREE
          </div>
        </div>

        <div className="metric-body">
          <span className="metric-label">CARBON DIOXIDE PREVENTED</span>
          <div className="metric-value-wrapper">
            <span className="metric-value">24.5</span>
            <span className="metric-unit-text">kg CO₂e</span>
          </div>
        </div>

        <div className="metric-footer">
          <Trees size={14} className="footer-icon icon-green" />
          <span>Equals <strong>78 km</strong> car ride offset (1.2 trees equivalent)</span>
        </div>
      </Card>
    </div>
  );
}
