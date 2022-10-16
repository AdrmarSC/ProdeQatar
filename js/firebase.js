// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuW45bTxQWs0-LQExc0A_2HZnJLWCQ7N4",
  authDomain: "prodeqatar-364703.firebaseapp.com",
  projectId: "prodeqatar-364703",
  storageBucket: "prodeqatar-364703.appspot.com",
  messagingSenderId: "604182413607",
  appId: "1:604182413607:web:77bbc4a3965ebc6183e902",
  measurementId: "G-SQ4Z7RMRCT",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const auth = getAuth(app);
