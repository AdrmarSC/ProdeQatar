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
  updateDoc,
  getDoc,
  getDocs,
  where,
  Timestamp,
  query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-firestore.js";

import { noPasa } from "./js/env.js"
import { objModeloCierreFechas } from "./js/modeloCierreFechas.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//*******************************************************/
//*****************TEST***********************************/

const firebaseConfig = {
  apiKey: "AIzaSyAuW45bTxQWs0-LQExc0A_2HZnJLWCQ7N4",
  authDomain: "prodeqatar-364703.firebaseapp.com",
  projectId: "prodeqatar-364703",
  storageBucket: "prodeqatar-364703.appspot.com",
  messagingSenderId: "604182413607",
  appId: "1:604182413607:web:77bbc4a3965ebc6183e902",
  measurementId: "G-SQ4Z7RMRCT",
};

//*****************TEST***********************************/


//*****************PROD***********************************/
//********************************************************/
/*
const firebaseConfig = {
  apiKey: "AIzaSyB4RXWMT3ar_xGx2p7dERXpRVP2gOolNoA",
  authDomain: "apuesqatar2022.firebaseapp.com",
  projectId: "apuesqatar2022",
  storageBucket: "apuesqatar2022.appspot.com",
  messagingSenderId: "386367050101",
  appId: "1:386367050101:web:cb061c8c9f7506fc22433c",
  measurementId: "G-0N522E8PET"
};
*/
//********************************************************/

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

//Genera documento con prode de cada usuario.
export const updateProdeFecha = async (objeto, usuario, version) => {
  let docu = usuario.toUpperCase() + "_v" + version;
  objeto.timestamp = Timestamp.fromDate(new Date())
  console.log("docu => " + docu);
  await setDoc(doc(db, "prodeFechas", docu), objeto);
};

//Genera documento UNICO con prode de cada usuario.
export const updateProdeFechaUnico = async (objeto, usuario) => {
  let docu = usuario.toUpperCase();
  objeto.timestamp = Timestamp.fromDate(new Date())
  console.log("docu => " + docu);
  await setDoc(doc(db, "prodeFechasUsuarios", docu), objeto);
};


export const encryptObj = (obj, ps) => CryptoJS.AES.encrypt(JSON.stringify(obj), ps).toString()
export const decryptObj = (cryp, ps) => JSON.parse(CryptoJS.AES.decrypt(cryp, ps).toString(CryptoJS.enc.Utf8))

/* En desuso, ya no busca la versión más actualizada sino el usuario UNICO
//Busca la version con número más alto y muesta al usuario su prode
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
    const encryptedObject = encryptObj(JSON.stringify(doc.data()), noPasa);
    window.localStorage.setItem("objFiBdata", encryptedObject)
  });
};
*/

//Busca el archivo único del usuario
export const cargaUltimoDocumento = async (usuario) => {
  //Filtra entre los documentos del usuario y se queda con el actualizado por fecha más reciente.
  let docu = usuario;
  const docRef = doc(db, "prodeFechasUsuarios", docu)
  console.log("docu => " + docu);
  const docRecu = await getDoc(docRef);
  //window.localStorage.setItem("prodeUser", JSON.stringify(docRecu.data()))
  const encryptedObject = encryptObj(JSON.stringify(docRecu.data()), noPasa);
  window.localStorage.setItem("objFiBdata", encryptedObject);
};

export const cargaUserCero = async (objeto, usuario, version) => {
  let docu = usuario.toUpperCase() + "_v" + version;
  objeto.timestamp = Timestamp.fromDate(new Date())
  console.log(docu);
  await setDoc(doc(db, "prodeFechas", docu), objeto);
};

