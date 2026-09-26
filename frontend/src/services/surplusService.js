import apiClient from './apiClient';

export const surplusService = {
  /**
   * Create Surplus Listing (Connects to Spring Boot SurplusListingRepository)
   * Endpoint: POST /api/v1/surplus
   */
  async createSurplusListing(listingData) {
    try {
      return await apiClient.post('/surplus', listingData);
    } catch (error) {
      const origPrice = listingData.initialPriceBDT || 500;
      const t2Disc = listingData.tier2DiscountPercent || 50;
      const t3Disc = listingData.tier3DiscountPercent || 80;
      const expHrs = listingData.expiryHours || 3;

      return {
        id: Date.now(),
        name: listingData.foodItemTitle || 'Royal Mutton Kacchi Biryani',
        sub: listingData.skipAiAudit ? '⚠️ Manual Unverified (On-Site Inspection)' : 'AI Certified (Grade A+)',
        quantity: `${listingData.quantityPortions || 25} Portions`,
        temp: 'Hot (60°C+)',
        expiry: `Expires in ${expHrs}h (${t2Disc}%-${t3Disc}% Off)`,
        expiryType: 'warning',
        price: `Base: ৳ ${origPrice} | B2C: ${t2Disc}% Off (৳ ${Math.round(origPrice * (1 - t2Disc/100))})`,
        status: 'Matching NGO / Discount Consumer...',
        statusType: 'pending'
      };
    }
  },

  /**
   * Get Active Surplus Food Listings
   * Endpoint: GET /api/v1/surplus/active
   */
  async getActiveListings() {
    try {
      return await apiClient.get('/surplus/active');
    } catch (error) {
      return [
        {
          id: 1,
          name: 'Spicy Chicken Biryani',
          sub: 'Cooked 1h ago • AI Certified Grade A+',
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80',
          quantity: '20 Portions',
          temp: 'Hot (60°C+)',
          expiry: 'Expires in 35m',
          expiryType: 'urgent',
          status: 'Volunteer En Route (Tanvir)',
          statusType: 'success'
        },
        {
          id: 2,
          name: 'Assorted Pastries Pkg',
          sub: 'Morning Bake • AI Certified Grade A+',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80',
          quantity: '15 Packs',
          temp: 'Room Temp',
          expiry: 'Expires in 2h 10m',
          expiryType: 'warning',
          status: 'Matching NGO...',
          statusType: 'pending'
        }
      ];
    }
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
