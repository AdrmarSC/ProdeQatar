import { cargaPronosticosProdeUnico } from "./firebase.js";

import { noPasa } from "./js/env.js"

export const encryptObj = (obj, ps) => CryptoJS.AES.encrypt(JSON.stringify(obj), ps).toString();
export const decryptObj = (cryp, ps) => JSON.parse(CryptoJS.AES.decrypt(cryp, ps).toString(CryptoJS.enc.Utf8));

//Variable que guarda el objecto de datos.
var usuario;
await cargaPronosticosProdeUnico();
var objPronosticosProdeUnico = JSON.parse(window.localStorage.getItem("objPronosticoProdeUnico"));
var usuariosMail = new Array();
objPronosticosProdeUnico.partidos[0].prodes.forEach(usu => {
    usuariosMail.push(usu.user.substring(0, usu.user.indexOf('@')))
}
)

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
    objPronosticosProdeUnico.partidos.forEach((pa, ind) => {
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
        pa.prodes.forEach((pro, i) => {
            let resulReal = pa.realPartido.resul_loc + "-" + pa.realPartido.resul_vis;
            let resultadoReal = pa.realPartido.resultado;
            let resultadoProde = pro.prodePartido.prode_resul;
            let resulProde = pro.prodePartido.prode_loc + "-" + pro.prodePartido.prode_vis;
            let dgProde = Number(pro.prodePartido.prode_loc) - Number(pro.prodePartido.prode_vis)
            let dgReal = Number(pa.realPartido.resul_loc) - Number(pa.realPartido.resul_vis)
            let cgProde = Number(pro.prodePartido.prode_loc) + Number(pro.prodePartido.prode_vis)
            let cgReal = Number(pa.realPartido.resul_loc) + Number(pa.realPartido.resul_vis)
            let realExt = pa.realPartido.resul_ext;
            let prodeExt = pro.prodePartido.prode_ext;
            let prodeEqLoc = pro.prodePartido.prode_eqlocal;
            let prodeEqVis = pro.prodePartido.prode_eqvisitante;
            let realEqLoc = pa.realPartido.resul_eqlocal;
            let realEqVis = pa.realPartido.resul_eqvisitante;

            let modifFase = 0;
            if (ind >= 48 && ind < 56) {
                modifFase = 1
            } else if (ind >= 56 && ind < 60) {
                modifFase = 2
            } else if (ind >= 60 && ind < 62) {
                modifFase = 3
            } else if (ind === 63) {
                modifFase = 4
            }

            let puntos = 0
            let puntosResultado = 0
            let puntosDG = 0
            let puntosCG = 0
            let aciertoEqFase = 0
            let aciertoPartExacto = 0
            let colorResul = "transparent";

            if (resultadoReal === "") { colorResul = "transparent" } else {
                if (ind < 48) {
                    if (resultadoReal === resultadoProde) {
                        if (resulReal === resulProde) {// acierta resultado exacto
                            puntosResultado = 3
                        } else {// acierta resultado
                            puntosResultado = 1
                        }
                    } else {//no acierta
                        puntosResultado = 0
                    }
                    //puntos por diferencia de gol
                    if (dgProde === dgReal) {
                        puntosDG = 1 + modifFase
                    }
                    //puntos por cantidad de goles en el partido
                    if (cgProde === cgReal) {
                        puntosCG = 1 + modifFase
                    }
                } else if (ind > 47) {
                    //console.log({ realEqLoc, realEqVis, prodeEqLoc, prodeEqVis })
                    if (realEqLoc === prodeEqLoc) { // si acierta equipo que pasa de fase
                        aciertoEqFase = 3 + aciertoEqFase + modifFase;
                    }
                    if (realEqVis === prodeEqVis) {// si acierta equipo que pasa de fase
                        aciertoEqFase = 3 + aciertoEqFase + modifFase;
                    }
                    if ((prodeEqLoc === realEqLoc) && (prodeEqVis === realEqVis)) { // Acierta equipos partido
                        aciertoPartExacto = 3 + modifFase;
                        if (resultadoReal != "") {
                            if (resultadoReal === resultadoProde) {// L E V
                                if (((resulReal === resulProde) && (resultadoReal != "E")) || ((resulReal === resulProde) && (resultadoReal === "E") && (realExt === prodeExt))) {//resultado exacto
                                    puntosResultado = 3 + modifFase; //acierto resultado exacto y ganador de partido
                                } else if (((resulReal === resulProde) && (resultadoReal === "E") && (realExt != prodeExt)) || (resulReal != resulProde)) {
                                    puntosResultado = 1 + modifFase; //acierto resultado exacto pero no ganador de partido
                                }
                            } else if ((resultadoReal != resultadoProde) && ((resultadoReal === "E" && realExt === resultadoProde) || (resultadoProde === "E" && prodeExt === resultadoReal))) {
                                puntosResultado = 1 + modifFase // acierta ganador de partido
                            } else {
                                puntosResultado = 0
                            }
                            //puntos por diferencia de gol
                            if (dgProde === dgReal) {
                                puntosDG = 1 + modifFase
                            }
                            //puntos por cantidad de goles en el partido
                            if (cgProde === cgReal) {
                                puntosCG = 1 + modifFase
                            }
                            //console.log({ puntosResultado, puntosDG, puntosCG, aciertoEqFase, aciertoPartExacto })
                        }
                    }
                }
                //  console.log({ ind, puntosResultado, puntosDG, puntosCG, aciertoEqFase, aciertoPartExacto })
                puntos = puntosResultado + puntosDG + puntosCG + aciertoEqFase + aciertoPartExacto

                if (puntos > 5) {
                    colorResul = "#D44249" //red;
                } else if (puntos === 5) {
                    colorResul = "#5EC448" //green;
                } else if (puntos === 4) {
                    colorResul = "#9E4AC7" //celeste;
                } else if (puntos === 3) {
                    colorResul = "#1D8919" //verdeclaro;
                } else if (puntos === 2) {
                    colorResul = "#0070C0" //azul;
                } else if (puntos === 1) {
                    colorResul = "#595959" //gris  
                } else if (puntos === 0) {
                    //colorResul = "#d5385a" //red
                    colorResul = "#000000" //negro
                }

            }

            tablaPronosticosProdeUnico += `<div class="jugadores" style="background-color:${colorResul}"> 
            <img id="imgIcoLoc_${ind}" src="img/equipos/${pro.prodePartido.prode_icolocal}.png"  class="imgIcoPronosticos" />` + `${pro.prodePartido.prode_loc}` + ` - ` + `${pro.prodePartido.prode_vis}` + `
            <img id="imgIcoVis_${ind}" src="img/equipos/${pro.prodePartido.prode_icovisitante}.png"  class="imgIcoPronosticos" /> ${pro.prodePartido.prode_ext} | ${puntos}
            </div>`
        })
        tablaPronosticosProdeUnico += `</div > `
    })

    tablaPronosticosProdeUnico += `
        </div >
        <div class="ultimaActualizacion">Ultima actualización: ${objPronosticosProdeUnico.user_modificacion} </div>
        <div class="tablaColores ">
            <div class="mascincoColor"></div><div class="filaColores"> >5 Puntos</div>
            <div class="cincoColor"></div><div class="filaColores">5 Puntos</div>
            <div class="cuatroColor"></div><div class="filaColores">4 Puntos</div>
            <div class="tresColor"></div><div class="filaColores">3 Puntos</div>
            <div class="dosColor"></div><div class="filaColores">2 Puntos</div>
            <div class="unoColor"></div><div class="filaColores">1 Punto</div>
            <div class="ceroColor"></div><div class="filaColores">0 Puntos</div>
        </div>
        `
    document.getElementById("tablaPronosticosProdeUnico").innerHTML = tablaPronosticosProdeUnico
}
disenoTablaPronosticosProdeUnico()