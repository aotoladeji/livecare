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
const ANON_AUTH_DISABLED_KEY = 'livecare_firebase_anon_auth_disabled';

function isAnonymousAuthRestricted(error) {
  return error?.code === 'auth/admin-restricted-operation';
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function shouldSkipAnonymousAuth() {
  return isBrowser() && window.localStorage.getItem(ANON_AUTH_DISABLED_KEY) === 'true';
}

function rememberAnonymousAuthDisabled() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(ANON_AUTH_DISABLED_KEY, 'true');
}

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

      if (shouldSkipAnonymousAuth()) {
        return null;
      }

      try {
        const credentials = await signInAnonymously(auth);
        return credentials.user;
      } catch (error) {
        if (isAnonymousAuthRestricted(error)) {
          // Some Firebase projects disable anonymous sign-in.
          // Continue without a Firebase user so unauth rules can still be used.
          rememberAnonymousAuthDisabled();
          return null;
        }
        throw error;
      }
    })().catch((error) => {
      firebaseSessionPromise = null;
      throw error;
    });
  }

  return firebaseSessionPromise;
}
