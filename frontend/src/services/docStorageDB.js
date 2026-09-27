// src/services/docStorageDB.js
// IndexedDB-based persistent document storage for partner application files.
// Unlike sessionStorage, IndexedDB survives page refresh, tab close, and browser restart.
// Typical browser limit: 50-100MB+ (vs sessionStorage's ~5MB session-only limit).

const DB_NAME = 'FoodRescuePartnerDocs';
const DB_VERSION = 1;
const STORE_NAME = 'documents';

/**
 * Open (or create) the IndexedDB database.
 * Returns a Promise<IDBDatabase>.
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Each record: { appId: string, docs: [{name, url, size}] }
        db.createObjectStore(STORE_NAME, { keyPath: 'appId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.error('[DocStorageDB] Failed to open IndexedDB:', request.error);
      reject(request.error);
    };
  });
}

/**
 * Save uploaded document files (with Base64 data URLs) for a given application ID.
 * @param {string} appId - The application tracking ID (e.g. APP-NGO-2026-123)
 * @param {Array<{name: string, url: string, size: string}>} docs - Array of doc objects with Base64 URLs
 */
export async function saveDocs(appId, docs) {
  if (!docs || docs.length === 0) return;
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ appId, docs, savedAt: Date.now() });
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    console.log(`[DocStorageDB] ✅ Saved ${docs.length} doc(s) for ${appId}`);
  } catch (e) {
    console.error('[DocStorageDB] ❌ Failed to save docs:', e);
  }
}

/**
 * Load uploaded document files for a given application ID.
 * @param {string} appId - The application tracking ID
 * @returns {Promise<Array>} - Array of doc objects, or empty array if not found
 */
export async function loadDocs(appId) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(appId);
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.docs : []);
      };
      request.onerror = () => {
        console.warn('[DocStorageDB] Error loading docs for', appId);
        resolve([]);
      };
    });
  } catch (e) {
    console.error('[DocStorageDB] ❌ Failed to load docs:', e);
    return [];
  }
}

/**
 * Delete document files for a given application ID.
 * @param {string} appId - The application tracking ID
 */
export async function deleteDocs(appId) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(appId);
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    console.log(`[DocStorageDB] Deleted docs for ${appId}`);
  } catch (e) {
    console.error('[DocStorageDB] Failed to delete docs:', e);
  }
}

/**
 * List all stored application IDs and their doc counts (for debugging).
 * @returns {Promise<Array<{appId: string, docCount: number, savedAt: number}>>}
 */
export async function listAllDocs() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const results = request.result || [];
        resolve(results.map(r => ({
          appId: r.appId,
          docCount: r.docs ? r.docs.length : 0,
          savedAt: r.savedAt
        })));
      };
      request.onerror = () => resolve([]);
    });
  } catch (e) {
    return [];
  }
}
