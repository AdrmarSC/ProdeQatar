
import { cargaAdminUnico, backupAdminUnico, updateFasesFinales, traeFasesFinalesUsuariosUnicos, updateResultadosUsuarios } from "./firebase.js";

var usuarioAdmin = "ADMINISTRADOR@ADMIN.COM"

//EJECUTAR AL INICIO para cargar DOC. 
//-------Habilitar la lectura del archivo de FB, también la escritura al final de todo y modificar el valor de la función fecha por fecha. 

await cargaAdminUnico(usuarioAdmin)

var numFechaGlobal;
var origenFasesFinales = new Object();
var fechaFiltrada = new Object();

//Backup
//await backupAdminUnico(origenFasesFinales, usuarioAdmin)

/******************************************************************************************** */
//iconos mal
const iconosVacios = async (numFecha, origenFasesFinales) => {
    numFechaGlobal = numFecha;
    fechaFiltrada = origenFasesFinales.fechanro[numFecha - 1].partidos; //fases
    for (let i = 0; i < fechaFiltrada.length; i++) {
        //reviso si existe el icono

        const UrlExists = async (icono) => {
            let urlIco = window.location.origin + "/img/equipos/" + icono + ".png";
            console.log(icono)
            var http = new XMLHttpRequest();
            http.open('HEAD', urlIco, false);
            http.send();
            if (http.status === 404)
                return false;
            else
                return true;
        }
        if (!(await UrlExists(fechaFiltrada[i].datosPartido.icolocal))) { fechaFiltrada[i].datosPartido.icolocal = "vacio" };
        if (!(await UrlExists(fechaFiltrada[i].datosPartido.icovisitante))) { fechaFiltrada[i].datosPartido.icovisitante = "vacio" };
    }
    origenFasesFinales.fechanro[numFecha - 1].partidos = fechaFiltrada  //fases
    console.log(origenFasesFinales)
    //await disenoFasesFinales(7, origenFasesFinales);
}
/******************************************************************************************** */

/******************************************************************************************** */
//Octavos de FINAL
const disenoFasesFinales = async (numFecha, origenFasesFinales) => {
    numFechaGlobal = numFecha;
    //origenFasesFinales = JSON.parse(window.localStorage.getItem("fasesFinales"));
    fechaFiltrada = origenFasesFinales.fechanro[numFecha - 1].partidos; //fases
    let tituloCuadroFecha = ["FECHA 1", "FECHA 2", "FECHA 3", "OCTAVOS DE FINAL", "CUARTOS DE FINAL", "SEMIFINALES", "FINALES"]
    let tituloCuadro = tituloCuadroFecha[numFecha - 1]

    var tablaFasesFinales = `
    <div class="cuadroCompleto solapa${numFecha}">
        <div class="tituloCuadro">${tituloCuadro}</div>
            <div class="titulosPartidos">
                <div class="fecha">DIA</div>
                <div class="hora">HORA</div>
                <div class="resMedio">PRÓNOSTICO</div>
            </div>
    `

    for (let i = 0; i < fechaFiltrada.length; i++) {
        tablaFasesFinales += `
            <div class="filaPartido">
                <div class="fecha">${fechaFiltrada[i].datosPartido.dia + " " + fechaFiltrada[i].datosPartido.fecha.substring(0, 5)}</div>
                <div class="hora">${fechaFiltrada[i].datosPartido.hora}</div>
                <div class="local" id="eqLoc_${i}" contenteditable="true">${fechaFiltrada[i].datosPartido.eqlocal}</div>
                <div class="icoLocal" id="icoLoc_${i}">
                    <img id="imgIcoLoc_${i}" src="img/equipos/${fechaFiltrada[i].datosPartido.icolocal}.png"  class="imgIco" />
                </div>
                <div id="resLoc_L${i}"  class="resLocal resul">${fechaFiltrada[i].realPartido.resul_loc}</div>
                <div class="resMedio">-</div>
                <div id="resVis_V${i}"  class="resVisitante resul">${fechaFiltrada[i].realPartido.resul_vis}</div>
                <div class="icoVisitante" id="icoVis_${i}">
                    <img id="imgIcoVis_${i}" src="img/equipos/${fechaFiltrada[i].datosPartido.icovisitante}.png"  class="imgIco" />
                </div>
                <div class="visitante" id="eqVis_${i}" contenteditable="true">${fechaFiltrada[i].datosPartido.eqvisitante}</div>
                <!--<div class="resultado">${fechaFiltrada[i].realPartido.resul_loc + "-" + fechaFiltrada[i].realPartido.resul_vis}</div>-->
            </div>
        `
    }
    tablaFasesFinales += `
            <button class="button1" role="button" id="actualizar_ronda">
                Actualizar_Ronda
            </button>
        </div>
    <div id="tablaFasesFinales"></div>
    </div>
    `
    document.getElementById("tablaFasesFinales").innerHTML = tablaFasesFinales

}

