
/* Funcion que resetea el doc de usuario en prode fecha unica*/
import { cargaProdeUnicoCERO } from "./js/loginFirebase.js";
import { modeloProdeUnicoCero, modeloTablaGruposCero } from "./js/modeloCEROProdeUnico.js"
export const encryptObj = (obj, ps) => CryptoJS.AES.encrypt(JSON.stringify(obj), ps).toString()
export const decryptObj = (cryp, ps) => JSON.parse(CryptoJS.AES.decrypt(cryp, ps).toString(CryptoJS.enc.Utf8))
var usuario;
usuario = decryptObj(localStorage.getItem("user"), "prueba");
let objUnico = new Object()
objUnico.tablaGrupos = modeloTablaGruposCero;
objUnico.partidos = modeloProdeUnicoCero;
objUnico.user = usuario.toUpperCase()
await cargaProdeUnicoCERO(objUnico, usuario);

