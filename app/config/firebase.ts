// firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Avoid re-initializing on Next.js hot reload / multiple imports
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth instance used for Phone Authentication
export const auth = getAuth(app);

// Analytics only works in the browser and only if supported (avoids SSR crash)
export const initAnalytics = async () => {
  if (typeof window === "undefined") return null;
  const supported = await isSupported().catch(() => false);
  return supported ? getAnalytics(app) : null;
};

// Helper to create/reuse an invisible reCAPTCHA verifier for phone auth.
// Call this once, referencing a container div id (e.g. "recaptcha-container").
export const getRecaptchaVerifier = (containerId: string) => {
  const w = window as typeof window & {
    recaptchaVerifier?: RecaptchaVerifier;
  };

  if (!w.recaptchaVerifier) {
    w.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
    });
  }

  return w.recaptchaVerifier;
};

export default app;
