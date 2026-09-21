import React, { useState } from 'react';
import { 
  Search, Filter, Clock, MapPin, Tag, ShoppingBag, 
  Sparkles, Flame, ShieldCheck, Heart, AlertCircle, ChevronRight
} from 'lucide-react';
import Button from '../../../components/Button/Button';
import Badge from '../../../components/Badge/Badge';

export default function DealExplorerTab({ 
  onAddToCart, 
  cartItems, 
  onOpenCart 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');

  // Sample Dhaka Surplus Food Deals
  const dealsData = [
    {
      id: 'DEAL-101',
      restaurantName: 'Kacchi Bhai - Banani',
      rating: 4.8,
      reviewsCount: 320,
      cuisine: 'Bengali / Biryani',
      itemTitle: 'Royal Mutton Kacchi & Borhani Combo',
      description: 'Hot thermal packed 2x Mutton Kacchi platters + 250ml Borhani. Freshly cooked today.',
      originalPrice: 580,
      discountedPrice: 220,
      discountPercent: 62,
      portionCount: 6,
      expiryTimeMinutes: 35,
      distanceKm: 0.8,
      area: 'Banani Road 11',
      tags: ['Halal', 'Hot Packed', 'Top Rated'],
      imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80',
      dietary: 'Non-Veg'
    },
    {
      id: 'DEAL-102',
      restaurantName: 'Chillox Burgers - Gulshan 2',
      rating: 4.7,
      reviewsCount: 450,
      cuisine: 'Fast Food / American',
      itemTitle: 'Smoky Beef Cheese Burger + Fries Box',
      description: 'Double beef patty burgers with loaded fries. Perfectly fresh surplus from evening rush.',
      originalPrice: 420,
      discountedPrice: 160,
      discountPercent: 62,
      portionCount: 4,
      expiryTimeMinutes: 20,
      distanceKm: 1.2,
      area: 'Gulshan 2 Circle',
      tags: ['Halal', 'Chef Special', 'Urgent'],
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      dietary: 'Non-Veg'
    },
    {
      id: 'DEAL-103',
      restaurantName: 'Secret Recipe Bakery - Dhanmondi',
      rating: 4.9,
      reviewsCount: 510,
      cuisine: 'Bakery & Desserts',
      itemTitle: 'Premium Chocolate Fudge Cake Slice & Pastry',
      description: '2x Decadent chocolate cake slices + 1x Croissant. Made fresh this morning.',
      originalPrice: 490,
      discountedPrice: 170,
      discountPercent: 65,
      portionCount: 8,
      expiryTimeMinutes: 90,
      distanceKm: 2.4,
      area: 'Dhanmondi 27',
      tags: ['Sweet Treat', 'Vegetarian'],
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
      dietary: 'Veg'
    },
    {
      id: 'DEAL-104',
      restaurantName: 'Sultan’s Dine - Bashundhara',
      rating: 4.8,
      reviewsCount: 620,
      cuisine: 'Traditional Feast',
      itemTitle: 'Special Beef Tehari & Jarda Box',
      description: 'Fragrant mustard-oil beef tehari with sweet jarda. Hygienically packed.',
      originalPrice: 380,
      discountedPrice: 150,
      discountPercent: 60,
      portionCount: 5,
      expiryTimeMinutes: 45,
      distanceKm: 1.8,
      area: 'Bashundhara Gate',
      tags: ['Halal', 'Bestseller'],
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      dietary: 'Non-Veg'
    },
    {
      id: 'DEAL-105',
      restaurantName: 'Takeout Burgers - Uttara',
      rating: 4.6,
      reviewsCount: 290,
      cuisine: 'Fast Food',
      itemTitle: 'Crispy Gourmet Chicken Strips & Dip',
      description: '6x Crispy fried chicken tenderloin strips + Garlic Mayo dip box.',
      originalPrice: 350,
      discountedPrice: 130,
      discountPercent: 63,
      portionCount: 3,
      expiryTimeMinutes: 15,
      distanceKm: 3.1,
      area: 'Uttara Sector 3',
      tags: ['Urgent', 'Halal'],
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
      dietary: 'Non-Veg'
    },
    {
      id: 'DEAL-106',
      restaurantName: 'Boulangerie Artisanal - Banani',
      rating: 4.9,
      reviewsCount: 180,
      cuisine: 'Organic Bakery',
      itemTitle: 'Artisanal Sourdough & Garlic Butter Loaf',
      description: '1x Whole sourdough bread + Garlic herb butter spread. Organic & healthy.',
      originalPrice: 400,
      discountedPrice: 140,
      discountPercent: 65,
      portionCount: 7,
      expiryTimeMinutes: 120,
      distanceKm: 0.9,
      area: 'Banani Block E',
      tags: ['Organic', 'Vegetarian'],
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      dietary: 'Veg'
    }
  ];

  // Filtering Logic
  const filteredDeals = dealsData.filter(deal => {
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
                    <Clock size={12} /> {deal.expiryTimeMinutes}m Left
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
                      <span className="stock-num">{deal.portionCount} Left</span>
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
