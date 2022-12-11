import { docFechasCerradas } from "./firebase.js";
import { verFechasCerradas, ultUpdPronos, noPasa } from "./js/env.js"




export const encryptObj = (obj, ps) => CryptoJS.AES.encrypt(JSON.stringify(obj), ps).toString();
export const decryptObj = (cryp, ps) => JSON.parse(CryptoJS.AES.decrypt(cryp, ps).toString(CryptoJS.enc.Utf8));

//Variable que guarda el objecto de datos.
var fechaCerrada = [];
var usuario;
//------------------------------------------------------------------------------------------------
// Función para la creación de html de las 3 primeras fechas;
const partidosFecha = async (num) => {
    var numFecha = num;
    var tituloCuadro;
    console.log("numFecha: " + numFecha)

    let fechaCerradaCompleta = JSON.parse(window.localStorage.getItem("FechasCerradas"))
    fechaCerrada[numFecha] = fechaCerradaCompleta.fechanro[numFecha - 1].partidos;
    console.log("fechaCerrada")
    console.log(fechaCerrada[numFecha])
    switch (Number(numFecha)) {
        case 1:
            tituloCuadro = "FECHA 1";
            break;
        case 2:
            tituloCuadro = "FECHA 2";
            break;
        case 3:
            tituloCuadro = "FECHA 3";
            break;
        case 4:
            tituloCuadro = "OCTAVOS DE FINAL";
            break;
        case 5:
            tituloCuadro = "CUARTOS DE FINAL";
            break;
        case 6:
            tituloCuadro = "SEMIFINALES";
            break;
        case 7:
            tituloCuadro = "FINALES";
            break;
    }

    var tablaGrupos = `
<div class="cuadroCompleto solapa${numFecha}">
    <div class="tituloCuadro">${tituloCuadro}</div>
        <div class="titulosPartidos">
            <div class="fecha">DIA</div>
            <div class="tituloMedio">RESULTADO</div>`

    for (let j = 0; j < fechaCerrada[numFecha][0].prodes.length; j++) {
        let usuarioMail = fechaCerrada[numFecha][0].prodes[j].user
        usuarioMail = usuarioMail.substring(0, usuarioMail.indexOf('@'))

        tablaGrupos += `<div class="tituloJugadores">${usuarioMail}</div>`
    }
    tablaGrupos += `</div >`

    //Recorro partidos
    for (let i = 0; i < fechaCerrada[numFecha].length; i++) {
        tablaGrupos += `
    <div class="filaPartido">
                <div class="fecha">${fechaCerrada[numFecha][i].datosPartido.dia.substring(0, 2) + ". " + fechaCerrada[numFecha][i].datosPartido.fecha.substring(0, 5)} ${fechaCerrada[numFecha][i].datosPartido.hora.substring(0, 2) + "hs"}</div>
                <div class="local">${fechaCerrada[numFecha][i].datosPartido.eqlocal}</div>
                <div class="icoLocal">
                    <img src="img/equipos/${fechaCerrada[numFecha][i].datosPartido.icolocal}.png" onerror="this.onerror=null;this.src=''" class="imgIco" />
                </div>
                <div id="resLoc_L${i}"  class="resLocal">${fechaCerrada[numFecha][i].realPartido.resul_loc}</div>
                <div class="resMedio">-</div>
                <div id="resVis_V${i}"  class="resVisitante">${fechaCerrada[numFecha][i].realPartido.resul_vis}</div>
                <div class="icoVisitante">
                    <img src="img/equipos/${fechaCerrada[numFecha][i].datosPartido.icovisitante}.png" onerror="this.onerror=null;this.src=''" class="imgIco" />
                </div>
                <div class="visitante">${fechaCerrada[numFecha][i].datosPartido.eqvisitante}</div>`
        for (let j = 0; j < fechaCerrada[numFecha][i].prodes.length; j++) {
            let resulReal = fechaCerrada[numFecha][i].realPartido.resul_loc + "-" + fechaCerrada[numFecha][i].realPartido.resul_vis;
            let resultadoReal = fechaCerrada[numFecha][i].realPartido.resultado;
            let resultadoProde = fechaCerrada[numFecha][i].prodes[j].prodePartido.prode_resul;
            let resulProde = fechaCerrada[numFecha][i].prodes[j].prodePartido.prode_loc + "-" + fechaCerrada[numFecha][i].prodes[j].prodePartido.prode_vis;
            let extReal = fechaCerrada[numFecha][i].realPartido.resul_ext;
            let extProde = fechaCerrada[numFecha][i].prodes[j].prodePartido.prode_ext;
            let dgProde = Number(fechaCerrada[numFecha][i].prodes[j].prodePartido.prode_loc) - Number(fechaCerrada[numFecha][i].prodes[j].prodePartido.prode_vis)
            let dgReal = Number(fechaCerrada[numFecha][i].realPartido.resul_loc) - Number(fechaCerrada[numFecha][i].realPartido.resul_vis)
            let cgProde = Number(fechaCerrada[numFecha][i].prodes[j].prodePartido.prode_loc) + Number(fechaCerrada[numFecha][i].prodes[j].prodePartido.prode_vis)
            let cgReal = Number(fechaCerrada[numFecha][i].realPartido.resul_loc) + Number(fechaCerrada[numFecha][i].realPartido.resul_vis)

            let colorResul = "transparent";
            if (numFecha < 4) {
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
                        //colorResul = "#d5385a" //red
                        colorResul = "#000000" //negro
                    }
                }
            } else if (numFecha > 3) {
                if (resultadoReal === "") { colorResul = "transparent" } else {
                    if (resultadoReal === resultadoProde) {
                        if (((resulReal === resulProde) && (resultadoReal === "E") && (extReal === extProde)) || ((resulReal === resulProde) && (resultadoReal != "E"))) {//5 puntos
                            colorResul = "#5EC448" //verdeclaro;
                        } else if ((dgReal === dgProde && cgProde === cgReal) || ((resulReal === resulProde) && (resultadoReal === "E") && (extReal != extProde))) {// 3puntos 
                            colorResul = "#1D8919" //verdeclaro;
                        } else if (dgReal === dgProde || cgProde === cgReal) {//2 puntos
                            colorResul = "#0070C0" //azul;
                        } else {//1punto
                            colorResul = "#595959" //gris  
                        }
                    } else if (cgProde === cgReal) {//1 puntos
                        //colorResul = "#d5385a" //red
                        colorResul = "#595959" //gris  
                    } else {//0 puntos
                        colorResul = "#000000" //negro
                    }
                }
            }
            let extendido = resultadoProde === "E" ? (String(fechaCerrada[numFecha][i].prodes[j].prodePartido.prode_ext) === "undefined" ? "" : String(fechaCerrada[numFecha][i].prodes[j].prodePartido.prode_ext)) : "";
            tablaGrupos += `<div class="jugadores" style="background-color:${colorResul}"> ` + `${fechaCerrada[numFecha][i].prodes[j].prodePartido.prode_loc}` + ` - ` + `${fechaCerrada[numFecha][i].prodes[j].prodePartido.prode_vis}` + `  ` + `${extendido}` + `</div>`
        }
        tablaGrupos += `</div > `
    }

    tablaGrupos += `
    </div >
    <div id="fecha${numFecha}" class="tabcontentPronos">
        <div id="tablaProde"></div>
    </div>
    <div class="ultimaActualizacion">Ultima actualización: ${fechaCerradaCompleta.user_modificacion}</div>
    <div class="tablaColores ">
        <div class="cincoColor"></div><div class="filaColores">5 Puntos</div>
        <div class="tresColor"></div><div class="filaColores">3 Puntos</div>
        <div class="dosColor"></div><div class="filaColores">2 Puntos</div>
        <div class="unoColor"></div><div class="filaColores">1 Punto</div>
        <div class="ceroColor"></div><div class="filaColores">0 Puntos</div>
    </div>
    `
    document.getElementById("tablaProde").innerHTML = tablaGrupos
};


