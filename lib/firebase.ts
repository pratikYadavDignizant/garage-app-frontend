import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};



// Initialize Firebase only if the API key is present
const app =
    getApps().length > 0
        ? getApp()
        : (firebaseConfig.apiKey && firebaseConfig.apiKey !== '...' && firebaseConfig.apiKey !== 'your-api-key-here'
            ? initializeApp(firebaseConfig)
            : null);

const auth = app ? getAuth(app) : null;

if (auth) {
    auth.languageCode = 'en';
} else {
    console.warn("Firebase Auth: Missing or invalid API key. Set NEXT_PUBLIC_FIREBASE_API_KEY in .env.local");
}

export { auth };
export default app;
