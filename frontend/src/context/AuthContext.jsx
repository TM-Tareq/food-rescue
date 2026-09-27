import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7 Days in Milliseconds

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('foodrescue_user');
      const savedToken = localStorage.getItem('foodrescue_jwt');
      const savedExpiry = localStorage.getItem('foodrescue_session_expiry');

      if (savedExpiry && Date.now() > Number(savedExpiry)) {
        // 1-Week Session Expired -> Auto Logout
        console.info('🔒 Session expired after 7 days of inactivity. User logged out.');
        logout();
      } else if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        setSessionExpiry(savedExpiry ? Number(savedExpiry) : Date.now() + SEVEN_DAYS_MS);
      } else {
        setUser(null);
        setToken(null);
        setSessionExpiry(null);
      }
    } catch (e) {
      console.warn('Failed to restore Auth Context from localStorage', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, jwtToken) => {
    const expiryTime = Date.now() + SEVEN_DAYS_MS;
    setUser(userData);
    setToken(jwtToken || 'demo-jwt-token-123456');
    setSessionExpiry(expiryTime);

    localStorage.setItem('foodrescue_user', JSON.stringify(userData));
    localStorage.setItem('foodrescue_jwt', jwtToken || 'demo-jwt-token-123456');
    localStorage.setItem('foodrescue_session_expiry', expiryTime.toString());
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setSessionExpiry(null);
    localStorage.removeItem('foodrescue_user');
    localStorage.removeItem('foodrescue_jwt');
    localStorage.removeItem('foodrescue_session_expiry');
  };

  const switchRole = (roleName) => {
    const roleProfiles = {
      RESTAURANT: { id: 1, name: 'Star Chef Bistro', role: 'RESTAURANT', email: 'chef@starbistro.com', avatar: '👨‍🍳' },
      NGO: { id: 2, name: 'Anjuman Orphanage Shelter', role: 'NGO', email: 'director@anjuman.org', avatar: '🏠' },
      CONSUMER: { id: 3, name: 'Farhan Ahmed', role: 'CONSUMER', email: 'farhan@gmail.com', avatar: '👨‍💼' },
      VOLUNTEER: { id: 4, name: 'Tanvir Ahmed (Hero Rider)', role: 'VOLUNTEER', email: 'tanvir@rider.com', avatar: '🛵' },
      ADMIN: { id: 5, name: 'Tareq Rahman (Super Admin)', role: 'ADMIN', email: 'tareq@foodrescue.org', avatar: '👨‍💻' }
    };

    const newProfile = roleProfiles[roleName.toUpperCase()] || roleProfiles.RESTAURANT;
    login(newProfile, `jwt-token-${roleName.toLowerCase()}-99`);
  };

  const getRemainingSessionDays = () => {
    if (!sessionExpiry) return 7;
    const diffMs = sessionExpiry - Date.now();
    if (diffMs <= 0) return 0;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      switchRole,
      sessionExpiry,
      getRemainingSessionDays
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
