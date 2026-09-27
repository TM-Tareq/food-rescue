import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Loader2, ShieldCheck } from 'lucide-react';
import './PortalTransitionOverlay.css';

export default function PortalTransitionOverlay({ isVisible, user, role = 'restaurant', mode = 'login', onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const roleNameMap = {
    restaurant: 'Restaurant Partner Portal',
    ngo: 'NGO Shelter Portal',
    volunteer: 'Hero Rider GPS App',
    consumer: 'Consumer Surplus Marketplace',
    admin: 'Super Admin Control Tower'
  };

  const roleAvatarMap = {
    restaurant: '👨‍🍳',
    ngo: '🏠',
    volunteer: '🛵',
    consumer: '🛍️',
    admin: '🛡️'
  };

  const roleThemeColorMap = {
    restaurant: '#f97316',
    ngo: '#059669',
    volunteer: '#06b6d4',
    consumer: '#f59e0b',
    admin: '#3b82f6'
  };

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setIsExiting(false);
      return;
    }

    setProgress(0);
    setIsExiting(false);

    // Smooth Pacing Steps over ~2.0 Seconds (Total duration ~2.4s)
    const timers = [];

    // Step 1: 0% -> 28%
    timers.push(setTimeout(() => setProgress(28), 250));
    
    // Step 2: 28% -> 58%
    timers.push(setTimeout(() => setProgress(58), 750));

    // Step 3: 58% -> 88%
    timers.push(setTimeout(() => setProgress(88), 1350));

    // Step 4: 88% -> 100%
    timers.push(setTimeout(() => setProgress(100), 1900));

    return () => timers.forEach(t => clearTimeout(t));
  }, [isVisible]);

  useEffect(() => {
    if (progress === 100 && isVisible) {
      // Pause at 100% so user enjoys the success feedback
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        const completeTimer = setTimeout(() => {
          if (onComplete) onComplete();
        }, 500); // Smooth CSS fade-out transition duration
        return () => clearTimeout(completeTimer);
      }, 500);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, isVisible, onComplete]);

  if (!isVisible && !isExiting) return null;

  const userDisplayName = user?.name || user?.email?.split('@')[0] || 'Partner';
  const displayRoleTitle = roleNameMap[role.toLowerCase()] || 'Partner Portal';
  const roleAvatar = user?.avatar || roleAvatarMap[role.toLowerCase()] || '✨';
  const roleColor = roleThemeColorMap[role.toLowerCase()] || '#059669';

  // Dynamic status text based on animation progress
  let statusText = mode === 'register' 
    ? 'Saving partner account into MySQL Database...' 
    : 'Validating email & credentials with MySQL...';

  if (progress >= 28 && progress < 58) {
    statusText = 'Verifying security session & issuing JWT authorization...';
  } else if (progress >= 58 && progress < 88) {
    statusText = `Synchronizing ${displayRoleTitle} environment...`;
  } else if (progress >= 88) {
    statusText = '✅ Access Granted! Launching your portal...';
  }

  return (
    <div className={`portal-transition-backdrop ${isVisible ? 'active' : ''} ${isExiting ? 'exiting' : ''}`}>
      {/* Background Ambient Radial Glow */}
      <div className={`portal-ambient-glow glow-${role.toLowerCase()}`} />

      {/* Floating Sparkle Particles */}
      <div className="portal-particles">
        <div className="portal-particle" style={{ left: '15%', animationDelay: '0s' }} />
        <div className="portal-particle" style={{ left: '35%', animationDelay: '0.6s' }} />
        <div className="portal-particle" style={{ left: '60%', animationDelay: '1.2s' }} />
        <div className="portal-particle" style={{ left: '80%', animationDelay: '1.8s' }} />
      </div>

      {/* Glass Card Container */}
      <div className="portal-card">
        {/* Animated Avatar Icon */}
        <div className="portal-icon-wrapper">
          <div className="portal-ring-outer" />
          <div 
            className="portal-ring-glow"
            style={{
              background: `conic-gradient(from 0deg, transparent 0%, ${roleColor} 50%, #10b981 100%)`
            }} 
          />
          <div className="portal-avatar-badge">{roleAvatar}</div>
          <div 
            className="portal-check-badge"
            style={{ background: progress === 100 ? '#10b981' : roleColor }}
          >
            {progress === 100 ? (
              <Check size={16} strokeWidth={3} />
            ) : (
              <ShieldCheck size={16} />
            )}
          </div>
        </div>

        {/* Status Tag Pill */}
        <div 
          className="portal-status-tag"
          style={{
            background: `${roleColor}18`,
            borderColor: `${roleColor}40`,
            color: roleColor
          }}
        >
          <Sparkles size={13} />
          <span>{mode === 'register' ? 'MySQL Registration Verified' : 'Authentication Success'}</span>
        </div>

        {/* Welcome Message */}
        <h2 className="portal-welcome-title">Welcome back, {userDisplayName}!</h2>
        <p className="portal-role-desc">
          Entering <strong>{displayRoleTitle}</strong>
        </p>

        {/* Progress Bar & Status Text */}
        <div className="portal-progress-section">
          <div className="portal-progress-header">
            <span>MySQL Gateway Connection</span>
            <span style={{ color: roleColor, fontWeight: 700 }}>{progress}%</span>
          </div>

          <div className="portal-progress-bar-bg">
            <div 
              className="portal-progress-bar-fill"
              style={{ 
                width: `${progress}%`,
                background: `linear-gradient(90deg, #059669 0%, ${roleColor} 100%)`,
                boxShadow: `0 0 14px ${roleColor}80`
              }}
            />
          </div>

          <div className="portal-status-text">
            {progress < 100 ? (
              <Loader2 size={13} className="spin-icon" style={{ animation: 'spinRing 1s linear infinite', color: roleColor }} />
            ) : (
              <Check size={13} style={{ color: '#10b981' }} />
            )}
            <span>{statusText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
