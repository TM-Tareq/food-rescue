import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, MapPin, PhoneCall, QrCode, 
  ShoppingBag, ShieldCheck, ChevronRight, ArrowRight,
  Bike, Truck, Sparkles, Navigation, UserCheck, AlertCircle,
  RefreshCw, Phone, Radio
} from 'lucide-react';
import Button from '../../../components/Button/Button';
import { supplyChainService } from '../../../services/supplyChainService';

export default function ActiveOrdersTab({ 
  orders, 
  onOpenQrPass 
}) {
  const [liveOrders, setLiveOrders] = useState(orders || []);

  const syncOrdersWithSupplyChain = () => {
    try {
      const batches = supplyChainService.getBatches();
      
      setLiveOrders(prevOrders => {
        return prevOrders.map(order => {
          if (order.fulfillmentType === 'delivery') {
            const matchedBatch = batches.find(b => b.id === order.batchId || b.id === order.id || b.restaurant === order.restaurantName);
            if (matchedBatch) {
              const isAssigned = matchedBatch.riderName && !matchedBatch.riderName.includes('Pending') && !matchedBatch.riderName.includes('Searching');
              return {
                ...order,
                riderAssigned: isAssigned,
                riderName: isAssigned ? matchedBatch.riderName : 'Searching for Hero Rider...',
                riderPhone: matchedBatch.riderPhone || '+880 1711-987654',
                status: isAssigned ? 'RIDER_ASSIGNED' : 'RIDER_SEARCHING',
                eta: matchedBatch.eta || '12 mins ETA',
                distanceKm: matchedBatch.distanceKm || '0.8 km'
              };
            }
          }
          return order;
        });
      });
    } catch (e) {
      console.warn('Error syncing active orders with supply chain:', e);
    }
  };

  useEffect(() => {
    setLiveOrders(orders || []);
  }, [orders]);

  useEffect(() => {
    syncOrdersWithSupplyChain();

    const syncChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('foodrescue_live_channel') : null;
    if (syncChannel) {
      syncChannel.onmessage = () => {
        syncOrdersWithSupplyChain();
      };
    }

    window.addEventListener('foodrescue_supply_chain_updated', syncOrdersWithSupplyChain);
    window.addEventListener('foodrescue_surplus_updated', syncOrdersWithSupplyChain);
    window.addEventListener('storage', syncOrdersWithSupplyChain);

    return () => {
      if (syncChannel) syncChannel.close();
      window.removeEventListener('foodrescue_supply_chain_updated', syncOrdersWithSupplyChain);
      window.removeEventListener('foodrescue_surplus_updated', syncOrdersWithSupplyChain);
      window.removeEventListener('storage', syncOrdersWithSupplyChain);
    };
  }, []);

  // Simulate Rider Accepting Order for instant testing
  const handleSimulateRiderAccept = (orderId, batchId) => {
    try {
      const batches = supplyChainService.getBatches();
      const batchIndex = batches.findIndex(b => b.id === batchId);
      
      if (batchIndex !== -1) {
        batches[batchIndex].riderName = 'Tanvir Hossain (Hero Rider)';
        batches[batchIndex].riderPhone = '+880 1711-987654';
        batches[batchIndex].status = 'IN_TRANSIT';
        batches[batchIndex].currentStage = 4;
        supplyChainService.saveBatches(batches);
      } else {
        // Create new batch if missing
        const newBatch = {
          id: batchId || `BATCH-${Math.floor(8000 + Math.random() * 999)}`,
          title: 'Consumer Surplus Meal Package',
          restaurant: 'Star Chef Bistro',
          restaurantAddress: 'Block D, Banani Rd 11, Dhaka',
          category: 'COOKED_MEAL',
          portions: 1,
          portionsClaimedNgo: 0,
          portionsSoldConsumer: 1,
          hygieneScore: 98,
          aiGrade: 'GRADE_A_PREMIUM',
          prepTime: '09:00 PM',
          expiryTime: '45 mins left',
          currentStage: 4,
          status: 'IN_TRANSIT',
          deliveryMode: 'VOLUNTEER_RIDER',
          recipient: 'Consumer Order (Banani, Dhaka)',
          recipientType: 'CONSUMER',
          riderName: 'Tanvir Hossain (Hero Rider)',
          riderPhone: '+880 1711-987654',
          riderAvatar: '🛵',
          pickupOtp: '4892',
          deliveryOtp: '7842',
          eta: '12 mins ETA',
          distanceKm: '0.8 km',
          foodSavedKg: 1.8,
          co2SavedKg: 2.7,
          createdAt: Date.now()
        };
        supplyChainService.addOrUpdateBatch(newBatch);
      }

      setLiveOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            riderAssigned: true,
            riderName: 'Tanvir Hossain (Hero Rider)',
            riderPhone: '+880 1711-987654',
            status: 'RIDER_ASSIGNED',
            eta: '12 mins ETA',
            distanceKm: '0.8 km away'
          };
        }
        return o;
      }));
    } catch (e) {
      console.warn('Error simulating rider accept:', e);
    }
  };

  return (
    <div className="active-orders-container">
      <div className="orders-header-bar">
        <div>
          <h3>My Active Orders & Foodpanda-Style Live Tracker</h3>
          <span className="orders-sub">Real-time status updates, saved OTP codes & live rider tracking</span>
        </div>
        <span className="orders-count-badge">{liveOrders.length} Active Orders</span>
      </div>

      {liveOrders.length === 0 ? (
        <div className="empty-orders-card">
          <ShoppingBag size={44} className="empty-bag-icon" />
          <h4>No Active Orders</h4>
          <p>Explore surplus deals in Dhaka restaurants and reserve your meals at up to 70% OFF.</p>
        </div>
      ) : (
        <div className="orders-stack">
          {liveOrders.map((order) => {
            const isDelivery = order.fulfillmentType === 'delivery';
            const isRiderAssigned = order.riderAssigned || (order.riderName && !order.riderName.includes('Searching') && !order.riderName.includes('Pending'));

            return (
              <div key={order.id} className="active-order-card foodpanda-style-card">
                {/* 1. TOP ORDER HEADER */}
                <div className="order-card-top">
                  <div>
                    <div className="pass-id-row">
                      <span className="order-id-tag">ORDER PASS #{order.id}</span>
                      <span className={`payment-pill ${order.paymentMethod === 'COD' ? 'cod-pill' : 'escrow-pill'}`}>
                        {order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : `💳 Paid via ${order.paymentMethod}`}
                      </span>
                    </div>
                    <h4 className="resto-title">🏪 {order.restaurantName}</h4>
                    <span className="resto-address">📍 {order.restaurantAddress}</span>
                  </div>

                  <div className={`fulfillment-badge ${isDelivery ? 'delivery-badge' : 'pickup-badge'}`}>
                    {isDelivery ? '🛵 Volunteer Rider Delivery' : '🛍️ Self Takeaway (Pickup)'}
                  </div>
                </div>

                {/* 2. ORDER ITEMS SUMMARY */}
                <div className="order-item-detail-box">
                  <div className="item-row">
                    <span className="item-name">🍲 <strong>{order.itemTitle}</strong></span>
                    <span className="item-qty">x{order.quantity}</span>
                  </div>
                  <div className="price-summary-line">
                    <span>Total Bill ({order.paymentMethod}):</span>
                    <strong className="paid-amt">৳{order.totalAmount} BDT</strong>
                  </div>
                </div>

                {/* 3. FOODPANDA-STYLE RIDER LIVE TRACKING BANNER (DELIVERY ORDERS) */}
                {isDelivery && (
                  <div className="foodpanda-rider-tracker-banner">
                    {isRiderAssigned ? (
                      <div className="rider-active-card">
                        <div className="rider-avatar-box">
                          <span className="r-avatar">{order.riderAvatar || '🛵'}</span>
                          <span className="live-dot-green"></span>
                        </div>

                        <div className="rider-details-meta">
                          <div className="r-title-row">
                            <h5>{order.riderName || 'Tanvir Hossain (Hero Rider)'}</h5>
                            <span className="r-rating">⭐ 4.9 (84 Rescues)</span>
                          </div>
                          <p className="r-status-txt">
                            🟢 <strong>Accepted Your Order!</strong> En route to restaurant ({order.distanceKm || '0.8 km'} • {order.eta || '12 mins ETA'})
                          </p>
                        </div>

                        <div className="rider-contact-box">
                          <a 
                            href={`tel:${order.riderPhone || '+8801711987654'}`} 
                            className="btn-call-rider"
                            title="Call Rider Directly"
                          >
                            <PhoneCall size={14} />
                            <span>Call Rider</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      /* SEARCHING FOR RIDER STANDBY STATE */
                      <div className="rider-searching-card">
                        <div className="searching-icon-pulse">
                          <Radio size={22} className="spin-icon" color="#38bdf8" />
                        </div>

                        <div className="searching-info">
                          <h5>⏳ Searching for Nearby Hero Rider...</h5>
                          <p>Order stored in area database. Broadcasted to volunteer riders within 2.0 km radius.</p>
                        </div>

                        <button 
                          type="button"
                          className="btn-simulate-accept"
                          onClick={() => handleSimulateRiderAccept(order.id, order.batchId)}
                        >
                          ⚡ Accept Order as Rider (Test Live Sync)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. FOODPANDA-STYLE STEPPER PROGRESS PIPELINE */}
                <div className="order-status-stepper foodpanda-stepper">
                  <div className="stepper-step completed">
                    <div className="step-dot">✓</div>
                    <span>1. Placed ({order.paymentMethod})</span>
                  </div>

                  <div className="step-connector completed"></div>

                  <div className="stepper-step completed">
                    <div className="step-dot">✓</div>
                    <span>2. Kitchen Ready</span>
                  </div>

                  <div className="step-connector active"></div>

                  <div className={`stepper-step ${isRiderAssigned || !isDelivery ? 'current' : ''}`}>
                    <div className="step-dot">{isRiderAssigned || !isDelivery ? '3' : '⌛'}</div>
                    <span>{isDelivery ? (isRiderAssigned ? '3. Rider En Route' : '3. Assigning Rider') : '3. Ready for QR'}</span>
                  </div>

                  <div className="step-connector"></div>

                  <div className="stepper-step">
                    <div className="step-dot">4</div>
                    <span>4. Delivered</span>
                  </div>
                </div>

                {/* 5. SAVED OTP & QR CODE ACTION FOOTER */}
                <div className="order-action-footer foodpanda-footer">
                  <div className="saved-otp-box">
                    <ShieldCheck size={18} color="#059669" />
                    <div>
                      <span className="otp-lbl">SAVED REDEMPTION OTP / PIN:</span>
                      <strong className="otp-code">{order.pinCode || '6695'}</strong>
                    </div>
                  </div>

                  <div className="btn-action-group">
                    <a href={`tel:${order.restaurantPhone || '+8801711987654'}`} className="btn-call-resto">
                      <Phone size={14} /> Call Restaurant
                    </a>

                    <button 
                      className="btn-view-qr-pass"
                      onClick={() => onOpenQrPass(order)}
                    >
                      <QrCode size={16} /> Show Digital QR Pass ➔
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
