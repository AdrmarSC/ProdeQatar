// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-analytics.js";

// Add Firebase products that you want to use
import { getAuth } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js";
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
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore();

export const saveResultGrupo = (grupo) => {
  collection(db, "");
  console.log(grupo);
};

//En formulario de contacto, guardo el mensaje.
export const guardarContacto = (nombre, correo, mensaje, fechahora) => {
  addDoc(collection(db, "mensajesContacto"), { nombre, correo, mensaje, fechahora });
};

export const updateProdeFecha = async (objeto, usuario, version) => {
  let docu = usuario + "_V" + version;
  objeto.timestamp = Timestamp.fromDate(new Date())
  console.log(docu);
  await setDoc(doc(db, "prodeFechas", docu), objeto);
};

export const consultaDocumento = async (usuario, version) => {
  let docuUser = usuario + "_V" + version;
  console.log("docuUser" + docuUser);
  const documento = await getDoc(doc(db, "prodeFechas", docuUser));
  console.log("Reccuperado de firebase");
  console.log(documento.data()) //todas las fechas
  console.log(documento.data().fechanro[0].partidos); //fecha
  //window.localStorage.setItem("objFBdata", JSON.stringify(documento.data())); //guardo en local
  window.localStorage.setItem("objFBdata", JSON.stringify(documento.data().fechanro[0].partidos)); //guardo en local
}



export const cargaUltimoDocumento = async (usuario) => {
  //Filtra entre los documentos del usuario y se queda con el actualizado por fecha más reciente.
  const colle = collection(db, "prodeFechas")
  //const q = query(colle, where("user", "==", "prueba0@prueba.com"), orderBy("user_modificacion", "desc"), limit(1))
  const q = query(colle, where("user", "==", usuario), orderBy("timestamp", "desc"), limit(1))
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    // const todayAsTimestamp = Timestamp.fromDate(new Date());
    // console.log(todayAsTimestamp)
    //window.localStorage.setItem("objFBdata", JSON.stringify(doc.data().fechanro[0].partidos));
    window.localStorage.setItem("objFBdata", JSON.stringify(doc.data()));
  });
};


export const cargaUserCero = async (objeto, usuario, version) => {
  let docu = usuario + "_V" + version;
  objeto.timestamp = Timestamp.fromDate(new Date())
  console.log(docu);
  await setDoc(doc(db, "prodeFechas", docu), objeto);
};
