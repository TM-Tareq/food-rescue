import apiClient from './apiClient';

const CURRENT_STORAGE_VERSION = 'v11_real_claims_only';

export const parseTimestamp = (val) => {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  const parsed = new Date(val).getTime();
  return isNaN(parsed) ? 0 : parsed;
};

const getHdPhotoForTitle = (title = '', defaultImg = '') => {
  if (defaultImg && !defaultImg.includes('.svg')) return defaultImg;
  const t = (title || '').toLowerCase();
  if (t.includes('kacchi') || t.includes('mutton')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80';
  }
  if (t.includes('tehari') || t.includes('beef')) {
    return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80';
  }
  if (t.includes('chicken') || t.includes('polao') || t.includes('biryani')) {
    return 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80';
  }
  if (t.includes('pastry') || t.includes('bakery') || t.includes('croissant')) {
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80';
  }
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
};

const getInitialListingsWithTimestamps = () => {
  const now = Date.now();
  
  // Item 1: Created 10m ago, NGO priority 45m (35m left) -> NGO Active ONLY
  const item1Created = now - (10 * 60 * 1000);
  const item1NgoEnd = item1Created + (45 * 60 * 1000);
  const item1ExpiresAt = item1Created + (3 * 3600 * 1000);

  // Item 2: Created 5m ago, NGO priority 45m (40m left) -> NGO Active ONLY
  const item2Created = now - (5 * 60 * 1000);
  const item2NgoEnd = item2Created + (45 * 60 * 1000);
  const item2ExpiresAt = item2Created + (3 * 3600 * 1000);

  // Item 3: Created 50m ago, NGO priority 45m EXPIRED 5m ago -> Consumer B2C Marketplace Active ONLY
  const item3Created = now - (50 * 60 * 1000);
  const item3NgoEnd = item3Created + (45 * 60 * 1000);
  const item3ExpiresAt = item3Created + (3 * 3600 * 1000);

  // Item 4: Created 55m ago, NGO priority 45m EXPIRED 10m ago -> Consumer B2C Marketplace Active ONLY
  const item4Created = now - (55 * 60 * 1000);
  const item4NgoEnd = item4Created + (45 * 60 * 1000);
  const item4ExpiresAt = item4Created + (6 * 3600 * 1000);

  return [
    {
      id: 1,
      name: 'Gourmet Beef Tehari & Salad Package',
      sub: 'AI Certified Grade A+ (62% Detect)',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      quantity: '25 Portions',
      temp: 'Hot (60°C+)',
      expiry: 'Expires in 2h 48m',
      createdAt: item1Created,
      ngoStartAt: item1Created,
      ngoEndAt: item1NgoEnd,
      ngoPriorityUntil: item1NgoEnd,
      consumerStartAt: item1NgoEnd,
      consumerEndAt: item1ExpiresAt,
      expiresAt: item1ExpiresAt,
      aiScore: 62,
      ngoPriorityMinutes: 28,
      expiryType: 'urgent',
      price: 'Base: ৳ 450 | B2C: 50% Off (৳ 225)',
      status: '🤝 Tier-1 NGO Priority Window (35m left)',
      statusType: 'pending',
      category: 'COOKED',
      donor: 'Star Chef Bistro',
      area: 'Banani, Dhaka',
      claimedByNgo: false,
      claimedByConsumer: false
    },
    {
      id: 2,
      name: 'Royal Mutton Kacchi Biryani & Borhani Combo',
      sub: 'AI Certified (Grade A+)',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      quantity: '25 Portions',
      temp: 'Hot (60°C+)',
      expiry: 'Expires in 2h 55m',
      createdAt: item2Created,
      ngoStartAt: item2Created,
      ngoEndAt: item2NgoEnd,
      ngoPriorityUntil: item2NgoEnd,
      consumerStartAt: item2NgoEnd,
      consumerEndAt: item2ExpiresAt,
      expiresAt: item2ExpiresAt,
      aiScore: 100,
      ngoPriorityMinutes: 45,
      expiryType: 'warning',
      price: 'Base: ৳ 550 | B2C: 60% Off (৳ 220)',
      status: '🤝 Tier-1 NGO Priority Window (40m left)',
      statusType: 'pending',
      category: 'COOKED',
      donor: 'Star Chef Bistro',
      area: 'Banani, Dhaka',
      claimedByNgo: false,
      claimedByConsumer: false
    },
    {
      id: 3,
      name: 'Spicy Chicken Biryani',
      sub: 'Cooked 1h ago • AI Certified Grade A+',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80',
      quantity: '20 Portions',
      temp: 'Hot (60°C+)',
      expiry: 'Expires in 2h 10m',
      createdAt: item3Created,
      ngoStartAt: item3Created,
      ngoEndAt: item3NgoEnd,
      ngoPriorityUntil: item3NgoEnd,
      consumerStartAt: item3NgoEnd,
      consumerEndAt: item3ExpiresAt,
      expiresAt: item3ExpiresAt,
      aiScore: 100,
      ngoPriorityMinutes: 45,
      expiryType: 'urgent',
      price: 'Base: ৳ 380 | B2C: 50% Off (৳ 190)',
      status: '⚡ Shifted to B2C Consumer Marketplace',
      statusType: 'pending',
      category: 'COOKED',
      donor: 'Star Chef Bistro',
      area: 'Banani, Dhaka',
      claimedByNgo: false,
      claimedByConsumer: false
    },
    {
      id: 4,
      name: 'Assorted Pastries Pkg',
      sub: 'Morning Bake • AI Certified Grade A+ (90% Detect)',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      quantity: '15 Packs',
      temp: 'Room Temp',
      expiry: 'Expires in 5h 05m',
      createdAt: item4Created,
      ngoStartAt: item4Created,
      ngoEndAt: item4NgoEnd,
      ngoPriorityUntil: item4NgoEnd,
      consumerStartAt: item4NgoEnd,
      consumerEndAt: item4ExpiresAt,
      expiresAt: item4ExpiresAt,
      aiScore: 90,
      ngoPriorityMinutes: 41,
      expiryType: 'warning',
      price: 'Base: ৳ 300 | B2C: 50% Off (৳ 150)',
      status: '⚡ Shifted to B2C Consumer Marketplace',
      statusType: 'pending',
      category: 'BAKERY',
      donor: 'Star Chef Bistro',
      area: 'Banani, Dhaka',
      claimedByNgo: false,
      claimedByConsumer: false
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
            if (!newItem.ngoStartAt) {
              newItem.ngoStartAt = newItem.createdAt;
              updated = true;
            }
            if (!newItem.ngoEndAt) {
              const aiScore = newItem.aiScore || 100;
              const ngoMinutes = newItem.ngoPriorityMinutes || Math.max(1, Math.round(45 * (aiScore / 100)));
              newItem.ngoEndAt = newItem.createdAt + (ngoMinutes * 60 * 1000);
              newItem.ngoPriorityUntil = newItem.ngoEndAt;
              updated = true;
            }
            if (!newItem.consumerStartAt) {
              newItem.consumerStartAt = newItem.ngoEndAt;
              updated = true;
            }
            if (!newItem.expiresAt) {
              newItem.expiresAt = newItem.createdAt + (3 * 3600 * 1000);
              updated = true;
            }
            if (!newItem.consumerEndAt) {
              newItem.consumerEndAt = newItem.expiresAt;
              updated = true;
            }
            if (!newItem.image || newItem.image.includes('.svg')) {
              newItem.image = getHdPhotoForTitle(newItem.name, newItem.image);
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
   * Create Surplus Listing with exact stored lifecycle timestamps:
   * createdAt, ngoStartAt, ngoEndAt, consumerStartAt, consumerEndAt, expiresAt
   */
  async createSurplusListing(listingData) {
    const origPrice = listingData.initialPriceBDT || 500;
    const t2Disc = listingData.tier2DiscountPercent || 50;
    const t3Disc = listingData.tier3DiscountPercent || 80;
    const expHrs = listingData.expiryHours || 3;
    const aiScore = listingData.aiScore !== undefined ? listingData.aiScore : (listingData.skipAiAudit ? 60 : 100);

    const ngoPriorityMinutes = Math.max(1, Math.round(45 * (aiScore / 100)));
    const now = Date.now();
    const ngoEndAt = now + ngoPriorityMinutes * 60 * 1000;
    const expiresAt = now + expHrs * 3600 * 1000;

    const newListing = {
      id: Date.now(),
      createdAt: now,
      ngoStartAt: now,
      ngoEndAt: ngoEndAt,
      ngoPriorityUntil: ngoEndAt,
      consumerStartAt: ngoEndAt,
      consumerEndAt: expiresAt,
      expiresAt: expiresAt,
      name: listingData.foodItemTitle || 'Royal Mutton Kacchi Biryani',
      sub: listingData.skipAiAudit ? '⚠️ Manual Unverified' : `AI Certified Grade A+ (${aiScore}% Detect)`,
      image: listingData.imageUrl || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80',
      quantity: `${listingData.quantityPortions || 25} Portions`,
      temp: 'Hot (60°C+)',
      expiry: `Expires in ${expHrs}h`,
      aiScore: aiScore,
      ngoPriorityMinutes: ngoPriorityMinutes,
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
      
      apiClient.post('/surplus', listingData).catch(() => {});
      return newListing;
    } catch (error) {
      return newListing;
    }
  },

  /**
   * Update Surplus Listing (Syncs with LocalStorage and Spring Boot PUT /api/v1/surplus/{id})
   */
  async updateSurplusListing(listingId, updateData) {
    try {
      const stored = this.getStoredListings();
      const targetIdStr = String(listingId).replace('FOOD-', '');
      let updatedListing = null;

      const updated = stored.map(item => {
        if (String(item.id) === targetIdStr) {
          const qty = updateData.quantityPortions ? `${updateData.quantityPortions} Portions` : item.quantity;
          const name = updateData.foodItemTitle || item.name;
          const category = updateData.category || item.category;
          const origPrice = updateData.initialPriceBDT !== undefined ? updateData.initialPriceBDT : (item.initialPriceBDT || 450);

          updatedListing = {
            ...item,
            name: name,
            category: category,
            quantity: qty,
            initialPriceBDT: origPrice,
            price: `Base: ৳ ${origPrice} | B2C: 50% Off (৳ ${Math.round(origPrice * 0.5)})`,
            updatedAt: Date.now()
          };
          return updatedListing;
        }
        return item;
      });

      localStorage.setItem('foodrescue_surplus_listings', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('foodrescue_surplus_updated', { detail: { id: listingId, action: 'UPDATE' } }));

      apiClient.put(`/surplus/${targetIdStr}`, {
        foodItemTitle: updateData.foodItemTitle,
        category: updateData.category,
        quantityPortions: updateData.quantityPortions,
        initialPriceBDT: updateData.initialPriceBDT,
        restaurantId: 1
      }).catch(() => {});

      return updatedListing;
    } catch (e) {
      console.warn('Failed to update listing:', e);
    }
  },

  /**
   * Delete Surplus Listing (Syncs with LocalStorage and Spring Boot DELETE /api/v1/surplus/{id})
   */
  async deleteSurplusListing(listingId) {
    try {
      const stored = this.getStoredListings();
      const targetIdStr = String(listingId).replace('FOOD-', '');
      const filtered = stored.filter(item => String(item.id) !== targetIdStr);

      localStorage.setItem('foodrescue_surplus_listings', JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('foodrescue_surplus_updated', { detail: { id: listingId, action: 'DELETE' } }));

      apiClient.delete(`/surplus/${targetIdStr}`).catch(() => {});
      return filtered;
    } catch (e) {
      console.warn('Failed to delete listing:', e);
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
          const ngoName = claimData.ngoName || 'Anjuman Orphanage Shelter (Bashundhara)';
          const riderName = isVolunteer ? 'Rider Tanvir Hossain' : null;
          return {
            ...item,
            claimedByNgo: true,
            claimedByNgoName: ngoName,
            riderAssigned: isVolunteer,
            riderName: riderName,
            status: isVolunteer ? `🛵 ${riderName} is Coming to Pick Up Food` : `🤝 Claimed by ${ngoName}`,
            statusType: isVolunteer ? 'success' : 'pending',
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

  async getActiveListings() {
    return this.getStoredListings();
  },

  getNgoListings(now = Date.now()) {
    const listings = this.getStoredListings();
    return listings.filter(item => {
      const ngoStart = parseTimestamp(item.ngoStartAt || item.createdAt);
      const ngoEnd = parseTimestamp(item.ngoEndAt || item.ngoPriorityUntil);
      const expiresAt = parseTimestamp(item.expiresAt || item.consumerEndAt);

      const isNgoActive = ngoStart && ngoEnd ? (now >= ngoStart && now < ngoEnd) : (ngoEnd ? now < ngoEnd : true);
      const isNotExpired = expiresAt ? now < expiresAt : true;

      return isNgoActive && isNotExpired && !item.claimedByNgo;
    });
  },

  getConsumerDeals(now = Date.now()) {
    const listings = this.getStoredListings();
    return listings.filter(item => {
      const consumerStart = parseTimestamp(item.consumerStartAt || item.ngoEndAt || item.ngoPriorityUntil);
      const consumerEnd = parseTimestamp(item.consumerEndAt || item.expiresAt);

      const isConsumerActive = consumerStart ? now >= consumerStart : true;
      const isNotExpired = consumerEnd ? now < consumerEnd : true;

      return isConsumerActive && isNotExpired && !item.claimedByNgo;
    });
  },

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

  if (item.status?.includes('Claimed') || item.status?.includes('Shelter') || item.claimedByNgo) {
    return {
      label: item.status || '🤝 Claimed by NGO Shelter',
      pillClass: 'status-pending',
      isPending: true
    };
  }

  const expiresAt = item.expiresAt || item.consumerEndAt;
  const ngoEndAt = item.ngoEndAt || item.ngoPriorityUntil;
  const isExpired = expiresAt && now >= expiresAt;
  const isNgoActive = item.ngoStartAt ? (now >= item.ngoStartAt && now < ngoEndAt) : (ngoEndAt && now < ngoEndAt);

  if (isExpired) {
    return {
      label: '⚠️ Expired (Safety Lock)',
      pillClass: 'status-expired',
      isExpired: true
    };
  }

  if (isNgoActive) {
    const minsLeft = Math.max(0, Math.ceil((ngoEndAt - now) / 60000));
    return {
      label: `🤝 Tier-1 NGO Priority Window (${minsLeft}m left)`,
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

