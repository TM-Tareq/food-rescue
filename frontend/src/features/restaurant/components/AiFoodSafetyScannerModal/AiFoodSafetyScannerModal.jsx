import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShieldCheck, Camera, CheckCircle2, AlertTriangle, 
  Thermometer, Clock, Leaf, RefreshCw, Upload, FileCheck, Utensils
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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  
  // Business Owner Pricing & Discount Timer Settings
  const [basePrice, setBasePrice] = useState(500);
  const [tier2Discount, setTier2Discount] = useState(50); // Default 50%
  const [tier3Discount, setTier3Discount] = useState(80); // Default 80%
  const [expiryHours, setExpiryHours] = useState(3);      // Default 3 Hours
  const [activeDemoImage, setActiveDemoImage] = useState('');
  
  // AI Audit States
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Load Master Menu Items from localStorage / masterMenuService on mount/open
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
    setActiveDemoImage(item.demoImage || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80');
  };

  const handleDropdownChange = (e) => {
    const id = e.target.value;
    setSelectedMenuId(id);
    const item = masterMenuItems.find(m => m.id === id);
    if (item) {
      handleSelectMasterMenuItem(item);
    }
  };

  // Sample Food Package Images for AI Vision Audit
  const samplePhotos = [
    {
      title: 'Sealed Thermal Pack (Demo Saved Image)',
      url: activeDemoImage || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
      quality: 'pass'
    },
    {
      title: 'Sealed Thermal Foil Pack (Recommended)',
      url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=500&q=80',
      quality: 'pass'
    },
    {
      title: 'Unsealed Open Container (Fails Audit)',
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
      quality: 'fail'
    }
  ];

  const handleRunAiAudit = () => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const chosenPhoto = samplePhotos[selectedPhotoIndex];

      // Auto-match menu item if needed
      const matched = masterMenuItems.find(m => m.id === selectedMenuId) || masterMenuItems[0];

      if (chosenPhoto.quality === 'pass') {
        setScanResult({
          status: 'APPROVED',
          hygieneScore: 98,
          grade: 'Grade A+ (Certified)',
          sealingDetection: `Hermetically Sealed Thermal Container for "${matched ? matched.title : foodName}" (99.4% Confidence)`,
          temperatureEst: 'Hot Storage (62°C+) • Freshly Cooked',
          spoilageCheck: 'Zero Mold / Zero Discoloration Detected',
          expiryRecommendation: 'Safe Window: 45 Mins Max for High Temperature',
          aiSummary: `Passed AI Thermal Vision & Hygiene Standards. Matched with Master Menu Item "${matched ? matched.title : foodName}". High-res pre-saved demo image linked.`
        });
      } else {
        setScanResult({
          status: 'REJECTED',
          hygieneScore: 42,
          grade: 'Grade F (Failed)',
          sealingDetection: 'Open / Unsealed Food Pack Detected (High Risk)',
          temperatureEst: 'Ambient Unregulated Storage',
          spoilageCheck: 'Potential Exposure to Foreign Contaminants',
          expiryRecommendation: 'Listing Blocked',
          aiSummary: '⚠️ AI Audit Failed: Food must be properly covered and sealed in thermal packaging before listing.'
        });
      }
    }, 1800);
  };

  const handleCompleteListing = async () => {
    if (!scanResult || scanResult.status !== 'APPROVED') return;

    const matched = masterMenuItems.find(m => m.id === selectedMenuId);
    const finalImage = matched ? matched.demoImage : (samplePhotos[selectedPhotoIndex].url || activeDemoImage);

    const payload = {
      foodItemTitle: foodName,
      quantityPortions: portions,
      initialPriceBDT: basePrice,
      tier2DiscountPercent: tier2Discount,
      tier3DiscountPercent: tier3Discount,
      expiryHours: expiryHours,
      imageUrl: finalImage,
      skipAiAudit: false
    };

    const newListing = await surplusService.createSurplusListing(payload);
    onListingApproved({
      ...newListing,
      image: finalImage
    });
    onClose();
  };

  const handleSkipAiAudit = async () => {
    const matched = masterMenuItems.find(m => m.id === selectedMenuId);
    const finalImage = matched ? matched.demoImage : (samplePhotos[selectedPhotoIndex].url || activeDemoImage);

    const payload = {
      foodItemTitle: foodName,
      quantityPortions: portions,
      initialPriceBDT: basePrice,
      tier2DiscountPercent: tier2Discount,
      tier3DiscountPercent: tier3Discount,
      expiryHours: expiryHours,
      imageUrl: finalImage,
      skipAiAudit: true
    };

    const unverifiedListing = await surplusService.createSurplusListing(payload);
    onListingApproved({
      ...unverifiedListing,
      image: finalImage
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🤖 AI Thermal Vision & Master Menu Surplus Food Engine"
    >
      <div className="ai-audit-modal-content">
        {/* Header Alert Banner */}
        <div className="ai-intro-banner">
          <Sparkles size={22} color="#059669" />
          <div>
            <h4>Automated AI Hygiene & Master Menu Matching</h4>
            <p>Select an item from your <strong>Settings Master Menu Catalog</strong> or scan raw photos to auto-populate high-res demo pictures and tier pricing.</p>
          </div>
        </div>

        {/* MASTER MENU DROPDOWN SELECTOR */}
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

        {/* Form Inputs */}
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

        {/* Business Owner Pricing & Discount Strategy Controls */}
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

        {/* Photo Selection Grid for AI Audit */}
        <div className="photo-selection-section">
          <label className="lbl">Select Packaging Photo / Demo Picture for AI Inspection:</label>
          <div className="photo-thumbs-grid">
            {samplePhotos.map((photo, idx) => (
              <div 
                key={idx} 
                className={`thumb-card ${selectedPhotoIndex === idx ? 'thumb-active' : ''}`}
                onClick={() => { setSelectedPhotoIndex(idx); setScanResult(null); }}
              >
                <img src={photo.url} alt={photo.title} className="thumb-img" />
                <span className="thumb-caption">{photo.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Run AI Audit Button */}
        <button 
          className="btn-run-ai-scan"
          onClick={handleRunAiAudit}
          disabled={isScanning}
        >
          {isScanning ? (
            <>
              <RefreshCw size={18} className="spin-icon" />
              <span>Scanning Computer Vision & Matching Master Menu...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Run AI Vision & Master Menu Verification ➔</span>
            </>
          )}
        </button>

        {/* Skip AI Test Option */}
        <button 
          className="btn-skip-ai-test"
          onClick={handleSkipAiAudit}
          type="button"
        >
          ⚠️ Skip AI Audit (Post using Saved Master Menu Demo Image directly)
        </button>

        {/* Live AI Scanner Overlay Beam Animation */}
        {isScanning && (
          <div className="ai-scanning-overlay">
            <div className="scan-beam"></div>
            <p className="scan-status-text">Matching Item with Master Menu Catalog & Inspecting Sealing Integrity...</p>
          </div>
        )}

        {/* AI Scan Results Output Box */}
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
                ✨ Publish AI Certified Listing with Saved Master Image ➔
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
