// plugins/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";
import firebase from '@/plugins/firebase';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-f2g7-UiuUmqhFV0iJOMklR76IXq1b0c",
  authDomain: "demowedupload.firebaseapp.com",
  projectId: "demowedupload",
  storageBucket: "demowedupload.appspot.com",
  messagingSenderId: "212408527163",
  appId: "1:212408527163:web:9454aeacdacae50eed6f1e",
  measurementId: "G-8VHYJH3N42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export default
export default {
    db,
    storage
};
