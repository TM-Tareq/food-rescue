import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShieldCheck, Camera, CheckCircle2, AlertTriangle, 
  Thermometer, Clock, Leaf, RefreshCw, Upload, FileCheck, Utensils,
  PackageCheck, PackageX, Image as ImageIcon
} from 'lucide-react';
import Modal from '../../../../components/Modal/Modal';
import Button from '../../../../components/Button/Button';
import { surplusService } from '../../../../services/surplusService';
import { masterMenuService } from '../../../../services/masterMenuService';
import './AiFoodSafetyScannerModal.css';

export default function AiFoodSafetyScannerModal({
  isOpen,
  onClose,
  onListingApproved
}) {
  const [masterMenuItems, setMasterMenuItems] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState('');
  
  const [foodName, setFoodName] = useState('Royal Mutton Kacchi Biryani');
  const [portions, setPortions] = useState(25);
  
  // Pricing & Tier Strategy
  const [basePrice, setBasePrice] = useState(500);
  const [tier2Discount, setTier2Discount] = useState(50);
  const [tier3Discount, setTier3Discount] = useState(80);
  const [expiryHours, setExpiryHours] = useState(3);
  
  // Configured Master Image & Custom Uploaded Image
  const [masterImage, setMasterImage] = useState('');
  const [customUploadImage, setCustomUploadImage] = useState(null);
  
  // AI Packaging Sealing Inspection Mode ('SEALED', 'SEMI_SEALED', 'UNSEALED')
  const [packagingState, setPackagingState] = useState('SEALED');
  
  // Thermal & Visual Freshness Parameters
  const [storageTemp, setStorageTemp] = useState('HOT'); // 'HOT', 'ROOM_TEMP', 'CHILLED'
  const [visualFreshness, setVisualFreshness] = useState('FRESH'); // 'FRESH', 'MODERATE', 'RISK_WARNING'
  
  // AI Audit Output States
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Master Menu Items from localStorage / masterMenuService on open
  useEffect(() => {
    if (isOpen) {
      const items = masterMenuService.getMasterMenuItems();
      setMasterMenuItems(items);
      if (items.length > 0) {
        handleSelectMasterMenuItem(items[0]);
      }
    }
  }, [isOpen]);

  const handleSelectMasterMenuItem = (item) => {
    setSelectedMenuId(item.id);
    setFoodName(item.title);
    setBasePrice(item.originalPrice || 500);
    setTier2Discount(item.tier2Discount || 50);
    setTier3Discount(item.tier3Discount || 80);
    setExpiryHours(item.expiryHours || 3);
    setMasterImage(item.demoImage || '');
    setCustomUploadImage(null);
    setScanResult(null);
  };

  const handleDropdownChange = (e) => {
    const id = e.target.value;
    setSelectedMenuId(id);
    const item = masterMenuItems.find(m => m.id === id);
    if (item) {
      handleSelectMasterMenuItem(item);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setCustomUploadImage(uploadEvent.target.result);
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const getActiveDisplayImage = () => {
    return customUploadImage || masterImage || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80';
  };

  const handleRunAiAudit = () => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const matched = masterMenuItems.find(m => m.id === selectedMenuId) || masterMenuItems[0];
      const itemTitle = matched ? matched.title : foodName;

      let baseScore = 100;
      let auditGrade = 'Grade A+ (100% AI Certified)';
      let isApproved = true;
      let sealingMsg = '';
      let tempMsg = '';
      let spoilageMsg = '';

      // 1. Packaging Sealing Impact
      if (packagingState === 'UNSEALED') {
        baseScore -= 60;
        isApproved = false;
        auditGrade = 'Grade F (Failed Audit)';
        sealingMsg = 'Open / Unsealed Container Detected (High Airborne Contamination Risk)';
      } else if (packagingState === 'SEMI_SEALED') {
        baseScore -= 18;
        sealingMsg = `Standard Container Box for "${itemTitle}" (Minor Thermal Air Gap Detected)`;
      } else {
        sealingMsg = `Hermetically Sealed Thermal Packaging Verified for "${itemTitle}" (100% Insulation)`;
      }

      // 2. Thermal Vision Temperature Impact
      if (storageTemp === 'ROOM_TEMP') {
        baseScore -= 12;
        tempMsg = 'Room Temp Storage (25°C) — Accelerated Microbial Window';
      } else if (storageTemp === 'HOT') {
        tempMsg = 'Hot Thermal Storage (62°C+) — Bacterial Activity Suppressed';
      } else {
        tempMsg = 'Regulated Cold Storage (4°C) Verified';
      }

      // 3. Computer Vision Freshness Impact
      if (visualFreshness === 'MODERATE') {
        baseScore -= 8;
        spoilageMsg = 'Slight Surface Moisture Loss Detected (2-4h Batch)';
      } else if (visualFreshness === 'RISK_WARNING') {
        baseScore -= 18;
        spoilageMsg = 'Edge Drying & Color Fading Detected by AI Computer Vision';
      } else {
        spoilageMsg = 'Zero Mold / Zero Discoloration / Perfect Surface Texture Integrity';
      }

      const finalScore = Math.max(38, Math.min(100, baseScore));
      if (finalScore < 60) {
        isApproved = false;
        auditGrade = 'Grade F (Audit Failed)';
      } else if (finalScore >= 95) {
        auditGrade = `Grade A+ (${finalScore}% AI Certified)`;
      } else if (finalScore >= 80) {
        auditGrade = `Grade B (${finalScore}% AI Verified)`;
      } else {
        auditGrade = `Grade C (${finalScore}% Moderate Freshness)`;
      }

      const calculatedNgoMinutes = Math.max(1, Math.round(45 * (finalScore / 100)));

      if (isApproved) {
        setScanResult({
          status: 'APPROVED',
          hygieneScore: finalScore,
          ngoPriorityMinutes: calculatedNgoMinutes,
          grade: auditGrade,
          sealingDetection: sealingMsg,
          temperatureEst: tempMsg,
          spoilageCheck: spoilageMsg,
          expiryRecommendation: `Safe Window: ${expiryHours} Hours Max | NGO Priority: ${calculatedNgoMinutes} Mins (${finalScore}% AI Score)`,
          aiSummary: `Passed AI Computer Vision & Hygiene Audit with ${finalScore}% Freshness Score. Assigned ${calculatedNgoMinutes}-min NGO Priority Window.`
        });
      } else {
        setScanResult({
          status: 'REJECTED',
          hygieneScore: finalScore,
          ngoPriorityMinutes: 0,
          grade: auditGrade,
          sealingDetection: sealingMsg,
          temperatureEst: tempMsg,
          spoilageCheck: spoilageMsg,
          expiryRecommendation: 'Listing Blocked',
          aiSummary: `⚠️ AI Audit Failed (${finalScore}% Score): Food container is improperly sealed or exposed. Safe packaging required.`
        });
      }
    }, 1500);
  };

  const handleCompleteListing = async () => {
    if (!scanResult || scanResult.status !== 'APPROVED' || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const matched = masterMenuItems.find(m => m.id === selectedMenuId);
      const officialMasterImage = matched ? matched.demoImage : (masterImage || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80');

      const payload = {
        foodItemTitle: foodName,
        quantityPortions: portions,
        initialPriceBDT: basePrice,
        tier2DiscountPercent: tier2Discount,
        tier3DiscountPercent: tier3Discount,
        expiryHours: expiryHours,
        imageUrl: officialMasterImage,
        aiScore: scanResult ? scanResult.hygieneScore : 100,
        skipAiAudit: false
      };

      const newListing = await surplusService.createSurplusListing(payload);
      onListingApproved({
        ...newListing,
        image: officialMasterImage
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipAiAudit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const matched = masterMenuItems.find(m => m.id === selectedMenuId);
      const officialMasterImage = matched ? matched.demoImage : (masterImage || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80');

      const payload = {
        foodItemTitle: foodName,
        quantityPortions: portions,
        initialPriceBDT: basePrice,
        tier2DiscountPercent: tier2Discount,
        tier3DiscountPercent: tier3Discount,
        expiryHours: expiryHours,
        imageUrl: officialMasterImage,
        aiScore: 60,
        skipAiAudit: true
      };

      const unverifiedListing = await surplusService.createSurplusListing(payload);
      onListingApproved({
        ...unverifiedListing,
        image: officialMasterImage
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🤖 AI Thermal Vision & Food Safety Audit Engine"
    >
      <div className="ai-audit-modal-content">
        {/* Header Alert Banner */}
        <div className="ai-intro-banner">
          <Sparkles size={22} color="#059669" />
          <div>
            <h4>Automated AI Hygiene & Freshness Inspection</h4>
            <p>Scan food packaging with computer vision to issue an official <strong>AI Safety Seal</strong> before posting surplus food.</p>
          </div>
        </div>

        {/* 1. MASTER MENU ITEM DROPDOWN SELECTOR */}
        <div style={{
          background: '#f0fdf4',
          border: '1.5px solid #86efac',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '16px'
        }}>
          <label className="lbl" style={{ fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Utensils size={16} /> Select Item from Restaurant Master Menu Catalog:
          </label>
          <select 
            className="inp-field" 
            value={selectedMenuId} 
            onChange={handleDropdownChange}
            style={{ fontWeight: 600, background: '#ffffff', borderColor: '#22c55e', color: '#14532d' }}
          >
            {masterMenuItems.map(item => (
              <option key={item.id} value={item.id}>
                📖 {item.title} — Base: ৳{item.originalPrice} (Tier 2: {item.tier2Discount}% off, Tier 3: {item.tier3Discount}% off)
              </option>
            ))}
          </select>
        </div>

        {/* 2. ITEM TITLE & QUANTITY INPUTS */}
        <div className="form-row-grid">
          <div className="form-group">
            <label className="lbl">Selected Food Item Title:</label>
            <input 
              type="text" 
              className="inp-field"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="lbl">Quantity (Portions / Servings):</label>
            <input 
              type="number" 
              className="inp-field"
              value={portions}
              onChange={(e) => setPortions(e.target.value)}
            />
          </div>
        </div>

        {/* 3. BUSINESS OWNER PRICING & TIER DISCOUNT CONTROLS */}
        <div className="business-pricing-card" style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1.5px solid #cbd5e1',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '18px'
        }}>
          <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🏷️ Master Menu Price & Tier Discount Strategy
          </h5>
          <div className="form-row-grid">
            <div className="form-group">
              <label className="lbl" style={{ fontSize: '12px', fontWeight: 600 }}>Original Base Price (BDT ৳):</label>
              <input 
                type="number" 
                className="inp-field"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                placeholder="e.g. 500"
              />
            </div>
            <div className="form-group">
              <label className="lbl" style={{ fontSize: '12px', fontWeight: 600 }}>Total Listing Expiry (Hours):</label>
              <input 
                type="number" 
                className="inp-field"
                value={expiryHours}
                onChange={(e) => setExpiryHours(Number(e.target.value))}
                placeholder="e.g. 3"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '10px' }}>
            <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: '#2563eb', marginBottom: '4px' }}>
                <span>Tier-2 Consumer Sale:</span>
                <span>{tier2Discount}% Off (৳ {Math.round(basePrice * (1 - tier2Discount / 100))})</span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="70" 
                step="5" 
                value={tier2Discount} 
                onChange={(e) => setTier2Discount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
              />
            </div>

            <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: '#dc2626', marginBottom: '4px' }}>
                <span>Tier-3 Flash Clearance:</span>
                <span>{tier3Discount}% Off (৳ {Math.round(basePrice * (1 - tier3Discount / 100))})</span>
              </div>
              <input 
                type="range" 
                min="70" 
                max="90" 
                step="5" 
                value={tier3Discount} 
                onChange={(e) => setTier3Discount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#dc2626', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* 4. FOOD ITEM IMAGE & PACKAGING PHOTO SELECTION */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '18px'
        }}>
          <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            📸 Food Item Image & Packaging Inspection Photo
          </h5>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '110px', height: '100px', borderRadius: '10px', overflow: 'hidden', border: '2px solid #2563eb', flexShrink: 0 }}>
              <img src={getActiveDisplayImage()} alt={foodName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                {customUploadImage ? '📷 Custom Package Photo Uploaded' : '📖 Pre-saved Master Menu Image (Settings Catalog)'}
              </span>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                This image will be shown on the NGO surplus feed and B2C marketplace deal card.
              </p>

              <label style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: '#eff6ff',
                border: '1px solid #93c5fd',
                color: '#1d4ed8',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                <Upload size={14} />
                <span>Upload Current Package Photo (Device Gallery)</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>

              {customUploadImage && (
                <button 
                  type="button" 
                  onClick={() => setCustomUploadImage(null)}
                  style={{ marginLeft: '8px', background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Reset to Settings Image
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 5. DYNAMIC AI COMPUTER VISION PARAMETERS TUNING */}
        <div style={{
          background: '#f8fafc',
          border: '1.5px solid #e2e8f0',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '18px'
        }}>
          <h5 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#0f172a', fontWeight: 700 }}>
            🧪 AI Inspection Controls (Tuning & Testing Parameters)
          </h5>

          {/* Parameter A: Packaging Condition */}
          <div style={{ marginBottom: '12px' }}>
            <label className="lbl" style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>
              📦 Packaging Insulation & Container Seal:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => { setPackagingState('SEALED'); setScanResult(null); }}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: packagingState === 'SEALED' ? '2px solid #10b981' : '1px solid #cbd5e1',
                  background: packagingState === 'SEALED' ? '#f0fdf4' : '#ffffff',
                  color: packagingState === 'SEALED' ? '#166534' : '#475569',
                  cursor: 'pointer'
                }}
              >
                🟢 Sealed Thermal (+0%)
              </button>
              <button 
                type="button"
                onClick={() => { setPackagingState('SEMI_SEALED'); setScanResult(null); }}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: packagingState === 'SEMI_SEALED' ? '2px solid #f59e0b' : '1px solid #cbd5e1',
                  background: packagingState === 'SEMI_SEALED' ? '#fffbeb' : '#ffffff',
                  color: packagingState === 'SEMI_SEALED' ? '#92400e' : '#475569',
                  cursor: 'pointer'
                }}
              >
                🟡 Semi-Lidded (-18%)
              </button>
              <button 
                type="button"
                onClick={() => { setPackagingState('UNSEALED'); setScanResult(null); }}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: packagingState === 'UNSEALED' ? '2px solid #ef4444' : '1px solid #cbd5e1',
                  background: packagingState === 'UNSEALED' ? '#fef2f2' : '#ffffff',
                  color: packagingState === 'UNSEALED' ? '#991b1b' : '#475569',
                  cursor: 'pointer'
                }}
              >
                🔴 Unsealed (-60% Fail)
              </button>
            </div>
          </div>

          {/* Parameter B: Thermal Storage Temperature */}
          <div style={{ marginBottom: '12px' }}>
            <label className="lbl" style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>
              🌡️ Thermal Vision Temperature Storage:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => { setStorageTemp('HOT'); setScanResult(null); }}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: storageTemp === 'HOT' ? '2px solid #059669' : '1px solid #cbd5e1',
                  background: storageTemp === 'HOT' ? '#ecfdf5' : '#ffffff',
                  color: storageTemp === 'HOT' ? '#047857' : '#475569',
                  cursor: 'pointer'
                }}
              >
                ♨️ Hot Storage 62°C (+0%)
              </button>
              <button 
                type="button"
                onClick={() => { setStorageTemp('ROOM_TEMP'); setScanResult(null); }}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: storageTemp === 'ROOM_TEMP' ? '2px solid #f59e0b' : '1px solid #cbd5e1',
                  background: storageTemp === 'ROOM_TEMP' ? '#fffbeb' : '#ffffff',
                  color: storageTemp === 'ROOM_TEMP' ? '#b45309' : '#475569',
                  cursor: 'pointer'
                }}
              >
                🌤️ Room Temp 25°C (-12%)
              </button>
              <button 
                type="button"
                onClick={() => { setStorageTemp('CHILLED'); setScanResult(null); }}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: storageTemp === 'CHILLED' ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                  background: storageTemp === 'CHILLED' ? '#eff6ff' : '#ffffff',
                  color: storageTemp === 'CHILLED' ? '#1d4ed8' : '#475569',
                  cursor: 'pointer'
                }}
              >
                🧊 Chilled 4°C (+0%)
              </button>
            </div>
          </div>

          {/* Parameter C: Visual Surface Freshness */}
          <div>
            <label className="lbl" style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>
              👁️ Computer Vision Visual Surface Texture:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => { setVisualFreshness('FRESH'); setScanResult(null); }}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: visualFreshness === 'FRESH' ? '2px solid #10b981' : '1px solid #cbd5e1',
                  background: visualFreshness === 'FRESH' ? '#f0fdf4' : '#ffffff',
                  color: visualFreshness === 'FRESH' ? '#15803d' : '#475569',
                  cursor: 'pointer'
                }}
              >
                ✨ Fresh Batch (+0%)
              </button>
              <button 
                type="button"
                onClick={() => { setVisualFreshness('MODERATE'); setScanResult(null); }}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: visualFreshness === 'MODERATE' ? '2px solid #f59e0b' : '1px solid #cbd5e1',
                  background: visualFreshness === 'MODERATE' ? '#fffbeb' : '#ffffff',
                  color: visualFreshness === 'MODERATE' ? '#92400e' : '#475569',
                  cursor: 'pointer'
                }}
              >
                ⏳ 2-4h Stored (-8%)
              </button>
              <button 
                type="button"
                onClick={() => { setVisualFreshness('RISK_WARNING'); setScanResult(null); }}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: visualFreshness === 'RISK_WARNING' ? '2px solid #dc2626' : '1px solid #cbd5e1',
                  background: visualFreshness === 'RISK_WARNING' ? '#fef2f2' : '#ffffff',
                  color: visualFreshness === 'RISK_WARNING' ? '#b91c1c' : '#475569',
                  cursor: 'pointer'
                }}
              >
                ⚠️ Edge Drying (-18%)
              </button>
            </div>
          </div>
        </div>

        {/* 6. RUN AI AUDIT BUTTON */}
        <button 
          className="btn-run-ai-scan"
          onClick={handleRunAiAudit}
          disabled={isScanning}
        >
          {isScanning ? (
            <>
              <RefreshCw size={18} className="spin-icon" />
              <span>Scanning Computer Vision Features & Packaging Insulation...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Run AI Vision & Food Safety Inspection ➔</span>
            </>
          )}
        </button>

        {/* Skip AI Test Option */}
        <button 
          className="btn-skip-ai-test"
          onClick={handleSkipAiAudit}
          type="button"
        >
          ⚠️ Skip AI Audit (Post using Saved Master Menu Image directly)
        </button>

        {/* Live AI Scanner Overlay Beam Animation */}
        {isScanning && (
          <div className="ai-scanning-overlay">
            <div className="scan-beam"></div>
            <p className="scan-status-text">Analyzing Thermal Insulation & Packaging Integrity...</p>
          </div>
        )}

        {/* 7. AI SCAN RESULTS OUTPUT BOX */}
        {scanResult && (
          <div className={`ai-results-card ${scanResult.status === 'APPROVED' ? 'res-pass' : 'res-fail'}`}>
            <div className="res-header">
              <div className="score-circle">
                <span className="score-num">{scanResult.hygieneScore}</span>
                <span className="score-lbl">/ 100</span>
              </div>
              <div className="res-meta">
                <h4 className="res-title">
                  {scanResult.status === 'APPROVED' ? (
                    <><CheckCircle2 size={18} color="#059669" /> {scanResult.grade}</>
                  ) : (
                    <><AlertTriangle size={18} color="#ef4444" /> {scanResult.grade}</>
                  )}
                </h4>
                <p className="res-summary">{scanResult.aiSummary}</p>
              </div>
            </div>

            <div className="ai-breakdown-grid">
              <div className="bd-item">
                <ShieldCheck size={16} />
                <span>Sealing Detection: <strong>{scanResult.sealingDetection}</strong></span>
              </div>

              <div className="bd-item">
                <Thermometer size={16} />
                <span>Temp Storage: <strong>{scanResult.temperatureEst}</strong></span>
              </div>

              <div className="bd-item">
                <Clock size={16} />
                <span>Freshness Calculation: <strong>{scanResult.expiryRecommendation}</strong></span>
              </div>
            </div>

            {scanResult.status === 'APPROVED' && (
              <button 
                className="btn-approve-post"
                onClick={handleCompleteListing}
              >
                ✨ Publish AI Certified Listing with Saved Image ➔
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
