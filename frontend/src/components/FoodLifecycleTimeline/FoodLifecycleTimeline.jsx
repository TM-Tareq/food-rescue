import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, Zap, Building2, AlertTriangle, ArrowRight } from 'lucide-react';
import './FoodLifecycleTimeline.css';

export default function FoodLifecycleTimeline({ 
  expiresAt, 
  ngoPriorityUntil, 
  createdAt, 
  aiScore = 100, 
  compact = false 
}) {
  const [timelineState, setTimelineState] = useState({
    phase: 'NGO',
    ngoLeftText: '',
    b2cLeftText: '',
    totalLeftText: '',
    totalDurationText: '',
    ngoDurationText: '',
    b2cDurationText: '',
    ngoPercent: 25,
    b2cPercent: 75
  });

  useEffect(() => {
    const updateTimeline = () => {
      const now = Date.now();
      const totalTarget = expiresAt || (now + 3 * 3600 * 1000);
      const createTime = createdAt || (totalTarget - 3 * 3600 * 1000);
      const ngoTarget = ngoPriorityUntil || (createTime + 45 * 60 * 1000);

      const totalMs = Math.max(0, totalTarget - createTime);
      const ngoMs = Math.max(0, ngoTarget - createTime);
      const b2cMs = Math.max(0, totalTarget - ngoTarget);

      const totalLeftMs = Math.max(0, totalTarget - now);
      const ngoLeftMs = Math.max(0, ngoTarget - now);
      const b2cLeftMs = Math.max(0, totalTarget - Math.max(now, ngoTarget));

      const formatMs = (ms) => {
        const secs = Math.floor(ms / 1000);
        const hrs = Math.floor(secs / 3600);
        const mins = Math.floor((secs % 3600) / 60);
        const remSecs = secs % 60;
        const pad = (n) => String(n).padStart(2, '0');
        if (hrs > 0) return `${hrs}h ${pad(mins)}m ${pad(remSecs)}s`;
        return `${pad(mins)}m ${pad(remSecs)}s`;
      };

      const formatHoursMin = (ms) => {
        const mins = Math.round(ms / (60 * 1000));
        const hrs = Math.floor(mins / 60);
        const remMins = mins % 60;
        if (hrs > 0 && remMins > 0) return `${hrs}h ${remMins}m`;
        if (hrs > 0) return `${hrs}h`;
        return `${remMins}m`;
      };

      let currentPhase = 'NGO';
      if (now >= totalTarget) {
        currentPhase = 'EXPIRED';
      } else if (now >= ngoTarget) {
        currentPhase = 'B2C';
      }

      const ngoPct = totalMs > 0 ? Math.round((ngoMs / totalMs) * 100) : 25;

      setTimelineState({
        phase: currentPhase,
        ngoLeftText: formatMs(ngoLeftMs),
        b2cLeftText: currentPhase === 'NGO' ? `Starts in ${formatMs(ngoLeftMs)}` : formatMs(b2cLeftMs),
        totalLeftText: formatMs(totalLeftMs),
        totalDurationText: formatHoursMin(totalMs),
        ngoDurationText: formatHoursMin(ngoMs),
        b2cDurationText: formatHoursMin(b2cMs),
        ngoPercent: Math.min(90, Math.max(10, ngoPct)),
        b2cPercent: Math.min(90, Math.max(10, 100 - ngoPct))
      });
    };

    updateTimeline();
    const interval = setInterval(updateTimeline, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, ngoPriorityUntil, createdAt, aiScore]);

  if (compact) {
    return (
      <div className="compact-lifecycle-badge">
        <div className="compact-meta-row">
          <span className="meta-pill total-pill">
            ⌛ Total: {timelineState.totalDurationText} ({timelineState.totalLeftText} left)
          </span>
          {timelineState.phase === 'NGO' ? (
            <span className="meta-pill ngo-pill">
              🤝 NGO Priority: {timelineState.ngoLeftText} left
            </span>
          ) : timelineState.phase === 'B2C' ? (
            <span className="meta-pill b2c-pill">
              ⚡ B2C Flash Sale: {timelineState.b2cLeftText} left
            </span>
          ) : (
            <span className="meta-pill expired-pill">
              ⚠️ Expired
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="food-lifecycle-timeline-card">
      <div className="timeline-card-header">
        <div className="header-title-box">
          <Clock size={18} color="#059669" />
          <h4>Food Rescue Lifetime Breakdown & Phase Countdown</h4>
        </div>
        <div className="total-window-badge">
          ⌛ Total Safe Window: <strong>{timelineState.totalDurationText}</strong> ({timelineState.totalLeftText} left)
        </div>
      </div>

      {/* Visual Timeline Progress Bar */}
      <div className="timeline-track-wrap">
        <div 
          className={`track-segment ngo-segment ${timelineState.phase === 'NGO' ? 'segment-active' : ''}`}
          style={{ flex: timelineState.ngoPercent }}
        >
          <span className="segment-label">
            🤝 Phase 1: NGO Free ({timelineState.ngoDurationText})
          </span>
        </div>
        <div 
          className={`track-segment b2c-segment ${timelineState.phase === 'B2C' ? 'segment-active' : ''}`}
          style={{ flex: timelineState.b2cPercent }}
        >
          <span className="segment-label">
            ⚡ Phase 2: B2C Flash Sale ({timelineState.b2cDurationText})
          </span>
        </div>
      </div>

      {/* Dynamic Detailed Countdown Boxes */}
      <div className="phases-detail-grid">
        {/* Phase 1 Box */}
        <div className={`phase-detail-box ngo-box ${timelineState.phase === 'NGO' ? 'active-phase-box' : 'past-phase-box'}`}>
          <div className="phase-box-top">
            <span className="phase-pill ngo-theme">
              <Building2 size={13} /> 1. NGO Free Window
            </span>
            {timelineState.phase === 'NGO' && <span className="live-now-tag">🟢 ACTIVE NOW</span>}
          </div>
          <div className="phase-timer-val">
            {timelineState.phase === 'NGO' ? timelineState.ngoLeftText : 'Ended (Window Completed)'}
          </div>
          <div className="phase-box-sub">
            Allocated: {timelineState.ngoDurationText} ({aiScore}% AI Detect)
          </div>
        </div>

        {/* Phase 2 Box */}
        <div className={`phase-detail-box b2c-box ${timelineState.phase === 'B2C' ? 'active-phase-box' : ''}`}>
          <div className="phase-box-top">
            <span className="phase-pill b2c-theme">
              <Zap size={13} /> 2. B2C Flash Sale
            </span>
            {timelineState.phase === 'B2C' && <span className="live-now-tag yellow-tag">⚡ ACTIVE NOW</span>}
          </div>
          <div className="phase-timer-val">
            {timelineState.phase === 'NGO' 
              ? `Starts in ${timelineState.ngoLeftText}`
              : timelineState.phase === 'B2C' 
                ? timelineState.b2cLeftText 
                : 'Ended'}
          </div>
          <div className="phase-box-sub">
            Sale Duration: {timelineState.b2cDurationText} (50%-80% OFF)
          </div>
        </div>

        {/* Phase 3 Box */}
        <div className={`phase-detail-box lock-box ${timelineState.phase === 'EXPIRED' ? 'active-phase-box' : ''}`}>
          <div className="phase-box-top">
            <span className="phase-pill lock-theme">
              <ShieldAlert size={13} /> 3. Safety Lock
            </span>
            {timelineState.phase === 'EXPIRED' && <span className="live-now-tag red-tag">🔴 LOCKED</span>}
          </div>
          <div className="phase-timer-val">
            {timelineState.phase === 'EXPIRED' ? '00m 00s (LOCKED)' : `Locks in ${timelineState.totalLeftText}`}
          </div>
          <div className="phase-box-sub">
            Total Expiry: {timelineState.totalDurationText} Max
          </div>
        </div>
      </div>
    </div>
  );
}
