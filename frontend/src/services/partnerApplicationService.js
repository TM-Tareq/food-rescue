// src/services/partnerApplicationService.js
// Document blobs (Base64) are stored in IndexedDB (persistent, 50-100MB+).
// Main applications list stays in localStorage (lightweight metadata only).

import apiClient from './apiClient';
import { saveDocs, loadDocs } from './docStorageDB';

const STORAGE_KEY = 'food_rescue_partner_applications';

const DEFAULT_APPLICATIONS = [
  {
    id: 'APP-REST-2026-901',
    name: 'Kacchi Bhai Banani',
    type: 'RESTAURANT',
    ownerName: 'Kamrul Islam',
    phone: '+880 1711-234567',
    email: 'kacchibhai.banani@partner.com',
    tradeLicenseNo: 'TL-DHAKA-2026-9042',
    tinNo: 'TIN-8890-1249',
    bstiCertNo: 'BSTI-FS-8041',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    appliedDate: '26 Sep 2026',
    status: 'PENDING',
    bankAccount: 'Kacchi Bhai Ltd (City Bank, Banani Br #88412)',
    docUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60',
    uploadedDocsMeta: [{ name: 'trade_license_banani.jpg', size: '420 KB' }],
    uploadedDocsCount: 1,
    notes: 'Submitted trade license and food sanitation certificate.'
  },
  {
    id: 'APP-NGO-2026-902',
    name: 'Anjuman Mufidul Relief Hub',
    type: 'NGO',
    ownerName: 'Dr. Nusrat Jahan',
    phone: '+880 1819-876543',
    email: 'contact@anjumanrelief.org',
    ngoRegNo: 'NGO-REG-DHAKA-4410',
    taxExemptNo: 'TAX-EXEMPT-2026-9901',
    dailyCapacity: '1,200 Meals / Day',
    coveredLocations: 'Korail Slum, Mohakhali, Kuril Flyover Slum',
    address: 'Plot 12, Road 4, Block C, Bashundhara R/A, Dhaka',
    appliedDate: '25 Sep 2026',
    status: 'PENDING',
    docUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=60',
    uploadedDocsMeta: [{ name: 'ngo_bureau_reg_2026.pdf', size: '630 KB' }],
    uploadedDocsCount: 1,
    notes: 'Govt NGO Bureau registration valid till 2028.'
  },
  {
    id: 'APP-RIDER-2026-903',
    name: 'Rahat Hasan (Express Rider)',
    type: 'RIDER',
    ownerName: 'Rahat Hasan',
    phone: '+880 1912-345678',
    email: 'rahat.rider@express.com',
    nidNo: 'NID-1998-8841-9921',
    drivingLicenseNo: 'DL-DHAKA-889124',
    vehicleType: 'Motorbike (Yamaha FZ-S)',
    emergencyContact: 'Mother (+880 1912-998877)',
    address: 'Block E, Bashundhara R/A, Dhaka',
    appliedDate: '24 Sep 2026',
    status: 'PENDING',
    docUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=60',
    uploadedDocsMeta: [{ name: 'nid_front_rahat.jpg', size: '380 KB' }, { name: 'driving_license_rahat.jpg', size: '290 KB' }],
    uploadedDocsCount: 2,
    notes: 'Submitted NID front/back & valid motorcycle driving license.'
  }
];


