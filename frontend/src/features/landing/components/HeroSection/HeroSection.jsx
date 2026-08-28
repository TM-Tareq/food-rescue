import React, { useState } from 'react';
import { Search, MapPin, Zap, Sparkles, HeartHandshake } from 'lucide-react';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import './HeroSection.css';

export default function HeroSection({ onOpenAuth }) {
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim()) {
      alert(`Searching surplus food deals near: "${location}"`);
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Column: Text & Search */}
        <div className="hero-content">
          <div className="hero-badges">
            <Badge icon={Zap} theme="flash">Flash Sales</Badge>
            <Badge icon={Sparkles} theme="fresh">100% Fresh</Badge>
            <Badge icon={HeartHandshake} theme="ngo">Free NGO Rescue</Badge>
          </div>

          <h1 className="hero-title">
            Save Delicious Surplus Food at <span className="highlight-orange">50-70% Off</span>
          </h1>

          <p className="hero-subtitle">
            Fresh surplus meals from top local restaurants. Buy at a fraction of the price or support free NGO distribution before items expire.
          </p>

          <form className="hero-search-box" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <MapPin className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Enter your neighborhood, area or zip..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" size="lg" icon={Search}>
              Find Meals Near Me
            </Button>
          </form>

          <div className="hero-trust-text">
            <span>⚡ Over 2,400+ meals saved this week in your area</span>
          </div>
        </div>

        {/* Right Column: Visual Feature Card */}
        <div className="hero-visual">
          <div className="image-card-wrapper">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
              alt="Fresh Restaurant Surplus Meals"
              className="hero-image"
            />
            
            {/* Overlay Banner Badge */}
            <div className="visual-overlay-card">
              <div className="overlay-icon">🛍️</div>
              <div className="overlay-info">
                <span className="overlay-title">Fresh Produce & Meal Package</span>
                <span className="overlay-sub">The Abundant Table • Just now</span>
              </div>
              <div className="discount-tag">-60%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
