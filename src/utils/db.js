/**
 * Firestore database utilities for LiveCare.
 *
 * Collections:
 *  - waitlist          : waitlist form submissions
 *  - productImages     : per-product image arrays  { images: [...urls] }
 *  - customProducts    : admin-added products (not in default catalog)
 */

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '../firebase';
import { DEFAULT_PRODUCTS } from '../data/shopProducts';

// ─── Waitlist ─────────────────────────────────────────────────

export async function addWaitlistEntryDB(entry) {
  const docRef = await addDoc(collection(db, 'waitlist'), {
    ...entry,
    submittedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getWaitlistEntriesDB() {
  const q = query(collection(db, 'waitlist'), orderBy('submittedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data(),
    submittedAt: d.data().submittedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
  }));
}

export async function deleteWaitlistEntryDB(entryId) {
  await deleteDoc(doc(db, 'waitlist', entryId));
}

/**
 * Returns the current waitlist count from Firestore.
 */
export async function getWaitlistCountDB() {
  const snapshot = await getCountFromServer(collection(db, 'waitlist'));
  return snapshot.data().count;
}

/**
 * Subscribes to real-time waitlist updates.
 * Returns an unsubscribe function — call it on component unmount.
 */
export function subscribeWaitlist(callback) {
  const q = query(collection(db, 'waitlist'), orderBy('submittedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      submittedAt: d.data().submittedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    }));
    callback(entries);
  });
}

// ─── Product Images ───────────────────────────────────────────

export async function getProductImagesDB() {
  const snapshot = await getDocs(collection(db, 'productImages'));
  const map = {};
  snapshot.docs.forEach(d => {
    map[d.id] = d.data().images || [];
  });
  return map; // { [productId]: [...urls] }
}

export async function updateProductImagesDB(productId, images) {
  await setDoc(doc(db, 'productImages', String(productId)), { images });
}

// ─── Custom Products ──────────────────────────────────────────

export async function getCustomProductsDB() {
  const snapshot = await getDocs(collection(db, 'customProducts'));
  return snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
}

export async function addCustomProductDB(product) {
  const docRef = await addDoc(collection(db, 'customProducts'), product);
  return docRef.id; // Firestore-generated id
}

export async function deleteCustomProductDB(productId) {
  await deleteDoc(doc(db, 'customProducts', String(productId)));
}

// ─── Merged product list (default catalog + overrides + custom) ─

export async function getAllProductsDB() {
  const [imageMap, customProducts] = await Promise.all([
    getProductImagesDB(),
    getCustomProductsDB(),
  ]);

  // Apply image overrides to default catalog
  const defaultWithImages = DEFAULT_PRODUCTS.map(p => ({
    ...p,
    images: imageMap[String(p.id)] ?? p.images ?? [],
  }));

  // Custom products also get image overrides
  const customWithImages = customProducts.map(p => ({
    ...p,
    images: imageMap[String(p.id)] ?? p.images ?? [],
  }));

  return [...defaultWithImages, ...customWithImages];
}
