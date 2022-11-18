
import { saveProdeUnicoUser, cargaProdeUnicoUser, updateProdeUnicoResultados } from "./firebase.js"
import { noPasa } from "./js/env.js"
export const encryptObj = (obj, ps) => CryptoJS.AES.encrypt(JSON.stringify(obj), ps).toString();
export const decryptObj = (cryp, ps) => JSON.parse(CryptoJS.AES.decrypt(cryp, ps).toString(CryptoJS.enc.Utf8));

var usuario;
var origenProdeUnico = new Array()
var fechaFiltrada = new Array();
var tablaProdeUnico = new Array();
var tablaPosGrupos = new Array();
var orDatos;




/******************************************************************************************** */
//prodeUnico
const disenoProdeUnico = async (cantPart, origenDatos, fase, posInicial) => {
    //origenDatos = JSON.parse(window.localStorage.getItem("prodeUnico"));
    fechaFiltrada = new Array();
    posInicial = posInicial - cantPart; //posiciones de los campos de los HTML generados dinamicamente
    const posFinal = Number(posInicial) + Number(cantPart);
    for (let pos = posInicial; pos < posFinal; pos++) {
        fechaFiltrada.push(origenDatos[pos])
    }

    let tituloCuadroFecha = ["GRUPO A", "GRUPO B", "GRUPO C", "GRUPO D", "GRUPO E", "GRUPO F", "GRUPO G", "GRUPO H", "OCTAVOS DE FINAL", "CUARTOS DE FINAL", "SEMIFINALES", "3° Y 4° PUESTO", "FINALES"]
    let tituloCuadro = tituloCuadroFecha[fase]

    tablaProdeUnico[fase] = `
    <div class="cuadroCompleto solapa${fase}">
        <div class="tituloCuadro">${tituloCuadro}</div>
            <div class="titulosPartidos">
                <div class="fecha">DIA</div>
                <div class="hora">HORA</div>
                <div class="local"></div>
                <div class="icoLocal"></div>
                <div class="resLocal">PRÓNOSTICO</div>
                <div class="resMedio"></div>
                <div class="resVisitante"></div>
                <div class="icoVisitante"></div>
                <div class="visitante"></div>
                <div class="extendido">EXT</div>
                <div class="resultado">REAL</div>
                <div class="puntos">PTS</div>
            </div>
    `
    let j = posInicial;
    for (let i = 0; i < fechaFiltrada.length; i++) {
        tablaProdeUnico[fase] += `
            <div class="filaPartido">
                <div class="fecha">${fechaFiltrada[i].datosPartido.dia + " " + fechaFiltrada[i].datosPartido.fecha.substring(0, 5)}</div>
                <div class="hora">${fechaFiltrada[i].datosPartido.hora}</div>
                <div class="local" id="eqLoc_${j}">${fechaFiltrada[i].datosPartido.eqlocal}</div>
                <div class="icoLocal" id="icoLoc_${j}">
                    <img id="imgIcoLoc_${j}" src="img/equipos/${fechaFiltrada[i].datosPartido.icolocal}.png"  class="imgIco" />
                </div>
                
                <div id="resLoc_L${j}"  class="resLocal resul">${fechaFiltrada[i].prodePartido.prode_loc}</div>
                <div class="resMedio">-</div>
                <div id="resVis_V${j}"  class="resVisitante resul">${fechaFiltrada[i].prodePartido.prode_vis}</div>
                
                <div class="icoVisitante" id="icoVis_${j}">
                    <img id="imgIcoVis_${j}" src="img/equipos/${fechaFiltrada[i].datosPartido.icovisitante}.png"  class="imgIco" />
                </div>
                <div class="visitante" id="eqVis_${j}">${fechaFiltrada[i].datosPartido.eqvisitante}</div>
                <div class="extendido" id="ext_${j}">${fechaFiltrada[i].prodePartido.prode_ext}</div>
                <div class="resultado">${fechaFiltrada[i].realPartido.resul_loc + "-" + fechaFiltrada[i].realPartido.resul_vis}</div>
                <div class="puntos">${fechaFiltrada[i].puntos}</div>
            </div>
        `
        j++;
    }
    tablaProdeUnico[fase] += `
        </div>
    </div>
    `
    // document.getElementById("tablaProdeUnico").insertAdjacentHTML("afterend", f)
    document.getElementById("tablaProdeUnico_" + fase).innerHTML = tablaProdeUnico[fase]
}


