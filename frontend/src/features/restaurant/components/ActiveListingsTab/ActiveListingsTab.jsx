import React, { useState } from 'react';
import { Search, Filter, Plus, Clock, Edit2, Trash2, Radio } from 'lucide-react';
import Card from '../../../../components/Card/Card';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import './ActiveListingsTab.css';

export default function ActiveListingsTab({ onOpenDispatch }) {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const listings = [
    {
      id: 1,
      name: 'Spicy Chicken Biryani & Kebabs',
      sub: 'Cooked 1h ago',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
      quantity: '20 Portions (8.5 kg)',
      category: 'Cooked Food',
      temp: 'Hot (60°C+)',
      expiry: 'Expires in 35m',
      expiryType: 'urgent',
      price: 'Free Donation',
      status: 'Volunteer En Route (Tanvir)',
      statusType: 'success'
    },
    {
      id: 2,
      name: 'Assorted Pastries & Croissant Package',
      sub: 'Morning Fresh Bake',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
      quantity: '15 Packs',
      category: 'Bakery',
      temp: 'Room Temp',
      expiry: 'Expires in 2h 10m',
      expiryType: 'warning',
      price: '50% Off (৳ 120/pack)',
      status: 'Matching NGO / Customer...',
      statusType: 'pending'
    }
  ];

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
          <Search size={16} className="search-icon" />
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
                {item.expiryType === 'urgent' ? (
                  <Badge theme="flash">🔥 {item.expiry}</Badge>
                ) : (
                  <Badge theme="fresh">⏳ {item.expiry}</Badge>
                )}
              </div>

              <h3 className="food-title">{item.name}</h3>
              <p className="food-sub">{item.sub} • Storage: {item.temp}</p>
              <p className="food-qty">Quantity: <strong>{item.quantity}</strong></p>

              <div className="status-box">
                <Clock size={14} />
                <span>Status: {item.status}</span>
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
