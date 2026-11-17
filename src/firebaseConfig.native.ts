import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  // @ts-expect-error Firebase React Native export is missing from the root TypeScript declarations.
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyDaajfgYiksCUfpY9oHuMIPQLB3DbH34SM",
  authDomain: "hesali-transport.firebaseapp.com",
  projectId: "hesali-transport",
  storageBucket: "hesali-transport.firebasestorage.app",
  messagingSenderId: "874204543144",
  appId: "1:874204543144:web:bfcf99978838030b8e6a9d",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : (() => {
        try {
          return initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
          });
        } catch {
          // Fast refresh can run this module again after Auth has initialized.
          return getAuth(app);
        }
      })();
