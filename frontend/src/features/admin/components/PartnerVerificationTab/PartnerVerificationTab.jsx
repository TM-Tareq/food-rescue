// src/features/admin/components/PartnerVerificationTab/PartnerVerificationTab.jsx
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, FileText, CheckCircle2, XCircle, Search, Filter, 
  ExternalLink, Building2, Utensils, AlertCircle, Eye, Download, Check,
  Bike, Store, Award, Clock, RefreshCw, MessageSquare
} from 'lucide-react';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import Modal from '../../../../components/Modal/Modal';
import { partnerApplicationService } from '../../../../services/partnerApplicationService';
import './PartnerVerificationTab.css';

export default function PartnerVerificationTab() {
  const [filterRole, setFilterRole] = useState('ALL'); // 'ALL', 'RESTAURANT', 'NGO', 'RIDER'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [actionFeedback, setActionFeedback] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // Applications loaded from central partnerApplicationService
  const [applications, setApplications] = useState([]);

  const loadApps = () => {
    const data = partnerApplicationService.getApplications();
    setApplications(data);
  };

  useEffect(() => {
    loadApps();
    const handleUpdate = () => loadApps();
    window.addEventListener('partner_applications_updated', handleUpdate);
    return () => window.removeEventListener('partner_applications_updated', handleUpdate);
  }, []);

  const filteredApps = applications.filter((app) => {
    const matchesRole = filterRole === 'ALL' || app.type === filterRole;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (app.tradeLicenseNo && app.tradeLicenseNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (app.ngoRegNo && app.ngoRegNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (app.nidNo && app.nidNo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const handleInspectDoc = async (partner) => {
    // Merge IndexedDB docs back into the partner record for display
    const partnerWithDocs = await partnerApplicationService.getApplicationWithDocs(partner.id);
    setSelectedPartner(partnerWithDocs || partner);
    setIsDocModalOpen(true);
    setActionFeedback('');
    setRejectReason('');
    setIsRejecting(false);
  };

  const handleApprovePartner = (id) => {
    const updated = partnerApplicationService.updateApplicationStatus(id, 'APPROVED');
    setApplications(updated);
    setActionFeedback('✅ Partner legal documents verified! Credentials & Portal API Key sent via SMS/Email.');
    setTimeout(() => {
      setIsDocModalOpen(false);
    }, 1800);
  };

  const handleConfirmReject = (id) => {
    const reason = rejectReason || 'Trade License / NID verification failed audit standards.';
    const updated = partnerApplicationService.updateApplicationStatus(id, 'REJECTED', reason);
    setApplications(updated);
    setActionFeedback(`❌ Application rejected. Notification sent to partner.`);
    setTimeout(() => {
      setIsDocModalOpen(false);
      setIsRejecting(false);
    }, 1800);
  };

  const handleRequestRevision = (id) => {
    const updated = partnerApplicationService.updateApplicationStatus(id, 'NEEDS_REVISION', 'Please upload a clearer image of Trade License and NID.');
    setApplications(updated);
    setActionFeedback('🔄 Revision request sent to applicant.');
    setTimeout(() => {
      setIsDocModalOpen(false);
    }, 1800);
  };

  return (
    <div className="tab-pane-partner-verification">
      {/* HEADER SUMMARY CARDS */}
      <div className="verification-stats-grid">
        <div className="v-stat-card">
          <div className="v-stat-icon orange"><Store size={20} /></div>
          <div>
            <span className="v-stat-label">Pending Restaurants</span>
            <strong className="v-stat-val">{applications.filter(a => a.type === 'RESTAURANT' && a.status === 'PENDING').length}</strong>
          </div>
        </div>

        <div className="v-stat-card">
          <div className="v-stat-icon green"><Building2 size={20} /></div>
          <div>
            <span className="v-stat-label">Pending NGOs / Shelters</span>
            <strong className="v-stat-val">{applications.filter(a => a.type === 'NGO' && a.status === 'PENDING').length}</strong>
          </div>
        </div>

        <div className="v-stat-card">
          <div className="v-stat-icon blue"><Bike size={20} /></div>
          <div>
            <span className="v-stat-label">Pending Riders</span>
            <strong className="v-stat-val">{applications.filter(a => a.type === 'RIDER' && a.status === 'PENDING').length}</strong>
          </div>
        </div>

        <div className="v-stat-card">
          <div className="v-stat-icon purple"><ShieldCheck size={20} /></div>
          <div>
            <span className="v-stat-label">Verified Partners</span>
            <strong className="v-stat-val">{applications.filter(a => a.status === 'APPROVED').length}</strong>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="verification-controls-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by Partner Name, Trade License, NGO Reg, NID..."
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
            🏢 NGOs
          </button>
          <button 
            className={`filter-btn ${filterRole === 'RIDER' ? 'active' : ''}`}
            onClick={() => setFilterRole('RIDER')}
          >
            🚴 Riders
          </button>
        </div>
      </div>

      {/* MASTER VERIFICATION TABLE */}
      <div className="admin-table-container">
        <table className="admin-master-table">
          <thead>
            <tr>
              <th>APP ID</th>
              <th>PARTNER / ENTITY</th>
              <th>ROLE TYPE</th>
              <th>GOVT LICENSE / REG / NID NO</th>
              <th>APPLIED DATE</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No partner applications match the selected filter.
                </td>
              </tr>
            ) : (
              filteredApps.map((item) => (
                <tr key={item.id}>
                  <td><code>{item.id}</code></td>
                  <td>
                    <div className="partner-cell-name">
                      <strong>{item.name}</strong>
                      <span className="sub-addr">{item.ownerName} • {item.address}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`type-badge ${item.type.toLowerCase()}`}>
                      {item.type === 'RESTAURANT' ? '🏪 Restaurant' : item.type === 'NGO' ? '🏢 NGO Shelter' : '🚴 Volunteer Rider'}
                    </span>
                  </td>
                  <td>
                    <code>{item.tradeLicenseNo || item.ngoRegNo || item.nidNo || 'REG-PENDING'}</code>
                  </td>
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
                      <Eye size={14} /> Inspect Dossier
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL: DOCUMENT INSPECTOR & VERIFICATION DOSSIER */}
      <Modal 
        isOpen={isDocModalOpen} 
        onClose={() => setIsDocModalOpen(false)}
        title="🛡️ Super Admin Partner Verification Dossier"
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

            {/* DYNAMIC ROLE DETAILS GRID */}
            <div className="dossier-info-grid">
              <div className="d-info-item">
                <span>Contact Person:</span>
                <strong>{selectedPartner.ownerName}</strong>
              </div>
              <div className="d-info-item">
                <span>Mobile Phone:</span>
                <strong>{selectedPartner.phone}</strong>
              </div>
              <div className="d-info-item">
                <span>Official Email:</span>
                <strong>{selectedPartner.email}</strong>
              </div>
              <div className="d-info-item">
                <span>Application ID:</span>
                <code>{selectedPartner.id}</code>
              </div>

              {selectedPartner.type === 'RESTAURANT' && (
                <>
                  <div className="d-info-item">
                    <span>Trade License No:</span>
                    <code>{selectedPartner.tradeLicenseNo}</code>
                  </div>
                  <div className="d-info-item">
                    <span>E-TIN / BIN No:</span>
                    <code>{selectedPartner.tinNo || 'TIN-8890-1249'}</code>
                  </div>
                  <div className="d-info-item">
                    <span>BSTI Food Safety Cert:</span>
                    <code>{selectedPartner.bstiCertNo || 'BSTI-FS-8041'}</code>
                  </div>
                  <div className="d-info-item">
                    <span>Bank Settlement A/C:</span>
                    <strong>{selectedPartner.bankAccount || 'City Bank Ltd'}</strong>
                  </div>
                </>
              )}

              {selectedPartner.type === 'NGO' && (
                <>
                  <div className="d-info-item">
                    <span>NGO Bureau Reg No:</span>
                    <code>{selectedPartner.ngoRegNo}</code>
                  </div>
                  <div className="d-info-item">
                    <span>Tax Exemption Cert:</span>
                    <code>{selectedPartner.taxExemptNo || 'TAX-EXEMPT-2026'}</code>
                  </div>
                  <div className="d-info-item">
                    <span>Daily Food Capacity:</span>
                    <strong>{selectedPartner.dailyCapacity || '1,200 Meals / Day'}</strong>
                  </div>
                  <div className="d-info-item">
                    <span>Coverage Hubs:</span>
                    <strong>{selectedPartner.coveredLocations || 'Mohakhali, Korail'}</strong>
                  </div>
                </>
              )}

              {selectedPartner.type === 'RIDER' && (
                <>
                  <div className="d-info-item">
                    <span>National ID (NID):</span>
                    <code>{selectedPartner.nidNo}</code>
                  </div>
                  <div className="d-info-item">
                    <span>Driving License No:</span>
                    <code>{selectedPartner.drivingLicenseNo || 'DL-DHAKA-889124'}</code>
                  </div>
                  <div className="d-info-item">
                    <span>Vehicle Type:</span>
                    <strong>{selectedPartner.vehicleType || 'Motorbike'}</strong>
                  </div>
                  <div className="d-info-item">
                    <span>Emergency Contact:</span>
                    <strong>{selectedPartner.emergencyContact || 'Family'}</strong>
                  </div>
                </>
              )}
            </div>

            {/* DOCUMENT SCANS GALLERY & LIGHTBOX PREVIEW */}
            <div className="doc-preview-box">
              <div className="doc-box-title">
                <FileText size={16} /> Uploaded Legal Document Attachments (
                {selectedPartner.uploadedDocs && selectedPartner.uploadedDocs.length > 0
                  ? selectedPartner.uploadedDocs.length
                  : selectedPartner.uploadedDocsCount || 1} File Scans)
              </div>

              {/* CASE 1: Real uploaded docs with Base64 data (loaded from sessionStorage) */}
              {selectedPartner.uploadedDocs && selectedPartner.uploadedDocs.length > 0 ? (
                <div className="admin-doc-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginTop: '10px' }}>
                  {selectedPartner.uploadedDocs.map((docItem, dIdx) => (
                    <div 
                      key={dIdx} 
                      className="admin-doc-card"
                      style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', background: '#1a1a1a', cursor: 'pointer', transition: 'transform 0.2s' }}
                      onClick={() => setLightboxImg(docItem.url)}
                    >
                      <img 
                        src={docItem.url} 
                        alt={docItem.name} 
                        style={{ width: '100%', height: '140px', objectFit: 'cover' }} 
                      />
                      <div style={{ padding: '8px 10px', fontSize: '11px', color: '#60a5fa', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{docItem.name}</span>
                        <Eye size={12} />
                      </div>
                    </div>
                  ))}
                </div>

              /* CASE 2: Metadata only (docs in sessionStorage expired / different tab) */
              ) : selectedPartner.uploadedDocsMeta && selectedPartner.uploadedDocsMeta.length > 0 ? (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)', marginBottom: '10px', fontSize: '12px', color: '#f59e0b' }}>
                    ⚠️ Document previews are session-bound. Files uploaded in the same browser session can be previewed. Below are the submitted filenames:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedPartner.uploadedDocsMeta.map((meta, mIdx) => (
                      <div key={mIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', fontSize: '12px', color: '#60a5fa' }}>
                        <FileText size={13} />
                        <span>{meta.name}</span>
                        <span style={{ color: '#6b7280', fontSize: '11px' }}>({meta.size})</span>
                      </div>
                    ))}
                  </div>
                </div>

              /* CASE 3: Single demo doc URL fallback */
              ) : (
                <div 
                  className="admin-doc-card"
                  style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', background: '#1a1a1a', cursor: 'pointer', marginTop: '10px' }}
                  onClick={() => setLightboxImg(selectedPartner.docUrl)}
                >
                  <img 
                    src={selectedPartner.docUrl} 
                    alt="Verification Scan" 
                    className="doc-preview-img"
                    style={{ width: '100%', maxHeight: '280px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '8px 12px', fontSize: '12px', color: '#60a5fa', textAlign: 'center', fontWeight: 600 }}>
                    🔍 Click image to enlarge full document scan
                  </div>
                </div>
              )}
            </div>


            {actionFeedback && (
              <div className="action-feedback-notice">
                {actionFeedback}
              </div>
            )}

            {/* REJECTION REASON INPUT FIELD */}
            {isRejecting && (
              <div className="rejection-reason-box">
                <label className="form-label">Specify Rejection Reason (Sent to Applicant):</label>
                <textarea
                  className="form-input"
                  rows="2"
                  placeholder="e.g. Trade license photo is blurry / NGO Bureau registration number is invalid."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <Button size="sm" variant="secondary" onClick={() => setIsRejecting(false)}>Cancel</Button>
                  <Button size="sm" variant="primary" style={{ background: '#ef4444' }} onClick={() => handleConfirmReject(selectedPartner.id)}>
                    Confirm Rejection
                  </Button>
                </div>
              </div>
            )}

            {/* ADMIN ACTIONS BAR */}
            {selectedPartner.status === 'PENDING' && !isRejecting && (
              <div className="dossier-action-bar">
                <button 
                  className="btn-reject-partner"
                  onClick={() => setIsRejecting(true)}
                >
                  <XCircle size={16} /> Reject Application
                </button>
                <button 
                  className="btn-revision-partner"
                  onClick={() => handleRequestRevision(selectedPartner.id)}
                >
                  <RefreshCw size={16} /> Request Revision
                </button>
                <button 
                  className="btn-approve-partner"
                  onClick={() => handleApprovePartner(selectedPartner.id)}
                >
                  <CheckCircle2 size={16} /> Approve & Issue Credentials
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* FULLSIZE ENLARGED LIGHTBOX MODAL */}
      <Modal
        isOpen={!!lightboxImg}
        onClose={() => setLightboxImg(null)}
        title="🔍 Document Scan Lightbox Inspection"
      >
        {lightboxImg && (
          <div style={{ textAlignment: 'center', padding: '10px' }}>
            <img 
              src={lightboxImg} 
              alt="Enlarged Document Scan" 
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)' }}
            />
            <div style={{ marginTop: '14px', textAlignment: 'right' }}>
              <Button variant="secondary" onClick={() => setLightboxImg(null)}>Close Lightbox Preview</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
