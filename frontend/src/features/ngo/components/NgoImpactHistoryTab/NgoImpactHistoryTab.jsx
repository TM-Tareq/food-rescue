import React, { useState } from 'react';
import { 
  Utensils, DollarSign, Leaf, Store, Trophy, Award, Medal, 
  Download, FileText, CheckCircle2, Search, Filter, Sparkles, Calendar, ChevronDown
} from 'lucide-react';
import Card from '../../../../components/Card/Card';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import './NgoImpactHistoryTab.css';

export default function NgoImpactHistoryTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('THIS_MONTH');

  // Dynamic KPI Stats per Selected Duration
  const kpiDataMap = {
    THIS_MONTH: {
      meals: '1,450+',
      trend: '📈 +18%',
      value: '৳87,000',
      carbon: '3.2',
      donors: '18',
      topDonor: 'Star Chef Bistro'
    },
    LAST_3_MONTHS: {
      meals: '4,250+',
      trend: '📈 +24%',
      value: '৳255,000',
      carbon: '9.4',
      donors: '24',
      topDonor: 'Star Chef Bistro'
    },
    THIS_YEAR: {
      meals: '11,800+',
      trend: '📈 +35%',
      value: '৳708,000',
      carbon: '26.1',
      donors: '32',
      topDonor: 'Star Chef Bistro'
    },
    ALL_TIME: {
      meals: '24,500+',
      trend: '⭐ Milestone',
      value: '৳1,470,000',
      carbon: '54.0',
      donors: '45',
      topDonor: 'Star Chef Bistro'
    }
  };

  const currentKpi = kpiDataMap[selectedDuration] || kpiDataMap.THIS_MONTH;

  // Top Donor Leaderboard Data
  const topDonors = [
    {
      rank: 1,
      name: 'Star Chef Bistro (Banani)',
      mealsDonated: selectedDuration === 'ALL_TIME' ? 2400 : selectedDuration === 'THIS_YEAR' ? 1200 : selectedDuration === 'LAST_3_MONTHS' ? 890 : 480,
      badge: '#1 Donating Partner',
      iconColor: '#f59e0b',
      bgColor: '#fffbeb',
      badgeClass: 'badge-gold'
    },
    {
      rank: 2,
      name: 'Daily Crust Bakery (Bashundhara)',
      mealsDonated: selectedDuration === 'ALL_TIME' ? 1850 : selectedDuration === 'THIS_YEAR' ? 950 : selectedDuration === 'LAST_3_MONTHS' ? 640 : 320,
      badge: 'Top Bakery Partner',
      iconColor: '#64748b',
      bgColor: '#f8fafc',
      badgeClass: 'badge-silver'
    },
    {
      rank: 3,
      name: 'Dhaka Kitchen (Gulshan)',
      mealsDonated: selectedDuration === 'ALL_TIME' ? 1320 : selectedDuration === 'THIS_YEAR' ? 680 : selectedDuration === 'LAST_3_MONTHS' ? 420 : 210,
      badge: 'Loyal Rescue Partner',
      iconColor: '#d97706',
      bgColor: '#fff7ed',
      badgeClass: 'badge-bronze'
    }
  ];

  // Completed Rescue History Table Data
  const completedRescues = [
    {
      id: '8091',
      date: 'Aug 30, 6:45 PM',
      foodItem: 'Spicy Chicken Biryani',
      portions: '20 Portions',
      donor: 'Star Chef Bistro',
      courier: 'Tanvir Hossain (Motorcycle)',
      status: 'Handover Verified',
      receiptId: '#8091',
      period: 'THIS_MONTH'
    },
    {
      id: '8092',
      date: 'Aug 29, 5:30 PM',
      foodItem: 'Artisan Bread Basket',
      portions: '15 Packs',
      donor: 'Daily Crust Bakery',
      courier: 'Shelter Driver Rafiq (NGO Van)',
      status: 'Handover Verified',
      receiptId: '#8092',
      period: 'THIS_MONTH'
    },
    {
      id: '8090',
      date: 'Aug 28, 8:15 PM',
      foodItem: 'Beef Tehari & Borhani',
      portions: '35 Portions',
      donor: 'Dhaka Kitchen',
      courier: 'Tanvir Hossain (Motorcycle)',
      status: 'Handover Verified',
      receiptId: '#8090',
      period: 'THIS_MONTH'
    },
    {
      id: '8088',
      date: 'Aug 26, 1:15 PM',
      foodItem: 'Mixed Pastry & Cake Box',
      portions: '12 Packs',
      donor: 'Daily Crust Bakery',
      courier: 'Volunteer Arman (Bicycle)',
      status: 'Handover Verified',
      receiptId: '#8088',
      period: 'THIS_MONTH'
    },
    {
      id: '8085',
      date: 'Aug 24, 7:00 PM',
      foodItem: 'Kacchi Biryani & Firni',
      portions: '40 Portions',
      donor: 'Star Chef Bistro',
      courier: 'Tanvir Hossain (Motorcycle)',
      status: 'Handover Verified',
      receiptId: '#8085',
      period: 'THIS_MONTH'
    }
  ];

  const handleDownloadPdfStatement = () => {
    setIsExportingPdf(true);
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob([
        `FOODRESCUE NGO OFFICIAL IMPACT STATEMENT\n=========================================\nShelter: Anjuman Orphanage Shelter\nPeriod Filter: ${selectedDuration}\n\nTotal Meals Served: ${currentKpi.meals} Meals\nFood Value Rescued: ${currentKpi.value}\nCarbon Footprint Offset: ${currentKpi.carbon} Tons CO2\nPartner Donor Restaurants: ${currentKpi.donors} Active Donors\n\nTOP DONOR LEADERBOARD:\n1. Star Chef Bistro (Banani) - ${topDonors[0].mealsDonated} Meals\n2. Daily Crust Bakery (Bashundhara) - ${topDonors[1].mealsDonated} Meals\n3. Dhaka Kitchen (Gulshan) - ${topDonors[2].mealsDonated} Meals\n`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `Anjuman_Shelter_Impact_Report_${selectedDuration}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setIsExportingPdf(false);
    }, 1200);
  };

  const filteredRescues = completedRescues.filter(r => 
    r.foodItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.courier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="ngo-impact-history-tab">
      {/* Header */}
      <div className="tab-header">
        <div>
          <h1 className="tab-title">NGO Impact History & Sustainability Analytics</h1>
          <p className="tab-sub">Official food rescue milestones, donor restaurant leaderboard, and monthly impact reports for Anjuman Orphanage Shelter.</p>
        </div>
        <Button
          variant="emerald"
          icon={Download}
          onClick={handleDownloadPdfStatement}
          loading={isExportingPdf}
          className="export-pdf-btn"
        >
          {isExportingPdf ? 'Generating PDF...' : '📥 Download Official Impact Statement (PDF)'}
        </Button>
      </div>

      {/* DURATION SELECTOR BAR (Filter across different durations) */}
      <div className="duration-selector-bar">
        <span className="duration-bar-label"><Calendar size={16} /> Select Analytics Duration:</span>
        <div className="duration-chips">
          <button
            className={`duration-chip ${selectedDuration === 'THIS_MONTH' ? 'chip-active' : ''}`}
            onClick={() => setSelectedDuration('THIS_MONTH')}
          >
            📅 This Month (Aug 2026)
          </button>
          <button
            className={`duration-chip ${selectedDuration === 'LAST_3_MONTHS' ? 'chip-active' : ''}`}
            onClick={() => setSelectedDuration('LAST_3_MONTHS')}
          >
            🗓️ Last 3 Months
          </button>
          <button
            className={`duration-chip ${selectedDuration === 'THIS_YEAR' ? 'chip-active' : ''}`}
            onClick={() => setSelectedDuration('THIS_YEAR')}
          >
            📊 This Year (2026)
          </button>
          <button
            className={`duration-chip ${selectedDuration === 'ALL_TIME' ? 'chip-active' : ''}`}
            onClick={() => setSelectedDuration('ALL_TIME')}
          >
            🌐 All-Time History
          </button>
        </div>
      </div>

      {/* SECTION 1: 4 KPI METRIC STAT CARDS */}
      <div className="impact-kpi-grid">
        <Card hover={false} className="kpi-metric-card">
          <div className="kpi-icon-row">
            <div className="kpi-icon-circle bg-emerald">
              <Utensils size={22} className="text-emerald" />
            </div>
            <span className="kpi-trend-badge">{currentKpi.trend}</span>
          </div>
          <span className="kpi-label">Total Meals Served</span>
          <h2 className="kpi-value-text">{currentKpi.meals} <span className="kpi-unit">Meals</span></h2>
          <span className="kpi-sub-info">Directly fed children in shelter</span>
        </Card>

        <Card hover={false} className="kpi-metric-card">
          <div className="kpi-icon-row">
            <div className="kpi-icon-circle bg-amber">
              <DollarSign size={22} className="text-amber" />
            </div>
          </div>
          <span className="kpi-label">Food Value Rescued</span>
          <h2 className="kpi-value-text">{currentKpi.value}</h2>
          <span className="kpi-sub-info">Equivalent meal cost saved</span>
        </Card>

        <Card hover={false} className="kpi-metric-card">
          <div className="kpi-icon-row">
            <div className="kpi-icon-circle bg-teal">
              <Leaf size={22} className="text-teal" />
            </div>
          </div>
          <span className="kpi-label">Carbon Footprint Offset</span>
          <h2 className="kpi-value-text">{currentKpi.carbon} <span className="kpi-unit">Tons CO₂</span></h2>
          <span className="kpi-sub-info">Prevented from landfills</span>
        </Card>

        <Card hover={false} className="kpi-metric-card">
          <div className="kpi-icon-row">
            <div className="kpi-icon-circle bg-blue">
              <Store size={22} className="text-blue" />
            </div>
          </div>
          <span className="kpi-label">Partner Donors</span>
          <h2 className="kpi-value-text">{currentKpi.donors} <span className="kpi-unit">Restaurants</span></h2>
          <span className="kpi-sub-info">Top donor: {currentKpi.topDonor}</span>
        </Card>
      </div>

      {/* SECTION 2: TOP DONOR RESTAURANT LEADERBOARD */}
      <div className="leaderboard-section">
        <div className="section-header">
          <h2 className="section-title">
            <Trophy size={20} className="text-amber" /> Top Donor Restaurant Leaderboard
          </h2>
        </div>

        <div className="leaderboard-grid">
          {topDonors.map((donor) => (
            <Card key={donor.rank} hover={false} className={`donor-rank-card rank-${donor.rank}`}>
              <div className="rank-badge-icon">
                {donor.rank === 1 && <Trophy size={28} className="icon-gold" />}
                {donor.rank === 2 && <Award size={28} className="icon-silver" />}
                {donor.rank === 3 && <Medal size={28} className="icon-bronze" />}
              </div>

              <h3 className="donor-name-title">{donor.name}</h3>
              <div className="meals-donated-count">
                <span className="count-number">{donor.mealsDonated}</span>
                <span className="count-label">Meals Donated</span>
              </div>

              <span className={`donor-category-pill ${donor.badgeClass}`}>
                {donor.badge}
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* SECTION 3: COMPLETED RESCUE HISTORY LOGS TABLE */}
      <div className="history-table-section">
        <div className="table-header-row">
          <div className="table-title-wrap">
            <h2 className="section-title">
              <CheckCircle2 size={20} className="text-blue" /> Verified Completed Rescues History
            </h2>
          </div>

          <div className="table-search-box">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search history by food, donor, or courier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card hover={false} className="history-table-card">
          <div className="table-responsive-wrapper">
            <table className="rescue-history-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Food Item</th>
                  <th>Portions</th>
                  <th>Donor Restaurant</th>
                  <th>Volunteer Courier</th>
                  <th>Verification Status</th>
                  <th>Digital Receipt</th>
                </tr>
              </thead>
              <tbody>
                {filteredRescues.map((rescue) => (
                  <tr key={rescue.id}>
                    <td className="date-cell">{rescue.date}</td>
                    <td className="food-cell">
                      <strong>{rescue.foodItem}</strong>
                    </td>
                    <td className="portions-cell">{rescue.portions}</td>
                    <td className="donor-cell">{rescue.donor}</td>
                    <td className="courier-cell">{rescue.courier}</td>
                    <td>
                      <span className="status-verified-pill">
                        <CheckCircle2 size={13} /> {rescue.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="download-receipt-link-btn"
                        onClick={() => alert(`Downloading Receipt ${rescue.receiptId}...`)}
                      >
                        <FileText size={13} /> Receipt {rescue.receiptId} (PDF)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
