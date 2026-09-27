import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Clock, Edit2, Trash2, Radio } from 'lucide-react';
import Card from '../../../../components/Card/Card';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import { surplusService, getItemLogisticsStatus } from '../../../../services/surplusService';
import LiveCountdownBadge from '../../../../components/LiveCountdownBadge/LiveCountdownBadge';
import FoodLifecycleTimeline from '../../../../components/FoodLifecycleTimeline/FoodLifecycleTimeline';
import './ActiveListingsTab.css';

export default function ActiveListingsTab({ onOpenDispatch, listings: propListings }) {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [listings, setListings] = useState(propListings || surplusService.getStoredListings());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const refreshListings = () => {
      setListings(surplusService.getStoredListings());
    };

    if (!propListings) {
      refreshListings();
    } else {
      setListings(propListings);
    }

    const timer = setInterval(() => setNow(Date.now()), 1000);

    window.addEventListener('foodrescue_surplus_updated', refreshListings);
    return () => {
      clearInterval(timer);
      window.removeEventListener('foodrescue_surplus_updated', refreshListings);
    };
  }, [propListings]);


  return (
    <div className="active-listings-tab">
      <div className="tab-header">
        <div>
          <h1 className="tab-title">Surplus Food Listings</h1>
          <p className="tab-sub">Manage active food posts, storage rules, and dispatch statuses.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => onOpenDispatch(null)}>
          Create New Listing
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="filter-controls">
        <div className="filter-tabs">
          <button className={`filter-tab ${filter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>
            All Posts (2)
          </button>
          <button className={`filter-tab ${filter === 'URGENT' ? 'active' : ''}`} onClick={() => setFilter('URGENT')}>
            🔥 Urgent Expiry (1)
          </button>
          <button className={`filter-tab ${filter === 'DONATION' ? 'active' : ''}`} onClick={() => setFilter('DONATION')}>
            🤝 NGO Free (1)
          </button>
          <button className={`filter-tab ${filter === 'FLASH' ? 'active' : ''}`} onClick={() => setFilter('FLASH')}>
            ⚡ Flash Sale (1)
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by food name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Listings Cards Grid */}
      <div className="listings-grid">
        {listings.map((item) => (
          <Card key={item.id} hover={true} className="listing-item-card">
            <div className="card-top-image">
              <img src={item.image} alt={item.name} />
              <div className="price-tag">{item.price}</div>
            </div>

            <div className="card-body-content">
              <div className="meta-row">
                <Badge theme="dark">{item.category}</Badge>
                <LiveCountdownBadge 
                  expiresAt={item.expiresAt} 
                  ngoPriorityUntil={item.ngoPriorityUntil}
                  defaultExpiry={item.expiry} 
                  badgeTheme={true}
                />
              </div>

              <FoodLifecycleTimeline 
                expiresAt={item.expiresAt}
                ngoPriorityUntil={item.ngoPriorityUntil}
                createdAt={item.createdAt}
                aiScore={item.aiScore || 100}
                compact={true}
              />

              <h3 className="food-title">{item.name}</h3>
              <p className="food-sub">{item.sub} • Storage: {item.temp}</p>
              <p className="food-qty">Quantity: <strong>{item.quantity}</strong></p>

              <div className="status-box">
                <Clock size={14} />
                <span>Status: {getItemLogisticsStatus(item, now).label}</span>
              </div>

              <div className="card-actions-row">
                <Button variant="orange" size="sm" icon={Radio} fullWidth onClick={() => onOpenDispatch(item)}>
                  Dispatch Options
                </Button>
                <button className="icon-action-btn" title="Edit Listing"><Edit2 size={16} /></button>
                <button className="icon-action-btn danger" title="Cancel Listing"><Trash2 size={16} /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
