import React, { useState } from 'react';
import { Zap, Building2, Clock, ShieldAlert, Check } from 'lucide-react';
import Modal from '../../../../components/Modal/Modal';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import './DispatchOptionModal.css';

/**
 * Dispatch & Broadcast Choice Modal
 * Allows donors to choose between Normal/Preferred NGO Assignment vs Emergency Open Broadcast
 */
export default function DispatchOptionModal({ isOpen, onClose, selectedItem }) {
  const [selectedChoice, setSelectedChoice] = useState('EMERGENCY'); // 'EMERGENCY' or 'PREFERRED'
  const [selectedNgo, setSelectedNgo] = useState('101');
  const [fallbackEnabled, setFallbackEnabled] = useState(true);

  if (!isOpen) return null;

  const mockNgos = [
    { id: '101', name: 'Anjuman Orphanage Shelter', distance: '1.2 km', capacity: '150 meals' },
    { id: '102', name: 'Dhaka Community Food Bank', distance: '2.5 km', capacity: '300 meals' }
  ];

  const handleConfirmDispatch = (e) => {
    e.preventDefault();
    const itemTitle = selectedItem?.title || 'Selected Surplus Food';

    if (selectedChoice === 'EMERGENCY') {
      alert(`⚡ EMERGENCY BROADCAST SENT!\n\nItem: "${itemTitle}"\n\nNotification sent to ALL nearby NGOs & Volunteers within 5 km radius for instant pickup!`);
    } else {
      const ngoName = mockNgos.find(n => n.id === selectedNgo)?.name || 'Selected NGO';
      alert(`🤝 PREFERRED NGO DISPATCH SENT!\n\nItem: "${itemTitle}"\nAssigned to: ${ngoName}\nFallback 15-min Auto Switch: ${fallbackEnabled ? 'ENABLED' : 'DISABLED'}`);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="dispatch-modal">
      <div className="dispatch-header">
        <div className="header-badge-icon">
          <Zap size={22} />
        </div>
        <div>
          <h2 className="dispatch-title">Broadcast & Dispatch Options</h2>
          <p className="dispatch-sub">
            Choose how you want to route <strong>{selectedItem?.title || 'surplus food'}</strong>.
          </p>
        </div>
      </div>

      <form onSubmit={handleConfirmDispatch} className="dispatch-form">
        {/* Choice Selection Grid */}
        <div className="choice-cards-grid">
          {/* Choice 1: Emergency Open Broadcast */}
          <div
            className={`choice-card ${selectedChoice === 'EMERGENCY' ? 'choice-active active-emergency' : ''}`}
            onClick={() => setSelectedChoice('EMERGENCY')}
          >
            <div className="choice-top">
              <span className="choice-pill red-pill">
                <Zap size={14} /> Instant Alert
              </span>
              <div className="radio-circle">{selectedChoice === 'EMERGENCY' && <Check size={12} />}</div>
            </div>
            <h3 className="choice-title">🚨 Emergency Open Broadcast</h3>
            <p className="choice-desc">
              Sends an immediate notification to <strong>ALL nearby NGOs & Volunteers</strong> within radius for first-come, first-served instant pickup.
            </p>
          </div>

          {/* Choice 2: Preferred NGO Selection */}
          <div
            className={`choice-card ${selectedChoice === 'PREFERRED' ? 'choice-active active-preferred' : ''}`}
            onClick={() => setSelectedChoice('PREFERRED')}
          >
            <div className="choice-top">
              <span className="choice-pill green-pill">
                <Building2 size={14} /> Preferred NGO
              </span>
              <div className="radio-circle">{selectedChoice === 'PREFERRED' && <Check size={12} />}</div>
            </div>
            <h3 className="choice-title">🤝 Preferred NGO Assignment</h3>
            <p className="choice-desc">
              Routes this food item specifically to your chosen partner orphanage/shelter with optional safety fallback.
            </p>
          </div>
        </div>

        {/* Preferred NGO Details & Fallback Option */}
        {selectedChoice === 'PREFERRED' && (
          <div className="preferred-ngo-section">
            <label className="section-label">Select Partner NGO</label>
            <div className="ngo-options-list">
              {mockNgos.map((ngo) => (
                <div
                  key={ngo.id}
                  className={`ngo-option-item ${selectedNgo === ngo.id ? 'ngo-item-selected' : ''}`}
                  onClick={() => setSelectedNgo(ngo.id)}
                >
                  <input type="radio" checked={selectedNgo === ngo.id} onChange={() => {}} />
                  <div>
                    <span className="ngo-option-name">{ngo.name}</span>
                    <span className="ngo-option-sub">{ngo.distance} away • Cap: {ngo.capacity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Fallback Option */}
            <div className="fallback-toggle-box">
              <div className="fallback-header">
                <Clock size={16} />
                <span>15-Minute Fallback Auto-Switch</span>
                <input
                  type="checkbox"
                  checked={fallbackEnabled}
                  onChange={(e) => setFallbackEnabled(e.target.checked)}
                />
              </div>
              <p className="fallback-desc">
                If the preferred NGO doesn't accept within 15 minutes, automatically switch to Emergency Open Broadcast so no food is wasted.
              </p>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="dispatch-actions">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={selectedChoice === 'EMERGENCY' ? 'orange' : 'primary'}
            size="lg"
            icon={selectedChoice === 'EMERGENCY' ? ShieldAlert : Building2}
          >
            {selectedChoice === 'EMERGENCY' ? 'Send Emergency Broadcast to All' : 'Assign to Preferred NGO'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
