import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQ_kCO_rDVNXBwH94Qsa7kFUuZXsjOD8c",
  authDomain: "fitfurs-admin.firebaseapp.com",
  projectId: "fitfurs-admin",
  storageBucket: "fitfurs-admin.firebasestorage.app",
  messagingSenderId: "107278235994",
  appId: "1:107278235994:web:df3b50fea971653e3c5b63",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);