//---------------------------------------------------------------------------------------------
export var usuariosCierreFecha = [];
export const ultimaVersionUsuarios = async () => {
  //funcion para traer la ultima version con los resultados de los usuarios. Devuelve los mails (users) unicos. 
  const colle = collection(db, "prodeFechas")
  const usuariosMail = [];
  let j = 0
  const querySnapshot = await getDocs(colle);
  querySnapshot.forEach((doc) => {
    //console.log(doc.id, " => ", doc.data());
    usuariosMail[j] = doc.data().user
    j++
  });
  console.log(usuariosMail)
  const usuUnicos = [...new Set(usuariosMail)]
  for (let usu of usuUnicos) {
    const q = await getDocs(query(colle, where("user", "==", usu), orderBy("timestamp", "desc"), limit(1)))
    q.forEach(async (doc2) => {
      console.log(doc2.id)
      usuariosCierreFecha.push(doc2.id)
    });
  }
  console.log(usuariosCierreFecha)
};
//---------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------
//Trae todos los datos de todas las versiones de usuarios. 
export const generarObjPronosticos = async () => {
  //funcion para traer la ultima version con los resultados de los usuarios. Devuelve los mails (users) unicos. 
  const colle = collection(db, "prodeFechas")
  const todosDocs = [];
  let j = 0
  const querySnapshot = await getDocs(colle);
  querySnapshot.forEach((doc) => {
    //console.log(doc.id, " => ", doc.data());
    todosDocs[j] = doc.data()
    j++
  });
  window.localStorage.removeItem("todosDocs");
  window.localStorage.setItem("todosDocs", JSON.stringify(todosDocs))
  console.log(JSON.parse(window.localStorage.getItem("todosDocs")))
};
//-----------------------------------------------------------------------------------------



export const docCierreFecha = async (objeto, fecha) => {
  //Genera documento unico para cada fecha con todos los pronosticos de usuarios.
  let docu = "docFecha_" + fecha;
  const docRef = doc(db, "cierreFechas", docu)
  objeto.user_modificacion = new Date().toLocaleString();
  objeto.timestamp = Timestamp.fromDate(new Date())
  console.log("docu => " + docu);
  await setDoc(docRef, objeto);
  //------------Unifica la fecha en un doc en Firebase en collectino FechasCerradas
  var objFechasCompleto = new Object()
  let docu2 = "FechasCerradas"
  const docRef2 = doc(db, "cierreFechas", docu2)
  const docRecu = await getDoc(docRef2)
  if (docRecu.exists()) {
    objFechasCompleto = docRecu.data();
    objFechasCompleto.fechanro[fecha - 1] = objeto;
  } else {
    //si no existe el archivo entonces va a ser la primera fecha.
    objFechasCompleto.fechanro = new Array();
    objFechasCompleto.fechanro[0] = objeto;
  }
  await setDoc(doc(db, "cierreFechas", docu2), objFechasCompleto);
  window.localStorage.setItem("FechasCerradas", JSON.stringify(objFechasCompleto))

};

//----------------------------------------------
export const docFechasCerradas = async () => {
  //Genera documento unico para cada fecha con todos los pronosticos de usuarios.
  let docu = "FechasCerradas";
  const docRef = doc(db, "cierreFechas", docu)
  console.log("docu => " + docu);
  const docRecu = await getDoc(docRef);
  //const encryptedObject = encryptObj(JSON.stringify(docRecu.data()), noPasa);
  //window.localStorage.setItem("FechasCerradas", encryptedObject)
  window.localStorage.setItem("FechasCerradas", JSON.stringify(docRecu.data()))
};

//-----------------------------------------------------------------------------------
//Carga de resultados
export const updateDocResultados = async (objeto, usuario) => {
  //Genera documento unico para cada fecha con todos los pronosticos de usuarios.
  let docu = usuario.toUpperCase();
  const docRef = doc(db, "resultadoFechas", docu)
  const docRecu = await getDoc(docRef)
  if (!(docRecu.exists())) {
    //si no existe el archivo entonces crea el modelo.
    objeto = JSON.parse(JSON.stringify(objModeloCierreFechas));
    objeto.user_modificacion = new Date().toLocaleString();
    objeto.timestamp = Timestamp.fromDate(new Date())
    console.log("resultadosFechas CERO docu => " + docu);
    await setDoc(docRef, objeto);
  } else if (!(objeto === null)) {
    objeto.user_modificacion = new Date().toLocaleString();
    objeto.timestamp = Timestamp.fromDate(new Date())
    console.log("resultadosFechas docu => " + docu);
    await setDoc(docRef, objeto);
    window.localStorage.setItem("resultadoFechas", JSON.stringify(objeto));
  }
};

