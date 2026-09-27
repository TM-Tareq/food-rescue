// src/components/PartnerApplicationModal/PartnerApplicationModal.jsx
import React, { useState } from 'react';
import { 
  Store, Building2, Bike, Shield, FileCheck, Upload, AlertCircle, 
  CheckCircle2, ArrowRight, ArrowLeft, Clock, Info, ExternalLink, Hash, Award
} from 'lucide-react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import Badge from '../Badge/Badge';
import { partnerApplicationService } from '../../services/partnerApplicationService';
import './PartnerApplicationModal.css';

export default function PartnerApplicationModal({ isOpen, onClose, initialRole = 'RESTAURANT', onSubmitted }) {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(initialRole);

  // Common Form Fields
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Restaurant Specific
  const [tradeLicenseNo, setTradeLicenseNo] = useState('');
  const [tinNo, setTinNo] = useState('');
  const [bstiCertNo, setBstiCertNo] = useState('');
  const [bankAccount, setBankAccount] = useState('');

  // NGO Specific
  const [ngoRegNo, setNgoRegNo] = useState('');
  const [taxExemptNo, setTaxExemptNo] = useState('');
  const [dailyCapacity, setDailyCapacity] = useState('500 Meals / Day');
  const [coveredLocations, setCoveredLocations] = useState('');

  // Rider Specific
  const [nidNo, setNidNo] = useState('');
  const [drivingLicenseNo, setDrivingLicenseNo] = useState('');
  const [vehicleType, setVehicleType] = useState('Motorbike');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Document Upload State (Real Base64 Data URLs)
  const [uploadedDocFiles, setUploadedDocFiles] = useState([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Receipt State
  const [submittedReceipt, setSubmittedReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      // Skip role selection (step 1) and go directly to the form (step 2)
      // since the role is already determined from where the user clicked
      setStep(2);
      setSelectedRole(initialRole.toUpperCase());
      setSubmittedReceipt(null);
      setUploadedDocFiles([]);
      setAgreedToTerms(false);
    }
  }, [isOpen, initialRole]);

  const handleDocFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedDocFiles((prev) => [
          ...prev,
          {
            name: file.name,
            url: event.target.result,
            size: (file.size / 1024).toFixed(1) + ' KB'
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveDocFile = (indexToRemove) => {
    setUploadedDocFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const defaultDocUrl = selectedRole === 'RESTAURANT' 
      ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60'
      : selectedRole === 'NGO'
      ? 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=60'
      : 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=60';

    const finalDocsList = uploadedDocFiles.length > 0 
      ? uploadedDocFiles 
      : [{ name: 'Default_Verification_Doc.jpg', url: defaultDocUrl, size: '420 KB' }];

    let rolePayload = {
      type: selectedRole,
      name: name || (selectedRole === 'RESTAURANT' ? 'Kacchi Express' : selectedRole === 'NGO' ? 'Humanity Food Bank' : ownerName),
      ownerName: ownerName || 'Tanvir Ahmed',
      email: email || `applicant.${Date.now()}@partner.com`,
      phone: phone || '01700000000',
      address: address || 'Dhaka, Bangladesh',
      uploadedDocs: finalDocsList,
      docUrl: finalDocsList[0].url,
      uploadedDocName: finalDocsList.map(d => d.name).join(', ')
    };

    if (selectedRole === 'RESTAURANT') {
      rolePayload = {
        ...rolePayload,
        tradeLicenseNo: tradeLicenseNo || `TL-DHAKA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        tinNo: tinNo || 'TIN-8841-9920',
        bstiCertNo: bstiCertNo || 'BSTI-SAN-4029',
        bankAccount: bankAccount || 'Dutch Bangla Bank Ltd (A/C #1102948120)'
      };
    } else if (selectedRole === 'NGO') {
      rolePayload = {
        ...rolePayload,
        ngoRegNo: ngoRegNo || `NGO-BUREAU-REG-${Math.floor(1000 + Math.random() * 9000)}`,
        taxExemptNo: taxExemptNo || 'TAX-EXEMPT-8819',
        dailyCapacity: dailyCapacity,
        coveredLocations: coveredLocations || 'Mohakhali Slum, Banani Railgate, Tejgaon'
      };
    } else {
      rolePayload = {
        ...rolePayload,
        nidNo: nidNo || `NID-1995-${Math.floor(100000 + Math.random() * 900000)}`,
        drivingLicenseNo: drivingLicenseNo || `DL-DHAKA-${Math.floor(10000 + Math.random() * 90000)}`,
        vehicleType: vehicleType,
        emergencyContact: emergencyContact || 'Father (+880 1819-001122)'
      };
    }

    // Small delay for UX spinner, then await the async submit (IndexedDB save)
    await new Promise(r => setTimeout(r, 600));
    const receipt = await partnerApplicationService.submitApplication(rolePayload);
    setSubmittedReceipt(receipt);
    setIsSubmitting(false);
    setStep(4); // Receipt Step
    if (onSubmitted) onSubmitted(receipt);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="partner-app-modal">
      {step < 4 ? (
        <>
          {/* HEADER & WIZARD PROGRESS */}
          <div className="partner-app-header">
            <div className="partner-app-badge-row">
              <span className="app-badge-pill">
                <Shield size={14} /> Govt & Food Safety Verification Standard
              </span>
              <span className="role-selected-pill">
                {selectedRole === 'RESTAURANT' ? '🏪 Restaurant Owner' : selectedRole === 'NGO' ? '🏢 NGO / Shelter Home' : '🚴 Delivery Rider'}
              </span>
            </div>
            <h2 className="partner-app-title">Partner Registration & Legal Verification Application</h2>
            <p className="partner-app-sub">
              Direct self-signup is disabled. All Food Rescue partners must undergo Super Admin audit per Foodpanda, Uber & NGO Bureau guidelines.
            </p>

            {/* STEP WIZARD BAR - 2 steps, role is pre-determined */}
            <div className="partner-app-steps">
              <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                <span className="step-num">1</span>
                <span className="step-name">Legal Documents</span>
              </div>
              <div className="step-line" />
              <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                <span className="step-num">2</span>
                <span className="step-name">Audit Review</span>
              </div>
            </div>
          </div>

          {/* STEP 1 ROLE SELECTION REMOVED - role is pre-selected from click */}
          {step === 1 && (
            <div className="partner-app-body">
              <label className="form-label-section">Select Enterprise Role Type:</label>
              <div className="role-cards-selection">
                <div 
                  className={`role-select-card ${selectedRole === 'RESTAURANT' ? 'selected' : ''}`}
                  onClick={() => setSelectedRole('RESTAURANT')}
                >
                  <div className="role-icon-circle orange">
                    <Store size={22} />
                  </div>
                  <div className="role-card-info">
                    <h4>🏪 Restaurant Owner / Hotel</h4>
                    <p>Requires Trade License, E-TIN, and BSTI / City Corporation Sanitation Clearance Certificate.</p>
                  </div>
                </div>

                <div 
                  className={`role-select-card ${selectedRole === 'NGO' ? 'selected' : ''}`}
                  onClick={() => setSelectedRole('NGO')}
                >
                  <div className="role-icon-circle green">
                    <Building2 size={22} />
                  </div>
                  <div className="role-card-info">
                    <h4>🏢 Registered NGO / Shelter Home</h4>
                    <p>Requires NGO Affairs Bureau Reg No / Social Services Dept Registration & Fleet Audit.</p>
                  </div>
                </div>

                <div 
                  className={`role-select-card ${selectedRole === 'RIDER' ? 'selected' : ''}`}
                  onClick={() => setSelectedRole('RIDER')}
                >
                  <div className="role-icon-circle blue">
                    <Bike size={22} />
                  </div>
                  <div className="role-card-info">
                    <h4>🚴 Delivery Rider / Volunteer Fleet</h4>
                    <p>Requires NID / Smartcard, Driving License (for motorized vehicles), & Live Selfie Match.</p>
                  </div>
                </div>
              </div>

              <div className="step-action-bar">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" icon={ArrowRight} onClick={() => setStep(2)}>
                  Continue to Information & Documents
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: LEGAL INFORMATION & DOCUMENT UPLOAD */}
          {step === 2 && (
            <div className="partner-app-body">
              <div className="form-section-title">
                <FileCheck size={16} /> Basic & Contact Information
              </div>
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">
                    {selectedRole === 'RESTAURANT' ? 'Restaurant Brand Name *' : selectedRole === 'NGO' ? 'NGO / Shelter Home Name *' : 'Rider Full Name *'}
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder={selectedRole === 'RESTAURANT' ? 'e.g. Sultan’s Dine Gulshan' : selectedRole === 'NGO' ? 'e.g. Anjuman Shelter' : 'e.g. Tanvir Ahmed'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Authorized Contact Person / Owner Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Kamrul Islam"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Official Work Email *</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="partner@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Mobile Number (+880) *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="01712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Physical Street Address / Operating Location *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. House 42, Road 11, Block D, Banani, Dhaka"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              {/* DYNAMIC ROLE FIELDS */}
              <div className="form-section-title" style={{ marginTop: '16px' }}>
                <Award size={16} /> Legal Registration & Verification Credentials
              </div>

              {selectedRole === 'RESTAURANT' && (
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="form-label">Trade License Number (ট্রেড লাইসেন্স) *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="TL-DHAKA-2026-XXXX"
                      value={tradeLicenseNo}
                      onChange={(e) => setTradeLicenseNo(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">E-TIN / BIN Number *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="TIN-8890-XXXX"
                      value={tinNo}
                      onChange={(e) => setTinNo(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">BSTI / Food Sanitation Cert No *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="BSTI-FS-XXXX"
                      value={bstiCertNo}
                      onChange={(e) => setBstiCertNo(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bank Account / bKash Merchant No *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Bank A/C / bKash Merchant Number"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {selectedRole === 'NGO' && (
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="form-label">NGO Affairs Bureau Reg No (এনজিও ব্যুরো) *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="NGO-REG-DHAKA-XXXX"
                      value={ngoRegNo}
                      onChange={(e) => setNgoRegNo(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tax Exemption Cert No *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="TAX-EXEMPT-XXXX"
                      value={taxExemptNo}
                      onChange={(e) => setTaxExemptNo(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Daily Meal Rescue & Distribution Capacity *</label>
                    <select 
                      className="form-input" 
                      value={dailyCapacity}
                      onChange={(e) => setDailyCapacity(e.target.value)}
                    >
                      <option value="300 Meals / Day">300 Meals / Day</option>
                      <option value="500 Meals / Day">500 Meals / Day</option>
                      <option value="1,000+ Meals / Day">1,000+ Meals / Day</option>
                      <option value="2,500+ Meals / Day (Large Hub)">2,500+ Meals / Day (Large Hub)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target Coverage Hubs / Slum Areas *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Korail Slum, Mohakhali, Kuril"
                      value={coveredLocations}
                      onChange={(e) => setCoveredLocations(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {selectedRole === 'RIDER' && (
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="form-label">National ID (NID) Number *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="NID-199X-XXXX-XXXX"
                      value={nidNo}
                      onChange={(e) => setNidNo(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Driving License Number (If motorized) *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="DL-DHAKA-XXXXXX"
                      value={drivingLicenseNo}
                      onChange={(e) => setDrivingLicenseNo(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Vehicle Type *</label>
                    <select 
                      className="form-input" 
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                    >
                      <option value="Motorbike">Motorbike (Bike Express)</option>
                      <option value="Bicycle">Bicycle (Eco Volunteer)</option>
                      <option value="Scooter">Scooter / Electric Bike</option>
                      <option value="Pickup Van">Pickup Van (Bulk Transport)</option>
                      <option value="Pedestrian">Pedestrian (On-Foot Rescue)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Emergency Contact Person & Phone *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Father (+880 1711-XXXXXX)"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* DOCUMENT FILE UPLOAD DROPBOX */}
              <div className="form-section-title" style={{ marginTop: '16px' }}>
                <Upload size={16} /> Legal Document Attachment & Inspection Dossier
              </div>

              <div className="doc-upload-dropzone">
                <input 
                  type="file" 
                  id="partner-doc-input" 
                  multiple
                  accept="image/*,.pdf"
                  style={{ display: 'none' }}
                  onChange={handleDocFileUpload}
                />
                <label htmlFor="partner-doc-input" className="doc-upload-label">
                  <Upload size={28} className="upload-icon-pulse" />
                  <div>
                    <strong>Click or Drag to Upload Exact Scans / Photos (Images / PDF)</strong>
                    <p className="sub-hint">
                      {selectedRole === 'RESTAURANT' ? 'Attach Trade License, BSTI Certificate & Owner NID.' : selectedRole === 'NGO' ? 'Attach Govt NGO Bureau License & ED Authorization Letter.' : 'Attach NID Front/Back, Driving License & Live Selfie.'}
                    </p>
                  </div>
                </label>

                {uploadedDocFiles.length > 0 && (
                  <div className="uploaded-docs-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', marginTop: '12px' }}>
                    {uploadedDocFiles.map((doc, idx) => (
                      <div key={idx} className="doc-thumbnail-card" style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', background: '#1e1e1e' }}>
                        <img 
                          src={doc.url} 
                          alt={doc.name} 
                          style={{ width: '100%', height: '80px', objectFit: 'cover' }} 
                        />
                        <div style={{ padding: '4px 6px', fontSize: '10px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {doc.name}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDocFile(idx)}
                          style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.85)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '11px', lineHeight: '1' }}
                          title="Remove file"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="step-action-bar">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" icon={ArrowRight} onClick={() => setStep(3)}>
                  Review Application
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & AUDIT AGREEMENT */}
          {step === 3 && (
            <div className="partner-app-body">
              <div className="review-summary-card">
                <h3>📋 Application Summary Dossier</h3>
                <div className="review-grid">
                  <div className="review-item">
                    <span>Role Applied:</span>
                    <strong className="role-tag-pill">{selectedRole}</strong>
                  </div>
                  <div className="review-item">
                    <span>Name / Entity:</span>
                    <strong>{name || 'Kacchi Express / Partner'}</strong>
                  </div>
                  <div className="review-item">
                    <span>Contact Person:</span>
                    <strong>{ownerName || 'Kamrul Islam'}</strong>
                  </div>
                  <div className="review-item">
                    <span>Email:</span>
                    <strong>{email || 'partner@organization.com'}</strong>
                  </div>
                  <div className="review-item">
                    <span>Phone:</span>
                    <strong>{phone || '01712345678'}</strong>
                  </div>
                  <div className="review-item">
                    <span>Operating Address:</span>
                    <strong>{address || 'Banani, Dhaka'}</strong>
                  </div>
                  <div className="review-item">
                    <span>Legal Reg / License No:</span>
                    <code>{tradeLicenseNo || ngoRegNo || nidNo || 'TL-DHAKA-2026-8819'}</code>
                  </div>
                  <div className="review-item">
                    <span>Doc Attachment:</span>
                    <span className="file-attached-pill">
                      {uploadedDocFiles.length > 0 
                        ? uploadedDocFiles.map(d => d.name).join(', ') 
                        : 'Legal_Verification_Docs.pdf'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="terms-checkbox-box">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  <span>
                    I certify under penalty of account blacklisting that all legal trade licenses, government NGO registrations, NID documents, and food sanitation credentials uploaded are authentic and valid under Bangladesh Law. I understand Food Rescue Super Admin will verify these documents before account activation.
                  </span>
                </label>
              </div>

              <div className="step-action-bar">
                <Button variant="secondary" icon={ArrowLeft} onClick={() => setStep(2)}>Back</Button>
                <Button 
                  variant="primary" 
                  icon={CheckCircle2} 
                  disabled={!agreedToTerms || isSubmitting}
                  onClick={handleSubmitApplication}
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application to Super Admin'}
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* STEP 4: RECEIPT & STATUS TRACKING */
        <div className="partner-app-body receipt-body">
          <div className="receipt-success-card">
            <div className="receipt-icon-badge">
              <Clock size={36} color="#3b82f6" />
            </div>
            <h2 className="receipt-title">Application Submitted to Verification Desk</h2>
            <p className="receipt-sub">
              Your partner registration application is now pending audit by Food Rescue Super Admin. Direct self-activation is disabled for safety compliance.
            </p>

            <div className="receipt-details-box">
              <div className="receipt-row">
                <span>Application Tracking Code:</span>
                <strong className="tracking-code"><code>{submittedReceipt?.id}</code></strong>
              </div>
              <div className="receipt-row">
                <span>Application Status:</span>
                <span className="status-pill pending">PENDING_ADMIN_VERIFICATION</span>
              </div>
              <div className="receipt-row">
                <span>Applied Entity:</span>
                <strong>{submittedReceipt?.name} ({submittedReceipt?.type})</strong>
              </div>
              <div className="receipt-row">
                <span>Verification ETA:</span>
                <strong>24 - 48 Hours</strong>
              </div>
            </div>

            <div className="receipt-notice-banner">
              <Info size={16} />
              <span>
                Super Admin will audit your uploaded Trade License / NGO Bureau Reg / NID documents. Once approved, login credentials will be issued directly to <strong>{submittedReceipt?.email}</strong>.
              </span>
            </div>

            <Button variant="primary" fullWidth onClick={onClose} style={{ marginTop: '20px' }}>
              Close Receipt & Return to Platform
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