//--------------------------------------------------------------------------------
//Seteo menu según fecha seleccionada, por defecto fecha 1
const abrirFecha = async (fecha) => {
    //console.log(fecha);
    var i, tabcontentPronos, menuLinks
    tabcontentPronos = document.getElementsByClassName("tabcontentPronos")
    for (i = 0; i < tabcontentPronos.length; i++) {
        tabcontentPronos[i].style.display = "none"
    }
    menuLinks = document.getElementsByClassName("menuLinks")
    for (i = 0; i < menuLinks.length; i++) {
        menuLinks[i].className = menuLinks[i].className.replace(" active", "")
    }
    document.getElementById("fecha" + fecha).style.display = "block";
    document.getElementById("fecha" + fecha).className += " active";
    let cantFechasCerradas = JSON.parse(localStorage.getItem("FechasCerradas")).fechanro.length

    for (i = (cantFechasCerradas + 1); i <= menuLinks.length; i++) {
        document.getElementById("fecha" + i).style.display = "none";
    }
    if (cantFechasCerradas >= fecha) {
        await partidosFecha(fecha);
    }

};

//--------------------------------------------------------------------------------
//Función para detectar el click en botones de fechas. INICIO DE LA PAGE
//Click en la fecha1, modificar al avanzar fechas.
window.onload = async () => {
    document.getElementById("animacion").innerHTML = `<div class="loading"> Loading &#8230;</div>`
    let actualizar = false;
    console.log("unico")
    if (!(localStorage.getItem("user") === null)) {
        usuario = decryptObj(localStorage.getItem("user"), noPasa);
        console.log("usuario logeado");
        if (Number(verFechasCerradas) > 0) {
            console.log("ultUpdPronos: " + ultUpdPronos)
            if (Number(ultUpdPronos) > 0) {
                if (!(localStorage.getItem("ultUpdPronos") === null)) {
                    console.log("ultUpdPronos_Local: " + localStorage.getItem("ultUpdPronos"))
                    if (!(Number(localStorage.getItem("ultUpdPronos")) === Number(ultUpdPronos))) {
                        console.log("datos en storage no actualizados")
                        actualizar = true;
                    } else {
                        console.log("datos en storage actualizados")
                        actualizar = false;
                        document.getElementById("fecha1").onclick = abrirFecha(4);
                    }
                } else {
                    actualizar = true;
                }
                document.getElementById("fecha1").onclick = abrirFecha(4);

                if (actualizar) {
                    console.log("actualizado")
                    window.localStorage.setItem("ultUpdPronos", ultUpdPronos)
                    console.log("recuperando datos")
                    await docFechasCerradas();
                    document.getElementById("fecha1").onclick = abrirFecha(4);
                }
            }
        } else {
            document.getElementById('fechasTabPronos').style.display = "none";
            document.getElementById("animacion").innerHTML = `<div> Aún no finalizó la carga de resultados. Se visualizará el 20/11.</div> `
        }
    } else {
        document.getElementById("animacion").innerHTML = `<div> Iniciar sesión y clickear en la sección "Prode" para visualizar los partidos</div> `
    }
}
//--------------------------------------------------------------------------------
const botones = document.getElementById('fechasTabPronos');
botones.addEventListener('click', (event) => {
    const isButton = event.target.nodeName === 'BUTTON';
    if (!isButton) {

        return;
    }
    console.log(event.target.id)
    let numFecha = event.target.id.match(/\d+/g);

    abrirFecha(numFecha);
})
//--------------------------------------------------------------------------------






