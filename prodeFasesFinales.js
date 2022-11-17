import { cargaUltimoDocumento } from "./firebase"
await cargaUltimoDocumento()
datosLocalArcUnico = window.localStorage.setItem("objFiBdata", encryptedObject);
console.log(datosLocalArcUnico);