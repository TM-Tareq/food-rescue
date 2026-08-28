import React, { useState } from 'react';
import { Store, Building2, Bike, Shield, ArrowRight, Lock } from 'lucide-react';
import Modal from '../../../../components/Modal/Modal';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import './PartnerAuthModal.css';

export default function PartnerAuthModal({ isOpen, onClose, initialRole = 'restaurant', mode = 'signin' }) {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [isLoginMode, setIsLoginMode] = useState(mode === 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`[${isLoginMode ? 'Sign In' : 'Sign Up'}] Role: ${selectedRole.toUpperCase()} - Email: ${email}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Modal Header */}
      <div className="modal-header">
        <Badge icon={Lock} theme="fresh" className="modal-badge-pill">
          Partner Access Portal
        </Badge>
        <h2 className="modal-title">
          {isLoginMode ? 'Partner Sign In' : 'Create Partner Account'}
        </h2>
        <p className="modal-sub">
          Select your operational role to access your dedicated dashboard.
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="role-selector-grid">
        <button
          type="button"
          className={`role-tab ${selectedRole === 'restaurant' ? 'role-active orange-active' : ''}`}
          onClick={() => setSelectedRole('restaurant')}
        >
          <Store size={20} />
          <span>Restaurant</span>
        </button>

        <button
          type="button"
          className={`role-tab ${selectedRole === 'ngo' ? 'role-active green-active' : ''}`}
          onClick={() => setSelectedRole('ngo')}
        >
          <Building2 size={20} />
          <span>NGO</span>
        </button>

        <button
          type="button"
          className={`role-tab ${selectedRole === 'volunteer' ? 'role-active dark-active' : ''}`}
          onClick={() => setSelectedRole('volunteer')}
        >
          <Bike size={20} />
          <span>Volunteer</span>
        </button>

        <button
          type="button"
          className={`role-tab ${selectedRole === 'admin' ? 'role-active blue-active' : ''}`}
          onClick={() => setSelectedRole('admin')}
        >
          <Shield size={20} />
          <span>Admin</span>
        </button>
      </div>

      {/* Auth Form */}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Work Email / Phone</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. partner@organization.org"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <Button type="submit" variant="primary" size="lg" fullWidth icon={ArrowRight}>
          {isLoginMode ? `Sign In as ${selectedRole.toUpperCase()}` : `Register as ${selectedRole.toUpperCase()}`}
        </Button>
      </form>

      {/* Mode Toggle Footer */}
      <div className="modal-toggle-footer">
        <span>{isLoginMode ? "Don't have a partner account?" : "Already registered?"}</span>
        <button
          type="button"
          className="btn-toggle-mode"
          onClick={() => setIsLoginMode(!isLoginMode)}
        >
          {isLoginMode ? 'Register New Account' : 'Sign In Here'}
        </button>
      </div>
    </Modal>
  );
}
