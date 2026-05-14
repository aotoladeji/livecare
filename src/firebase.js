import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCxKJ9OjIZ5j3DAlH6leoauqZS-h0ueVZY",
  authDomain: "live-care-app.firebaseapp.com",
  projectId: "live-care-app",
  storageBucket: "live-care-app.firebasestorage.app",
  messagingSenderId: "722771125410",
  appId: "1:722771125410:web:38c68942fd32548930e3fb"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);

let firebaseSessionPromise;

export async function ensureFirebaseSession() {
  if (!firebaseSessionPromise) {
    // Default mode avoids Auth-dependent startup failures.
    firebaseSessionPromise = Promise.resolve(null);
  }

  return firebaseSessionPromise;
}