const cargarDiseno = async () => {
    let recuFBuserUnico = await JSON.parse(decryptObj(window.localStorage.getItem('prodeUnicoUser'), noPasa));
    origenProdeUnico = recuFBuserUnico.partidos
    let orDatosTabGru = recuFBuserUnico.tablaGrupos
    const encObj = encryptObj(JSON.stringify(orDatosTabGru), noPasa);
    window.localStorage.setItem("orDatosProdeUnicoUser", encObj)
    const partidosPorFases = [6, 6, 6, 6, 6, 6, 6, 6, 8, 4, 2, 1, 1]
    let result = 0;
    partidosPorFases.forEach(async (p, index) => {
        result += p;
        await disenoProdeUnico(p, origenProdeUnico, index, result);
    });
    document.getElementById("animacion").remove();
}




//***************************************************** */
//************INICIO */
document.getElementById("animacion").innerHTML = `<div class="loading">Loading&#8230;</div>`
if (!(localStorage.getItem("user") === null)) {
    usuario = decryptObj(localStorage.getItem("user"), noPasa);
    console.log("usuario logeado")
    if (localStorage.getItem("prodeUnicoUser") === null) {
        await cargaProdeUnicoUser(usuario);
        cargarDiseno()
    } else {
        console.log("datos en local")
        cargarDiseno()
    }
} else {
    document.getElementById("mitad2").style.display = 'none'
    document.getElementById("animacion").innerHTML = `<div>Iniciar sesión y Actualizar para visualizar los partidos</div>`
}

orDatos = await JSON.parse(decryptObj(window.localStorage.getItem("orDatosProdeUnicoUser"), noPasa));
const tablaPGrupos = async (fase) => {
    let tituloCuadroFecha = ["GRUPO A", "GRUPO B", "GRUPO C", "GRUPO D", "GRUPO E", "GRUPO F", "GRUPO G", "GRUPO H", "OCTAVOS DE FINAL", "CUARTOS DE FINAL", "SEMIFINALES", "3° Y 4° PUESTO", "FINALES"]
    let tituloCuadro = tituloCuadroFecha[fase]
    //    console.log(orDatos.grupos[fase])
    tablaPosGrupos[fase] = `
    <div class="tablaPosCompleta solapa${fase}">
    <div class="tituloCuadro">${tituloCuadro}</div>
        <div class="titulosTabla">
            <div class="tablaPuntajes">POS</div>    
            <div class="icoLocal"></div>
            <div class="tablaEquipo">Equipo</div>
            <div class="tablaPuntos">Puntos</div>
            <div class="tablaPuntajes">PJ</div>
            <div class="tablaPuntajes">PG</div>
            <div class="tablaPuntajes">PE</div>
            <div class="tablaPuntajes">PP</div>
            <div class="tablaPuntajes">GF</div>
            <div class="tablaPuntajes">GC</div>
            <div class="tablaPuntajes">DG</div>
        </div>
        `

    for (let i = 0; i < 4; i++) {
        tablaPosGrupos[fase] += `
        <div class="filaTabla">
            <div class="tablaPuntajes">${i + 1}</div>    
            <div class="icoLocal">
            <img src="img/equipos/${orDatos.grupos[fase].eq[i].ico}.png"  class="imgIco" />
            </div>
            <div class="tablaEquipo">${orDatos.grupos[fase].eq[i].equipo}</div>
            <div class="tablaPuntos">${orDatos.grupos[fase].eq[i].puntos.reduce((x, y) => x + y)}</div>
            <div class="tablaPuntajes">${orDatos.grupos[fase].eq[i].pj.reduce((x, y) => x + y)}</div>
            <div class="tablaPuntajes">${orDatos.grupos[fase].eq[i].pg.reduce((x, y) => x + y)}</div>
            <div class="tablaPuntajes">${orDatos.grupos[fase].eq[i].pe.reduce((x, y) => x + y)}</div>
            <div class="tablaPuntajes">${orDatos.grupos[fase].eq[i].pp.reduce((x, y) => x + y)}</div>
            <div class="tablaPuntajes">${orDatos.grupos[fase].eq[i].gf.reduce((x, y) => x + y)}</div>
            <div class="tablaPuntajes">${orDatos.grupos[fase].eq[i].gc.reduce((x, y) => x + y)}</div>
            <div class="tablaPuntajes">${orDatos.grupos[fase].eq[i].dg.reduce((x, y) => x + y)}</div>
        </div>
    `
    }
    tablaPosGrupos[fase] += `
    </div>
    `
    document.getElementById("tablaPosCompleta_" + fase).innerHTML = tablaPosGrupos[fase]
}

//Inicializo  tablas de posiciones
for (let j = 7; j >= 0; j--) {
    tablaPGrupos(j)
}