// ─── MAIN SERVICE ────────────────────────────────────────────────────────────
export const partnerApplicationService = {

  getApplications: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_APPLICATIONS));
        return DEFAULT_APPLICATIONS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('[PartnerApp] Error loading applications:', e);
      return DEFAULT_APPLICATIONS;
    }
  },

  // Load full application with documents merged in from IndexedDB (async)
  getApplicationWithDocs: async (appId) => {
    const apps = partnerApplicationService.getApplications();
    const app = apps.find(a => a.id === appId);
    if (!app) return null;
    const docs = await loadDocs(appId);
    return { ...app, uploadedDocs: docs };
  },

  async fetchApplicationsFromApi(roleType = 'ALL', status = '') {
    try {
      const response = await apiClient.get('/partner-applications', {
        params: { roleType, status }
      });
      if (response && response.data) {
        return response.data;
      }
    } catch (err) {
      console.warn('[PartnerApp] Backend API offline, using local storage fallback.');
    }
    return partnerApplicationService.getApplications();
  },

  submitApplication: async (appData) => {
    // ─── 1. Separate heavy Base64 docs from main record ───────────────────
    const { uploadedDocs, docUrl: rawDocUrl, ...lightAppData } = appData;
    
    const uploadedDocsMeta = (uploadedDocs || []).map(d => ({ name: d.name, size: d.size }));
    const uploadedDocsCount = uploadedDocsMeta.length;
    const safeDocUrl = rawDocUrl && !rawDocUrl.startsWith('data:')
      ? rawDocUrl
      : uploadedDocsMeta.length > 0
        ? `[${uploadedDocsCount} document(s) uploaded — view in detail panel]`
        : 'No documents attached';

    const rolePrefix = appData.type === 'RESTAURANT' ? 'REST' : appData.type === 'NGO' ? 'NGO' : 'RIDER';
    const appId = `APP-${rolePrefix}-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newApp = {
      id: appId,
      appliedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'PENDING',
      ...lightAppData,
      docUrl: safeDocUrl,
      uploadedDocsMeta,
      uploadedDocsCount,
    };

    // ─── 2. Save docs (with Base64 data) to IndexedDB (persistent!) ───────
    if (uploadedDocs && uploadedDocs.length > 0) {
      await saveDocs(appId, uploadedDocs);
    }

    // ─── 3. Save lightweight app record to localStorage ───────────────────
    let savedOk = false;
    try {
      const apps = partnerApplicationService.getApplications();
      const updated = [newApp, ...apps];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      savedOk = true;
      console.log(`[PartnerApp] ✅ Application saved: ${appId}`, newApp);
    } catch (e) {
      // QuotaExceededError fallback — save without any optional fields
      console.error('[PartnerApp] localStorage quota exceeded, retrying with minimal record:', e.message);
      try {
        const minimalApp = {
          id: appId,
          name: newApp.name,
          type: newApp.type,
          ownerName: newApp.ownerName,
          email: newApp.email,
          phone: newApp.phone,
          address: newApp.address,
          appliedDate: newApp.appliedDate,
          status: 'PENDING',
          docUrl: 'Documents saved in session only.',
          uploadedDocsCount,
          uploadedDocsMeta
        };
        // Clear old defaults to make room if needed
        const existingRaw = localStorage.getItem(STORAGE_KEY);
        const existing = existingRaw ? JSON.parse(existingRaw) : DEFAULT_APPLICATIONS;
        localStorage.setItem(STORAGE_KEY, JSON.stringify([minimalApp, ...existing]));
        savedOk = true;
        console.log(`[PartnerApp] ✅ Minimal application saved after quota fix: ${appId}`);
      } catch (e2) {
        console.error('[PartnerApp] ❌ Critical: Could not save application even minimally:', e2);
      }
    }

    // ─── 4. Notify all UI listeners immediately ───────────────────────────
    window.dispatchEvent(new CustomEvent('partner_applications_updated', { detail: { appId, type: newApp.type } }));

    // ─── 5. Try posting to Spring Boot backend ────────────────────────────
    apiClient.post('/partner-applications/submit', lightAppData).catch(() => {
      // Quiet fallback when backend is offline
    });

    return { ...newApp, _savedOk: savedOk };
  },

  updateApplicationStatus: (id, status, feedbackReason = '') => {
    try {
      const apps = partnerApplicationService.getApplications();
      const updated = apps.map(app => {
        if (app.id === id) {
          return {
            ...app,
            status,
            feedbackReason,
            reviewedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          };
        }
        return app;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('partner_applications_updated'));

      // Try patching to Spring Boot backend asynchronously
      apiClient.patch(`/partner-applications/${id}/status`, { status, feedbackReason }).catch(() => {});
      return updated;
    } catch (e) {
      console.error('[PartnerApp] Error updating status:', e);
      return [];
    }
  }
};
