import React from 'react';
import HeroSection from './components/HeroSection/HeroSection';
import DualModeCards from './components/DualModeCards/DualModeCards';
import EcosystemPartners from './components/EcosystemPartners/EcosystemPartners';
import MissionImpact from './components/MissionImpact/MissionImpact';
import './LandingPage.css';

export default function LandingPage({ onOpenAuth }) {
  return (
    <main className="landing-page-container">
      {/* 1. Hero Section (Public & Consumer Focus) */}
      <HeroSection onOpenAuth={onOpenAuth} />

      {/* 2. Dual Mode Offer Cards (Orange Discount Sales vs Green Free NGO) */}
      <DualModeCards onOpenAuth={onOpenAuth} />

      {/* 3. Partner Onboarding Section (Restaurants, NGOs, Volunteers) */}
      <EcosystemPartners onOpenAuth={onOpenAuth} />

      {/* 4. Full-width Mission Statement & Impact Counter Section */}
      <MissionImpact />
    </main>
  );
}
