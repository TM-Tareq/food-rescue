// Supply Chain & Multi-Party OTP Service for FoodRescue

const INITIAL_BATCHES = [
  {
    id: 'BATCH-8091',
    title: 'Kacchi Biryani & Borhani Combo',
    restaurant: 'Star Chef Bistro',
    restaurantAddress: 'Gulshan 2, Dhaka',
    category: 'COOKED_MEAL',
    portions: 50,
    portionsClaimedNgo: 30,
    portionsSoldConsumer: 20,
    hygieneScore: 96,
    aiGrade: 'GRADE_A_PREMIUM',
    prepTime: '08:15 PM',
    expiryTime: '11:45 PM',
    currentStage: 4, // 1: Listed, 2: Allocated, 3: Pickup Verified, 4: In Transit, 5: Delivered
    status: 'IN_TRANSIT',
    deliveryMode: 'VOLUNTEER_RIDER', // 'VOLUNTEER_RIDER' or 'NGO_SELF_PICKUP'
    recipient: 'Anjuman Orphanage Shelter (Dhanmondi)',
    recipientType: 'NGO',
    riderName: 'Tanvir Ahmed (Hero Rider)',
    riderPhone: '+880 1711-987654',
    riderAvatar: '🛵',
    pickupOtp: '4892',
    pickupOtpVerified: true,
    pickupOtpStatus: 'EXPIRED_REMOVED',
    deliveryOtp: '7842',
    deliveryOtpVerified: false,
    deliveryOtpStatus: 'ACTIVE_VISIBLE',
    eta: '9 mins remaining',
    distanceKm: '4.2 km',
    foodSavedKg: 25,
    co2SavedKg: 37.5
  },
  {
    id: 'BATCH-8092',
    title: 'Special Chicken Polao & Egg',
    restaurant: 'Sultan\'s Dine Banani',
    restaurantAddress: 'Banani Block 11, Dhaka',
    category: 'COOKED_MEAL',
    portions: 35,
    portionsClaimedNgo: 35,
    portionsSoldConsumer: 0,
    hygieneScore: 94,
    aiGrade: 'GRADE_A_PREMIUM',
    prepTime: '08:30 PM',
    expiryTime: '11:59 PM',
    currentStage: 5,
    status: 'DELIVERED',
    deliveryMode: 'NGO_SELF_PICKUP',
    recipient: 'Chhoto Moni Nibash (Tejgaon)',
    recipientType: 'NGO',
    riderName: 'NGO Transport Van',
    riderPhone: '+880 1819-445566',
    riderAvatar: '🚐',
    pickupOtp: '9153',
    pickupOtpVerified: true,
    pickupOtpStatus: 'EXPIRED_REMOVED',
    deliveryOtp: '9153',
    deliveryOtpVerified: true,
    deliveryOtpStatus: 'EXPIRED_REMOVED',
    eta: 'Delivered',
    distanceKm: '3.1 km',
    foodSavedKg: 17.5,
    co2SavedKg: 26.2
  },
  {
    id: 'BATCH-8093',
    title: 'Traditional Mutton Mezban & Dal',
    restaurant: 'Dhakaiya Mezban Gulshan',
    restaurantAddress: 'Gulshan 1, Dhaka',
    category: 'COOKED_MEAL',
    portions: 40,
    portionsClaimedNgo: 15,
    portionsSoldConsumer: 25,
    hygieneScore: 91,
    aiGrade: 'GRADE_A_FRESH',
    prepTime: '07:45 PM',
    expiryTime: '11:15 PM',
    currentStage: 3,
    status: 'PICKUP_VERIFIED',
    deliveryMode: 'VOLUNTEER_RIDER',
    recipient: 'Shanti Old Age Home & Marketplace Buyers',
    recipientType: 'HYBRID',
    riderName: 'Farhan Kabir',
    riderPhone: '+880 1912-778899',
    riderAvatar: '🛵',
    pickupOtp: '3310',
    pickupOtpVerified: true,
    pickupOtpStatus: 'EXPIRED_REMOVED',
    deliveryOtp: '6124',
    deliveryOtpVerified: false,
    deliveryOtpStatus: 'ACTIVE_VISIBLE',
    eta: '18 mins remaining',
    distanceKm: '5.8 km',
    foodSavedKg: 20,
    co2SavedKg: 30.0
  },
  {
    id: 'BATCH-8094',
    title: 'Fresh Artisan Pastry & Milk Buns',
    restaurant: 'Bread & Butter Bakery',
    restaurantAddress: 'Uttara Sector 3, Dhaka',
    category: 'BAKERY',
    portions: 60,
    portionsClaimedNgo: 20,
    portionsSoldConsumer: 40,
    hygieneScore: 98,
    aiGrade: 'GRADE_A_PREMIUM',
    prepTime: '06:00 PM',
    expiryTime: '11:00 PM',
    currentStage: 2,
    status: 'CLAIMED_PENDING_PICKUP',
    deliveryMode: 'NGO_SELF_PICKUP',
    recipient: 'Uttara Street Children Care',
    recipientType: 'NGO',
    riderName: 'NGO Self-Pickup Team',
    riderPhone: '+880 1712-009988',
    riderAvatar: '🏠',
    pickupOtp: '5582',
    pickupOtpVerified: false,
    pickupOtpStatus: 'ACTIVE_VISIBLE',
    deliveryOtp: '5582',
    deliveryOtpVerified: false,
    deliveryOtpStatus: 'ACTIVE_VISIBLE',
    eta: 'Awaiting NGO Self-Pickup',
    distanceKm: '2.0 km',
    foodSavedKg: 18,
    co2SavedKg: 27.0
  },
  {
    id: 'BATCH-8095',
    title: 'Morog Polao & Firni Dessert',
    restaurant: 'Kacchi Bhai Dhanmondi',
    restaurantAddress: 'Dhanmondi 27, Dhaka',
    category: 'COOKED_MEAL',
    portions: 25,
    portionsClaimedNgo: 25,
    portionsSoldConsumer: 0,
    hygieneScore: 93,
    aiGrade: 'GRADE_A_FRESH',
    prepTime: '09:00 PM',
    expiryTime: '12:30 AM',
    currentStage: 1,
    status: 'AI_AUDITED_LISTED',
    deliveryMode: 'VOLUNTEER_RIDER',
    recipient: 'Broadcasted to Tier 1 NGO Shelters',
    recipientType: 'BROADCAST',
    riderName: 'Pending Claim',
    riderPhone: 'N/A',
    riderAvatar: '🏪',
    pickupOtp: null,
    pickupOtpVerified: false,
    pickupOtpStatus: 'UNGENERATED',
    deliveryOtp: null,
    deliveryOtpVerified: false,
    deliveryOtpStatus: 'UNGENERATED',
    eta: 'Tier 1 Free NGO Window Active',
    distanceKm: 'N/A',
    foodSavedKg: 12.5,
    co2SavedKg: 18.7
  }
];

