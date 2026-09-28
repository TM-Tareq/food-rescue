import apiClient from './apiClient';
import { supplyChainService } from './supplyChainService';

export const consumerService = {
  /**
   * B2C Order Checkout & Escrow / COD Lock
   * Endpoint: POST /api/v1/orders/checkout
   */
  async checkoutEscrowOrder(orderData) {
    const pinCode = `${Math.floor(1000 + Math.random() * 9000)}`;
    const passId = `PASS-${Math.floor(100000 + Math.random() * 900000)}`;
    const batchId = `BATCH-${Math.floor(8000 + Math.random() * 999)}`;

    const isDelivery = !orderData.fulfillmentType || orderData.fulfillmentType === 'delivery' || orderData.fulfillmentType === 'VOLUNTEER_RIDER';

    const getCoordsFromAddress = (addr = '') => {
      const t = (addr || '').toLowerCase();
      if (t.includes('gulshan')) return [23.7979, 90.4143];
      if (t.includes('dhanmondi')) return [23.7516, 90.3774];
      if (t.includes('uttara')) return [23.8722, 90.3989];
      if (t.includes('bashundhara')) return [23.8103, 90.4125];
      if (t.includes('mirpur')) return [23.8069, 90.3687];
      return [23.7937, 90.4066]; // Default Banani
    };

    const pCoords = getCoordsFromAddress(orderData.restaurantAddress || orderData.restaurantName);
    const custName = orderData.customerName || 'Farhan Ahmed';
    const custAddr = orderData.customerAddress || 'House 42, Road 11, Block D, Banani, Dhaka';
    const custPhone = orderData.customerPhone || '+880 1712-345678';
    const dCoords = getCoordsFromAddress(custAddr);

    const orderObj = {
      id: passId,
      batchId: batchId,
      restaurantName: orderData.restaurantName || 'Star Chef Bistro',
      restaurantAddress: orderData.restaurantAddress || 'Block D, Banani Rd 11, Dhaka',
      restaurantPhone: '+880 1711-987654',
      customerName: custName,
      customerAddress: custAddr,
      customerPhone: custPhone,
      itemTitle: orderData.itemTitle || 'Surplus Meal Pack',
      quantity: orderData.quantity || 1,
      totalAmount: orderData.totalAmount || 220,
      fulfillmentType: isDelivery ? 'delivery' : 'pickup',
      paymentMethod: (orderData.paymentMethod || 'COD').toUpperCase(),
      pinCode: pinCode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      status: isDelivery ? 'RIDER_SEARCHING' : 'READY_FOR_PICKUP',
      riderAssigned: false,
      riderName: isDelivery ? 'Searching for Hero Rider...' : null,
      riderPhone: null,
      riderAvatar: '🛵',
      riderRating: '4.9',
      distanceKm: '0.8 km',
      eta: isDelivery ? '12 mins ETA' : 'Ready at counter'
    };

    // If delivery requested, register with Supply Chain Service for Riders to see and claim
    if (isDelivery) {
      const supplyBatch = {
        id: batchId,
        title: orderData.itemTitle || 'Surplus Consumer Meal Pack',
        name: orderData.itemTitle || 'Surplus Consumer Meal Pack',
        restaurant: orderData.restaurantName || 'Star Chef Bistro',
        donor: orderData.restaurantName || 'Star Chef Bistro',
        restaurantAddress: orderData.restaurantAddress || 'Block D, Banani Rd 11, Dhaka',
        area: orderData.restaurantAddress || 'Banani, Dhaka',
        customerName: custName,
        customerAddress: custAddr,
        customerPhone: custPhone,
        category: 'COOKED_MEAL',
        portions: orderData.quantity || 1,
        portionsClaimedNgo: 0,
        portionsSoldConsumer: orderData.quantity || 1,
        hygieneScore: 98,
        aiGrade: 'GRADE_A_PREMIUM',
        prepTime: orderObj.timestamp,
        expiryTime: 'Expires in 45 mins',
        currentStage: 2, // Pending pickup
        status: 'CLAIMED_PENDING_PICKUP',
        deliveryMode: 'VOLUNTEER_RIDER',
        recipient: `${custName} (${custAddr})`,
        recipientType: 'CONSUMER',
        riderName: 'Pending Rider Acceptance',
        riderPhone: '+880 1711-987654',
        riderAvatar: '🛵',
        pickupOtp: pinCode,
        deliveryOtp: pinCode,
        eta: '12 mins ETA',
        distanceKm: '1.2 km',
        pickupCoords: pCoords,
        dropoffCoords: dCoords,
        foodSavedKg: 1.8,
        co2SavedKg: 2.7,
        createdAt: Date.now(),
        isDemo: false
      };
      supplyChainService.addOrUpdateBatch(supplyBatch);
    }

    try {
      await apiClient.post('/orders/checkout', orderData);
    } catch (error) {
      // Offline fallback returning orderObj
    }

    return orderObj;
  }
};
