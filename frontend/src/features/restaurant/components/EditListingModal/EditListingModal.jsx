import React, { useState, useEffect } from 'react';
import { X, Edit3, Save, Package, DollarSign, Utensils } from 'lucide-react';
import Button from '../../../../components/Button/Button';
import './EditListingModal.css';

export default function EditListingModal({ isOpen, onClose, item, onSave }) {
  const [foodItemTitle, setFoodItemTitle] = useState('');
  const [category, setCategory] = useState('COOKED');
  const [quantityPortions, setQuantityPortions] = useState(20);
  const [initialPriceBDT, setInitialPriceBDT] = useState(450);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFoodItemTitle(item.name || item.foodItemTitle || '');
      setCategory(item.category || 'COOKED');

      // Extract portion count from string if e.g. "25 Portions"
      const parsedQty = parseInt(item.quantity || item.quantityPortions || 20, 10);
      setQuantityPortions(isNaN(parsedQty) ? 20 : parsedQty);

      // Extract price from string if e.g. "Base: ৳ 450 | B2C: 50% Off"
      let parsedPrice = item.initialPriceBDT;
      if (!parsedPrice && item.price) {
        const match = item.price.match(/৳\s*(\d+)/);
        if (match) parsedPrice = parseFloat(match[1]);
      }
      setInitialPriceBDT(parsedPrice || 450);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(item.id, {
        foodItemTitle,
        category,
        quantityPortions: Number(quantityPortions),
        initialPriceBDT: Number(initialPriceBDT)
      });
      onClose();
    } catch (err) {
      console.error('Error updating surplus listing:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <div className="title-group">
            <Edit3 size={20} className="header-icon" />
            <div>
              <h3>Edit Surplus Food Post</h3>
              <p className="subtitle">Update listing details, quantity, or base price</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-modal-form">
          <div className="form-group">
            <label><Utensils size={15} /> Food Item Title</label>
            <input
              type="text"
              required
              value={foodItemTitle}
              onChange={(e) => setFoodItemTitle(e.target.value)}
              placeholder="e.g. Royal Mutton Kacchi Biryani"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><Package size={15} /> Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="COOKED">🍲 Cooked Meal</option>
                <option value="BAKERY">🍞 Bakery & Bread</option>
                <option value="DAIRY">🥛 Dairy Products</option>
                <option value="DRY_GROCERY">📦 Dry Grocery</option>
              </select>
            </div>

            <div className="form-group">
              <label><Package size={15} /> Quantity (Portions)</label>
              <input
                type="number"
                min="1"
                max="500"
                required
                value={quantityPortions}
                onChange={(e) => setQuantityPortions(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label><DollarSign size={15} /> Initial Base Price (BDT ৳)</label>
            <input
              type="number"
              min="0"
              required
              value={initialPriceBDT}
              onChange={(e) => setInitialPriceBDT(e.target.value)}
            />
            <small className="hint">NGO Priority window remains 100% FREE. B2C sale discount will automatically adjust.</small>
          </div>

          <div className="edit-modal-actions">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon={Save} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
