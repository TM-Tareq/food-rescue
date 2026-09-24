import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('foodrescue_user');
      const savedToken = localStorage.getItem('foodrescue_jwt');

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } else {
        // Default Demo User fallback (Chef Bistro / Restaurant Manager)
        const demoUser = {
          id: 1,
          name: 'Star Chef Bistro',
          role: 'RESTAURANT',
          email: 'chef@starbistro.com',
          avatar: '👨‍🍳',
          verified: true
        };
        setUser(demoUser);
        setToken('demo-jwt-token-123456');
      }
    } catch (e) {
      console.warn('Failed to restore Auth Context from localStorage', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken || 'demo-jwt-token-123456');
    localStorage.setItem('foodrescue_user', JSON.stringify(userData));
    localStorage.setItem('foodrescue_jwt', jwtToken || 'demo-jwt-token-123456');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('foodrescue_user');
    localStorage.removeItem('foodrescue_jwt');
  };

  const switchRole = (roleName) => {
    const roleProfiles = {
      RESTAURANT: { id: 1, name: 'Star Chef Bistro', role: 'RESTAURANT', email: 'chef@starbistro.com', avatar: '👨‍🍳' },
      NGO: { id: 2, name: 'Anjuman Orphanage Shelter', role: 'NGO', email: 'director@anjuman.org', avatar: '🏠' },
      CONSUMER: { id: 3, name: 'Farhan Ahmed', role: 'CONSUMER', email: 'farhan@gmail.com', avatar: '👨‍💼' },
      VOLUNTEER: { id: 4, name: 'Tanvir Ahmed (Hero Rider)', role: 'VOLUNTEER', email: 'tanvir@rider.com', avatar: '🛵' },
      ADMIN: { id: 5, name: 'Tareq Rahman (Super Admin)', role: 'ADMIN', email: 'tareq@foodrescue.org', avatar: '👨‍💻' }
    };

    const newProfile = roleProfiles[roleName] || roleProfiles.RESTAURANT;
    login(newProfile, `jwt-token-${roleName.toLowerCase()}-99`);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, switchRole }}>
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
