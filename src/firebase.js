import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, signInAnonymously } from 'firebase/auth';
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
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

let firebaseSessionPromise;

export async function ensureFirebaseSession() {
  if (!firebaseSessionPromise) {
    firebaseSessionPromise = (async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        // Persistence can fail in restricted browser environments.
        console.warn('Firebase persistence not available, continuing with in-memory auth.', error);
      }

      if (auth.currentUser) {
        return auth.currentUser;
      }

      const credentials = await signInAnonymously(auth);
      return credentials.user;
    })().catch((error) => {
      firebaseSessionPromise = null;
      throw error;
    });
  }

  return firebaseSessionPromise;
}
