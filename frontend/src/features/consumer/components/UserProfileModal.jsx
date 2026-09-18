import React, { useState } from 'react';
import { User, Phone, MapPin, Award, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/Button/Button';

export default function UserProfileModal({
  isOpen,
  onClose,
  userInfo,
  onUpdateUserInfo
}) {
  const [name, setName] = useState(userInfo.name || 'Farhan Ahmed');
  const [phone, setPhone] = useState(userInfo.phone || '+880 1712-345678');
  const [address, setAddress] = useState(userInfo.address || 'House 42, Road 11, Block D, Banani, Dhaka');
  const [avatarEmoji, setAvatarEmoji] = useState(userInfo.avatarEmoji || '👨‍💼');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const avatarOptions = ['👨‍💼', '👩‍💻', '👨‍🌾', '🦸‍♂️', '👑', '🥑', '🌱'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUserInfo({
      name,
      phone,
      address,
      avatarEmoji
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="👤 Edit Consumer Profile & Settings"
    >
      <form onSubmit={handleSubmit} className="user-profile-form">
        {/* Avatar Picker */}
        <div className="avatar-picker-section">
          <label className="input-lbl">Choose Your Avatar Emoji:</label>
          <div className="avatar-options-grid">
            {avatarOptions.map((emoji) => (
              <button
                type="button"
                key={emoji}
                className={`avatar-opt-btn ${avatarEmoji === emoji ? 'active-opt' : ''}`}
                onClick={() => setAvatarEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Name Input */}
        <div className="form-group-field">
          <label className="input-lbl">Full Name:</label>
          <input
            type="text"
            className="text-input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Phone Input */}
        <div className="form-group-field">
          <label className="input-lbl">Mobile Phone (bKash / SMS Alerts):</label>
          <input
            type="text"
            className="text-input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {/* Default Delivery Address */}
        <div className="form-group-field">
          <label className="input-lbl">Default Takeaway / Delivery Address:</label>
          <textarea
            className="textarea-field"
            rows="2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Member Level Stats Banner */}
        <div className="profile-level-banner">
          <Award size={20} color="#059669" />
          <div>
            <strong>Level 3 • Food Saver Hero</strong>
            <p>Saved ৳4,500 BDT • 28 Surplus Meals Rescued</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="save-success-toast">
            <CheckCircle2 size={16} /> Profile Information Saved Successfully!
          </div>
        )}

        <div className="modal-btn-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Profile Settings ➔
          </Button>
        </div>
      </form>
    </Modal>
  );
}
