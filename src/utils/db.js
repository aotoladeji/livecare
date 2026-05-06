/**
 * Firestore database utilities for LiveCare.
 *
 * Collections:
 *  - waitlist              : waitlist form submissions
 *  - productImages         : per-product image arrays  { images: [...urls] }
 *  - customProducts        : admin-added products (not in default catalog)
 *  - caregiverApplications : caregiver apply form submissions
 *  - certifiedCaregivers   : caregivers approved/certified by admin
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
  where,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import { DEFAULT_PRODUCTS } from '../data/shopProducts';

// ─── Waitlist ─────────────────────────────────────────────────

export async function addWaitlistEntryDB(entry) {
  const normalizedEmail = String(entry.email || '').trim().toLowerCase();
  const normalizedPhone = String(entry.phone || '').replace(/\s+/g, '');

  // Check for duplicates by email or phone before writing.
  const [existingByEmail, existingByPhone] = await Promise.all([
    normalizedEmail
      ? getDocs(query(collection(db, 'waitlist'), where('email', '==', normalizedEmail), limit(1)))
      : Promise.resolve({ empty: true }),
    normalizedPhone
      ? getDocs(query(collection(db, 'waitlist'), where('phone', '==', normalizedPhone), limit(1)))
      : Promise.resolve({ empty: true }),
  ]);

  if (!existingByEmail.empty || !existingByPhone.empty) {
    const error = new Error('Duplicate waitlist entry');
    error.code = 'DUPLICATE_WAITLIST_ENTRY';
    throw error;
  }

  const docRef = await addDoc(collection(db, 'waitlist'), {
    ...entry,
    email: normalizedEmail,
    phone: normalizedPhone,
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

// ─── Caregiver Applications ───────────────────────────────────

export async function addCaregiverApplicationDB(entry) {
  const docRef = await addDoc(collection(db, 'caregiverApplications'), {
    ...entry,
    status: 'pending',
    submittedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function deleteCaregiverApplicationDB(id) {
  await deleteDoc(doc(db, 'caregiverApplications', id));
}

export function subscribeCaregiverApplications(callback) {
  const q = query(collection(db, 'caregiverApplications'), orderBy('submittedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      submittedAt: d.data().submittedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    }));
    callback(entries);
  });
}

// ─── Certified Caregivers ─────────────────────────────────────

/**
 * Certify a caregiver: copies their application data into certifiedCaregivers
 * and removes them from applications.
 */
export async function certifyCaregiverDB(application) {
  const { id, ...data } = application;
  await addDoc(collection(db, 'certifiedCaregivers'), {
    ...data,
    certifiedAt: serverTimestamp(),
    originalApplicationId: id,
  });
  await deleteDoc(doc(db, 'caregiverApplications', id));
}

export async function removeCertifiedCaregiverDB(id) {
  await deleteDoc(doc(db, 'certifiedCaregivers', id));
}

export function subscribeCertifiedCaregivers(callback) {
  const q = query(collection(db, 'certifiedCaregivers'), orderBy('certifiedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      certifiedAt: d.data().certifiedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      submittedAt: d.data().submittedAt?.toDate?.()?.toISOString() ?? null,
    }));
    callback(entries);
  });
}

// ─── Contact Form Submissions ─────────────────────────────────

export async function addContactSubmissionDB(submission) {
  const docRef = await addDoc(collection(db, 'contacts'), {
    ...submission,
    status: 'new',
    submittedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function deleteContactSubmissionDB(id) {
  await deleteDoc(doc(db, 'contacts', id));
}

export function subscribeContacts(callback) {
  const q = query(collection(db, 'contacts'), orderBy('submittedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      submittedAt: d.data().submittedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    }));
    callback(entries);
  });
}

// ─── Orders ───────────────────────────────────────────────────

export async function createOrderDB(order) {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...order,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateOrderStatusDB(orderId, status) {
  await setDoc(doc(db, 'orders', orderId), { status }, { merge: true });
}

export async function deleteOrderDB(orderId) {
  await deleteDoc(doc(db, 'orders', orderId));
}

export function subscribeOrders(callback) {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    }));
    callback(entries);
  });
}
