import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBkgzCfMCpMPAXqVuFty3aM0YuwvL8SPms",
  authDomain: "laundrysystem-326b3.firebaseapp.com",
  projectId: "laundrysystem-326b3",
  storageBucket: "laundrysystem-326b3.firebasestorage.app",
  messagingSenderId: "830058431225",
  appId: "1:830058431225:web:9352d63761491e7daf9828",
  measurementId: "G-5MXLKCLZCV"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);