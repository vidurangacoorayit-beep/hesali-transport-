import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

export const auth = getAuth(app);
