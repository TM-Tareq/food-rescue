import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Clock, Edit2, Trash2, Radio } from 'lucide-react';
import Card from '../../../../components/Card/Card';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import { surplusService, getItemLogisticsStatus } from '../../../../services/surplusService';
import LiveCountdownBadge from '../../../../components/LiveCountdownBadge/LiveCountdownBadge';
import FoodLifecycleTimeline from '../../../../components/FoodLifecycleTimeline/FoodLifecycleTimeline';
import EditListingModal from '../EditListingModal/EditListingModal';
import './ActiveListingsTab.css';

export default function ActiveListingsTab({ onOpenDispatch, listings: propListings }) {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [listings, setListings] = useState(propListings || surplusService.getStoredListings());
  const [now, setNow] = useState(Date.now());
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleEditClick = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (id, updatedFields) => {
    await surplusService.updateSurplusListing(id, updatedFields);
    setListings(surplusService.getStoredListings());
  };

  const handleDeleteClick = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"? This will remove it from all portals.`)) {
      await surplusService.deleteSurplusListing(item.id);
      setListings(surplusService.getStoredListings());
    }
  };

  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    const statusObj = getItemLogisticsStatus(item, now);
    if (filter === 'URGENT') return item.expiryType === 'urgent' || (item.ngoPriorityUntil && (item.ngoPriorityUntil - now) <= 30 * 60 * 1000);
    if (filter === 'DONATION') return statusObj.isNgoWindow;
    if (filter === 'FLASH') return statusObj.isFlashSale;
    return true;
  });

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
            All Posts ({listings.length})
          </button>
          <button className={`filter-tab ${filter === 'URGENT' ? 'active' : ''}`} onClick={() => setFilter('URGENT')}>
            🔥 Urgent Expiry
          </button>
          <button className={`filter-tab ${filter === 'DONATION' ? 'active' : ''}`} onClick={() => setFilter('DONATION')}>
            🤝 NGO Free
          </button>
          <button className={`filter-tab ${filter === 'FLASH' ? 'active' : ''}`} onClick={() => setFilter('FLASH')}>
            ⚡ Flash Sale
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
        {filteredListings.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '12px', color: 'var(--text-muted)' }}>
            No surplus listings match your selected filter.
          </div>
        ) : (
          filteredListings.map((item) => (
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
                  <button className="icon-action-btn" title="Edit Listing" onClick={() => handleEditClick(item)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="icon-action-btn danger" title="Delete Listing" onClick={() => handleDeleteClick(item)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Edit Listing Modal */}
      <EditListingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={editingItem}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
