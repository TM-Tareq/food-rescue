import React, { useState } from 'react';
import { 
  Truck, Navigation, UserCheck, ShieldAlert, RefreshCw, PhoneCall, 
  MapPin, CheckCircle2, Clock, Zap, ArrowRight, UserX
} from 'lucide-react';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import Modal from '../../../../components/Modal/Modal';

export default function LogisticsTowerTab() {
  const [selectedMission, setSelectedMission] = useState(null);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [reassignSuccess, setReassignSuccess] = useState('');

  // Fleet Rider Summary Counters
  const fleetCounters = {
    totalRiders: 310,
    onlineRiders: 84,
    onMissionRiders: 34,
    idleRiders: 50
  };

  // Active Missions
  const [activeMissions, setActiveMissions] = useState([
    {
      id: 'RESCUE-8091',
      riderName: 'Tanvir Hossain',
      riderPhone: '+880 1711-987654',
      riderRating: '4.9 ⭐',
      donor: 'Star Kabab Banani',
      shelter: 'Anjuman Orphanage Shelter',
      food: '35x Biryani Packages',
      status: 'EN_ROUTE_PICKUP',
      eta: '8 mins'
    },
    {
      id: 'RESCUE-8092',
      riderName: 'Shakil Ahmed',
      riderPhone: '+880 1819-445566',
      riderRating: '4.8 ⭐',
      donor: 'Kacchi Bhai Banani',
      shelter: 'Chhoto Moni Nibash Tejgaon',
      food: '20x Polao Boxes',
      status: 'EN_ROUTE_DELIVERY',
      eta: '14 mins'
    },
    {
      id: 'RESCUE-8093',
      riderName: 'Farhan Kabir',
      riderPhone: '+880 1912-778899',
      riderRating: '5.0 ⭐',
      donor: 'Dhakaiya Mezban Gulshan',
      shelter: 'Shanti Old Age Home',
      food: '15x Beef Packages',
      status: 'PICKED_UP',
      eta: '22 mins'
    }
  ]);

  const handleOpenReassign = (mission) => {
    setSelectedMission(mission);
    setIsReassignModalOpen(true);
    setReassignSuccess('');
  };

  const handleConfirmReassign = (newRiderName) => {
    setActiveMissions((prev) => prev.map(m => m.id === selectedMission.id ? { ...m, riderName: newRiderName } : m));
    setReassignSuccess(`✅ Mission ${selectedMission.id} reassigned to ${newRiderName}!`);
    setTimeout(() => {
      setIsReassignModalOpen(false);
    }, 1500);
  };

  return (
    <div className="tab-pane-logistics-tower">
      {/* FLEET STATUS COUNTERS */}
      <div className="fleet-counters-grid">
        <div className="fleet-stat-card">
          <span className="stat-label">TOTAL REGISTERED RIDERS</span>
          <span className="stat-num">{fleetCounters.totalRiders}</span>
          <span className="stat-sub">Dhaka Metropolitan Fleet</span>
        </div>

        <div className="fleet-stat-card green">
          <span className="stat-label">ONLINE FOR RESCUES</span>
          <span className="stat-num">{fleetCounters.onlineRiders}</span>
          <span className="stat-sub">🟢 Active Duty</span>
        </div>

        <div className="fleet-stat-card blue">
          <span className="stat-label">RIDERS ON LIVE MISSIONS</span>
          <span className="stat-num">{fleetCounters.onMissionRiders}</span>
          <span className="stat-sub">🚚 Delivering Food</span>
        </div>

        <div className="fleet-stat-card amber">
          <span className="stat-label">IDLE & READY RIDERS</span>
          <span className="stat-num">{fleetCounters.idleRiders}</span>
          <span className="stat-sub">⚡ Available for Auto-Dispatch</span>
        </div>
      </div>

      {/* ACTIVE MISSIONS MASTER TABLE */}
      <div className="admin-table-container">
        <div className="table-header-title">
          <h4>Active Rescue Missions ({activeMissions.length})</h4>
          <span className="live-pulse">● LIVE DISPATCH RADAR</span>
        </div>

        <table className="admin-master-table">
          <thead>
            <tr>
              <th>MISSION ID</th>
              <th>ASSIGNED RIDER</th>
              <th>PICKUP DONOR</th>
              <th>DELIVERY DESTINATION</th>
              <th>FOOD ITEM</th>
              <th>ESTIMATED ETA</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {activeMissions.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.id}</strong></td>
                <td>
                  <div className="rider-cell-box">
                    <strong>{item.riderName}</strong>
                    <span className="sub-phone">{item.riderPhone} ({item.riderRating})</span>
                  </div>
                </td>
                <td>🏪 {item.donor}</td>
                <td>🏠 {item.shelter}</td>
                <td>{item.food}</td>
                <td><span className="eta-badge">⏳ {item.eta}</span></td>
                <td>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => handleOpenReassign(item)}
                  >
                    <RefreshCw size={14} /> Re-assign Rider
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: RIDER RE-ASSIGNMENT */}
      <Modal 
        isOpen={isReassignModalOpen} 
        onClose={() => setIsReassignModalOpen(false)}
        title="🚚 Re-assign Volunteer Rider"
      >
        {selectedMission && (
          <div className="reassign-modal-body">
            <div className="mission-mini-summary">
              <h5>Mission: {selectedMission.id}</h5>
              <p>Food: {selectedMission.food} • Pickup: {selectedMission.donor}</p>
              <p>Current Rider: <strong>{selectedMission.riderName}</strong></p>
            </div>

            <h5>Select Nearby Idle Rider:</h5>
            <div className="idle-riders-stack">
              <div className="idle-rider-option" onClick={() => handleConfirmReassign('Rakibul Hasan (0.2km away)')}>
                <div className="r-avatar">👨‍🌾</div>
                <div>
                  <strong>Rakibul Hasan</strong>
                  <p>⭐ 4.9 Rating • 0.2 km from donor</p>
                </div>
                <Button size="sm" variant="primary">Select & Assign</Button>
              </div>

              <div className="idle-rider-option" onClick={() => handleConfirmReassign('Mehedi Hasan (0.5km away)')}>
                <div className="r-avatar">🚴</div>
                <div>
                  <strong>Mehedi Hasan (Bicycle)</strong>
                  <p>⭐ 4.8 Rating • 0.5 km from donor</p>
                </div>
                <Button size="sm" variant="primary">Select & Assign</Button>
              </div>
            </div>

            {reassignSuccess && (
              <div className="action-feedback-notice">
                {reassignSuccess}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
