// Firebase Configuration for AlloSN
// This file sets up the connection to Firebase Firestore

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3XRwSKvbRd5oD_PJQaTBblQc9fP1wvYg",
  authDomain: "allosn-d6cb3.firebaseapp.com",
  projectId: "allosn-d6cb3",
  storageBucket: "allosn-d6cb3.firebasestorage.app",
  messagingSenderId: "526627965234",
  appId: "1:526627965234:web:1247b5b74023dc5b5eef2b"
}

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize Cloud Firestore and get a reference to the service
export const firestore = getFirestore(app)

// Initialize Firebase Auth
export const auth = getAuth(app)

export default app

// Admin emails - Super Admins have full access
export const SUPER_ADMIN_EMAILS = [
  'Abdoulayegueye87@gmail.com',
  'abdoulayegueye87@gmail.com', // lowercase version
]

// Check if email is super admin
export function isSuperAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase())
}
