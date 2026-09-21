import React from 'react';
import { QrCode, CheckCircle2, Clock, MapPin, PhoneCall, ShieldCheck, Printer, Download } from 'lucide-react';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/Button/Button';

export default function QrCodePassModal({
  isOpen,
  onClose,
  order
}) {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🎟️ Scannable Digital Takeaway Pass"
    >
      <div className="qr-pass-modal-content">
        {/* Pass Top Banner */}
        <div className="pass-status-header">
          <CheckCircle2 size={24} color="#059669" />
          <div>
            <h4>Escrow Payment Verified</h4>
            <p>Show this QR code at restaurant counter to collect your food.</p>
          </div>
        </div>

        {/* QR Code Visual Shell */}
        <div className="qr-code-frame-box">
          <div className="qr-visual-wrapper">
            {/* Vector Simulated QR Code SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180" className="qr-svg">
              <rect width="180" height="180" fill="#ffffff" rx="12" />
              {/* Outer Position Squares */}
              <rect x="15" y="15" width="45" height="45" fill="#0f172a" rx="4" />
              <rect x="23" y="23" width="29" height="29" fill="#ffffff" rx="2" />
              <rect x="29" y="29" width="17" height="17" fill="#2563eb" rx="1" />

              <rect x="120" y="15" width="45" height="45" fill="#0f172a" rx="4" />
              <rect x="128" y="23" width="29" height="29" fill="#ffffff" rx="2" />
              <rect x="134" y="29" width="17" height="17" fill="#2563eb" rx="1" />

              <rect x="15" y="120" width="45" height="45" fill="#0f172a" rx="4" />
              <rect x="23" y="128" width="29" height="29" fill="#ffffff" rx="2" />
              <rect x="29" y="134" width="17" height="17" fill="#2563eb" rx="1" />

              {/* Data Pattern Grid Blocks */}
              <rect x="70" y="20" width="12" height="12" fill="#0f172a" />
              <rect x="90" y="20" width="12" height="12" fill="#2563eb" />
              <rect x="70" y="40" width="12" height="12" fill="#0f172a" />
              <rect x="90" y="50" width="12" height="12" fill="#0f172a" />
              <rect x="20" y="70" width="12" height="12" fill="#2563eb" />
              <rect x="40" y="70" width="12" height="12" fill="#0f172a" />
              <rect x="70" y="70" width="12" height="12" fill="#059669" />
              <rect x="90" y="70" width="12" height="12" fill="#0f172a" />
              <rect x="110" y="70" width="12" height="12" fill="#2563eb" />
              <rect x="130" y="70" width="12" height="12" fill="#0f172a" />
              <rect x="150" y="70" width="12" height="12" fill="#0f172a" />
              
              <rect x="20" y="95" width="12" height="12" fill="#0f172a" />
              <rect x="50" y="95" width="12" height="12" fill="#2563eb" />
              <rect x="75" y="95" width="12" height="12" fill="#0f172a" />
              <rect x="100" y="95" width="12" height="12" fill="#0f172a" />
              <rect x="125" y="95" width="12" height="12" fill="#059669" />
              <rect x="145" y="95" width="12" height="12" fill="#0f172a" />

              <rect x="70" y="120" width="12" height="12" fill="#2563eb" />
              <rect x="90" y="120" width="12" height="12" fill="#0f172a" />
              <rect x="110" y="120" width="12" height="12" fill="#0f172a" />
              <rect x="140" y="120" width="12" height="12" fill="#0f172a" />

              <rect x="70" y="145" width="12" height="12" fill="#0f172a" />
              <rect x="95" y="145" width="12" height="12" fill="#059669" />
              <rect x="120" y="145" width="12" height="12" fill="#2563eb" />
              <rect x="145" y="145" width="12" height="12" fill="#0f172a" />
            </svg>
          </div>

          <div className="security-pin-display">
            <span>Redemption Verification PIN:</span>
            <h3 className="pin-code">{order.pinCode || '8942'}</h3>
          </div>
        </div>

        {/* Order Details Receipt */}
        <div className="pass-details-card">
          <div className="p-row">
            <span>Order Pass ID:</span> <strong>#{order.id}</strong>
          </div>
          <div className="p-row">
            <span>Restaurant:</span> <strong>{order.restaurantName}</strong>
          </div>
          <div className="p-row">
            <span>Location:</span> <strong>{order.restaurantAddress}</strong>
          </div>
          <div className="p-row">
            <span>Items Reserved:</span> <strong>{order.itemTitle} (x{order.quantity})</strong>
          </div>
          <div className="p-row">
            <span>Amount Paid:</span> <strong className="price-highlight">৳{order.totalAmount} BDT via {order.paymentMethod}</strong>
          </div>
          <div className="p-row">
            <span>Valid Until:</span> <strong>45 mins from now</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pass-actions-row">
          <button className="btn-secondary-pass" onClick={() => window.print()}>
            <Printer size={15} /> Print / Save PDF
          </button>
          <Button variant="primary" onClick={onClose}>
            Done & Return ➔
          </Button>
        </div>
      </div>
    </Modal>
  );
}
