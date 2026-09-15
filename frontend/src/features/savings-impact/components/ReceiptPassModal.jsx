import React from 'react';
import {
  QrCode,
  CheckCircle2,
  Leaf,
  Store,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/Button/Button';
import './ReceiptPassModal.css';

export default function ReceiptPassModal({ isOpen, onClose, order }) {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verified Surplus Pickup Pass">
      <div className="receipt-modal-body">
        {/* Pass Top Card Header */}
        <div className="receipt-pass-header">
          <div className="pass-status-pill">
            <CheckCircle2 size={14} />
            <span>VERIFIED SURPLUS RESCUE PASS</span>
          </div>

          <h2 className="pass-id-title">{order.id}</h2>
          <span className="pass-date-time">{order.date}</span>
        </div>

        {/* QR Code Section */}
        <div className="receipt-qr-wrapper">
          <div className="qr-frame">
            <QrCode size={140} className="receipt-qr-img" />
          </div>
          <span className="qr-pass-code">{order.qrCode || 'QR-89412-DHAKA-RESCUE'}</span>
          <p className="qr-instruction">
            Show this QR pass at the restaurant counter or to the volunteer driver during pickup window.
          </p>
        </div>

        {/* Order Details Breakdown */}
        <div className="receipt-details-list">
          <div className="r-detail-row">
            <span className="r-lbl"><Store size={14} className="r-icon" /> Restaurant Partner</span>
            <span className="r-val bold">{order.restaurant}</span>
          </div>

          <div className="r-detail-row">
            <span className="r-lbl"><ShoppingBag size={14} className="r-icon" /> Rescued Items</span>
            <span className="r-val">{order.item}</span>
          </div>

          <div className="r-detail-row">
            <span className="r-lbl"><MapPin size={14} className="r-icon" /> Pickup Hub</span>
            <span className="r-val">Banani Road 11, Dhaka</span>
          </div>

          <div className="r-detail-row">
            <span className="r-lbl">Regular Menu Price</span>
            <span className="r-val strike">৳{order.originalPrice}</span>
          </div>

          <div className="r-detail-row">
            <span className="r-lbl">Surplus Rescue Price</span>
            <span className="r-val bold">৳{order.paidPrice}</span>
          </div>

          <div className="r-detail-row highlight-green">
            <span className="r-lbl">Your Plate Savings</span>
            <span className="r-val green">+ ৳{order.savings} ({order.discountPct}% OFF)</span>
          </div>

          <div className="r-detail-row highlight-teal">
            <span className="r-lbl"><Leaf size={14} className="r-icon" /> Carbon Offset</span>
            <span className="r-val teal">{order.co2} CO₂ Diverted</span>
          </div>
        </div>

        <div className="receipt-modal-footer">
          <Button variant="primary" fullWidth onClick={onClose}>
            Close Receipt Pass
          </Button>
        </div>
      </div>
    </Modal>
  );
}
