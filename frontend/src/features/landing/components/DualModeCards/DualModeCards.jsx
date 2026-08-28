import React from 'react';
import { ShoppingBag, HeartHandshake, ArrowRight } from 'lucide-react';
import Card from '../../../../components/Card/Card';
import Button from '../../../../components/Button/Button';
import './DualModeCards.css';

export default function DualModeCards({ onOpenAuth }) {
  return (
    <section className="dual-mode-section" id="deals">
      <div className="dual-mode-container">
        {/* Card 1: Consumer Surplus Purchase */}
        <Card topBorder="orange" className="mode-card">
          <div className="card-badge-header orange-bg">
            <ShoppingBag size={24} className="icon-orange" />
          </div>

          <h3 className="card-title">Buy Surplus Meals</h3>
          <p className="card-description">
            For local consumers to pick up discounted high-quality meals before expiry. Save money while helping restaurants eliminate food waste.
          </p>

          <Button
            variant="orange"
            size="lg"
            icon={ArrowRight}
            onClick={() => alert('Navigating to Discount Deals Feed...')}
          >
            Browse Local Deals
          </Button>
        </Card>

        {/* Card 2: Free NGO Claims */}
        <Card topBorder="green" className="mode-card" id="ngo-feed">
          <div className="card-badge-header green-bg">
            <HeartHandshake size={24} className="icon-green" />
          </div>

          <h3 className="card-title">Free NGO Claims</h3>
          <p className="card-description">
            For verified NGOs to claim free food donations. Feed orphanages, shelters, and vulnerable communities with verified logistics support.
          </p>

          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            onClick={() => onOpenAuth('ngo')}
          >
            Register NGO to Claim
          </Button>
        </Card>
      </div>
    </section>
  );
}
