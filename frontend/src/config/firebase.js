// frontend/src/config/firebase.js
// Initializes the Firebase Client SDK for use in the browser.
// Uses VITE_ prefixed env vars — Vite only exposes vars with this prefix to the browser bundle.
// Never import firebase-admin here; that is server-side only (backend).

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey:     import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:  import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId:      import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize the Firebase app (singleton — safe to call once at module level)
const app = initializeApp(firebaseConfig);

// Export the auth instance for use in login/register pages
export const auth = getAuth(app);

export default app;
