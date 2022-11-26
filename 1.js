
/* Importart desde el archivo 11prodes*/
import { updateProdeFecha, updateProdeFechaUnico, saveProdeUnicoUser } from "./firebase.js";

/*
import { fechaDiego, unicoDiego, fechaPablo, unicoPablo, fechaSeba, unicoSeba, fechaAriel, unicoAriel } from "./js/11prodes.js"
await updateProdeFecha(fechaAriel, "ARIELMORENO85@HOTMAIL.COM", 0)
await updateProdeFechaUnico(fechaAriel, "ARIELMORENO85@HOTMAIL.COM")
await saveProdeUnicoUser(unicoAriel, "ARIELMORENO85@HOTMAIL.COM")

await updateProdeFecha(fechaDiego, "VILLAFANEDIEGO@GMAIL.COM", 0)
await updateProdeFechaUnico(fechaDiego, "VILLAFANEDIEGO@GMAIL.COM")
await saveProdeUnicoUser(unicoDiego, "VILLAFANEDIEGO@GMAIL.COM")

await updateProdeFecha(fechaPablo, "PEPRIETO@GMAIL.COM", 0)
await updateProdeFechaUnico(fechaPablo, "PEPRIETO@GMAIL.COM")
await saveProdeUnicoUser(unicoPablo, "PEPRIETO@GMAIL.COM")

await updateProdeFecha(fechaSeba, "SEBASV2002@HOTMAIL.COM", 0)
await updateProdeFechaUnico(fechaSeba, "SEBASPV2002@HOTMAIL.COM")
await saveProdeUnicoUser(unicoSeba, "SEBASV2002@HOTMAIL.COM")
*/

/*
import { cargaUltimoDocumentoFechaPrueba, cargaUltimoDocumentoUNICOPrueba } from "./firebase.js";

await cargaUltimoDocumentoFechaPrueba("VILLAFANEDIEGO@GMAIL.COM")
window.localStorage.setItem("ObjUlt_fecha_Diego", window.localStorage.getItem("ObjUlt_Fecha"))
await cargaUltimoDocumentoFechaPrueba("SEBASV2002@HOTMAIL.COM")
window.localStorage.setItem("ObjUlt_fecha_Seba", window.localStorage.getItem("ObjUlt_Fecha"))
await cargaUltimoDocumentoFechaPrueba("ARIELMORENO85@HOTMAIL.COM")
window.localStorage.setItem("ObjUlt_fecha_Ariel", window.localStorage.getItem("ObjUlt_Fecha"))
await cargaUltimoDocumentoFechaPrueba("ADRIANMARTIN@GMAIL.COM")
window.localStorage.setItem("ObjUlt_fecha_Adri", window.localStorage.getItem("ObjUlt_Fecha"))
await cargaUltimoDocumentoFechaPrueba("PEPRIETO@GMAIL.COM")
window.localStorage.setItem("ObjUlt_fecha_Pablo", window.localStorage.getItem("ObjUlt_Fecha"))

await cargaUltimoDocumentoUNICOPrueba("VILLAFANEDIEGO@GMAIL.COM")
window.localStorage.setItem("ObjUlt_unico_Diego", window.localStorage.getItem("ObjUlt_Unico"))
await cargaUltimoDocumentoUNICOPrueba("SEBASV2002@HOTMAIL.COM")
window.localStorage.setItem("ObjUlt_unico_Seba", window.localStorage.getItem("ObjUlt_Unico"))
await cargaUltimoDocumentoUNICOPrueba("ARIELMORENO85@HOTMAIL.COM")
window.localStorage.setItem("ObjUlt_unico_Ariel", window.localStorage.getItem("ObjUlt_Unico"))
await cargaUltimoDocumentoUNICOPrueba("ADRIANMARTIN@GMAIL.COM")
window.localStorage.setItem("ObjUlt_unico_Adri", window.localStorage.getItem("ObjUlt_Unico"))
await cargaUltimoDocumentoUNICOPrueba("PEPRIETO@GMAIL.COM")
window.localStorage.setItem("ObjUlt_unico_Pablo", window.localStorage.getItem("ObjUlt_Unico"))
*/

/* Funcion que resetea el doc de usuario en prode fecha unica*/
/*
import { cargaUltimoDocumentoFechaPrueba, backupAdminUnico } from "./firebase.js";

await cargaUltimoDocumentoFechaPrueba("ENZO_PEREZ@GMAIL.COM")

await backupAdminUnico(JSON.parse(window.localStorage.getItem("ObjUlt")), "ENZO_PEREZ@GMAIL.COM")
*/


//import { cargaProdeUnicoCERO} from "./js/loginFirebase.js";
//import { modeloProdeUnicoCero, modeloTablaGruposCero } from "./js/modeloCEROProdeUnico.js"

/*
export const encryptObj = (obj, ps) => CryptoJS.AES.encrypt(JSON.stringify(obj), ps).toString()
export const decryptObj = (cryp, ps) => JSON.parse(CryptoJS.AES.decrypt(cryp, ps).toString(CryptoJS.enc.Utf8))
var usuario;
usuario = decryptObj(localStorage.getItem("user"), "prueba");
let objUnico = new Object()
objUnico.tablaGrupos = modeloTablaGruposCero;
objUnico.partidos = modeloProdeUnicoCero;
objUnico.user = usuario.toUpperCase()
await cargaProdeUnicoCERO(objUnico, usuario);

*/
/*
let objUnico = new Object()
objUnico.tablaGrupos = modeloTablaGruposCero;
objUnico.partidos = modeloProdeUnicoCero;
await cargaProdeUnicoCERO(objUnico, "ARIELMORENO85@HOTMAIL.COM");
*/
/*
let ObjModProunic = new Object()
ObjModProunic = modeloProdeUnicoCero
console.log({ ObjModProunic })

ObjModProunic.forEach(p => {
    p.prodePartido.prode_eqlocal = ""
    p.prodePartido.prode_eqvisitante = ""
    p.prodePartido.prode_icolocal = "vacio"
    p.prodePartido.prode_icovisitante = "vacio"
    p.prodePartido.prode_eqwin = ""
    p.prodePartido.prode_icowin = "vacio"
    p.realPartido.resul_eqlocal = ""
    p.realPartido.resul_icolocal = "vacio"
    p.realPartido.resul_eqvisitante = ""
    p.realPartido.resul_icovisitante = "vacio"

});
console.log(ObjModProunic)

*/
/*
import { updateProdeUnicoResultados } from "./firebase.js";
import { modeloProdeUnicoCero, modeloTablaGruposCero } from "./js/modeloCEROProdeUnico.js"
//Carga de usuario admin en blanco
let objAdmin = new Object()
objAdmin.tablaGrupos = modeloTablaGruposCero;
objAdmin.partidos = modeloProdeUnicoCero;
objAdmin.user = "ADMINISTRADOR@ADMIN.COM"
await updateProdeUnicoResultados(objAdmin, "ADMINISTRADOR@ADMIN.COM");

*/