//Busca el archivo único de resultados
export const cargaResultados = async (usuario) => {
  //Filtra entre los documentos del usuario y se queda con el actualizado por fecha más reciente.
  let docu = usuario.toUpperCase();
  const docRef = doc(db, "resultadoFechas", docu)
  console.log("docu => " + docu);
  const docRecu = await getDoc(docRef);
  window.localStorage.setItem("resultadoFechas", JSON.stringify(docRecu.data()))
};
//-----------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------
//Trae cada archivo unico de usuario para actualizar RESULTADOS
export const unificarTodosUsuario = async () => {
  //funcion para traer la ultima version con los resultados de los usuarios. Devuelve los mails (users) unicos. 
  const colle = collection(db, "prodeFechasUsuarios")
  const todosDocsUnificado = [];
  let j = 0
  const querySnapshot = await getDocs(colle);
  querySnapshot.forEach((doc) => {
    //console.log(doc.id, " => ", doc.data());
    todosDocsUnificado[j] = doc.data()
    j++
  });
  window.localStorage.removeItem("todosDocsUnificado");
  window.localStorage.setItem("todosDocsUnificado", JSON.stringify(todosDocsUnificado))
  console.log("docu => " + "todosDocsUnificado")

};

export const updateResultadosUsuarios = async (objeto, usuario) => {
  //Actualiza cada documento de usuario con los partidos.
  let docu = usuario.toUpperCase();
  console.log("docu => " + docu);
  await setDoc(doc(db, "prodeFechasUsuarios", docu), objeto);
};

export const updatePronosFechasCerradas = async (objeto) => {
  let docu = "FechasCerradas"
  objeto.user_modificacion = new Date().toLocaleString();
  objeto.timestamp = Timestamp.fromDate(new Date())
  const docRef = doc(db, "cierreFechas", docu)
  console.log("docu => " + "FechasCerradas")
  await setDoc(docRef, objeto);
  window.localStorage.setItem("FechasCerradas", JSON.stringify(objeto))
}

//-----------------------------------------------------------------------------------
export const updateTablaPosicionesFechas = async (objeto) => {
  let docu = "tablaPosiciones"
  objeto.user_modificacion = new Date().toLocaleString();
  objeto.timestamp = Timestamp.fromDate(new Date())
  console.log("docu => " + "tablaPosiciones")
  const docRef = doc(db, "tablaPosFechas", docu)
  await setDoc(docRef, objeto);
  window.localStorage.setItem("tablaPosiciones", JSON.stringify(objeto))
}

export const cargaTablaPosicionesFechas = async () => {
  //Filtra entre los documentos del usuario y se queda con el actualizado por fecha más reciente.
  let docu = "tablaPosiciones";
  const docRef = doc(db, "tablaPosFechas", docu)
  console.log("docu => " + docu);
  const docRecu = await getDoc(docRef);
  window.localStorage.setItem("tablaPosiciones", JSON.stringify(docRecu.data()))
};


//--------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//Busca el archivo único de resultados ADMIN
export const cargaAdminUnico = async (usuario) => {
  //let docu = "OCTAVOS_" + usuario.toUpperCase();
  let docu = usuario.toUpperCase();
  const docRef = doc(db, "resultadoFechas", docu)
  console.log("docu => " + docu);
  const docRecu = await getDoc(docRef);
  window.localStorage.setItem("fasesFinales", JSON.stringify(docRecu.data()))
};

export const updateFasesFinales = async (objeto, usuario) => {
  // let docu = "OCTAVOS_" + usuario.toUpperCase();
  let docu = usuario.toUpperCase();
  const docRef = doc(db, "resultadoFechas", docu)
  objeto.user_modificacion = new Date().toLocaleString();
  objeto.timestamp = Timestamp.fromDate(new Date())
  console.log("docu => " + docu);
  await setDoc(docRef, objeto);
};


//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------

//*************************************************************************************************** */
//Backup archivo admin
export const backupAdminUnico = async (objeto, usuario) => {
  let docu = "BACKUP_" + usuario.toUpperCase();
  const docRef = doc(db, "BACKUPS", docu)
  objeto.user_modificacion = new Date().toLocaleString();
  objeto.timestamp = Timestamp.fromDate(new Date())
  console.log("docu => " + docu);
  await setDoc(docRef, objeto);
};
//*************************************************************************************************** */

//*************************************************************************************************** */
//Trae cada archivo unico de usuario para actualizar Fases Finales
export const traeFasesFinalesUsuariosUnicos = async () => {
  const colle = collection(db, "prodeFechasUsuarios")
  const todosDocsUnificadoFasesFinales = [];
  let j = 0
  const querySnapshot = await getDocs(colle);
  querySnapshot.forEach((doc) => {
    //console.log(doc.id, " => ", doc.data());
    todosDocsUnificadoFasesFinales[j] = doc.data()
    j++
  });
  window.localStorage.removeItem("todosDocsUnificadoFasesFinales");
  window.localStorage.setItem("todosDocsUnificadoFasesFinales", JSON.stringify(todosDocsUnificadoFasesFinales))
  console.log("docu => " + "todosDocsUnificadoFasesFinales")

};

