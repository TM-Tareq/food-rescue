// Master Menu & Demo Image Storage Service for FoodRescue Restaurants

const DEFAULT_MASTER_MENU = [
  {
    id: 'MENU-101',
    restaurantName: 'Star Chef Bistro',
    title: 'Royal Mutton Kacchi Biryani & Borhani Combo',
    category: 'COOKED_MEAL',
    originalPrice: 550,
    tier2Discount: 50, // 50% Off -> ৳ 275
    tier3Discount: 80, // 80% Off -> ৳ 110
    expiryHours: 3,
    description: 'Traditional Basmati Rice Kacchi with tender mutton chunks, potato, and chilled Borhani.',
    demoImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'MENU-102',
    restaurantName: 'Star Chef Bistro',
    title: 'Special Chicken Polao & Egg Platter',
    category: 'COOKED_MEAL',
    originalPrice: 480,
    tier2Discount: 50, // 50% Off -> ৳ 240
    tier3Discount: 80, // 80% Off -> ৳ 96
    expiryHours: 3,
    description: 'Aromatic Chinigura rice polao with golden fried chicken roast and egg.',
    demoImage: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'MENU-103',
    restaurantName: 'Star Chef Bistro',
    title: 'Assorted Fresh Pastry & Croissant Pack',
    category: 'BAKERY',
    originalPrice: 350,
    tier2Discount: 50, // 50% Off -> ৳ 175
    tier3Discount: 80, // 80% Off -> ৳ 70
    expiryHours: 4,
    description: 'Fresh butter croissants, chocolate tarts, and fruit danishes sealed package.',
    demoImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'MENU-104',
    restaurantName: 'Star Chef Bistro',
    title: 'Gourmet Beef Tehari & Salad Package',
    category: 'COOKED_MEAL',
    originalPrice: 420,
    tier2Discount: 50, // 50% Off -> ৳ 210
    tier3Discount: 80, // 80% Off -> ৳ 84
    expiryHours: 3,
    description: 'Spicy mustard oil mustard beef tehari served with fresh cucumber salad.',
    demoImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    available: true
  }
];

const MASTER_MENU_STORAGE_VERSION = 'v8_hd_restored_photos';

const getHdPhotoForTitle = (title = '', defaultImg = '') => {
  if (defaultImg && !defaultImg.includes('.svg')) return defaultImg;
  const t = (title || '').toLowerCase();
  if (t.includes('kacchi') || t.includes('mutton')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80';
  }
  if (t.includes('tehari') || t.includes('beef')) {
    return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80';
  }
  if (t.includes('chicken') || t.includes('polao') || t.includes('biryani')) {
    return 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80';
  }
  if (t.includes('pastry') || t.includes('bakery') || t.includes('croissant')) {
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80';
  }
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
};

export const masterMenuService = {
  getMasterMenuItems() {
    try {
      const storedVersion = localStorage.getItem('foodrescue_master_menu_version');
      const raw = localStorage.getItem('foodrescue_master_menu_items');
      
      if (storedVersion !== MASTER_MENU_STORAGE_VERSION) {
        localStorage.setItem('foodrescue_master_menu_version', MASTER_MENU_STORAGE_VERSION);
        localStorage.setItem('foodrescue_master_menu_items', JSON.stringify(DEFAULT_MASTER_MENU));
        return DEFAULT_MASTER_MENU;
      }

      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let updated = false;
          const sanitized = parsed.map(item => {
            const currentImg = item.demoImage || '';
            if (currentImg.includes('.svg') || !currentImg) {
              updated = true;
              return { ...item, demoImage: getHdPhotoForTitle(item.title, currentImg) };
            }
            return item;
          });
          if (updated) {
            localStorage.setItem('foodrescue_master_menu_items', JSON.stringify(sanitized));
          }
          return sanitized;
        }
      }
    } catch (e) {
      console.warn('Failed to read master menu items from localStorage:', e);
    }
    localStorage.setItem('foodrescue_master_menu_version', MASTER_MENU_STORAGE_VERSION);
    localStorage.setItem('foodrescue_master_menu_items', JSON.stringify(DEFAULT_MASTER_MENU));
    return DEFAULT_MASTER_MENU;
  },

  saveMasterMenuItems(items) {
    try {
      localStorage.setItem('foodrescue_master_menu_items', JSON.stringify(items));
      window.dispatchEvent(new Event('foodrescue_menu_updated'));
    } catch (e) {
      console.error('Error saving master menu items:', e);
    }
  },

  addMenuItem(newItem) {
    const items = this.getMasterMenuItems();
    const itemWithId = {
      id: `MENU-${Math.floor(100 + Math.random() * 900)}`,
      available: true,
      ...newItem
    };
    const updated = [itemWithId, ...items];
    this.saveMasterMenuItems(updated);
    return itemWithId;
  },

  updateMenuItem(id, updatedFields) {
    const items = this.getMasterMenuItems();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updatedFields };
    this.saveMasterMenuItems(items);
    return items[index];
  },

  deleteMenuItem(id) {
    const items = this.getMasterMenuItems();
    const filtered = items.filter(i => i.id !== id);
    this.saveMasterMenuItems(filtered);
    return true;
  }
};
