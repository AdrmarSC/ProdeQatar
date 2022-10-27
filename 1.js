import { cargaUltimoDocumento } from "./firebase.js";
import { datosProdeCero } from "./js/modeloCERO.js"
// let tokensData = {
//     O: {
//         id: 0,
//         name: '',
//         organization: '',
//     },
//     1: {
//         id: 1,
//         name: '',
//         organization: '',
//     },
//     2: {
//         id: 2,
//         name: '',
//         organization: '',
//     }
// }

// let store = [0, 1];

// const result = Object.entries(tokensData).filter(([k, v]) => !store.some(s => s == v.id));

// console.log(Object.fromEntries(result));

// console.log(Object.entries(tokensData));

// consultaDocumento2("prueba6@prueba.com");

// const fechaHora = new Date().toLocaleString();
// console.log(fechaHora);
// const fechaHora1 = Date.now();
// console.log(fechaHora1);
// console.log(datosProdeCero)

//cargaUltimoDocumento(localStorage.getItem("user"))



// var noPasa = "prueba";



// var encUser = CryptoJS.AES.encrypt(window.localStorage.getItem("user"), noPasa);
// window.localStorage.setItem("usuario", encUser)
// var decUser = CryptoJS.AES.decrypt(encUser, noPasa).toString(CryptoJS.enc.Utf8);
// console.log(decUser)

// const encryptObj = (obj, ps) => CryptoJS.AES.encrypt(JSON.stringify(obj), ps).toString()
// const decryptObj = (cryp, ps) => JSON.parse(CryptoJS.AES.decrypt(cryp, ps).toString(CryptoJS.enc.Utf8))

// const encryptedObject = encryptObj(window.localStorage.getItem("objFBdata"), noPasa);
// const decryptedObject = decryptObj(encryptedObject, noPasa)
// console.log(encryptedObject)
// console.log(decryptedObject)
// window.localStorage.setItem("objEnc", encryptedObject)
// window.localStorage.setItem("obj", decryptedObject)

// const EEEE = encryptObj(window.localStorage.getItem("user"), noPasa)
// window.localStorage.setItem("STReeee", EEEE)
// const DDDD = decryptObj(EEEE, noPasa)
// window.localStorage.setItem("STRdddd", DDDD)



//var encData = CryptoJS.AES.encrypt(JSON.stringify(window.localStorage.getItem("objFBdata")), myPassword);
//console.log(decrypted.toString(CryptoJS.enc.Utf8));


// var bdenc = CryptoJS.AES.encrypt(JSON.stringify(window.localStorage.getItem("objFBdata")), myPassword);
// var bddesen = JSON.parse(CryptoJS.AES.decrypt(bdenc, myPassword).toString(CryptoJS.enc.Utf8));
// console.log("enc: " + bdenc);
// console.log("dec: " + bddesen);
// window.localStorage.setItem("obj", bddesen)
// //console.log(bddesen.toString(CryptoJS.enc.Utf8));
// console.log(bddesen)