//*************************************************************************************************** */


//*************************************************************************************************** */
//Guardar Prode Unico por usuario

export const saveProdeUnicoUser = async (objeto, usuario) => {
  let docu = usuario.toUpperCase();
  const docRef = doc(db, "prodeUnico", docu)
  objeto.user_modificacion = new Date().toLocaleString();
  objeto.timestamp = Timestamp.fromDate(new Date())
  console.log("docu => " + docu);
  await setDoc(docRef, objeto);
};
export const cargaProdeUnicoUser = async (usuario) => {
  let docu = usuario.toUpperCase();
  const docRef = doc(db, "prodeUnico", docu)
  console.log("docu => " + docu);
  const docRecu = await getDoc(docRef);
  //window.localStorage.setItem("prodeUnicoUser", JSON.stringify(docRecu.data())):
  const encObj = encryptObj(JSON.stringify(docRecu.data()), noPasa);
  window.localStorage.setItem("prodeUnicoUser", encObj);
};

export const updateProdeUnicoResultados = async (objeto, usuario) => {
  let docu = usuario.toUpperCase();
  const docRef = doc(db, "prodeUnicoResultados", docu)
  objeto.user_modificacion = new Date().toLocaleString();
  objeto.timestamp = Timestamp.fromDate(new Date())
  console.log("docu => " + docu);
  await setDoc(docRef, objeto);
};

export const cargaProdeUnicoResultadosAdmin = async (usuario) => {
  let docu = usuario.toUpperCase();
  const docRef = doc(db, "prodeUnicoResultados", docu)
  console.log("docu => " + docu);
  const docRecu = await getDoc(docRef);
  //window.localStorage.setItem("prodeUnicoUser", JSON.stringify(docRecu.data())):
  const encObj = encryptObj(JSON.stringify(docRecu.data()), noPasa);
  window.localStorage.setItem("prodeUnicoAdmin", encObj);
};

export const updateResultadosUsuariosProdeUnico = async (objeto, usuario) => {
  //Actualiza los resultados a cada usuario con sus puntajes
  let docu = usuario.toUpperCase();
  const docRef = doc(db, "prodeUnico", docu)
  objeto.user_modificacion = new Date().toLocaleString();
  objeto.timestamp = Timestamp.fromDate(new Date())
  console.log("docu => " + docu);
  await setDoc(docRef, objeto);
};

export const updatePronosticosProdeUnico = async (objeto) => {
  //Actualiza los PRONOSTICOS de cada usuario
  let docu = "docPRONOSTICOS";
  objeto.user_modificacion = new Date().toLocaleString();
  objeto.timestamp = Timestamp.fromDate(new Date())
  const docRef = doc(db, "prodeUnicoResultados", docu)
  console.log("docu => " + docu);
  await setDoc(docRef, objeto);
};

export const cargaPronosticosProdeUnico = async () => {
  //Actualiza los PRONOSTICOS de cada usuario
  let docu = "docPRONOSTICOS";
  const docRef = doc(db, "prodeUnicoResultados", docu)
  console.log("docu => " + docu);
  const docRecu = await getDoc(docRef);
  window.localStorage.setItem("objPronosticoProdeUnico", JSON.stringify(docRecu.data()))
};

export const updateTablaPosicionesProdeUnico = async (objeto) => {
  let docu = "tablaPosicionesProdeUnico"
  objeto.user_modificacion = new Date().toLocaleString();
  objeto.timestamp = Timestamp.fromDate(new Date())
  console.log("docu => " + "tablaPosicionesProdeUnico")
  const docRef = doc(db, "prodeUnicoResultados", docu)
  await setDoc(docRef, objeto);
  window.localStorage.setItem("tablaPosicionesProdeUnico", JSON.stringify(objeto))
}

export const cargaTablaPosicionesProdeUnico = async () => {
  let docu = "tablaPosicionesProdeUnico";
  const docRef = doc(db, "prodeUnicoResultados", docu)
  console.log("docu => " + docu);
  const docRecu = await getDoc(docRef);
  window.localStorage.setItem("tablaPosicionesProdeUnico", JSON.stringify(docRecu.data()))
};

