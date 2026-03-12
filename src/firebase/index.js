import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpLQoJwh3hdtlg94KNQbaxrDzjLrnD0z8",
  authDomain: "artisan-fb.firebaseapp.com",
  projectId: "artisan-fb",
  storageBucket: "artisan-fb.firebasestorage.app",
  messagingSenderId: "905575704635",
  appId: "1:905575704635:web:84b16013bfbc50a813941e",
  measurementId: "G-NBTJLVNVWQ"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);