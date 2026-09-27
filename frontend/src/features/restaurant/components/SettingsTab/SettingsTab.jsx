import React, { useState, useEffect } from 'react';
import { Store, ShieldCheck, Save, Plus, Edit2, Trash2, Utensils, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import Card from '../../../../components/Card/Card';
import Button from '../../../../components/Button/Button';
import Modal from '../../../../components/Modal/Modal';
import { masterMenuService } from '../../../../services/masterMenuService';
import './SettingsTab.css';

export default function SettingsTab() {
  const [restaurantName, setRestaurantName] = useState('Star Chef Bistro');
  const [tradeLicense, setTradeLicense] = useState('TRD-8849-DHAKA');
  const [address, setAddress] = useState('House 42, Road 11, Banani, Dhaka');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoFallback, setAutoFallback] = useState(true);

  // Master Menu Items State
  const [menuItems, setMenuItems] = useState([]);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  // Form State for Menu Item Modal
  const [itemTitle, setItemTitle] = useState('');
  const [itemCategory, setItemCategory] = useState('COOKED_MEAL');
  const [itemPrice, setItemPrice] = useState(500);
  const [itemTier2Disc, setItemTier2Disc] = useState(50);
  const [itemTier3Disc, setItemTier3Disc] = useState(80);
  const [itemExpiryHours, setItemExpiryHours] = useState(3);
  const [itemDemoImage, setItemDemoImage] = useState('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80');
  const [itemDescription, setItemDescription] = useState('');

  // Sample Preset Demo Photos
  const presetPhotos = [
    { title: 'Mutton Kacchi', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80' },
    { title: 'Chicken Polao', url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80' },
    { title: 'Bakery Pastries', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
    { title: 'Beef Tehari', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80' }
  ];

  const reloadMenu = () => {
    setMenuItems(masterMenuService.getMasterMenuItems());
  };

  useEffect(() => {
    reloadMenu();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItemId(null);
    setItemTitle('');
    setItemCategory('COOKED_MEAL');
    setItemPrice(500);
    setItemTier2Disc(50);
    setItemTier3Disc(80);
    setItemExpiryHours(3);
    setItemDemoImage(presetPhotos[0].url);
    setItemDescription('');
    setIsItemModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItemId(item.id);
    setItemTitle(item.title);
    setItemCategory(item.category || 'COOKED_MEAL');
    setItemPrice(item.originalPrice || 500);
    setItemTier2Disc(item.tier2Discount || 50);
    setItemTier3Disc(item.tier3Discount || 80);
    setItemExpiryHours(item.expiryHours || 3);
    setItemDemoImage(item.demoImage || presetPhotos[0].url);
    setItemDescription(item.description || '');
    setIsItemModalOpen(true);
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setItemDemoImage(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to remove this menu item from your Master Catalog?')) {
      masterMenuService.deleteMenuItem(id);
      reloadMenu();
    }
  };

  const handleSaveItemSubmit = (e) => {
    e.preventDefault();
    if (!itemTitle.trim()) {
      alert('Please enter a valid menu item title.');
      return;
    }

    const payload = {
      restaurantName: restaurantName,
      title: itemTitle.trim(),
      category: itemCategory,
      originalPrice: Number(itemPrice),
      tier2Discount: Number(itemTier2Disc),
      tier3Discount: Number(itemTier3Disc),
      expiryHours: Number(itemExpiryHours),
      demoImage: itemDemoImage.trim(),
      description: itemDescription.trim()
    };

    if (editingItemId) {
      masterMenuService.updateMenuItem(editingItemId, payload);
    } else {
      masterMenuService.addMenuItem(payload);
    }

    reloadMenu();
    setIsItemModalOpen(false);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    alert('✅ Restaurant Profile Settings Saved Successfully!');
  };

  return (
    <div className="settings-tab">
      <div className="tab-header">
        <div>
          <h1 className="tab-title">Restaurant Profile & Master Menu Catalog Settings</h1>
          <p className="tab-sub">Configure your Master Menu items, demo pictures, default pricing strategy, and dispatch rules.</p>
        </div>
      </div>

      {/* MASTER MENU CATALOG & SAVED DEMO IMAGES CARD */}
      <Card hover={false} className="settings-card" style={{ marginBottom: '24px' }}>
        <div className="card-header-row" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Utensils className="icon-emerald" size={22} />
            <div>
              <h3 className="card-title">📖 Master Menu & Saved Demo Images</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                Items configured here will auto-populate during manual surplus posting and AI computer-vision food audits.
              </p>
            </div>
          </div>

          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
            Add New Menu Item
          </Button>
        </div>

        {/* Master Menu Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
          {menuItems.map((item) => (
            <div key={item.id} style={{
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between'
            }}>
              <div>
                <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                  <img src={item.demoImage} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    color: '#fff',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600
                  }}>
                    {item.category === 'COOKED_MEAL' ? '🍲 Cooked' : item.category === 'BAKERY' ? '🍞 Bakery' : '📦 Surplus'}
                  </span>
                </div>

                <div style={{ padding: '14px' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{item.title}</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                    {item.description || 'Pre-configured menu item for surplus food rescue.'}
                  </p>

                  <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #f1f5f9', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ color: '#475569' }}>Original Price:</span>
                      <strong style={{ color: '#0f172a' }}>৳ {item.originalPrice}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2563eb' }}>
                      <span>Tier 2 ({item.tier2Discount}% Off):</span>
                      <strong>৳ {Math.round(item.originalPrice * (1 - item.tier2Discount/100))}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}>
                      <span>Tier 3 ({item.tier3Discount}% Off):</span>
                      <strong>৳ {Math.round(item.originalPrice * (1 - item.tier3Discount/100))}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '10px 14px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px', justifyContent: 'flex-end', background: '#fafafa' }}>
                <Button variant="outline" size="sm" icon={Edit2} onClick={() => handleOpenEditModal(item)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" icon={Trash2} style={{ color: '#ef4444' }} onClick={() => handleDeleteItem(item.id)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* PROFILE & SAFETY SETTINGS FORM */}
      <form onSubmit={handleSaveSettings} className="settings-form-grid">
        {/* Profile Settings */}
        <Card hover={false} className="settings-card">
          <div className="card-header-row">
            <Store className="icon-emerald" size={20} />
            <h3 className="card-title">Restaurant Credentials</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Restaurant Business Name</label>
            <input
              type="text"
              className="form-input"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Trade License Number</label>
            <input
              type="text"
              className="form-input"
              value={tradeLicense}
              onChange={(e) => setTradeLicense(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Pickup Address</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </Card>

        {/* Safety & Alert Preferences */}
        <Card hover={false} className="settings-card">
          <div className="card-header-row">
            <ShieldCheck className="icon-orange" size={20} />
            <h3 className="card-title">Food Safety & Dispatch Rules</h3>
          </div>

          <div className="setting-toggle-row">
            <div>
              <span className="toggle-label">15-Minute Fallback Auto Switch</span>
              <span className="toggle-sub">Automatically convert preferred NGO broadcasts to Open Broadcast after 15 mins.</span>
            </div>
            <input
              type="checkbox"
              checked={autoFallback}
              onChange={(e) => setAutoFallback(e.target.checked)}
            />
          </div>

          <div className="setting-toggle-row">
            <div>
              <span className="toggle-label">SMS Critical Expiry Alerts</span>
              <span className="toggle-sub">Receive instant SMS alerts when food has less than 30 mins remaining.</span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
            />
          </div>

          <div className="save-btn-row">
            <Button type="submit" variant="primary" size="lg" icon={Save}>
              Save Profile Settings
            </Button>
          </div>
        </Card>
      </form>

      {/* MASTER MENU ITEM ADD/EDIT MODAL */}
      <Modal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        title={editingItemId ? '✏️ Modify Master Menu Item' : '➕ Add Master Menu Item & Demo Image'}
      >
        <form onSubmit={handleSaveItemSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '10px' }}>
          <div className="form-group">
            <label className="form-label">Menu Item Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Royal Mutton Kacchi Biryani"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Food Category</label>
              <select className="form-input" value={itemCategory} onChange={(e) => setItemCategory(e.target.value)}>
                <option value="COOKED_MEAL">🍲 Hot Cooked Meal</option>
                <option value="BAKERY">🍞 Bakery & Pastry</option>
                <option value="DRY_GOODS">📦 Dry / Packaged Goods</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Regular Price (BDT ৳)</label>
              <input
                type="number"
                className="form-input"
                placeholder="500"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '11px' }}>Tier 2 Disc (%):</label>
              <input type="number" className="form-input" value={itemTier2Disc} onChange={(e) => setItemTier2Disc(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '11px' }}>Tier 3 Disc (%):</label>
              <input type="number" className="form-input" value={itemTier3Disc} onChange={(e) => setItemTier3Disc(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '11px' }}>Default Expiry (Hrs):</label>
              <input type="number" className="form-input" value={itemExpiryHours} onChange={(e) => setItemExpiryHours(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">📷 Select / Upload Item Image (Local Device Gallery)</label>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={handleImageFileUpload}
              style={{ padding: '6px 10px' }}
            />
            
            {itemDemoImage && (
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px', background: '#f0fdf4', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <img src={itemDemoImage} alt="Preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                <div>
                  <span style={{ fontSize: '12px', color: '#15803d', fontWeight: 600, display: 'block' }}>✅ Image Loaded & Saved in Gallery</span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>Used for manual posts, AI auto-audits & NGO view.</span>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Description & Allergen / Packaging Notes</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="e.g. Prepared with fresh basmati rice, mutton, ghee. Sealed thermal pack."
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <Button variant="ghost" type="button" onClick={() => setIsItemModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon={CheckCircle2}>
              {editingItemId ? 'Update Menu Item' : 'Save New Menu Item'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
