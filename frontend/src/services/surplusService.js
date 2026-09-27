import apiClient from './apiClient';

const CURRENT_STORAGE_VERSION = 'v3_dynamic_timers';

const getInitialListingsWithTimestamps = () => {
  const now = Date.now();
  return [
    {
      id: 1,
      name: 'Gourmet Beef Tehari & Salad Package',
      sub: 'AI Certified Grade A+ (62% Detect)',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=200&q=80',
      quantity: '25 Portions',
      temp: 'Hot (60°C+)',
      expiry: 'Expires in 2h 48m',
      createdAt: now - (12 * 60 * 1000), // Created 12m ago
      expiresAt: now + (3 * 3600 - 12 * 60) * 1000,
      aiScore: 62,
      ngoPriorityMinutes: 28, // Math.round(45 * 0.62)
      ngoPriorityUntil: now + (28 - 12) * 60 * 1000, // 16m left
      expiryType: 'urgent',
      price: 'Base: ৳ 450 | B2C: 50% Off (৳ 225)',
      status: '🤝 Tier-1 NGO Priority Window (28m)',
      statusType: 'pending',
      category: 'COOKED',
      donor: 'Star Chef Bistro',
      area: 'Banani, Dhaka'
    },
    {
      id: 2,
      name: 'Royal Mutton Kacchi Biryani & Borhani Combo',
      sub: 'AI Certified (Grade A+)',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80',
      quantity: '25 Portions',
      temp: 'Hot (60°C+)',
      expiry: 'Expires in 2h 55m',
      createdAt: now - (5 * 60 * 1000), // Created 5m ago
      expiresAt: now + (3 * 3600 - 5 * 60) * 1000,
      aiScore: 100,
      ngoPriorityMinutes: 45,
      ngoPriorityUntil: now + (45 - 5) * 60 * 1000, // 40m left
      expiryType: 'warning',
      price: 'Base: ৳ 550 | B2C: 60% Off (৳ 220)',
      status: 'Matching NGO...',
      statusType: 'pending',
      category: 'COOKED',
      donor: 'Star Chef Bistro',
      area: 'Banani, Dhaka'
    },
    {
      id: 3,
      name: 'Spicy Chicken Biryani',
      sub: 'Cooked 1h ago • AI Certified Grade A+',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=200&q=80',
      quantity: '20 Portions',
      temp: 'Hot (60°C+)',
      expiry: 'Expires in 1h 55m',
      createdAt: now - (35 * 60 * 1000), // Created 35m ago
      expiresAt: now + (2.5 * 3600 - 35 * 60) * 1000,
      aiScore: 100,
      ngoPriorityMinutes: 45,
      ngoPriorityUntil: now + (45 - 35) * 60 * 1000, // 10m left
      expiryType: 'urgent',
      price: 'Base: ৳ 380 | B2C: 50% Off (৳ 190)',
      status: '🚚 Volunteer En Route (Tanvir)',
      statusType: 'success',
      category: 'COOKED',
      donor: 'Star Chef Bistro',
      area: 'Banani, Dhaka'
    },
    {
      id: 4,
      name: 'Assorted Pastries Pkg',
      sub: 'Morning Bake • AI Certified Grade A+ (90% Detect)',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80',
      quantity: '15 Packs',
      temp: 'Room Temp',
      expiry: 'Expires in 5h 35m',
      createdAt: now - (25 * 60 * 1000), // Created 25m ago
      expiresAt: now + (6 * 3600 - 25 * 60) * 1000,
      aiScore: 90,
      ngoPriorityMinutes: 41, // Math.round(45 * 0.90)
      ngoPriorityUntil: now + (41 - 25) * 60 * 1000, // 16m left
      expiryType: 'warning',
      price: 'Base: ৳ 300 | B2C: 50% Off (৳ 150)',
      status: 'Matching NGO...',
      statusType: 'pending',
      category: 'BAKERY',
      donor: 'Star Chef Bistro',
      area: 'Banani, Dhaka'
    }
  ];
};

