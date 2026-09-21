import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Trash2, Clock, MapPin, ShieldCheck, 
  CreditCard, Check, AlertCircle, ChevronRight, Lock
} from 'lucide-react';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/Button/Button';

export default function CartCheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
  onClearCart,
  onCheckoutSuccess
}) {
  const [fulfillmentType, setFulfillmentType] = useState('pickup'); // 'pickup' or 'delivery'
  const [paymentMethod, setPaymentMethod] = useState('bkash'); // 'bkash', 'nagad', 'card'
  const [isProcessing, setIsProcessing] = useState(false);
  const [holdTimer, setHoldTimer] = useState(600); // 10 minutes in seconds

  // 10-minute hold countdown effect
  useEffect(() => {
    if (!isOpen || cartItems.length === 0) return;
    const interval = setInterval(() => {
      setHoldTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, cartItems]);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  // Price calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.discountedPrice, 0);
  const deliveryFee = fulfillmentType === 'delivery' ? 40 : 0;
  const platformFee = 10; // Nominal surplus verification fee
  const totalAmount = subtotal + deliveryFee + platformFee;

  const handleConfirmCheckout = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const newOrder = {
        id: `PASS-${Math.floor(100000 + Math.random() * 900000)}`,
        restaurantName: cartItems[0]?.restaurantName || 'Kacchi Bhai Banani',
        restaurantAddress: cartItems[0]?.area || 'Block D, Banani Rd 11',
        restaurantPhone: '+880 1711-987654',
        itemTitle: cartItems[0]?.itemTitle || 'Surplus Meal Pack',
        quantity: cartItems.length,
        totalAmount: totalAmount,
        fulfillmentType: fulfillmentType,
        paymentMethod: paymentMethod.toUpperCase(),
        pinCode: `${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString()
      };

      onCheckoutSuccess(newOrder);
      onClearCart();
      onClose();
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🛒 Checkout & Reserve Surplus Items"
    >
      <div className="cart-checkout-container">
        {cartItems.length === 0 ? (
          <div className="empty-cart-view">
            <ShoppingBag size={48} className="empty-icon" />
            <h4>Your Cart is Empty</h4>
            <p>Select surplus deals from Dhaka restaurants to reserve your meal.</p>
          </div>
        ) : (
          <form onSubmit={handleConfirmCheckout} className="checkout-form">
            {/* Live 10-Min Hold Alert */}
            <div className="hold-timer-alert">
              <Clock size={16} color="#d97706" />
              <span>
                Deal Hold Timer: <strong>{formatTimer(holdTimer)}</strong> remaining to complete payment.
              </span>
            </div>

            {/* Cart Items List */}
            <div className="cart-items-stack">
              <h5 className="section-label">Reserved Items ({cartItems.length})</h5>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="item-info">
                    <strong>{item.itemTitle}</strong>
                    <span className="resto-sub">{item.restaurantName}</span>
                  </div>
                  <div className="item-price-remove">
                    <span className="price-tag">৳{item.discountedPrice} BDT</span>
                    <button 
                      type="button"
                      className="btn-remove-item"
                      onClick={() => onRemoveFromCart(item.id)}
                      title="Remove Item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Fulfillment Mode Selector */}
            <div className="fulfillment-selector-section">
              <h5 className="section-label">Choose Order Fulfillment</h5>
              <div className="fulfillment-grid">
                <div 
                  className={`fulfillment-card ${fulfillmentType === 'pickup' ? 'f-active' : ''}`}
                  onClick={() => setFulfillmentType('pickup')}
                >
                  <span className="f-icon">🛍️</span>
                  <div>
                    <strong>Self Takeaway (Pickup)</strong>
                    <p>৳0 Delivery Fee • Scan QR code at restaurant</p>
                  </div>
                  <span className="fee-badge free">FREE</span>
                </div>

                <div 
                  className={`fulfillment-card ${fulfillmentType === 'delivery' ? 'f-active' : ''}`}
                  onClick={() => setFulfillmentType('delivery')}
                >
                  <span className="f-icon">🛵</span>
                  <div>
                    <strong>Volunteer Rider Delivery</strong>
                    <p>+৳40 BDT Fee • Dispatches hero volunteer</p>
                  </div>
                  <span className="fee-badge">+৳40</span>
                </div>
              </div>
            </div>

            {/* Payment Escrow Method */}
            <div className="payment-method-section">
              <h5 className="section-label">Select Mobile Banking Escrow</h5>
              <div className="payment-options-grid">
                <button 
                  type="button"
                  className={`pay-option ${paymentMethod === 'bkash' ? 'p-active' : ''}`}
                  onClick={() => setPaymentMethod('bkash')}
                >
                  <span className="pay-logo bkash">bKash</span>
                  <span>Instant Escrow</span>
                </button>

                <button 
                  type="button"
                  className={`pay-option ${paymentMethod === 'nagad' ? 'p-active' : ''}`}
                  onClick={() => setPaymentMethod('nagad')}
                >
                  <span className="pay-logo nagad">Nagad</span>
                  <span>Mobile Wallet</span>
                </button>

                <button 
                  type="button"
                  className={`pay-option ${paymentMethod === 'card' ? 'p-active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={18} />
                  <span>Card / Visa</span>
                </button>
              </div>
            </div>

            {/* Price Summary Receipt */}
            <div className="checkout-summary-card">
              <div className="sum-row">
                <span>Subtotal ({cartItems.length} items):</span>
                <strong>৳{subtotal} BDT</strong>
              </div>
              <div className="sum-row">
                <span>Fulfillment ({fulfillmentType}):</span>
                <strong>{deliveryFee === 0 ? '৳0 (Self Pickup)' : `৳${deliveryFee} BDT`}</strong>
              </div>
              <div className="sum-row">
                <span>Verification Fee:</span>
                <strong>৳{platformFee} BDT</strong>
              </div>
              <div className="sum-row total-row">
                <span>Total Amount Due:</span>
                <strong className="total-amount">৳{totalAmount} BDT</strong>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="escrow-guarantee-note">
              <ShieldCheck size={16} color="#059669" />
              <span>
                100% Escrow Protection: Funds released to merchant only after QR code scan.
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={isProcessing}
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
            >
              {isProcessing ? 'Processing Escrow Lock...' : `🔒 Pay ৳${totalAmount} BDT & Lock Order`}
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
}
