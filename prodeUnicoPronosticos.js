import { cargaPronosticosProdeUnico } from "./firebase.js";

import { noPasa } from "./js/env.js"

export const encryptObj = (obj, ps) => CryptoJS.AES.encrypt(JSON.stringify(obj), ps).toString();
export const decryptObj = (cryp, ps) => JSON.parse(CryptoJS.AES.decrypt(cryp, ps).toString(CryptoJS.enc.Utf8));

//Variable que guarda el objecto de datos.
var usuario;


// var objPronosticosProdeUnico;
// var usuariosMail = new Array();

// await unificarTodosUsuariosProdeUnico()
// await cargaProdeUnicoResultadosAdmin("ADMINISTRADOR@ADMIN.COM");
// const unicoAdmin = await JSON.parse(decryptObj(window.localStorage.getItem("prodeUnicoAdmin"), noPasa));
// console.log({ unicoAdmin });

// //Genero documento con todos los pronosticos de usuarios
// export const generarDocPronosticos = async () => {
//     //    await unificarTodosUsuario();
//     let objTodosDocProdeUnico = JSON.parse(window.localStorage.getItem("todosDocsProdeUnico"));
//     objPronosticosProdeUnico = JSON.parse(JSON.stringify(objModeloPronosticosProdeUnico))
//     console.log(objTodosDocProdeUnico)
//     console.log(objPronosticosProdeUnico)
//     //ordeno los partidos de cada usuario
//     objTodosDocProdeUnico.forEach(usu => {
//         usu.partidos.sort((a, b) => a.id - b.id)
//         usuariosMail.push(usu.user.substring(0, usu.user.indexOf('@')))
//     });

//     //Asigno a cada uno de los 64 partidos del modelo, el pronostico de cada usuario.
//     objPronosticosProdeUnico.forEach((part, ind) => {
//         part.realPartido = unicoAdmin.partidos[ind].realPartido
//         part.prodes = new Array()
//         objTodosDocProdeUnico.forEach(usu => {
//             part.prodes.push(
//                 {
//                     user: usu.user,
//                     // prodePartido: usu.partidos[ind].prodePartido,
//                     prodePartido: {
//                         prode_ext: usu.partidos[ind].prodePartido.prode_ext,
//                         prode_loc: usu.partidos[ind].prodePartido.prode_loc,
//                         prode_vis: usu.partidos[ind].prodePartido.prode_vis,
//                         prode_resul: usu.partidos[ind].prodePartido.prode_resul,
//                         prode_eqlocal: usu.partidos[ind].datosPartido.eqlocal,
//                         prode_eqvisitante: usu.partidos[ind].datosPartido.eqvisitante,
//                         prode_icolocal: usu.partidos[ind].datosPartido.icolocal,
//                         prode_icovisitante: usu.partidos[ind].datosPartido.icovisitante
//                     }
//                 }
//             )
//         });
//     });
//     console.log(objPronosticosProdeUnico)
//     window.localStorage.setItem("objPronosticoProdeUnico", JSON.stringify(objPronosticosProdeUnico))
// }

// generarDocPronosticos()

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
        pa.prodes.forEach((pro, ind) => {
            let resulReal = pa.realPartido.resul_loc + "-" + pa.realPartido.resul_vis;
            let resultadoReal = pa.realPartido.resultado;
            let resultadoProde = pro.prodePartido.prode_resul;
            let resulProde = pro.prodePartido.prode_loc + "-" + pro.prodePartido.prode_vis;
            let dgProde = Number(pro.prodePartido.prode_loc) - Number(pro.prodePartido.prode_vis)
            let dgReal = Number(pa.realPartido.resul_loc) - Number(pa.realPartido.resul_vis)
            let cgProde = Number(pro.prodePartido.prode_loc) + Number(pro.prodePartido.prode_vis)
            let cgReal = Number(pa.realPartido.resul_loc) + Number(pa.realPartido.resul_vis)

            let colorResul = "transparent";
            if (resultadoReal === "") { colorResul = "transparent" } else {
                if (resultadoReal === resultadoProde) {
                    if (resulReal === resulProde) {//5 puntos
                        colorResul = "#5EC448" //green;
                    } else if (dgReal === dgProde && cgProde === cgReal) {// 3puntos 
                        colorResul = "#1D8919" //verdeclaro;
                    } else if (dgReal === dgProde || cgProde === cgReal) {//2 puntos
                        colorResul = "#0070C0" //azul;
                    } else {//1punto
                        colorResul = "#595959" //gris  
                    }
                } else {//0 puntos
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
        <div class="ultimaActualizacion">Ultima actualización: ${objPronosticosProdeUnico.user_modificacion} </div>
        <div class="tablaColores ">
            <div class="cincoColor"></div><div class="filaColores">5 Puntos</div>
            <div class="tresColor"></div><div class="filaColores">3 Puntos</div>
            <div class="dosColor"></div><div class="filaColores">2 Puntos</div>
            <div class="unoColor"></div><div class="filaColores">1 Punto</div>
            <div class="ceroColor"></div><div class="filaColores">0 Puntos</div>
        </div>
        `
    document.getElementById("tablaPronosticosProdeUnico").innerHTML = tablaPronosticosProdeUnico
}
disenoTablaPronosticosProdeUnico()