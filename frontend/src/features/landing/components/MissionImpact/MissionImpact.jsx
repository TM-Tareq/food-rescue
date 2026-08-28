import React from 'react';
import { Heart, Leaf, Users, ShieldCheck, Award } from 'lucide-react';
import Badge from '../../../../components/Badge/Badge';
import Card from '../../../../components/Card/Card';
import './MissionImpact.css';

export default function MissionImpact() {
  const stats = [
    {
      id: 'meals',
      icon: Heart,
      number: '25,000+',
      label: 'Saved Meals Delivered',
      sub: 'Feeding families & shelters',
      colorClass: 'stat-green'
    },
    {
      id: 'co2',
      icon: Leaf,
      number: '15+ Tons',
      label: 'CO₂ Emissions Offset',
      sub: 'Preventing landfill decay',
      colorClass: 'stat-emerald'
    },
    {
      id: 'volunteers',
      icon: Users,
      number: '1,200+',
      label: 'Active Rescue Volunteers',
      sub: 'Community transit network',
      colorClass: 'stat-orange'
    },
    {
      id: 'match',
      icon: Award,
      number: '98.4%',
      label: 'Match & Rescue Rate',
      sub: 'Verified safety window',
      colorClass: 'stat-blue'
    }
  ];

  return (
    <section className="mission-impact-section" id="impact">
      <div className="mission-impact-container">
        {/* Full-width Mission Statement Box */}
        <div className="mission-box">
          <div className="mission-header">
            <Badge icon={ShieldCheck} theme="fresh" className="mission-badge-pill">
              Our Core Mission
            </Badge>

            <h2 className="mission-title">
              Empowering Communities Through Smart Surplus Food Allocation
            </h2>
            <p className="mission-text">
              We bridge the gap between commercial surplus food and community food insecurity. By combining immediate zero-cost NGO donation windows with hyper-local flash deals for general consumers, our mission is to achieve <strong>zero edible food waste</strong> across restaurants, bakeries, and events.
            </p>
          </div>

          {/* Impact Stats Grid using Reusable Cards */}
          <div className="impact-stats-grid">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.id} hover={true} className="impact-stat-card">
                  <div className={`stat-icon-wrapper ${stat.colorClass}`}>
                    <Icon size={24} />
                  </div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-sub">{stat.sub}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