export const supplyChainService = {
  getBatches() {
    try {
      const raw = localStorage.getItem('foodrescue_supply_chain_batches');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse supply chain batches from localStorage:', e);
    }
    localStorage.setItem('foodrescue_supply_chain_batches', JSON.stringify(INITIAL_BATCHES));
    return INITIAL_BATCHES;
  },

  saveBatches(batches) {
    try {
      localStorage.setItem('foodrescue_supply_chain_batches', JSON.stringify(batches));
      window.dispatchEvent(new Event('foodrescue_supply_chain_updated'));
    } catch (e) {
      console.error('Error saving supply chain batches:', e);
    }
  },

  addOrUpdateBatch(newBatch) {
    const batches = this.getBatches();
    const existingIndex = batches.findIndex(b => b.id === newBatch.id);
    if (existingIndex !== -1) {
      batches[existingIndex] = { ...batches[existingIndex], ...newBatch };
    } else {
      batches.unshift(newBatch);
    }
    this.saveBatches(batches);
    return newBatch;
  },

  /**
   * Verify Pickup OTP (Kitchen Handover)
   */
  verifyPickupOtp(batchId, inputOtp) {
    const batches = this.getBatches();
    const batchIndex = batches.findIndex(b => b.id === batchId);
    if (batchIndex === -1) throw new Error('Batch not found');

    const batch = batches[batchIndex];

    if (batch.pickupOtpVerified) {
      return { success: true, message: 'Pickup OTP was already verified and removed.' };
    }

    if (batch.pickupOtp !== inputOtp.trim()) {
      throw new Error('❌ Invalid Pickup OTP. Please check the code with restaurant/NGO.');
    }

    // OTP Verified -> Mark as verified & expire/remove OTP
    batch.pickupOtpVerified = true;
    batch.pickupOtpStatus = 'EXPIRED_REMOVED';
    batch.currentStage = Math.max(batch.currentStage, 3);
    batch.status = batch.deliveryMode === 'NGO_SELF_PICKUP' ? 'DELIVERED' : 'IN_TRANSIT';
    
    if (batch.deliveryMode === 'NGO_SELF_PICKUP') {
      batch.currentStage = 5;
      batch.deliveryOtpVerified = true;
      batch.deliveryOtpStatus = 'EXPIRED_REMOVED';
      batch.eta = 'Delivered (Self-Pickup)';
    }

    batches[batchIndex] = batch;
    this.saveBatches(batches);

    return { 
      success: true, 
      message: batch.deliveryMode === 'NGO_SELF_PICKUP' 
        ? '✅ NGO Self-Pickup Verified! OTP validated and removed.' 
        : '✅ Kitchen Pickup OTP Verified! Food in transit.',
      batch 
    };
  },

  /**
   * Verify Delivery OTP (Beneficiary Doorstep Handover)
   */
  verifyDeliveryOtp(batchId, inputOtp) {
    const batches = this.getBatches();
    const batchIndex = batches.findIndex(b => b.id === batchId);
    if (batchIndex === -1) throw new Error('Batch not found');

    const batch = batches[batchIndex];

    if (batch.deliveryOtpVerified) {
      return { success: true, message: 'Delivery OTP was already verified and removed.' };
    }

    if (batch.deliveryOtp !== inputOtp.trim()) {
      throw new Error('❌ Invalid Delivery OTP. Please enter the code shown on NGO/Consumer screen.');
    }

    // OTP Verified -> Remove OTP & complete delivery
    batch.deliveryOtpVerified = true;
    batch.deliveryOtpStatus = 'EXPIRED_REMOVED';
    batch.currentStage = 5;
    batch.status = 'DELIVERED';
    batch.eta = 'Delivered Successfully';

    batches[batchIndex] = batch;
    this.saveBatches(batches);

    return { 
      success: true, 
      message: '🎉 Delivery OTP Verified! Food Handover Completed. OTP Removed from Database.',
      batch 
    };
  }
};
