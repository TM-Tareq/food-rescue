import React from 'react';
import {
  Leaf,
  Award,
  Download,
  Printer,
  CheckCircle2,
  QrCode,
  ShieldCheck
} from 'lucide-react';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/Button/Button';
import './ImpactCertificateModal.css';

export default function ImpactCertificateModal({ isOpen, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Impact Certificate">
      <div className="certificate-modal-content">
        {/* Decorative Certificate Frame */}
        <div className="certificate-frame">
          <div className="cert-header">
            <div className="cert-logo-box">
              <Leaf size={28} className="cert-leaf-icon" />
            </div>
            <div className="cert-org-details">
              <h2 className="cert-org-title">FOOD RESCUE MARKET</h2>
              <span className="cert-org-sub">VERIFIED ECO IMPACT & SUSTAINABILITY CERTIFICATE</span>
            </div>
            <div className="cert-badge-gold">
              <ShieldCheck size={28} />
            </div>
          </div>

          <div className="cert-divider"></div>

          <div className="cert-body">
            <p className="cert-presented">THIS CERTIFICATE IS OFFICIALLY PRESENTED TO</p>
            <h1 className="cert-user-name">Farhan Rahman</h1>
            <p className="cert-statement">
              In recognition of extraordinary contributions to reducing urban Dhaka food waste, diverting surplus food from landfills, and reducing greenhouse carbon emissions.
            </p>

            {/* Metrics Highlights Grid */}
            <div className="cert-metrics-grid">
              <div className="cert-metric-box">
                <span className="cert-m-val">৳4,500 BDT</span>
                <span className="cert-m-lbl">Total Money Saved</span>
              </div>
              <div className="cert-metric-box">
                <span className="cert-m-val">18 Portions</span>
                <span className="cert-m-lbl">Surplus Meals Rescued</span>
              </div>
              <div className="cert-metric-box">
                <span className="cert-m-val">24.5 kg</span>
                <span className="cert-m-lbl">CO₂ Emissions Offset</span>
              </div>
            </div>

            <div className="cert-footer-details">
              <div className="cert-qr-block">
                <QrCode size={48} className="cert-qr-icon" />
                <div className="cert-qr-info">
                  <span className="cert-code">VERIFIED SERIAL: FR-2026-DHAKA-89412</span>
                  <span className="cert-date">Issued: Feb 2026 · Banani Hub</span>
                </div>
              </div>

              <div className="cert-sign-block">
                <div className="sign-line"></div>
                <span className="sign-title">Dhaka Food Rescue Registry</span>
                <span className="sign-sub">Official Carbon Offsets Auditor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="cert-modal-actions">
          <Button variant="outline" icon={Printer} onClick={handlePrint}>
            Print Certificate
          </Button>
          <Button variant="primary" icon={Download} onClick={onClose}>
            Download PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
}