export const surplusService = {
  getStoredListings() {
    try {
      const storedVersion = localStorage.getItem('foodrescue_version');
      const stored = localStorage.getItem('foodrescue_surplus_listings');
      const now = Date.now();

      // Upgrade version check for storage synchronization
      if (storedVersion !== CURRENT_STORAGE_VERSION) {
        const initial = getInitialListingsWithTimestamps();
        localStorage.setItem('foodrescue_version', CURRENT_STORAGE_VERSION);
        localStorage.setItem('foodrescue_surplus_listings', JSON.stringify(initial));
        return initial;
      }

      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let updated = false;
          const sanitized = parsed.map((item, idx) => {
            let newItem = { ...item };
            if (!newItem.createdAt) {
              newItem.createdAt = now - ((idx + 1) * 10 * 60 * 1000);
              updated = true;
            }
            if (!newItem.expiresAt) {
              newItem.expiresAt = newItem.createdAt + (3 * 3600 * 1000);
              updated = true;
            }
            if (!newItem.ngoPriorityUntil) {
              const aiScore = newItem.aiScore || 100;
              const ngoMinutes = Math.max(1, Math.round(45 * (aiScore / 100)));
              newItem.ngoPriorityUntil = newItem.createdAt + (ngoMinutes * 60 * 1000);
              updated = true;
            }
            return newItem;
          });
          if (updated) {
            localStorage.setItem('foodrescue_surplus_listings', JSON.stringify(sanitized));
          }
          return sanitized;
        }
      }
      const initial = getInitialListingsWithTimestamps();
      localStorage.setItem('foodrescue_version', CURRENT_STORAGE_VERSION);
      localStorage.setItem('foodrescue_surplus_listings', JSON.stringify(initial));
      return initial;
    } catch (e) {
      return getInitialListingsWithTimestamps();
    }
  },

  /**
   * Create Surplus Listing (Connects to Spring Boot SurplusListingRepository)
   * Endpoint: POST /api/v1/surplus
   */
  async createSurplusListing(listingData) {
    const origPrice = listingData.initialPriceBDT || 500;
    const t2Disc = listingData.tier2DiscountPercent || 50;
    const t3Disc = listingData.tier3DiscountPercent || 80;
    const expHrs = listingData.expiryHours || 3;
    const aiScore = listingData.aiScore !== undefined ? listingData.aiScore : (listingData.skipAiAudit ? 60 : 100);

    // Dynamic NGO priority calculation: 100% AI detect = 45m max, otherwise %-wise reduced
    const ngoPriorityMinutes = Math.max(1, Math.round(45 * (aiScore / 100)));
    const now = Date.now();
    const ngoPriorityUntil = now + ngoPriorityMinutes * 60 * 1000;
    const expiresAt = now + expHrs * 3600 * 1000;

    const newListing = {
      id: Date.now(),
      createdAt: now,
      name: listingData.foodItemTitle || 'Royal Mutton Kacchi Biryani',
      sub: listingData.skipAiAudit ? '⚠️ Manual Unverified' : `AI Certified Grade A+ (${aiScore}% Detect)`,
      image: listingData.imageUrl || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80',
      quantity: `${listingData.quantityPortions || 25} Portions`,
      temp: 'Hot (60°C+)',
      expiry: `Expires in ${expHrs}h`,
      expiresAt: expiresAt,
      aiScore: aiScore,
      ngoPriorityMinutes: ngoPriorityMinutes,
      ngoPriorityUntil: ngoPriorityUntil,
      extraText: `(${t2Disc}%-${t3Disc}% Off)`,
      expiryType: expHrs <= 1 ? 'urgent' : 'warning',
      price: `Base: ৳ ${origPrice} | B2C: ${t2Disc}% Off (৳ ${Math.round(origPrice * (1 - t2Disc/100))})`,
      status: `🤝 Tier-1 NGO Priority Window (${ngoPriorityMinutes}m)`,
      statusType: 'pending',
      category: listingData.category || 'COOKED',
      donor: 'Star Chef Bistro',
      area: 'Banani, Dhaka'
    };


    try {
      const existing = this.getStoredListings();
      const filtered = existing.filter(item => item.id !== newListing.id);
      const updated = [newListing, ...filtered];
      localStorage.setItem('foodrescue_surplus_listings', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('foodrescue_surplus_updated', { detail: newListing }));
      
      // Async API sync if backend active
      apiClient.post('/surplus', listingData).catch(() => {});
      return newListing;
    } catch (error) {
      return newListing;
    }
  },

  /**
   * Claim stored surplus listing (NGO or Consumer)
   */
  claimStoredListing(listingId, claimData = {}) {
    try {
      const stored = this.getStoredListings();
      const targetIdStr = String(listingId).replace('FOOD-', '');
      const updated = stored.map(item => {
        if (String(item.id) === targetIdStr) {
          const isVolunteer = claimData.transportChoice === 'VOLUNTEER';
          return {
            ...item,
            status: isVolunteer ? '🚚 Volunteer En Route (Tanvir)' : '🤝 Claimed by Anjuman Shelter',
            statusType: isVolunteer ? 'success' : 'pending',
            claimedByNgo: true,
            claimedAt: new Date().toISOString()
          };
        }
        return item;
      });
      localStorage.setItem('foodrescue_surplus_listings', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('foodrescue_surplus_updated', { detail: { id: listingId } }));
      return updated;
    } catch (e) {
      console.warn('Failed to update claimed listing:', e);
    }
  },

  /**
   * Get Active Surplus Food Listings
   * Endpoint: GET /api/v1/surplus/active
   */
  async getActiveListings() {
    return this.getStoredListings();
  },

  /**
   * Get Consumer Marketplace Discounted Surplus Deals (Tier 2 & 3)
   * Endpoint: GET /api/v1/surplus/marketplace/deals
   */
  async getMarketplaceDeals() {
    try {
      return await apiClient.get('/surplus/marketplace/deals');
    } catch (error) {
      return [
        {
          id: 'DEAL-101',
          restaurantName: 'Kacchi Bhai - Banani',
          rating: 4.8,
          itemTitle: 'Royal Mutton Kacchi & Borhani Combo',
          originalPrice: 580,
          discountedPrice: 220,
          discountPercent: 62,
          portionCount: 6,
          expiryTimeMinutes: 35,
          distanceKm: 0.8,
          area: 'Banani Road 11'
        }
      ];
    }
  }
};

