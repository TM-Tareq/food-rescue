import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, Camera, CheckCircle2, AlertTriangle, 
  Thermometer, Clock, Leaf, RefreshCw, Upload, FileCheck
} from 'lucide-react';
import Modal from '../../../../components/Modal/Modal';
import Button from '../../../../components/Button/Button';
import './AiFoodSafetyScannerModal.css';

export default function AiFoodSafetyScannerModal({
  isOpen,
  onClose,
  onListingApproved
}) {
  const [foodName, setFoodName] = useState('Royal Mutton Kacchi Biryani');
  const [portions, setPortions] = useState(25);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  
  // AI Audit States
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Sample Food Package Images for AI Vision Audit
  const samplePhotos = [
    {
      title: 'Sealed Thermal Foil Pack (Recommended)',
      url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=500&q=80',
      quality: 'pass'
    },
    {
      title: 'Bakery Box (Covered)',
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
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

      if (chosenPhoto.quality === 'pass') {
        setScanResult({
          status: 'APPROVED',
          hygieneScore: 98,
          grade: 'Grade A+ (Certified)',
          sealingDetection: 'Hermetically Sealed Thermal Container (99.4% Confidence)',
          temperatureEst: 'Hot Storage (62°C+) • Freshly Cooked',
          spoilageCheck: 'Zero Mold / Zero Discoloration Detected',
          expiryRecommendation: 'Safe Window: 45 Mins Max for High Temperature',
          aiSummary: 'Passed AI Thermal Vision & Hygiene Standards. Safe for immediate NGO dispatch or B2C surplus sale.'
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
    }, 2000);
  };

  const handleCompleteListing = () => {
    if (!scanResult || scanResult.status !== 'APPROVED') return;

    const newListing = {
      id: Date.now(),
      name: foodName,
      sub: 'AI Vision Certified (Grade A+)',
      image: samplePhotos[selectedPhotoIndex].url,
      quantity: `${portions} Portions`,
      temp: 'Hot (60°C+)',
      expiry: 'Expires in 45m',
      expiryType: 'urgent',
      status: 'Matching NGO...',
      statusType: 'pending'
    };

    onListingApproved(newListing);
    onClose();
  };

  const handleSkipAiAudit = () => {
    const unverifiedListing = {
      id: Date.now(),
      name: foodName,
      sub: '⚠️ Manual Unverified (On-Site Rider Photo Inspection Required)',
      image: samplePhotos[selectedPhotoIndex].url,
      quantity: `${portions} Portions (Max 5)`,
      temp: 'Unverified Temp',
      expiry: 'Expires in 30m',
      expiryType: 'warning',
      status: 'Awaiting Rider Verification',
      statusType: 'pending'
    };

    onListingApproved(unverifiedListing);
    onClose();
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
            <p>Scan food packaging with computer vision to issue an official <strong>AI Safety Seal</strong> before posting.</p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="form-row-grid">
          <div className="form-group">
            <label className="lbl">Food Item Title:</label>
            <input 
              type="text" 
              className="inp-field"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="lbl">Quantity (Portions):</label>
            <input 
              type="number" 
              className="inp-field"
              value={portions}
              onChange={(e) => setPortions(e.target.value)}
            />
          </div>
        </div>

        {/* Photo Selection Grid for AI Audit */}
        <div className="photo-selection-section">
          <label className="lbl">Select Packaging Photo for AI Inspection:</label>
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
              <span>Scanning Computer Vision Features...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Run AI Vision & Freshness Inspection ➔</span>
            </>
          )}
        </button>

        {/* Skip AI Test Option */}
        <button 
          className="btn-skip-ai-test"
          onClick={handleSkipAiAudit}
          type="button"
        >
          ⚠️ Skip AI Audit (Post as Manual Unverified - Requires On-Site Rider Photo)
        </button>

        {/* Live AI Scanner Overlay Beam Animation */}
        {isScanning && (
          <div className="ai-scanning-overlay">
            <div className="scan-beam"></div>
            <p className="scan-status-text">Analyzing Thermal Insulation & Packaging Integrity...</p>
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
                ✨ Publish AI Certified Listing ➔
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
