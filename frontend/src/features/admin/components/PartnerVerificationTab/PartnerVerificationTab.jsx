import React, { useState } from 'react';
import { 
  ShieldCheck, FileText, CheckCircle2, XCircle, Search, Filter, 
  ExternalLink, Building2, Utensils, AlertCircle, Eye, Download, Check
} from 'lucide-react';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import Modal from '../../../../components/Modal/Modal';

export default function PartnerVerificationTab() {
  const [filterRole, setFilterRole] = useState('ALL'); // 'ALL', 'RESTAURANT', 'NGO'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState('');

  // Pending Applications List
  const [applications, setApplications] = useState([
    {
      id: 'APP-901',
      name: 'Kacchi Bhai Banani',
      type: 'RESTAURANT',
      ownerName: 'Kamrul Islam',
      phone: '+880 1711-234567',
      tradeLicenseNo: 'TL-DHAKA-2026-9042',
      bstiCertNo: 'BSTI-FS-8041',
      appliedDate: '15 Sep 2026',
      address: 'House 42, Road 11, Block D, Banani, Dhaka',
      status: 'PENDING',
      docUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 'APP-902',
      name: 'Bashundhara Child Relief Care',
      type: 'NGO',
      ownerName: 'Dr. Nusrat Jahan',
      phone: '+880 1819-876543',
      tradeLicenseNo: 'NGO-REG-DHAKA-4410',
      bstiCertNo: 'N/A (Shelter Org)',
      appliedDate: '14 Sep 2026',
      address: 'Plot 12, Road 4, Block C, Bashundhara R/A',
      status: 'PENDING',
      docUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 'APP-903',
      name: 'Sultan’s Dine Gulshan',
      type: 'RESTAURANT',
      ownerName: 'Mirza Tanvir',
      phone: '+880 1912-345678',
      tradeLicenseNo: 'TL-DHAKA-2026-1104',
      bstiCertNo: 'BSTI-FS-1190',
      appliedDate: '13 Sep 2026',
      address: 'Circle 2, Gulshan Avenue, Dhaka',
      status: 'PENDING',
      docUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60'
    }
  ]);

  const filteredApps = applications.filter((app) => {
    const matchesRole = filterRole === 'ALL' || app.type === filterRole;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.tradeLicenseNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleInspectDoc = (partner) => {
    setSelectedPartner(partner);
    setIsDocModalOpen(true);
    setActionFeedback('');
  };

  const handleApprovePartner = (id) => {
    setApplications((prev) => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a));
    setActionFeedback('✅ Partner verified & credentials sent via SMS/Email!');
    setTimeout(() => {
      setIsDocModalOpen(false);
    }, 1500);
  };

  const handleRejectPartner = (id) => {
    setApplications((prev) => prev.map(a => a.id === id ? { ...a, status: 'REJECTED' } : a));
    setActionFeedback('❌ Partner application rejected. Re-submission link sent.');
    setTimeout(() => {
      setIsDocModalOpen(false);
    }, 1500);
  };

  return (
    <div className="tab-pane-partner-verification">
      {/* HEADER CONTROLS */}
      <div className="verification-controls-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by Partner Name or Trade License No..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-button-group">
          <button 
            className={`filter-btn ${filterRole === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterRole('ALL')}
          >
            All Applications ({applications.length})
          </button>
          <button 
            className={`filter-btn ${filterRole === 'RESTAURANT' ? 'active' : ''}`}
            onClick={() => setFilterRole('RESTAURANT')}
          >
            🏪 Restaurants
          </button>
          <button 
            className={`filter-btn ${filterRole === 'NGO' ? 'active' : ''}`}
            onClick={() => setFilterRole('NGO')}
          >
            🏢 NGOs & Shelters
          </button>
        </div>
      </div>

      {/* MASTER VERIFICATION TABLE */}
      <div className="admin-table-container">
        <table className="admin-master-table">
          <thead>
            <tr>
              <th>APPLICATION ID</th>
              <th>PARTNER ORGANISATION</th>
              <th>TYPE</th>
              <th>TRADE LICENSE NO</th>
              <th>APPLIED DATE</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.id}</strong></td>
                <td>
                  <div className="partner-cell-name">
                    <strong>{item.name}</strong>
                    <span className="sub-addr">{item.address}</span>
                  </div>
                </td>
                <td>
                  <span className={`type-badge ${item.type.toLowerCase()}`}>
                    {item.type === 'RESTAURANT' ? '🏪 Restaurant' : '🏢 NGO Shelter'}
                  </span>
                </td>
                <td><code>{item.tradeLicenseNo}</code></td>
                <td>{item.appliedDate}</td>
                <td>
                  <span className={`status-pill ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => handleInspectDoc(item)}
                  >
                    <Eye size={14} /> Inspect Docs
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: DOCUMENT INSPECTOR & VERIFICATION DOSSIER */}
      <Modal 
        isOpen={isDocModalOpen} 
        onClose={() => setIsDocModalOpen(false)}
        title="🛡️ Partner Verification Dossier"
      >
        {selectedPartner && (
          <div className="dossier-modal-body">
            <div className="dossier-header-card">
              <div className="dossier-title-row">
                <h4>{selectedPartner.name}</h4>
                <span className={`type-badge ${selectedPartner.type.toLowerCase()}`}>
                  {selectedPartner.type}
                </span>
              </div>
              <p className="dossier-sub">{selectedPartner.address}</p>
            </div>

            <div className="dossier-info-grid">
              <div className="d-info-item">
                <span>Owner Name:</span>
                <strong>{selectedPartner.ownerName}</strong>
              </div>
              <div className="d-info-item">
                <span>Phone Number:</span>
                <strong>{selectedPartner.phone}</strong>
              </div>
              <div className="d-info-item">
                <span>Trade License No:</span>
                <code>{selectedPartner.tradeLicenseNo}</code>
              </div>
              <div className="d-info-item">
                <span>BSTI Food Safety Cert:</span>
                <code>{selectedPartner.bstiCertNo}</code>
              </div>
            </div>

            <div className="doc-preview-box">
              <div className="doc-box-title">
                <FileText size={16} /> Uploaded Trade License Document Preview
              </div>
              <img 
                src={selectedPartner.docUrl} 
                alt="Trade License Document" 
                className="doc-preview-img"
              />
            </div>

            {actionFeedback && (
              <div className="action-feedback-notice">
                {actionFeedback}
              </div>
            )}

            {selectedPartner.status === 'PENDING' && (
              <div className="dossier-action-bar">
                <button 
                  className="btn-reject-partner"
                  onClick={() => handleRejectPartner(selectedPartner.id)}
                >
                  ❌ Reject Application
                </button>
                <button 
                  className="btn-approve-partner"
                  onClick={() => handleApprovePartner(selectedPartner.id)}
                >
                  ✅ Approve & Issue API Credentials
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
