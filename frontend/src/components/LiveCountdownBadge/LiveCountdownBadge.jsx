import React, { useState, useEffect } from 'react';
import { Flame, Clock } from 'lucide-react';
import './LiveCountdownBadge.css';

export default function LiveCountdownBadge({ 
  expiresAt, 
  ngoPriorityUntil,
  defaultExpiry = '', 
  extraText = '', 
  className = '', 
  badgeTheme = null 
}) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isNgoPhase, setIsNgoPhase] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const parseTarget = (val) => {
      if (!val) return null;
      if (typeof val === 'number') return val;
      const parsed = new Date(val).getTime();
      return isNaN(parsed) ? null : parsed;
    };

    const updateTimer = () => {
      const now = Date.now();
      const totalTarget = parseTarget(expiresAt) || (now + 3 * 3600 * 1000);
      const ngoTarget = parseTarget(ngoPriorityUntil) || (totalTarget - 2 * 3600 * 1000);

      const inNgoWindow = now < ngoTarget;
      setIsNgoPhase(inNgoWindow);

      const activeTarget = inNgoWindow ? ngoTarget : totalTarget;
      const diffMs = activeTarget - now;

      if (now >= totalTarget) {
        setTimeLeft('00m 00s');
        setIsExpired(true);
        setIsUrgent(true);
        return;
      }

      const totalSecs = Math.max(0, Math.floor(diffMs / 1000));
      const hours = Math.floor(totalSecs / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;

      setIsUrgent(inNgoWindow || totalSecs < 45 * 60);

      const pad = (n) => String(n).padStart(2, '0');

      if (hours > 0) {
        setTimeLeft(`${hours}h ${pad(mins)}m ${pad(secs)}s`);
      } else {
        setTimeLeft(`${pad(mins)}m ${pad(secs)}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, ngoPriorityUntil, defaultExpiry]);

  let formattedLabel = '';
  if (isExpired) {
    formattedLabel = '⚠️ Expired (Safety Lock)';
  } else if (isNgoPhase) {
    formattedLabel = `🤝 NGO Priority: ${timeLeft} left (Free)`;
  } else {
    formattedLabel = `⚡ B2C Flash Sale: ${timeLeft} left`;
  }

  if (badgeTheme) {
    return (
      <span className={`live-timer-badge ${isExpired ? 'badge-expired-live' : (isNgoPhase ? 'live-badge-ngo' : 'live-badge-urgent')} ${className}`}>
        {isExpired ? '⚠️ ' : (isNgoPhase ? '🤝 ' : '⚡ ')}{formattedLabel}
      </span>
    );
  }

  return (
    <div className={`expiry-floating-badge ${isExpired ? 'expired-bg' : (isNgoPhase ? 'ngo-priority-bg' : 'urgent-bg')} ${className}`}>
      {isNgoPhase ? <Flame size={14} className="flame-live-anim" /> : <Clock size={14} />} 
      <span>{formattedLabel}</span>
    </div>
  );
}
