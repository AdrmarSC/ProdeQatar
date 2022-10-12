// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-analytics.js";

// Add Firebase products that you want to use
import { getAuth } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore();

export const saveResultGrupo = (grupo) => {
  collection(db, "");
  console.log(grupo);
};

//En formulario de contacto, guardo el mensaje.
export const guardarContacto = (name, email, message) => {
  console.log(name, email, message);
  addDoc(collection(db, "mensajesContacto"), { name, email, message });
};