export const getItemLogisticsStatus = (item, now = Date.now()) => {
  if (!item) return { label: 'Pending', pillClass: 'status-pending' };

  if (item.statusType === 'success' || item.status?.includes('Tanvir') || item.status?.includes('En Route')) {
    return {
      label: item.status || '🚚 Volunteer En Route (Tanvir)',
      pillClass: 'status-success',
      isSuccess: true
    };
  }

  if (item.status?.includes('Claimed') || item.status?.includes('Shelter')) {
    return {
      label: item.status || '🤝 Claimed by NGO Shelter',
      pillClass: 'status-pending',
      isPending: true
    };
  }

  const isNgoPriorityActive = item.ngoPriorityUntil && now < item.ngoPriorityUntil;
  const isExpired = item.expiresAt && now >= item.expiresAt;

  if (isExpired) {
    return {
      label: '⚠️ Expired (Safety Lock)',
      pillClass: 'status-expired',
      isExpired: true
    };
  }

  if (isNgoPriorityActive) {
    return {
      label: `🤝 Tier-1 NGO Priority Window (${item.ngoPriorityMinutes || 45}m)`,
      pillClass: 'status-pending',
      isNgoWindow: true
    };
  }

  return {
    label: '⚡ Shifted to B2C Flash Sale (50%-80% OFF)',
    pillClass: 'status-flash',
    isFlashSale: true
  };
};

