import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Clock, MapPin, Tag, ShoppingBag, 
  Sparkles, Flame, ShieldCheck, Heart, AlertCircle, ChevronRight
} from 'lucide-react';
import Button from '../../../components/Button/Button';
import Badge from '../../../components/Badge/Badge';
import { surplusService } from '../../../services/surplusService';

export default function DealExplorerTab({ 
  onAddToCart, 
  cartItems, 
  onOpenCart 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [now, setNow] = useState(Date.now());
  const [storedListings, setStoredListings] = useState(surplusService.getStoredListings());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    const updateHandler = () => setStoredListings(surplusService.getStoredListings());
    window.addEventListener('foodrescue_surplus_updated', updateHandler);
    return () => {
      clearInterval(interval);
      window.removeEventListener('foodrescue_surplus_updated', updateHandler);
    };
  }, []);

  // Helper for parsing any timestamp format (ms number, ISO string, or Date)
  const parseTimestamp = (val) => {
    if (!val) return null;
    if (typeof val === 'number') return val;
    const parsed = new Date(val).getTime();
    return isNaN(parsed) ? null : parsed;
  };

  const formatRemainingTime = (totalMins) => {
    if (totalMins <= 0) return 'Expired';
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  // Live consumer deals mapped dynamically from restaurant surplus food listings
  const dynamicConsumerDeals = storedListings
    .filter(item => {
      const consumerStartMs = parseTimestamp(item.consumerStartAt) || parseTimestamp(item.ngoEndAt) || parseTimestamp(item.ngoPriorityUntil);
      const expiresAtMs = parseTimestamp(item.expiresAt) || parseTimestamp(item.consumerEndAt) || parseTimestamp(item.finalExpiryTimestamp);

      // Consumer market starts ONLY AFTER NGO priority window has ended (now >= consumerStartMs)
      const hasConsumerStarted = consumerStartMs ? now >= consumerStartMs : true;
      // Item MUST NOT be fully expired (now < expiresAtMs)
      const isNotExpired = !expiresAtMs || now < expiresAtMs;
      // Item MUST NOT be claimed by an NGO
      const isNotClaimed = !item.claimedByNgo;

      return hasConsumerStarted && isNotExpired && isNotClaimed;
    })
    .map(item => {
      const ngoEndMs = parseTimestamp(item.ngoEndAt) || parseTimestamp(item.ngoPriorityUntil) || parseTimestamp(item.createdAt);
      const expiresAtMs = parseTimestamp(item.expiresAt) || parseTimestamp(item.consumerEndAt) || parseTimestamp(item.finalExpiryTimestamp) || (now + 3 * 3600 * 1000);
      
      const isShiftedToB2C = ngoEndMs ? now >= ngoEndMs : false;
      const origPrice = item.initialPriceBDT !== undefined ? Number(item.initialPriceBDT) : 500;
      const discPercent = isShiftedToB2C ? 60 : 50;
      const discPrice = Math.round(origPrice * (1 - discPercent / 100));

      const diffMs = expiresAtMs - now;
      const minsLeft = Math.max(0, Math.ceil(diffMs / 60000));

      // Accurate Portion Count from Item
      let portionCountStr = '15 Portions';
      if (typeof item.quantityPortions === 'number' && item.quantityPortions > 0) {
        portionCountStr = `${item.quantityPortions} Portions`;
      } else if (typeof item.quantity === 'string' && item.quantity.trim()) {
        portionCountStr = item.quantity;
      } else if (typeof item.quantity === 'number') {
        portionCountStr = `${item.quantity} Portions`;
      }

      const portionNum = parseInt(portionCountStr, 10) || 15;

      return {
        id: `DEAL-${item.id}`,
        restaurantName: item.donor || item.restaurantName || 'Star Chef Bistro - Banani',
        rating: 4.9,
        reviewsCount: 180,
        cuisine: item.category === 'COOKED' ? 'Bengali / Biryani' : item.category === 'BAKERY' ? 'Bakery & Desserts' : 'Surplus Meals',
        itemTitle: item.name || item.foodItemTitle || 'Surplus Meal Package',
        description: item.sub || 'Fresh surplus meal from restaurant kitchen.',
        originalPrice: origPrice,
        discountedPrice: discPrice,
        discountPercent: discPercent,
        portionCount: portionNum,
        portionText: portionCountStr,
        expiryTimeMinutes: minsLeft,
        expiryFormatted: formatRemainingTime(minsLeft),
        distanceKm: 1.2,
        area: item.area || item.restaurantArea || 'Banani Road 11',
        tags: isShiftedToB2C 
          ? ['⚡ Shifted to B2C Flash Sale', '60% OFF', 'Fresh'] 
          : ['🤝 Tier-1 NGO Window', '50% OFF Preview', 'Fresh'],
        imageUrl: (item.image && !item.image.includes('.svg')) ? item.image : (item.packagingPhotoUrl && !item.packagingPhotoUrl.includes('.svg')) ? item.packagingPhotoUrl : 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
        dietary: item.category === 'BAKERY' ? 'Veg' : 'Non-Veg'
      };
    });

  const filteredDeals = dynamicConsumerDeals.filter(deal => {
    const matchesSearch = deal.itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          deal.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          deal.cuisine.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeCategory === 'all' || 
                            (activeCategory === 'kacchi' && deal.cuisine.toLowerCase().includes('biryani')) ||
                            (activeCategory === 'fastfood' && deal.cuisine.toLowerCase().includes('fast food')) ||
                            (activeCategory === 'bakery' && deal.cuisine.toLowerCase().includes('bakery')) ||
                            (activeCategory === 'veg' && deal.dietary === 'Veg');

    const matchesUrgency = filterUrgency === 'all' || 
                           (filterUrgency === 'urgent' && deal.expiryTimeMinutes <= 25) ||
                           (filterUrgency === 'near' && deal.distanceKm <= 1.5);

    return matchesSearch && matchesCategory && matchesUrgency;
  });

  return (
    <div className="deal-explorer-container">
      {/* Banner / Hero Announcement */}
      <div className="marketplace-hero-banner">
        <div className="hero-text-side">
          <span className="hero-badge-tag">
            <Sparkles size={14} /> 50% - 70% OFF SURPLUS DEALS
          </span>
          <h2 className="hero-title">Save Gourmet Food. <span className="text-highlight">Save Money.</span></h2>
          <p className="hero-subtext">
            Fresh, unsold surplus meals from top Dhaka restaurants at fraction of original price.
          </p>
        </div>
        <div className="hero-stat-pill">
          <Flame size={20} className="flame-icon" />
          <div>
            <strong>124 Deals Active</strong>
            <span>Updated 2 mins ago</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="search-filter-section">
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search Kacchi, Burgers, Pastries, Restaurants..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>

        {/* Category Chips */}
        <div className="category-chips-row">
          <button 
            className={`cat-chip ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            🔥 All Deals
          </button>
          <button 
            className={`cat-chip ${activeCategory === 'kacchi' ? 'active' : ''}`}
            onClick={() => setActiveCategory('kacchi')}
          >
            🍲 Kacchi & Biryani
          </button>
          <button 
            className={`cat-chip ${activeCategory === 'fastfood' ? 'active' : ''}`}
            onClick={() => setActiveCategory('fastfood')}
          >
            🍔 Burgers & Snacks
          </button>
          <button 
            className={`cat-chip ${activeCategory === 'bakery' ? 'active' : ''}`}
            onClick={() => setActiveCategory('bakery')}
          >
            🍰 Bakery & Cakes
          </button>
          <button 
            className={`cat-chip ${activeCategory === 'veg' ? 'active' : ''}`}
            onClick={() => setActiveCategory('veg')}
          >
            🥗 Vegetarian
          </button>
        </div>

        {/* Quick Filter Bar */}
        <div className="quick-filter-bar">
          <span className="filter-lbl"><Filter size={14} /> Sort & Filter:</span>
          <button 
            className={`filter-btn ${filterUrgency === 'all' ? 'f-active' : ''}`}
            onClick={() => setFilterUrgency('all')}
          >
            All Items
          </button>
          <button 
            className={`filter-btn ${filterUrgency === 'urgent' ? 'f-active' : ''}`}
            onClick={() => setFilterUrgency('urgent')}
          >
            ⏳ Expiry &lt; 25m
          </button>
          <button 
            className={`filter-btn ${filterUrgency === 'near' ? 'f-active' : ''}`}
            onClick={() => setFilterUrgency('near')}
          >
            📍 Near Me (&lt;1.5km)
          </button>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="deals-grid-container">
        {filteredDeals.length === 0 ? (
          <div className="empty-deals-state">
            <AlertCircle size={40} className="empty-icon" />
            <h4>No deals match your search criteria</h4>
            <p>Try resetting filters or searching for different food items.</p>
            <Button variant="outline" onClick={() => { setSearchTerm(''); setActiveCategory('all'); setFilterUrgency('all'); }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredDeals.map((deal) => {
            const isAlreadyInCart = cartItems.some(item => item.id === deal.id);

            return (
              <div key={deal.id} className="deal-card-item">
                {/* Image & Discount Badge */}
                <div className="card-image-box">
                  <img src={deal.imageUrl} alt={deal.itemTitle} className="deal-img" />
                  <div className="discount-tag-badge">
                    {deal.discountPercent}% OFF
                  </div>
                  <div className="expiry-floating-pill">
                    <Clock size={12} /> {deal.expiryFormatted} Left
                  </div>
                </div>

                {/* Card Content */}
                <div className="card-content-body">
                  <div className="restaurant-meta-row">
                    <span className="resto-name">{deal.restaurantName}</span>
                    <span className="rating-tag">⭐ {deal.rating}</span>
                  </div>

                  <h3 className="deal-title">{deal.itemTitle}</h3>
                  <p className="deal-desc">{deal.description}</p>

                  <div className="tags-row">
                    {deal.tags.map((t, idx) => (
                      <span key={idx} className="mini-tag-chip">{t}</span>
                    ))}
                    <span className="dist-chip"><MapPin size={11} /> {deal.distanceKm} km ({deal.area})</span>
                  </div>

                  {/* Pricing & Stock Row */}
                  <div className="pricing-stock-row">
                    <div className="price-block">
                      <span className="original-strikethrough">৳{deal.originalPrice} BDT</span>
                      <div className="final-price">
                        ৳{deal.discountedPrice} <span className="bdt-symbol">BDT</span>
                      </div>
                    </div>

                    <div className="stock-counter">
                      <span className="stock-num">{deal.portionText}</span>
                      <span className="stock-lbl">Reserve before sold</span>
                    </div>
                  </div>

                  {/* Add to Cart CTA */}
                  <button 
                    className={`btn-reserve-deal ${isAlreadyInCart ? 'btn-in-cart' : ''}`}
                    onClick={() => onAddToCart(deal)}
                  >
                    {isAlreadyInCart ? (
                      <>✔ Reserved in Cart</>
                    ) : (
                      <>🛒 Reserve for ৳{deal.discountedPrice} BDT</>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
