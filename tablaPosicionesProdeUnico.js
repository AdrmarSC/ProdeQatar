import { unificarTodosUsuario, cargaTablaPosicionesFechas, cargaTablaPosicionesProdeUnico } from "./firebase.js";
import { noPasa, ultUpdTablaPos } from "./js/env.js"


export const encryptObj = (obj, ps) => CryptoJS.AES.encrypt(JSON.stringify(obj), ps).toString();
export const decryptObj = (cryp, ps) => JSON.parse(CryptoJS.AES.decrypt(cryp, ps).toString(CryptoJS.enc.Utf8));

//Variable que guarda el objecto de datos.
var usuario;
var objTodosDocsUsuarios = null;
var objTablaPosiciones = new Object();
objTablaPosiciones.usuarios = new Array();
var colorUsuario;


//------------------------------------------------------------------------------------------------
// Función para crear la tabla de posiciones
const cargarTablaPosiciones = async () => {
    //Busco el doc en FB con la tabla de posiciones
    await cargaTablaPosicionesProdeUnico()
    objTablaPosiciones = JSON.parse(window.localStorage.getItem("tablaPosicionesProdeUnico"));
    console.log(objTablaPosiciones);

    var vartablaPosiciones = `
    <div class="cuadroCompleto tablaprodeunico">
        <div class="tituloCuadro">Tabla de posiciones modo UNICO</div>
            <div class="tablaCompleta">
                <div class="titulosParticipantes">
                    <div class="puesto">PUESTO</div>
                    <div class="participante">PARTICIPANTE</div>
                    <div class="puntos">PUNTOS</div>
                    <div class="pj">PJ</div>
                    <div class="cincopuntos">5 Pts</div>
                    <div class="cuatropuntos">4 Pts</div>
                    <div class="trespuntos">3 Pts</div>
                    <div class="dospuntos">2 Pts</div>
                    <div class="unpunto">1 Pts</div>
                    <div class="ceropunto">0 Pts</div>
                    <div class="participacion"> > 5 pts</div>
                </div>        
    `
    let puesto = 0;

    objTablaPosiciones.usuarios.sort((a, b) => b.puntos - a.puntos).forEach(usu => {
        let userLogeado = usuario.substring(0, usuario.indexOf('@'));
        colorUsuario = (usu.user === userLogeado ? "green" : "transparent");
        puesto++;
        vartablaPosiciones += `
                <div class="filaParticipantes" style="background-color:${colorUsuario} !important">
                    <div class="puesto">${puesto}</div >
                    <div class="participante">${usu.user}</div>
                    <div class="puntos">${usu.puntos}</div>
                    <div class="pj">${usu.pj}</div>
                    <div class="cincopuntos">${usu.cincopt}</div>
                    <div class="cuatropuntos">${usu.cuatropt}</div>
                    <div class="trespuntos">${usu.trespt}</div>
                    <div class="dospuntos">${usu.dospt}</div>
                    <div class="unpunto">${usu.unopt}</div>
                    <div class="ceropunto">${usu.ceropt}</div>
                    <div class="participacion">${usu.mascincopt} (${usu.ptsmascincopt} p)</div>
                </div >
           `
    })

    vartablaPosiciones += `
        </div >
    </div >
    <div class="ultimaActualizacion">Ultima actualización: ${objTablaPosiciones.user_modificacion}</div>
    `
    document.getElementById("tablaPosiciones").innerHTML = vartablaPosiciones
};
//------------------------------------------------------------------------------------------------


window.onload = async () => {
    document.getElementById("animacion").innerHTML = `<div class="loading"> Loading &#8230;</div>`
    let actualizar = false;
    if (!(localStorage.getItem("user") === null)) {
        usuario = decryptObj(localStorage.getItem("user"), noPasa);
        console.log("usuario logeado")
        console.log(localStorage.getItem("ultUpdTablaPos"));
        if (Number(ultUpdTablaPos) > 0) {
            if (!(localStorage.getItem("ultUpdTablaPos") === null)) {
                console.log("local: " + localStorage.getItem("ultUpdTablaPos") + ", ul: " + ultUpdTablaPos)
                if (!(Number(localStorage.getItem("ultUpdTablaPos")) === Number(ultUpdTablaPos))) {
                    console.log("datos en storage no actualizados")
                    actualizar = true;
                } else {
                    console.log("datos en storage actualizados")
                    actualizar = false;
                    await cargarTablaPosiciones();
                }
            } else {
                actualizar = true;
            }

            if (actualizar) {
                console.log("actualizado")
                window.localStorage.setItem("ultUpdTablaPos", ultUpdTablaPos)
                console.log("recuperando datos")
                await cargaTablaPosicionesProdeUnico()
                await cargarTablaPosiciones()
                //acaaaaaaaaaaaaaa va funcion carga de tabla posiciones
                //await cargaUltimoDocumento(usuario);
            }
        } else {
            document.getElementById("animacion").innerHTML = `<div> Aún no finalizó la carga de resultados. Se visualizará el 20/11. </div> `
        }
    } else {
        document.getElementById("animacion").innerHTML = `<div> Iniciar sesión y clickear en la sección "Tabla de posiciones".</div>`
    }
}

//--------------------------------------------------------------------------------


