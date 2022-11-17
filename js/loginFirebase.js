// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

import { datosProdeCero } from "./modeloCERO.js"

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  where,
  Timestamp,
  query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { userAdmin } from "./env.js";
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
export const db = getFirestore();


export const cargaUserCero = async (objeto, usuario, version) => {
  let docu = usuario + "_v" + version;
  let docuUnico = usuario;
  objeto.timestamp = Timestamp.fromDate(new Date());
  objeto.user = usuario;
  objeto.user_modificacion = new Date().toLocaleString();
  console.log("docu => " + docuUnico);
  await setDoc(doc(db, "prodeFechasUsuarios", docuUnico), objeto);
  console.log("docu => " + docu);
  await setDoc(doc(db, "prodeFechas", docu), objeto);
};

/*
export const consultaExisteDocumento = async (usuario) => {
  //verifica si existe el documento en la collection
  const docRef = doc(db, "prodeFechas", usuario + "_v0");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    //console.log("Document data:", docSnap.data());
    console.log("existe archivo")
  } else {
    console.log("no existe archivo")
    cargaUserCero(datosProdeCero, usuario, 0)
  }
};
*/

export const consultaExisteDocumento = async (usuario) => {
  //verifica si existe el documento en la collection
  const docRef = doc(db, "prodeFechasUsuarios", usuario);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    //console.log("Document data:", docSnap.data());
    console.log("existe archivo login")
  } else {
    console.log("no existe archivo login")
    if (!(userAdmin === usuario)) {
      cargaUserCero(datosProdeCero, usuario, 0);
    }
  }
};


export const cargaProdeUnicoCERO = async (objeto, usuario) => {
  let docu = usuario.toUpperCase();
  const docRef = doc(db, "prodeUnico", docu)
  objeto.user_modificacion = new Date().toLocaleString();
  objeto.timestamp = Timestamp.fromDate(new Date())
  console.log("docu => " + docu);
  await setDoc(docRef, objeto);
};