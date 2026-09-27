import React, { useState } from 'react';
import { Store, Building2, Bike, Shield, ArrowRight, Lock, User, Phone, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import Modal from '../../../../components/Modal/Modal';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import PartnerApplicationModal from '../../../../components/PartnerApplicationModal/PartnerApplicationModal';
import { useAuth } from '../../../../context/AuthContext';
import { authService } from '../../../../services/authService';
import './PartnerAuthModal.css';

export default function PartnerAuthModal({ isOpen, onClose, initialRole = 'restaurant', mode = 'signin', onAuthSuccess }) {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [isLoginMode, setIsLoginMode] = useState(mode === 'signin');
  const [isPartnerAppOpen, setIsPartnerAppOpen] = useState(false);
  
  // Registration & Login Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authStatusMessage, setAuthStatusMessage] = useState(null);

  const { login } = useAuth();

  // Sync initial props when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedRole(initialRole);
      setIsLoginMode(mode === 'signin');
      setAuthStatusMessage(null);
    }
  }, [isOpen, initialRole, mode]);

  // Handle email typing to auto-select registered role tab
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    
    if (val.trim()) {
      const detectedRole = authService.getRegisteredRoleForEmail(val.trim());
      if (detectedRole) {
        setSelectedRole(detectedRole.toLowerCase());
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthStatusMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const knownRole = authService.getRegisteredRoleForEmail(cleanEmail);

    try {
      let activeRole = (knownRole || selectedRole).toLowerCase();

      if (!isLoginMode) {
        // --- CONSUMER SELF-REGISTRATION FLOW WITH STRICT VALIDATION ---
        if (!fullName || fullName.trim().length < 2) {
          throw new Error('Please enter your full name (at least 2 characters).');
        }
        if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
          throw new Error('Please enter a valid email address.');
        }
        if (!password || password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        if (!phone || phone.trim().length < 10) {
          throw new Error('Please enter a valid phone number (at least 10 digits).');
        }

        const registerData = {
          name: fullName.trim(),
          email: cleanEmail,
          password: password,
          role: selectedRole.toUpperCase(),
          phone: phone.trim(),
          address: 'Dhaka, Bangladesh'
        };

        const res = await authService.register(registerData);
        activeRole = (res.role || selectedRole).toLowerCase();
        
        const registeredUser = {
          id: res.userId || Date.now(),
          name: res.name || fullName.trim(),
          email: res.email || cleanEmail,
          role: activeRole.toUpperCase(),
          avatar: '🛍️'
        };

        login(registeredUser, res.jwtAccessToken || 'jwt-registered-token-2026');
        setAuthStatusMessage({ type: 'success', text: `✅ Account created successfully for ${fullName.trim()}!` });

        setTimeout(() => {
          setIsLoading(false);
          if (onAuthSuccess) {
            onAuthSuccess(activeRole, registeredUser, 'register');
          }
          onClose();
        }, 400);

      } else {
        // --- REAL LOGIN FLOW ---
        const res = await authService.login(cleanEmail, password, selectedRole.toUpperCase());
        activeRole = (res.role || knownRole || selectedRole).toLowerCase();

        const loggedInUser = {
          id: res.userId || Date.now(),
          name: res.name || res.fullName || cleanEmail.split('@')[0],
          email: res.email || cleanEmail,
          role: activeRole.toUpperCase(),
          avatar: activeRole === 'restaurant' ? '👨‍🍳' : activeRole === 'ngo' ? '🏠' : activeRole === 'volunteer' ? '🛵' : activeRole === 'consumer' ? '🛍️' : '🛡️'
        };

        login(loggedInUser, res.jwtAccessToken || 'jwt-login-token-2026');
        setAuthStatusMessage({ type: 'success', text: `✅ Authenticated successfully as ${activeRole.toUpperCase()}!` });

        setTimeout(() => {
          setIsLoading(false);
          if (onAuthSuccess) {
            onAuthSuccess(activeRole, loggedInUser, 'login');
          }
          onClose();
        }, 400);
      }

    } catch (err) {
      console.warn('Auth Error:', err);
      setIsLoading(false);
      const errorMessage = err.message || 'Invalid email or password. Access denied.';
      setAuthStatusMessage({ type: 'error', text: `${errorMessage}` });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        {/* Modal Header */}
        <div className="modal-header">
          <Badge icon={Lock} theme="fresh" className="modal-badge-pill">
            Verified Role Access Gateway
          </Badge>
          <h2 className="modal-title">
            {isLoginMode ? 'Sign In to Portal' : 'Partner Application Portal'}
          </h2>
          <p className="modal-sub">
            {isLoginMode 
              ? 'Sign in with your approved credentials to access your dedicated dashboard.' 
              : 'Direct self-signup is restricted for enterprise roles (Foodpanda / NGO Bureau standard).'}
          </p>
        </div>

        {/* Role Selector — ONLY shown in Sign-In mode */}
        {isLoginMode ? (
          <div className="role-selector-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            <button
              type="button"
              className={`role-tab ${selectedRole === 'restaurant' ? 'role-active orange-active' : ''}`}
              onClick={() => setSelectedRole('restaurant')}
            >
              <Store size={18} />
              <span>Restaurant</span>
            </button>

            <button
              type="button"
              className={`role-tab ${selectedRole === 'ngo' ? 'role-active green-active' : ''}`}
              onClick={() => setSelectedRole('ngo')}
            >
              <Building2 size={18} />
              <span>NGO</span>
            </button>

            <button
              type="button"
              className={`role-tab ${selectedRole === 'volunteer' ? 'role-active dark-active' : ''}`}
              onClick={() => setSelectedRole('volunteer')}
            >
              <Bike size={18} />
              <span>Volunteer</span>
            </button>

            <button
              type="button"
              className={`role-tab ${selectedRole === 'consumer' ? 'role-active orange-active' : ''}`}
              onClick={() => setSelectedRole('consumer')}
            >
              <Store size={18} />
              <span>Consumer</span>
            </button>

            <button
              type="button"
              className={`role-tab ${selectedRole === 'admin' ? 'role-active blue-active' : ''}`}
              onClick={() => setSelectedRole('admin')}
            >
              <Shield size={18} />
              <span>Admin</span>
            </button>
          </div>
        ) : (
          /* REGISTER MODE: Show locked role badge — no switching allowed */
          <div className="locked-role-indicator">
            <div className="locked-role-badge">
              {selectedRole === 'restaurant' && <><Store size={18} /> <span>Restaurant Owner</span></>}
              {selectedRole === 'ngo' && <><Building2 size={18} /> <span>NGO / Shelter Home</span></>}
              {selectedRole === 'volunteer' && <><Bike size={18} /> <span>Delivery Rider / Volunteer</span></>}
              {selectedRole === 'consumer' && <><Store size={18} /> <span>Consumer</span></>}
              {selectedRole === 'admin' && <><Shield size={18} /> <span>Admin</span></>}
            </div>
            <span className="locked-role-hint">
              <Lock size={12} /> Role selected from your entry point
            </span>
          </div>
        )}

        {/* Status Feedback Notification */}
        {authStatusMessage && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: authStatusMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: authStatusMessage.type === 'success' ? '#15803d' : '#b91c1c',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {authStatusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{authStatusMessage.text}</span>
          </div>
        )}

        {/* IF REGISTER MODE & ENTERPRISE ROLE -> SHOW RESTRICTED NOTICE CARD */}
        {!isLoginMode && selectedRole !== 'consumer' ? (
          <div className="enterprise-restricted-card">
            <div className="restricted-badge">
              <Shield size={16} /> Direct Self-Registration Disabled
            </div>
            <h4>Govt Trade License & Verification Audit Required</h4>
            <p>
              In compliance with Foodpanda, Uber, and Bangladesh NGO Affairs Bureau standards, <strong>{selectedRole.toUpperCase()}</strong> accounts cannot be created directly without Super Admin document verification.
            </p>
            <div className="restricted-action-row">
              <Button 
                type="button" 
                variant="primary" 
                fullWidth 
                icon={FileText}
                onClick={() => {
                  onClose();
                  setIsPartnerAppOpen(true);
                }}
              >
                📝 Submit Partner Application & Upload Documents
              </Button>
            </div>
          </div>
        ) : (
          /* REGULAR LOGIN OR CONSUMER SIGNUP FORM */
          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLoginMode && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Tanvir Hossain"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. user@domain.com"
                required
                value={email}
                onChange={handleEmailChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isLoginMode && (
              <div className="form-group">
                <label className="form-label">Contact Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 01712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" fullWidth icon={ArrowRight} disabled={isLoading}>
              {isLoading 
                ? 'Authenticating...' 
                : isLoginMode 
                  ? `Sign In as ${selectedRole.toUpperCase()}` 
                  : `Register Consumer Account`}
            </Button>
          </form>
        )}

        {/* Mode Toggle Footer */}
        <div className="modal-toggle-footer">
          <span>{isLoginMode ? "Need a new account or partner access?" : "Already an approved partner?"}</span>
          <button
            type="button"
            className="btn-toggle-mode"
            onClick={() => {
              const nextMode = !isLoginMode;
              setIsLoginMode(nextMode);
              setAuthStatusMessage(null);
            }}
          >
            {isLoginMode ? 'Register / Apply Here' : 'Sign In Here'}
          </button>
        </div>
      </Modal>

      {/* PARTNER APPLICATION MODAL */}
      <PartnerApplicationModal 
        isOpen={isPartnerAppOpen}
        onClose={() => setIsPartnerAppOpen(false)}
        initialRole={selectedRole.toUpperCase()}
      />
    </>
  );
}

