// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUQz5Ofa03TUCq2bl908tultQW8K-ft-s",
    authDomain: "fufleamarket.firebaseapp.com",
    projectId: "fufleamarket",
    storageBucket: "fufleamarket.appspot.com",
    messagingSenderId: "783117557441",
    appId: "1:783117557441:web:46e614fd314f1a9c8afe40",
    measurementId: "G-ZTZ43Y0V09"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app);