//************************************************************************************ */
//Iniciooooooo
//Octavos
origenFasesFinales = JSON.parse(window.localStorage.getItem("fasesFinales"));
//await iconosVacios(7, JSON.parse(window.localStorage.getItem("fasesFinales")));
await disenoFasesFinales(4, JSON.parse(window.localStorage.getItem("fasesFinales")));
//************************************************************************************ */

//click en botón Actualizar_Octavos
const btnActualizarRonda = document.getElementById("actualizar_ronda")
btnActualizarRonda.addEventListener('click', async (event) => {
    console.log(numFechaGlobal);
    let hasNumber = /\d/;
    let f = numFechaGlobal - 1;
    //funcion guardar nombre de equipos e iconos
    for (let i = 0; i < fechaFiltrada.length; i++) {
        origenFasesFinales.fechanro[f].partidos[i].datosPartido.eqlocal = document.getElementById("eqLoc_" + i).textContent;
        if (!(hasNumber.test(document.getElementById("eqLoc_" + i).textContent))) {
            origenFasesFinales.fechanro[f].partidos[i].datosPartido.icolocal = document.getElementById("eqLoc_" + i).textContent.toLowerCase().replace(/\s+/g, '');
            document.getElementById("imgIcoLoc_" + i).src = window.location.origin + "/img/equipos/" + document.getElementById("eqLoc_" + i).textContent.toLowerCase().replace(/\s+/g, '') + ".png";
        }
        origenFasesFinales.fechanro[f].partidos[i].datosPartido.eqvisitante = document.getElementById("eqVis_" + i).textContent;
        if (!(hasNumber.test(document.getElementById("eqVis_" + i).textContent))) {
            origenFasesFinales.fechanro[f].partidos[i].datosPartido.icovisitante = document.getElementById("eqVis_" + i).textContent.toLowerCase().replace(/\s+/g, '');
            document.getElementById("imgIcoVis_" + i).src = window.location.origin + "/img/equipos/" + document.getElementById("eqVis_" + i).textContent.toLowerCase().replace(/\s+/g, '') + ".png";
        }
    }
    console.log(origenFasesFinales);
    await updateFasesFinales(origenFasesFinales, usuarioAdmin);
    window.localStorage.setItem("fasesFinales", JSON.stringify(origenFasesFinales));
    //disenoFasesFinales(numFechaGlobal, JSON.parse(window.localStorage.getItem("fasesFinales")))



    //Actualización de usuarios
    await traeFasesFinalesUsuariosUnicos(); //cargi 
    let destinoUsuario = JSON.parse(window.localStorage.getItem("todosDocsUnificadoFasesFinales"));
    console.log(destinoUsuario.length);
    // origenFasesFinales.fechanro[f].partidos.forEach(p => {
    //     console.log("p partido:")
    //     //        console.log(p);
    //     p.puntos = "";
    //     p.prodePartido = { "prode_loc": "", "prode_penloc": "", "prode_penvis": "", "prode_resul": "", "prode_vis": "" };
    //     console.log(p)
    // })

    //recorro por usuario y actualizo los partidos que van armando la llave
    destinoUsuario.forEach(async obj => {
        console.log(obj.user)
        for (let i = 0; i < obj.fechanro[f].partidos.length; i++) {
            obj.fechanro[f].partidos[i].datosPartido = origenFasesFinales.fechanro[f].partidos[i].datosPartido
        }
        console.log(obj)
        await updateResultadosUsuarios(obj, obj.user); //actualizo los partidos a cada usuario
    });

});
/******************************************************************************************** */



