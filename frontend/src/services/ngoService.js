import apiClient from './apiClient';

const NGO_CLAIMS_VERSION = 'v11_real_claims_only';

export const ngoService = {
  getStoredClaims() {
    try {
      const storedVersion = localStorage.getItem('foodrescue_claims_version');
      if (storedVersion !== NGO_CLAIMS_VERSION) {
        localStorage.setItem('foodrescue_claims_version', NGO_CLAIMS_VERSION);
        localStorage.setItem('foodrescue_ngo_claims', JSON.stringify([]));
        return [];
      }
      const stored = localStorage.getItem('foodrescue_ngo_claims');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to read NGO claims:', e);
    }
    return [];
  },

  saveClaims(claims) {
    try {
      localStorage.setItem('foodrescue_claims_version', NGO_CLAIMS_VERSION);
      localStorage.setItem('foodrescue_ngo_claims', JSON.stringify(claims));
      window.dispatchEvent(new Event('foodrescue_claims_updated'));
    } catch (e) {
      console.error('Error saving NGO claims:', e);
    }
  },

  /**
   * Claim Tier-1 Free Surplus Food for Shelters
   * Endpoint: POST /api/v1/claims/claim-tier1
   */
  async claimTier1Food(claimData) {
    const isVolunteer = claimData.transportChoice === 'VOLUNTEER';
    const otpCode = claimData.deliveryOtp || claimData.pickupOtp || `${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newClaim = {
      id: claimData.id || `CLM-${Math.floor(8000 + Math.random() * 1000)}`,
      foodId: claimData.foodId,
      title: claimData.title || claimData.foodItemTitle || 'Surplus Meal Package',
      donor: claimData.donor || 'Star Chef Bistro (Banani)',
      claimedTime: claimData.claimedAt || (new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today'),
      beneficiaries: claimData.beneficiaries || 'Feeds ~25 People',
      transportMethod: isVolunteer ? '📡 Searching for Volunteer Rider' : '🚚 NGO Self Pickup Van',
      volunteerName: isVolunteer ? 'Awaiting Rider Acceptance...' : 'Shelter Driver Rafiq (NGO Van)',
      rating: '4.9 ⭐',
      deliveryOTP: otpCode,
      statusCategory: isVolunteer ? 'SEARCHING_RIDER' : 'READY_PICKUP',
      statusLabel: isVolunteer ? '📡 Searching Nearby Volunteer Rider...' : '🏪 Ready at Store',
      urgency: 'HIGH',
      eta: isVolunteer ? 'Broadcasting alert to nearby riders...' : '🚚 NGO Van On The Way for Pickup (ETA 15m)',
      createdAt: Date.now()
    };

    const existing = this.getStoredClaims();
    const updated = [newClaim, ...existing.filter(c => c.id !== newClaim.id)];
    this.saveClaims(updated);

    try {
      const response = await apiClient.post('/claims/claim-tier1', claimData);
      return response || newClaim;
    } catch (error) {
      return newClaim;
    }
  },

  updateClaimStatus(claimIdentifier, updates) {
    const claims = this.getStoredClaims();
    if (claims.length === 0) return;

    let found = false;
    const nextClaims = claims.map(c => {
      if (
        c.id === claimIdentifier || 
        c.title === claimIdentifier || 
        (c.title && claimIdentifier && c.title.toLowerCase().includes(claimIdentifier.toLowerCase()))
      ) {
        found = true;
        return { ...c, ...updates };
      }
      return c;
    });

    if (!found && nextClaims.length > 0) {
      // Update top active claim
      nextClaims[0] = { ...nextClaims[0], ...updates };
    }

    this.saveClaims(nextClaims);
  },

  /**
   * Get Active NGO Claims
   * Endpoint: GET /api/v1/claims/ngo/:ngoId
   */
  async getActiveClaims(ngoId = 'NGO-DHAKA-1') {
    try {
      const apiClaims = await apiClient.get(`/claims/ngo/${ngoId}`);
      if (Array.isArray(apiClaims) && apiClaims.length > 0) {
        return apiClaims;
      }
    } catch (error) {
      // Fallback to local stored claims
    }
    return this.getStoredClaims();
  }
};
