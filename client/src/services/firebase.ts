import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCfkdtHXtqtjxnyphn5mLbY02J52BwXz_g",
  authDomain: "healthcare-8dfb4.firebaseapp.com",
  projectId: "healthcare-8dfb4",
  storageBucket: "healthcare-8dfb4.firebasestorage.app",
  messagingSenderId: "552898090895",
  appId: "1:552898090895:android:2c1311cc3b16f3d817ddfa"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getApps().length === 0 || !getAuth(app) ? initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
}) : getAuth(app);
