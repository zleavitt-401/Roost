import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error(
      'Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable. ' +
      'Set it to the JSON string of your Firebase service account credentials.'
    );
  }

  let serviceAccount: ServiceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountKey) as ServiceAccount;
  } catch {
    throw new Error(
      'Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY — ensure it is valid JSON.'
    );
  }

  return initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

let _auth: Auth | undefined;
let _db: Firestore | undefined;
let _storage: Storage | undefined;

export function getAdminAuth(): Auth {
  if (!_auth) {
    _auth = getAuth(getAdminApp());
  }
  return _auth;
}

export function getAdminDb(): Firestore {
  if (!_db) {
    _db = getFirestore(getAdminApp());
  }
  return _db;
}

export function getAdminStorage(): Storage {
  if (!_storage) {
    _storage = getStorage(getAdminApp());
  }
  return _storage;
}
