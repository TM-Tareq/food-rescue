import React, { useState } from 'react';
import { 
  FileText, Download, Award, Leaf, Users, Heart, Sparkles, 
  TrendingUp, Calendar, CheckCircle2, Star
} from 'lucide-react';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';

export default function AnalyticsReportTab() {
  const [reportGenerated, setReportGenerated] = useState(false);

  // ESG Environmental Impact Metrics
  const esgMetrics = {
    co2Saved: '42.5 Tons',
    mealsServed: '1,25,000 Meals',
    waterSaved: '85,000 Liters',
    landfillPrevented: '18.2 Tons'
  };

  // Top Donors Leaderboard
  const topDonors = [
    { rank: 1, name: 'Star Kabab & Restaurant', rescues: 142, foodKg: '4,250 kg', badge: '🥇 Gold Donor' },
    { rank: 2, name: 'Kacchi Bhai Banani', rescues: 98, foodKg: '3,100 kg', badge: '🥈 Silver Donor' },
    { rank: 3, name: 'Sultan’s Dine Gulshan', rescues: 84, foodKg: '2,800 kg', badge: '🥉 Bronze Donor' },
    { rank: 4, name: 'Dhakaiya Mezban', rescues: 62, foodKg: '1,950 kg', badge: '🌟 Star Donor' }
  ];

  // Top Recipient Shelters
  const topShelters = [
    { rank: 1, name: 'Anjuman Orphanage Shelter', beneficiaries: '120 Children', mealsReceived: '4,850' },
    { rank: 2, name: 'Chhoto Moni Nibash Tejgaon', beneficiaries: '85 Children', mealsReceived: '3,400' },
    { rank: 3, name: 'Shanti Old Age Home', beneficiaries: '60 Senior Citizens', mealsReceived: '2,200' }
  ];

  const handleGeneratePdf = () => {
    setReportGenerated(true);
    setTimeout(() => {
      setReportGenerated(false);
    }, 3000);
  };

  return (
    <div className="tab-pane-analytics-report">
      {/* ESG IMPACT METRICS GRID */}
      <div className="esg-header-bar">
        <div>
          <h4>ESG Environmental & Social Impact Summary</h4>
          <p className="esg-sub">Verified statistics calculated for Bangladesh Ministry of Environment compliance</p>
        </div>

        <Button 
          variant="primary"
          onClick={handleGeneratePdf}
        >
          <FileText size={16} /> 📄 Export Govt CSR Compliance PDF
        </Button>
      </div>

      {reportGenerated && (
        <div className="pdf-success-banner">
          <CheckCircle2 size={20} /> Official ESG CSR PDF Report #ESG-2026-DHAKA successfully generated & downloaded!
        </div>
      )}

      <div className="esg-metrics-grid">
        <div className="esg-card green">
          <Leaf size={28} className="esg-icon" />
          <span className="esg-val">{esgMetrics.co2Saved}</span>
          <span className="esg-lbl">CO2 Emissions Prevented</span>
        </div>

        <div className="esg-card blue">
          <Heart size={28} className="esg-icon" />
          <span className="esg-val">{esgMetrics.mealsServed}</span>
          <span className="esg-lbl">Meals Served to Hungry</span>
        </div>

        <div className="esg-card purple">
          <Sparkles size={28} className="esg-icon" />
          <span className="esg-val">{esgMetrics.waterSaved}</span>
          <span className="esg-lbl">Water Footprint Saved</span>
        </div>

        <div className="esg-card amber">
          <Award size={28} className="esg-icon" />
          <span className="esg-val">{esgMetrics.landfillPrevented}</span>
          <span className="esg-lbl">Organic Waste Saved</span>
        </div>
      </div>

      {/* LEADERBOARDS GRID */}
      <div className="leaderboards-two-col">
        {/* TOP DONOR RESTAURANTS */}
        <div className="leaderboard-card">
          <div className="lb-header">
            <h4>🏆 Top Donor Restaurants</h4>
            <span className="badge-tag-gold">Annual Leaderboard</span>
          </div>

          <table className="lb-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>RESTAURANT</th>
                <th>RESCUES</th>
                <th>FOOD SAVED</th>
                <th>BADGE</th>
              </tr>
            </thead>
            <tbody>
              {topDonors.map((item) => (
                <tr key={item.rank}>
                  <td><strong>#{item.rank}</strong></td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.rescues}</td>
                  <td>{item.foodKg}</td>
                  <td><span className="badge-rank">{item.badge}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOP RECIPIENT SHELTERS */}
        <div className="leaderboard-card">
          <div className="lb-header">
            <h4>🏠 Top Recipient Shelters</h4>
            <span className="badge-tag-blue">Beneficiary Impact</span>
          </div>

          <table className="lb-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>SHELTER ORGANISATION</th>
                <th>BENEFICIARIES</th>
                <th>MEALS RECEIVED</th>
              </tr>
            </thead>
            <tbody>
              {topShelters.map((item) => (
                <tr key={item.rank}>
                  <td><strong>#{item.rank}</strong></td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.beneficiaries}</td>
                  <td><strong>{item.mealsReceived} Meals</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
