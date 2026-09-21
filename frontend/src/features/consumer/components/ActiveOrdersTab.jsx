import React from 'react';
import { 
  CheckCircle2, Clock, MapPin, PhoneCall, QrCode, 
  ShoppingBag, ShieldCheck, ChevronRight, ArrowRight
} from 'lucide-react';
import Button from '../../../components/Button/Button';

export default function ActiveOrdersTab({ 
  orders, 
  onOpenQrPass 
}) {
  return (
    <div className="active-orders-container">
      <div className="orders-header-bar">
        <h3>My Surplus Orders & Takeaway Passes</h3>
        <span className="orders-count-badge">{orders.length} Active Pass</span>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders-card">
          <ShoppingBag size={44} className="empty-bag-icon" />
          <h4>No Active Orders</h4>
          <p>Explore surplus deals and reserve your meals at up to 70% OFF.</p>
        </div>
      ) : (
        <div className="orders-stack">
          {orders.map((order) => (
            <div key={order.id} className="active-order-card">
              {/* Top Order Info Header */}
              <div className="order-card-top">
                <div>
                  <span className="order-id-tag">PASS ID: #{order.id}</span>
                  <h4 className="resto-title">{order.restaurantName}</h4>
                  <span className="resto-address">📍 {order.restaurantAddress}</span>
                </div>
                <div className="fulfillment-badge">
                  {order.fulfillmentType === 'pickup' ? '🛍️ Self Takeaway' : '🛵 Rider Delivery'}
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="order-item-detail-box">
                <div className="item-row">
                  <span className="item-name">🍲 {order.itemTitle}</span>
                  <span className="item-qty">x{order.quantity}</span>
                </div>
                <div className="price-summary-line">
                  <span>Amount Paid via {order.paymentMethod}:</span>
                  <strong className="paid-amt">৳{order.totalAmount} BDT</strong>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="order-status-stepper">
                <div className="stepper-step completed">
                  <div className="step-dot">✓</div>
                  <span>Escrow Locked</span>
                </div>
                <div className="step-connector active"></div>
                <div className="stepper-step current">
                  <div className="step-dot">2</div>
                  <span>Ready at Counter</span>
                </div>
                <div className="step-connector"></div>
                <div className="stepper-step">
                  <div className="step-dot">3</div>
                  <span>QR Scanned</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="order-action-footer">
                <div className="pickup-window-notice">
                  <Clock size={14} /> Pickup Window: <strong>Valid for next 45 mins</strong>
                </div>

                <div className="btn-action-group">
                  <a href={`tel:${order.restaurantPhone || '+8801711000000'}`} className="btn-call-resto">
                    <PhoneCall size={14} /> Call
                  </a>
                  <button 
                    className="btn-view-qr-pass"
                    onClick={() => onOpenQrPass(order)}
                  >
                    <QrCode size={16} /> View Digital QR Pass ➔
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
