import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaajfgYiksCUfpY9oHuMIPQLB3DbH34SM",
  authDomain: "hesali-transport.firebaseapp.com",
  projectId: "hesali-transport",
  storageBucket: "hesali-transport.appspot.com",
  messagingSenderId: "874204543144",
  appId: "1:874204543144:web:bfcf99978838030b8e6a9d",
  measurementId: "G-CJZK0M7X7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
