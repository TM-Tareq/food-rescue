import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import './BackendStatusBadge.css';

export default function BackendStatusBadge() {
  const [isBackendLive, setIsBackendLive] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState('');

  useEffect(() => {
    async function checkHealth() {
      const status = await authService.checkBackendHealth();
      setIsBackendLive(status.online);
      setLastCheckTime(new Date().toLocaleTimeString());
    }

    checkHealth();
    const interval = setInterval(checkHealth, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`backend-status-badge ${isBackendLive ? 'status-online' : 'status-demo'}`}
      title={`Last API check at ${lastCheckTime}. Target: http://localhost:8080/api/v1`}
    >
      <span className="status-dot-pulse"></span>
      <span className="status-text">
        {isBackendLive ? '🟢 Spring Boot API Live (8080)' : '⚡ Standalone Fallback Engine'}
      </span>
    </div>
  );
}
