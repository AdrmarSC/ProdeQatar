import { unificarTodosUsuariosProdeUnico } from "./firebase.js";
import { objModeloPronosticosProdeUnico } from "./js/modeloPronosticosProdeUnico.js"
import { noPasa } from "./js/env.js"

export const encryptObj = (obj, ps) => CryptoJS.AES.encrypt(JSON.stringify(obj), ps).toString();
export const decryptObj = (cryp, ps) => JSON.parse(CryptoJS.AES.decrypt(cryp, ps).toString(CryptoJS.enc.Utf8));

//Variable que guarda el objecto de datos.
var fechaCerrada = [];
var usuario;
var objPronosticosProdeUnico;
var usuariosMail = new Array();

await unificarTodosUsuariosProdeUnico()


//Genero documento con todos los pronosticos de usuarios
export const generarDocPronosticos = async () => {
    //    await unificarTodosUsuario();
    let objTodosDocProdeUnico = JSON.parse(window.localStorage.getItem("todosDocsProdeUnico"));
    objPronosticosProdeUnico = JSON.parse(JSON.stringify(objModeloPronosticosProdeUnico))
    console.log(objTodosDocProdeUnico)
    console.log(objPronosticosProdeUnico)
    //ordeno los partidos de cada usuario
    objTodosDocProdeUnico.forEach(usu => {
        usu.partidos.sort((a, b) => a.id - b.id)
        usuariosMail.push(usu.user.substring(0, usu.user.indexOf('@')))
    });

    //Asigno a cada uno de los 64 partidos del modelo, el pronostico de cada usuario.
    objPronosticosProdeUnico.forEach((part, ind) => {
        part.prodes = new Array()
        objTodosDocProdeUnico.forEach(usu => {
            part.prodes.push(
                {
                    user: usu.user,
                    // prodePartido: usu.partidos[ind].prodePartido,
                    prodePartido: {
                        prode_ext: usu.partidos[ind].prodePartido.prode_ext,
                        prode_loc: usu.partidos[ind].prodePartido.prode_loc,
                        prode_vis: usu.partidos[ind].prodePartido.prode_vis,
                        prode_resul: usu.partidos[ind].prodePartido.prode_resul,
                        prode_eqlocal: usu.partidos[ind].datosPartido.eqlocal,
                        prode_eqvisitante: usu.partidos[ind].datosPartido.eqvisitante,
                        prode_icolocal: usu.partidos[ind].datosPartido.icolocal,
                        prode_icovisitante: usu.partidos[ind].datosPartido.icovisitante
                    }
                }
            )
        });
    });
    console.log(objPronosticosProdeUnico)
    window.localStorage.setItem("objPronosticoProdeUnico", JSON.stringify(objPronosticosProdeUnico))
}

generarDocPronosticos()


const disenoTablaPronosticosProdeUnico = async () => {
    var tablaPronosticosProdeUnico = `
    <div class="cuadroCompleto solapa1">
        <div class="tituloCuadro">Pronósticos Prode_Unico</div>
            <div class="titulosPartidos">
                <div class="fecha">DIA</div>
                <div class="tituloMedio">RESULTADO</div>`
    usuariosMail.forEach(u => {
        tablaPronosticosProdeUnico += `<div class="tituloJugadores">${u}</div>`
    })
    tablaPronosticosProdeUnico += `</div>`

    //Recorro partidos
    objPronosticosProdeUnico.forEach((pa, ind) => {
        tablaPronosticosProdeUnico += `
            <div class="filaPartido">
                        <div class="fecha">${pa.datosPartido.dia.substring(0, 2) + ". " + pa.datosPartido.fecha.substring(0, 5)} ${pa.datosPartido.hora.substring(0, 2) + "hs"}</div>
                        <div class="local">${pa.datosPartido.eqlocal}</div>
                        <div class="icoLocal">
                            <img src="img/equipos/${pa.datosPartido.icolocal}.png" class="imgIco" />
                        </div>
                        <div id="resLoc_L${ind}"  class="resLocal">${pa.realPartido.resul_loc}</div>
                        <div class="resMedio">-</div>
                        <div id="resVis_V${ind}"  class="resVisitante">${pa.realPartido.resul_vis}</div>
                        <div class="icoVisitante">
                            <img src="img/equipos/${pa.datosPartido.icovisitante}.png" class="imgIco" />
                        </div>
                        <div class="visitante">${pa.datosPartido.eqvisitante}</div>`
        pa.prodes.forEach((pro, pind) => {
            let resultadoReal = pa.realPartido.resul_loc + "-" + pa.realPartido.resul_vis;
            let loviReal = pa.realPartido.resultado;
            let loviProde = pro.prodePartido.prode_resul;
            let resultadoProde = pro.prodePartido.prode_loc + "-" + pro.prodePartido.prode_vis;
            let colorResul = "transparent";
            if (loviReal === "") { colorResul = "transparent" } else {
                if (loviReal === loviProde) {
                    if (resultadoReal === resultadoProde) {
                        colorResul = "#57c443" //green;
                    } else {
                        colorResul = "#fdc82e" //yellow;
                    }
                } else {
                    colorResul = "#d5385a" //red
                }
            }
            tablaPronosticosProdeUnico += `<div class="jugadores" style="background-color:${colorResul}"> 
            <img id="imgIcoLoc_${ind}" src="img/equipos/${pro.prodePartido.prode_icolocal}.png"  class="imgIcoPronosticos" />` + `${pro.prodePartido.prode_loc}` + ` - ` + `${pro.prodePartido.prode_vis}` + `
            <img id="imgIcoVis_${ind}" src="img/equipos/${pro.prodePartido.prode_icovisitante}.png"  class="imgIcoPronosticos" />
            </div>`
        })
        tablaPronosticosProdeUnico += `</div > `
    })

    tablaPronosticosProdeUnico += `
        </div >
        <div class="ultimaActualizacion">Ultima actualización: </div>
        `
    document.getElementById("tablaPronosticosProdeUnico").innerHTML = tablaPronosticosProdeUnico
}
disenoTablaPronosticosProdeUnico()