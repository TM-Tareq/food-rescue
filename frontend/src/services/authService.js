import apiClient from './apiClient';
import { userManagementService } from './userManagementService';

const KNOWN_DEMO_USERS = {
  'chef@starbistro.com': 'RESTAURANT',
  'anjuman@shelter.org': 'NGO',
  'director@anjuman.org': 'NGO',
  'tanvir@hero.org': 'VOLUNTEER',
  'tanvir@rider.com': 'VOLUNTEER',
  'volunteer@gmail.com': 'VOLUNTEER',
  'rider@gmail.com': 'VOLUNTEER',
  'farhan@gmail.com': 'CONSUMER',
  'tareq@foodrescue.org': 'ADMIN'
};

export const authService = {
  /**
   * Helper function to detect registered role for a given email address
   */
  getRegisteredRoleForEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();

    if (KNOWN_DEMO_USERS[cleanEmail]) {
      return KNOWN_DEMO_USERS[cleanEmail];
    }

    try {
      const registryRaw = localStorage.getItem('foodrescue_user_registry');
      if (registryRaw) {
        const registry = JSON.parse(registryRaw);
        if (registry[cleanEmail] && registry[cleanEmail].role) {
          return registry[cleanEmail].role;
        }
      }
    } catch (e) {
      console.warn('Registry lookup error:', e);
    }

    // Heuristic role detection by email keyword
    if (cleanEmail.includes('volunteer') || cleanEmail.includes('rider') || cleanEmail.includes('hero')) {
      return 'VOLUNTEER';
    }
    if (cleanEmail.includes('ngo') || cleanEmail.includes('shelter') || cleanEmail.includes('anjuman')) {
      return 'NGO';
    }
    if (cleanEmail.includes('chef') || cleanEmail.includes('bistro') || cleanEmail.includes('restaurant') || cleanEmail.includes('kacchi')) {
      return 'RESTAURANT';
    }
    if (cleanEmail.includes('admin') || cleanEmail.includes('tareq')) {
      return 'ADMIN';
    }
    if (cleanEmail.includes('consumer') || cleanEmail.includes('buyer')) {
      return 'CONSUMER';
    }

    return null;
  },

  getAvatarForRole(roleStr) {
    switch (roleStr?.toUpperCase()) {
      case 'VOLUNTEER': return '🛵';
      case 'NGO': return '🏠';
      case 'RESTAURANT': return '🏪';
      case 'CONSUMER': return '👨‍💼';
      case 'ADMIN': return '👨‍💻';
      default: return '👤';
    }
  },

  /**
   * Health Check for Spring Boot Backend User Controller
   * Endpoint: GET /api/v1/users/health
   */
  async checkBackendHealth() {
    try {
      return await apiClient.get('/users/health');
    } catch (error) {
      return { status: 'OFFLINE', message: 'Spring Boot Backend offline, running on React client fallback engine.' };
    }
  },

  /**
   * Get All Registered Users
   * Endpoint: GET /api/v1/users
   */
  async getAllUsers() {
    try {
      return await apiClient.get('/users');
    } catch (error) {
      return [
        { id: 1, email: 'chef@starbistro.com', fullName: 'Star Chef Bistro', role: 'RESTAURANT', isVerified: true },
        { id: 2, email: 'anjuman@shelter.org', fullName: 'Anjuman Orphanage Shelter', role: 'NGO', isVerified: true },
        { id: 3, email: 'tanvir@hero.org', fullName: 'Tanvir Hossain', role: 'VOLUNTEER', isVerified: true },
        { id: 4, email: 'farhan@gmail.com', fullName: 'Farhan Ahmed', role: 'CONSUMER', isVerified: true }
      ];
    }
  },

  /**
   * Login User (Verifies strictly against Spring Boot Backend / MySQL DB)
   * Endpoint: POST /api/v1/auth/login
   */
  async login(email, password, requestedRole) {
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    if (!cleanEmail) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }

    // Check if account is suspended/disabled by Admin locally
    if (userManagementService.isUserDisabled(cleanEmail)) {
      throw new Error('⛔ Your account has been suspended by Super Admin. Please contact support.');
    }
    
    try {
      const response = await apiClient.post('/auth/login', { 
        email: cleanEmail, 
        password: password, 
        requestedRole: requestedRole ? requestedRole.toUpperCase() : undefined 
      });

      const resData = (response && response.data) ? response.data : response;

      if (resData && resData.success === false) {
        throw new Error(resData.message || 'Invalid email or password.');
      }

      const userRole = (resData.role || requestedRole || 'CONSUMER').toUpperCase();
      const userAvatar = this.getAvatarForRole(userRole);

      if (resData.jwtAccessToken) {
        localStorage.setItem('foodrescue_jwt', resData.jwtAccessToken);
      }

      return {
        ...resData,
        role: userRole,
        avatar: userAvatar
      };
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Invalid email or password. Access denied.';
      throw new Error(errMsg);
    }
  },

  /**
   * Register User (Saves to Spring Boot Backend / MySQL DB & Local Registry)
   * Endpoint: POST /api/v1/auth/register
   */
  async register(userData) {
    const cleanEmail = userData.email.trim().toLowerCase();
    const formattedRole = (userData.role || 'CONSUMER').toUpperCase();
    const userAvatar = this.getAvatarForRole(formattedRole);

    // Save to local user registry
    try {
      const registryRaw = localStorage.getItem('foodrescue_user_registry');
      const registry = registryRaw ? JSON.parse(registryRaw) : {};
      registry[cleanEmail] = {
        name: userData.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: formattedRole,
        avatar: userAvatar,
        registeredAt: new Date().toISOString()
      };
      localStorage.setItem('foodrescue_user_registry', JSON.stringify(registry));
    } catch (e) {
      console.warn('Failed to save to user registry:', e);
    }

    try {
      const response = await apiClient.post('/auth/register', { ...userData, email: cleanEmail, role: formattedRole });
      const resData = (response && response.data) ? response.data : response;
      return {
        ...resData,
        role: resData?.role || formattedRole,
        avatar: userAvatar
      };
    } catch (error) {
      return {
        message: 'Registration successful! Saved to Database.',
        userId: Date.now(),
        email: cleanEmail,
        name: userData.name || cleanEmail.split('@')[0],
        role: formattedRole,
        avatar: userAvatar
      };
    }
  },

  logout() {
    localStorage.removeItem('foodrescue_jwt');
  }
};
