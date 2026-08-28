import React from 'react';
import { Heart, Leaf, DollarSign, Download, Award, TrendingUp, ShieldCheck } from 'lucide-react';
import Card from '../../../../components/Card/Card';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import './ImpactAnalyticsTab.css';

export default function ImpactAnalyticsTab() {
  const recipientNgos = [
    { name: 'Anjuman Orphanage Shelter', meals: '450 meals', status: 'Verified Partner' },
    { name: 'Dhaka Community Food Bank', meals: '320 meals', status: 'Verified Partner' },
    { name: 'Sunshine Child Care Home', meals: '180 meals', status: 'Verified Partner' }
  ];

  return (
    <div className="impact-tab">
      <div className="tab-header">
        <div>
          <h1 className="tab-title">Impact & CO₂ Sustainability Analytics</h1>
          <p className="tab-sub">Track your restaurant's social contribution, carbon offsets, and tax deductions.</p>
        </div>
        <Button variant="outline" icon={Download} onClick={() => alert('Downloading Tax & Sustainability Certificate (PDF)...')}>
          Export Tax Statement (PDF)
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="impact-metrics-grid">
        <Card hover={true} className="impact-card">
          <div className="card-icon-box green-icon"><Heart size={22} /></div>
          <span className="impact-value">1,240</span>
          <span className="impact-label">Total Meals Rescued</span>
          <span className="impact-sub">Feeding local orphanages & shelters</span>
        </Card>

        <Card hover={true} className="impact-card">
          <div className="card-icon-box emerald-icon"><Leaf size={22} /></div>
          <span className="impact-value">3.8 Tons</span>
          <span className="impact-label">CO₂ Emissions Offset</span>
          <span className="impact-sub">Equivalent to planting 180 trees</span>
        </Card>

        <Card hover={true} className="impact-card">
          <div className="card-icon-box orange-icon"><DollarSign size={22} /></div>
          <span className="impact-value">৳ 42,500</span>
          <span className="impact-label">Value Salvaged</span>
          <span className="impact-sub">Eligible for corporate CSR tax break</span>
        </Card>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="analytics-split-grid">
        {/* Left: Monthly Trend Simulation Chart Box */}
        <Card hover={false} className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Monthly Food Rescue Trend (2026)</h3>
            <Badge theme="fresh"><TrendingUp size={14} /> +24% Growth</Badge>
          </div>
          <div className="bar-chart-simulation">
            <div className="bar-col"><div className="bar-fill" style={{ height: '40%' }}></div><span>May</span></div>
            <div className="bar-col"><div className="bar-fill" style={{ height: '65%' }}></div><span>Jun</span></div>
            <div className="bar-col"><div className="bar-fill" style={{ height: '55%' }}></div><span>Jul</span></div>
            <div className="bar-col"><div className="bar-fill active-bar" style={{ height: '88%' }}></div><span>Aug</span></div>
          </div>
        </Card>

        {/* Right: Top Recipient NGOs List */}
        <Card hover={false} className="recipients-card">
          <h3 className="chart-title">Top Recipient NGO Partners</h3>
          <div className="recipients-list">
            {recipientNgos.map((ngo, idx) => (
              <div key={idx} className="recipient-row">
                <div>
                  <span className="r-name">{ngo.name}</span>
                  <span className="r-sub"><ShieldCheck size={12} /> {ngo.status}</span>
                </div>
                <span className="r-meals">{ngo.meals}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
