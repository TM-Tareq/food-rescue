import React from 'react';
import { Store, Building2, Bike, ArrowRight } from 'lucide-react';
import Card from '../../../../components/Card/Card';
import Button from '../../../../components/Button/Button';
import './EcosystemPartners.css';

export default function EcosystemPartners({ onOpenAuth }) {
  const partners = [
    {
      id: 'restaurant',
      icon: Store,
      title: 'Restaurants',
      description: 'Reduce food waste & earn revenue on unsold items before disposal deadlines.',
      cta: 'Partner Sign Up',
      topBorder: 'orange',
      wrapperClass: 'wrapper-orange'
    },
    {
      id: 'ngo',
      icon: Building2,
      title: 'NGOs',
      description: 'Receive verified free meals for orphanages, shelters, and relief distribution centers.',
      cta: 'Claim Meals',
      topBorder: 'green',
      wrapperClass: 'wrapper-green'
    },
    {
      id: 'volunteer',
      icon: Bike,
      title: 'Volunteers',
      description: 'Deliver meals, earn recognition badges, and directly impact lives in your community.',
      cta: 'Become Rider',
      topBorder: 'dark',
      wrapperClass: 'wrapper-dark'
    }
  ];

  return (
    <section className="ecosystem-section" id="how-it-works">
      <div className="ecosystem-container">
        <div className="section-header">
          <h2 className="section-title">Join the Food Rescue Ecosystem</h2>
          <p className="section-subtitle">
            Multiple ways to participate, reduce waste, profit, and provide community impact.
          </p>
        </div>

        <div className="partner-cards-grid">
          {partners.map((partner) => {
            const Icon = partner.icon;
            return (
              <Card key={partner.id} topBorder={partner.topBorder} className="partner-card">
                <div className={`partner-icon-wrapper ${partner.wrapperClass}`}>
                  <Icon size={22} />
                </div>
                <h3 className="partner-title">{partner.title}</h3>
                <p className="partner-desc">{partner.description}</p>
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  icon={ArrowRight}
                  onClick={() => onOpenAuth(partner.id)}
                >
                  {partner.cta}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
