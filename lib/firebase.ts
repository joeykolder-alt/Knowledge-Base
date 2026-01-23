import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyB41AFLi7w4_ySww24Ai4dEUXY6hZGsOeY",
  authDomain: "earthlink-kb-v2.firebaseapp.com",
  projectId: "earthlink-kb-v2",
  storageBucket: "earthlink-kb-v2.firebasestorage.app",
  messagingSenderId: "223721088299",
  appId: "1:223721088299:web:8cbfa879da6824cb1e916e",
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

export default app