//*************************************************************************************************** */



//*************************************************************************************************** */
//-----------------------------------------------------------------------------------
//Trae cada archivo unico de usuario para actualizar RESULTADOS
export const unificarTodosUsuariosProdeUnico = async () => {
  //funcion para traer la ultima version con los resultados de los usuarios. Devuelve los mails (users) unicos. 
  const colle = collection(db, "prodeUnico")
  const todosDocsProdeUnico = [];
  let j = 0
  const querySnapshot = await getDocs(colle);
  querySnapshot.forEach((doc) => {
    //console.log(doc.id, " => ", doc.data());
    todosDocsProdeUnico[j] = doc.data()
    j++
  });
  window.localStorage.removeItem("todosDocsProdeUnico");
  window.localStorage.setItem("todosDocsProdeUnico", JSON.stringify(todosDocsProdeUnico))
  console.log("docu => " + "todosDocsProdeUnico")

};
//*************************************************************************************************** */

export const cargaUltimoDocumentoFechaPrueba = async (usuario) => {
  //Filtra entre los documentos del usuario y se queda con el actualizado por fecha más reciente.
  let docu = usuario;
  const docRef = doc(db, "prodeFechasUsuarios", docu)
  console.log("docu => " + docu);
  const docRecu = await getDoc(docRef);
  window.localStorage.setItem("ObjUlt_Fecha", JSON.stringify(docRecu.data()))

};

export const cargaUltimoDocumentoUNICOPrueba = async (usuario) => {
  //Filtra entre los documentos del usuario y se queda con el actualizado por fecha más reciente.
  let docu = usuario;
  const docRef = doc(db, "prodeUnico", docu)
  console.log("docu => " + docu);
  const docRecu = await getDoc(docRef);
  window.localStorage.setItem("ObjUlt_Unico", JSON.stringify(docRecu.data()))

};
//*************************************************************************************************** */


export const cargaProdeUnicoAdmin = async () => {
  let docu = "ADMINISTRADOR@ADMIN.COM";
  const docRef = doc(db, "prodeUnicoResultados", docu)
  console.log("docu => " + docu);
  const docRecu = await getDoc(docRef);
  window.localStorage.setItem("PUAdmin", JSON.stringify(docRecu.data()))
};

export const cargaProdeFechasAdmin = async () => {
  let docu = "ADMINISTRADOR@ADMIN.COM";
  const docRef = doc(db, "resultadoFechas", docu)
  console.log("docu => " + docu);
  const docRecu = await getDoc(docRef);
  window.localStorage.setItem("PFAdmin", JSON.stringify(docRecu.data()))
};



//*************************************************************************************************** */
export const backupDocFechasUser = async () => {
  //Backup de usuarios Fechas
  const colle = collection(db, "prodeFechasUsuarios")
  const todosDocsFechas = [];

  const querySnapshot = await getDocs(colle);
  querySnapshot.forEach(async (docu) => {
    //console.log(doc.id, " => ", doc.data());
    todosDocsFechas.push(docu.data())
    let docBackup = "BACKUP_8_" + docu.id;
    console.log("docu => " + docu.id);
    const docRefB = doc(db, "BACKUPS", docBackup)
    await setDoc(docRefB, docu.data());
  });
  console.log({ todosDocsFechas });
  window.localStorage.removeItem("todosDocsFechas8");
  window.localStorage.setItem("todosDocsFechas8", JSON.stringify(todosDocsFechas))
};

export const backupDocUnicoUser = async () => {
  //Backup de usuarios Fechas
  const colle = collection(db, "prodeUnico")
  const todosDocsUnico = [];
  const querySnapshot = await getDocs(colle);
  querySnapshot.forEach(async (docu) => {
    //console.log(doc.id, " => ", doc.data());
    todosDocsUnico.push(docu.data())
    let docBackup = "BACKUP_UNICO8_" + docu.id;
    console.log("docu => " + docu.id);
    const docRefB = doc(db, "BACKUPS", docBackup)
    await setDoc(docRefB, docu.data());
  });
  console.log({ todosDocsUnico });
  window.localStorage.removeItem("todosDocsUnico8");
  window.localStorage.setItem("todosDocsUnico8", JSON.stringify(todosDocsUnico))
};

//*************************************************************************************************** */
