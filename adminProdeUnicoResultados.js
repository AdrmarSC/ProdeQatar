
import { cargaProdeUnicoResultadosAdmin, updateProdeUnicoResultados, unificarTodosUsuariosProdeUnico, updateResultadosUsuariosProdeUnico, updatePronosticosProdeUnico, updateTablaPosicionesProdeUnico } from "./firebase.js"
import { objModeloPronosticosProdeUnico } from "./js/modeloPronosticosProdeUnico.js"
import { noPasa } from "./js/env.js"
export const encryptObj = (obj, ps) => CryptoJS.AES.encrypt(JSON.stringify(obj), ps).toString();
export const decryptObj = (cryp, ps) => JSON.parse(CryptoJS.AES.decrypt(cryp, ps).toString(CryptoJS.enc.Utf8));

var usuario;
var origenProdeUnico = new Array()
var fechaFiltrada = new Array();
var tablaProdeUnico = new Array();
var tablaPosGrupos = new Array();
var orDatos;


var equiposGanadoresOctavos = new Array();
var icoWinOct = ["vacio", "vacio", "vacio", "vacio", "vacio", "vacio", "vacio", "vacio"]

var equiposGanadoresCuartos = new Array();
var icoWinCuartos = ["vacio", "vacio", "vacio", "vacio"]

var equiposGanadoresSemi = new Array();
var icoWinSemi = ["vacio", "vacio"]
var equiposPerdedoresSemi = new Array();
var icoLoseSemi = ["vacio", "vacio"]

var equiposFinales = new Array();
var equiposTercer = new Array();
var icoFinales = ["vacio", "vacio"]
var icoTercer = ["vacio", "vacio"]

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
                <div class="divFlechas"></div>
                <div class="resLocal">PRÓNOSTICO</div>
                <div class="resMedio"></div>
                <div class="resVisitante"></div>
                <div class="divFlechas"></div>
                <div class="icoVisitante"></div>
                <div class="visitante"></div>
                <div class="extendido">EXT</div>
                <div class="resultado">REAL</div>
                <div class="puntos">PTS</div>
            </div>
    `
    let j = posInicial;
    for (let i = 0; i < fechaFiltrada.length; i++) {
        let visible = "none";
        let seleccionadoL;
        let seleccionadoV;

        if ((fase > 7) && (fechaFiltrada[i].prodePartido.prode_resul === "E")) {
            visible = "inline;  -webkit-appearance: none; background-color: #f0f0f0; width: 2vw;text-align: center; font-weight:bold; font-size: 16px;"
            if (fechaFiltrada[i].prodePartido.prode_ext === "L") {
                seleccionadoL = "selected"
            } else {
                seleccionadoV = "selected"
            }
        }
        tablaProdeUnico[fase] += `
            <div class="filaPartido">
                <div class="fecha">${fechaFiltrada[i].datosPartido.dia + " " + fechaFiltrada[i].datosPartido.fecha.substring(0, 5)}</div>
                <div class="hora">${fechaFiltrada[i].datosPartido.hora}</div>
                <div class="local" id="eqLoc_${j}">${fechaFiltrada[i].datosPartido.eqlocal}</div>
                <div class="icoLocal" id="icoLoc_${j}">
                    <img id="imgIcoLoc_${j}" src="img/equipos/${fechaFiltrada[i].datosPartido.icolocal}.png"  class="imgIco" />
                </div>
                <div  id="fleLoc_${j}" class="divFlechas">
                    <input type="image" id="up_Loc_${j}" src="./img/ArribaVerde.png" class="flechas" ; />
                    <input type="image" id="down_Loc_${j}" src="./img/abajoRojo.png" class="flechas" />
                </div>
                <div id="resLoc_L${j}"  class="resLocal resul">${fechaFiltrada[i].prodePartido.prode_loc}</div>
                <div class="resMedio">-</div>
                <div id="resVis_V${j}"  class="resVisitante resul">${fechaFiltrada[i].prodePartido.prode_vis}</div>
                <div  id="fleVIs_${j}" class="divFlechas">
                    <input type="image" id="up_Vis_${j}" src="./img/ArribaVerde.png" class="flechas" ; />
                    <input type="image" id="down_Vis_${j}" src="./img/abajoRojo.png" class="flechas" />
                </div>
                <div class="icoVisitante" id="icoVis_${j}">
                    <img id="imgIcoVis_${j}" src="img/equipos/${fechaFiltrada[i].datosPartido.icovisitante}.png"  class="imgIco" />
                </div>
                <div class="visitante" id="eqVis_${j}">${fechaFiltrada[i].datosPartido.eqvisitante}</div>
                <div class="extendido" id="ext_${j}">
                <select id="extSelect_${j}" style="display:${visible}" class="selOpcion"> 
                    <option value="L" ${seleccionadoL}>L</option>
                    <option value="V" ${seleccionadoV}>V</option>
                </select>
                </div>
                <div class="resultado">${fechaFiltrada[i].realPartido.resul_loc + "-" + fechaFiltrada[i].realPartido.resul_vis}</div>
                <div class="puntos">${fechaFiltrada[i].idg}</div>
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
/******************************************************* */
const completarReCargaFasesFinales = async (objEqWin, icoWin, ini, fin) => {
    let j = 0
    for (let i = ini; i < fin; i++) {
        let r = origenProdeUnico[i].prodePartido.prode_resul
        let rext = origenProdeUnico[i].prodePartido.prode_ext
        if ((r === "L") || (r === "E" && rext === "L")) {
            objEqWin[j] = origenProdeUnico[i].prodePartido.prode_eqlocal
            icoWin[j] = origenProdeUnico[i].prodePartido.prode_icolocal
        } else if ((r === "V") || (r === "E" && rext === "V")) {
            objEqWin[j] = origenProdeUnico[i].prodePartido.prode_eqvisitante
            icoWin[j] = origenProdeUnico[i].prodePartido.prode_icovisitante
        }
        j++;
    }
    //console.log({ objEqWin })
}

const completarReCargaFinales = async (objEqLose, icoLose, ini, fin) => {
    let j = 0
    for (let i = ini; i < fin; i++) {
        let r = origenProdeUnico[i].prodePartido.prode_resul
        let rext = origenProdeUnico[i].prodePartido.prode_ext
        if (!((r === "L") || (r === "E" && rext === "L"))) {
            objEqLose[j] = origenProdeUnico[i].prodePartido.prode_eqlocal
            icoLose[j] = origenProdeUnico[i].prodePartido.prode_icolocal
        } else if (!((r === "V") || (r === "E" && rext === "V"))) {
            objEqLose[j] = origenProdeUnico[i].prodePartido.prode_eqvisitante
            icoLose[j] = origenProdeUnico[i].prodePartido.prode_icovisitante
        }
        j++;
    }
    //console.log({ objEqLose })
}

//***************************************************** */
//************INICIO */
document.getElementById("animacion").innerHTML = `<div class="loading">Loading&#8230;</div>`
document.getElementById("btnGuardarProdeUnico").style.display = "none";
if (!(localStorage.getItem("user") === null)) {
    usuario = decryptObj(localStorage.getItem("user"), noPasa);
    console.log("usuario logeado")
    //await cargaProdeUnicoUser(usuario);
    await cargaProdeUnicoResultadosAdmin(usuario);
    document.getElementById("animacion").remove();
    document.getElementById("btnGuardarProdeUnico").style.display = "block";

    let recuFBuserUnico = await JSON.parse(decryptObj(window.localStorage.getItem('prodeUnicoAdmin'), noPasa));
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

    completarReCargaFasesFinales(equiposGanadoresOctavos, icoWinOct, 48, 56);  //octavos
    completarReCargaFasesFinales(equiposGanadoresCuartos, icoWinCuartos, 56, 60);  //cuartos
    completarReCargaFasesFinales(equiposGanadoresSemi, icoWinSemi, 60, 62);  //semi ganadores
    completarReCargaFinales(equiposPerdedoresSemi, icoLoseSemi, 60, 62)//semi perdedores
    completarReCargaFinales(equiposTercer, icoTercer, 62, 64)//final perdedores
    completarReCargaFasesFinales(equiposFinales, icoFinales, 62, 64);  //semi ganadores

} else {
    document.getElementById("mitad2").style.display = 'none'
    document.getElementById("animacion").innerHTML = `<div>Iniciar sesión y Actualizar para visualizar los partidos</div>`
}


//flechas subir y bajar marcador
const btnFlecha = document.getElementsByClassName("flechas");
Array.from(btnFlecha).forEach(b => {
    b.addEventListener('click', async (event) => {
        let b = event.target.id;
        let n = event.target.id.match(/\d+/g); //numero de casillero
        let res = 0;
        if (b.substring(0, 2) === "up") {
            if (b.substring(3, 6) === "Loc") {
                res = Number(document.getElementById("resLoc_L" + n).textContent) + 1
                document.getElementById("resLoc_L" + n).innerHTML = res;
                document.getElementById("resVis_V" + n).textContent === "" ? document.getElementById("resVis_V" + n).innerHTML = 0 : "";
            } else if (b.substring(3, 6) === "Vis") {
                res = Number(document.getElementById("resVis_V" + n).textContent) + 1
                document.getElementById("resVis_V" + n).innerHTML = res;
                document.getElementById("resLoc_L" + n).textContent === "" ? document.getElementById("resLoc_L" + n).innerHTML = 0 : "";
            }
        } else if (b.substring(0, 4) === "down") {
            if (b.substring(5, 8) === "Loc") {
                res = Number(document.getElementById("resLoc_L" + n).textContent)
                res > 0 ? res-- : res = 0
                document.getElementById("resLoc_L" + n).innerHTML = res;
                document.getElementById("resVis_V" + n).textContent === "" ? document.getElementById("resVis_V" + n).innerHTML = 0 : "";
            } else if (b.substring(5, 8) === "Vis") {
                res = Number(document.getElementById("resVis_V" + n).textContent)
                res > 0 ? res-- : res = 0
                document.getElementById("resVis_V" + n).innerHTML = res;
                document.getElementById("resLoc_L" + n).textContent === "" ? document.getElementById("resLoc_L" + n).innerHTML = 0 : "";
            }
        }
        if (n < 48) calcularPosiciones(n)
        if (n > 47) calcularGanadorPartido(n);
    })
});


//funcion para cargar tabla de Posiciones por Gruposresutlados
orDatos = await JSON.parse(decryptObj(window.localStorage.getItem("orDatosProdeUnicoUser"), noPasa));
const tablaPGrupos = async (fase) => {
    let tituloCuadroFecha = ["GRUPO A", "GRUPO B", "GRUPO C", "GRUPO D", "GRUPO E", "GRUPO F", "GRUPO G", "GRUPO H", "OCTAVOS DE FINAL", "CUARTOS DE FINAL", "SEMIFINALES", "3° Y 4° PUESTO", "FINALES"]
    let tituloCuadro = tituloCuadroFecha[fase]
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
    //document.getElementById("tablaPosCompleta").insertAdjacentHTML("afterend", tablaPosGrupos[fase]);
    document.getElementById("tablaPosCompleta_" + fase).innerHTML = tablaPosGrupos[fase]
}
//Inicializo  tablas de posiciones
for (let j = 7; j >= 0; j--) {
    tablaPGrupos(j)
    //document.getElementById("tablaPosCompleta").insertAdjacentHTML("afterend", tablaPosGrupos[j])
}


//funcion para calcular puntos con partido completado
const calcularPosiciones = async (nfila) => {
    let n = nfila || 0; //número de fila y partido
    let g = parseInt(n / 6) //grupo[0-7]
    let po = ((n / 6) - g).toFixed(2) //posicion del partido en tabla Posiiones [0,1,2]
    po <= 0.17 ? po = 0 : (po <= 0.5 ? po = 1 : po = 2);
    //console.log("fila: ", n, " grupo: ", g, " pos: ", po)
    let lo = document.getElementById("resLoc_L" + n).textContent;
    let vi = document.getElementById("resVis_V" + n).textContent;
    let equipoGanador;
    let equipoPerdedor;
    if (!(lo === "" && vi === "")) {
        lo = Number(document.getElementById("resLoc_L" + n).textContent)
        vi = Number(document.getElementById("resVis_V" + n).textContent)
        if (lo > vi) {//Evalua ganadores locales
            equipoGanador = origenProdeUnico[n].datosPartido.eqlocal;
            let ind = orDatos.grupos[g].eq.findIndex(e => e.equipo === equipoGanador)//index para encontrar que equipo es
            orDatos.grupos[g].eq[ind].pj[po] = 1
            orDatos.grupos[g].eq[ind].puntos[po] = 3
            orDatos.grupos[g].eq[ind].pg[po] = 1
            orDatos.grupos[g].eq[ind].pe[po] = 0
            orDatos.grupos[g].eq[ind].pp[po] = 0
            orDatos.grupos[g].eq[ind].gf[po] = lo
            orDatos.grupos[g].eq[ind].gc[po] = vi
            orDatos.grupos[g].eq[ind].dg[po] = lo - vi

            equipoPerdedor = origenProdeUnico[n].datosPartido.eqvisitante;
            ind = orDatos.grupos[g].eq.findIndex(e => e.equipo === equipoPerdedor)//index para encontrar que equipo es
            orDatos.grupos[g].eq[ind].pj[po] = 1
            orDatos.grupos[g].eq[ind].puntos[po] = 0
            orDatos.grupos[g].eq[ind].pg[po] = 0
            orDatos.grupos[g].eq[ind].pe[po] = 0
            orDatos.grupos[g].eq[ind].pp[po] = 1
            orDatos.grupos[g].eq[ind].gf[po] = vi
            orDatos.grupos[g].eq[ind].gc[po] = lo
            orDatos.grupos[g].eq[ind].dg[po] = vi - lo
        } else if (lo < vi) {//Evalua ganadores visitantes
            equipoGanador = origenProdeUnico[n].datosPartido.eqvisitante;
            let ind = orDatos.grupos[g].eq.findIndex(e => e.equipo === equipoGanador)//index para encontrar que equipo es
            orDatos.grupos[g].eq[ind].pj[po] = 1
            orDatos.grupos[g].eq[ind].puntos[po] = 3
            orDatos.grupos[g].eq[ind].pg[po] = 1
            orDatos.grupos[g].eq[ind].pe[po] = 0
            orDatos.grupos[g].eq[ind].pp[po] = 0
            orDatos.grupos[g].eq[ind].gf[po] = vi
            orDatos.grupos[g].eq[ind].gc[po] = lo
            orDatos.grupos[g].eq[ind].dg[po] = vi - lo

            equipoPerdedor = origenProdeUnico[n].datosPartido.eqlocal;
            ind = orDatos.grupos[g].eq.findIndex(e => e.equipo === equipoPerdedor)//index para encontrar que equipo es
            orDatos.grupos[g].eq[ind].pj[po] = 1
            orDatos.grupos[g].eq[ind].puntos[po] = 0
            orDatos.grupos[g].eq[ind].pg[po] = 0
            orDatos.grupos[g].eq[ind].pe[po] = 0
            orDatos.grupos[g].eq[ind].pp[po] = 1
            orDatos.grupos[g].eq[ind].gf[po] = lo
            orDatos.grupos[g].eq[ind].gc[po] = vi
            orDatos.grupos[g].eq[ind].dg[po] = lo - vi

        } else if (lo === vi) {//Evalua empates
            equipoGanador = origenProdeUnico[n].datosPartido.eqlocal;
            let ind = orDatos.grupos[g].eq.findIndex(e => e.equipo === equipoGanador)//index para encontrar que equipo es
            orDatos.grupos[g].eq[ind].pj[po] = 1
            orDatos.grupos[g].eq[ind].puntos[po] = 1
            orDatos.grupos[g].eq[ind].pg[po] = 0
            orDatos.grupos[g].eq[ind].pe[po] = 1
            orDatos.grupos[g].eq[ind].pp[po] = 0
            orDatos.grupos[g].eq[ind].gf[po] = lo
            orDatos.grupos[g].eq[ind].gc[po] = vi
            orDatos.grupos[g].eq[ind].dg[po] = lo - vi

            equipoPerdedor = origenProdeUnico[n].datosPartido.eqvisitante;
            ind = orDatos.grupos[g].eq.findIndex(e => e.equipo === equipoPerdedor)//index para encontrar que equipo es
            orDatos.grupos[g].eq[ind].pj[po] = 1
            orDatos.grupos[g].eq[ind].puntos[po] = 1
            orDatos.grupos[g].eq[ind].pg[po] = 0
            orDatos.grupos[g].eq[ind].pe[po] = 1
            orDatos.grupos[g].eq[ind].pp[po] = 0
            orDatos.grupos[g].eq[ind].gf[po] = vi
            orDatos.grupos[g].eq[ind].gc[po] = lo
            orDatos.grupos[g].eq[ind].dg[po] = vi - lo
        }
    }

    //ordeno por puntajes 
    orDatos.grupos[g].eq.sort((a, b) => {
        if (a.puntos.reduce((x, y) => x + y) > b.puntos.reduce((x, y) => x + y)) return -1;
        if (b.puntos.reduce((x, y) => x + y) > a.puntos.reduce((x, y) => x + y)) return 1;
        if (a.puntos.reduce((x, y) => x + y) === b.puntos.reduce((x, y) => x + y)) {
            if (a.dg.reduce((x, y) => x + y) > b.dg.reduce((x, y) => x + y)) {
                return -1;
            } else if (b.dg.reduce((x, y) => x + y) > a.dg.reduce((x, y) => x + y)) {
                return 1;
            } else if (a.dg.reduce((x, y) => x + y) === b.dg.reduce((x, y) => x + y)) {
                if (a.gf.reduce((x, y) => x + y) > b.gf.reduce((x, y) => x + y)) {
                    return -1;
                } else if (b.gf.reduce((x, y) => x + y) > a.gf.reduce((x, y) => x + y)) {
                    return 1;
                } else if (a.gf.reduce((x, y) => x + y) === b.gf.reduce((x, y) => x + y)) {
                    //console.log("Calcular tercer criterio")
                }
            }
        }
    })

    //asigno el valor final de la posicion en la tabla a cada equipo
    orDatos.grupos[g].eq.forEach((e, i) => {
        e.pos = i + 1;
    })
    tablaPGrupos(g)
    clasifOctavos(g);
    //calcularOctavos();
}
//calcularPosiciones()


//funcion para calcular partidos de octavos
const clasifOctavos = async (g) => {
    // let letraGrupo = ["A", "B", "C", "D", "E", "F", "G", "H"]
    let partJugados = 0;
    orDatos.grupos[g].eq.forEach((e, i) => { partJugados = partJugados + e.pj.reduce((x, y) => x + y) })
    //window.localStorage.setItem("orDatosTablaGrupos", JSON.stringify(orDatos))
    let encObjOrDatos = await encryptObj(JSON.stringify(orDatos), noPasa);
    window.localStorage.setItem("orDatosTablaGrupos", encObjOrDatos)
    if (partJugados === 12) {
        console.log("clasificados: ", orDatos.grupos[g].eq[0].equipo, "____2do: ", orDatos.grupos[g].eq[1].equipo)
        console.log("obj: ")
        console.log(origenProdeUnico)
        if (g === 0) {
            //A
            origenProdeUnico[48].datosPartido.eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[48].datosPartido.icolocal = orDatos.grupos[g].eq[0].ico
            origenProdeUnico[48].prodePartido.prode_eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[48].prodePartido.prode_icolocal = orDatos.grupos[g].eq[0].ico
            document.getElementById("eqLoc_" + 48).innerHTML = orDatos.grupos[g].eq[0].equipo
            document.getElementById("imgIcoLoc_" + 48).src = "img/equipos/" + orDatos.grupos[g].eq[0].ico + ".png"
            origenProdeUnico[51].datosPartido.eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[51].datosPartido.icovisitante = orDatos.grupos[g].eq[1].ico
            origenProdeUnico[51].prodePartido.prode_eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[51].prodePartido.prode_icovisitante = orDatos.grupos[g].eq[1].ico
            document.getElementById("eqVis_" + 51).innerHTML = orDatos.grupos[g].eq[1].equipo
            document.getElementById("imgIcoVis_" + 51).src = "img/equipos/" + orDatos.grupos[g].eq[1].ico + ".png"
        }
        if (g === 1) {
            //B
            origenProdeUnico[51].datosPartido.eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[51].datosPartido.icolocal = orDatos.grupos[g].eq[0].ico
            origenProdeUnico[51].prodePartido.prode_eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[51].prodePartido.prode_icolocal = orDatos.grupos[g].eq[0].ico
            document.getElementById("eqLoc_" + 51).innerHTML = orDatos.grupos[g].eq[0].equipo
            document.getElementById("imgIcoLoc_" + 51).src = "img/equipos/" + orDatos.grupos[g].eq[0].ico + ".png"
            origenProdeUnico[48].datosPartido.eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[48].datosPartido.icovisitante = orDatos.grupos[g].eq[1].ico
            origenProdeUnico[48].prodePartido.prode_eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[48].prodePartido.prode_icovisitante = orDatos.grupos[g].eq[1].ico
            document.getElementById("eqVis_" + 48).innerHTML = orDatos.grupos[g].eq[1].equipo
            document.getElementById("imgIcoVis_" + 48).src = "img/equipos/" + orDatos.grupos[g].eq[1].ico + ".png"
        }
        if (g === 2) {
            //C
            origenProdeUnico[49].datosPartido.eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[49].datosPartido.icolocal = orDatos.grupos[g].eq[0].ico
            origenProdeUnico[49].prodePartido.prode_eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[49].prodePartido.prode_icolocal = orDatos.grupos[g].eq[0].ico
            document.getElementById("eqLoc_" + 49).innerHTML = orDatos.grupos[g].eq[0].equipo
            document.getElementById("imgIcoLoc_" + 49).src = "img/equipos/" + orDatos.grupos[g].eq[0].ico + ".png"
            origenProdeUnico[50].datosPartido.eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[50].datosPartido.icovisitante = orDatos.grupos[g].eq[1].ico
            origenProdeUnico[50].prodePartido.prode_eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[50].prodePartido.prode_icovisitante = orDatos.grupos[g].eq[1].ico
            document.getElementById("eqVis_" + 50).innerHTML = orDatos.grupos[g].eq[1].equipo
            document.getElementById("imgIcoVis_" + 50).src = "img/equipos/" + orDatos.grupos[g].eq[1].ico + ".png"
        }
        if (g === 3) {
            //D
            origenProdeUnico[50].datosPartido.eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[50].datosPartido.icolocal = orDatos.grupos[g].eq[0].ico
            origenProdeUnico[50].prodePartido.prode_eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[50].prodePartido.prode_icolocal = orDatos.grupos[g].eq[0].ico
            document.getElementById("eqLoc_" + 50).innerHTML = orDatos.grupos[g].eq[0].equipo
            document.getElementById("imgIcoLoc_" + 50).src = "img/equipos/" + orDatos.grupos[g].eq[0].ico + ".png"
            origenProdeUnico[49].datosPartido.eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[49].datosPartido.icovisitante = orDatos.grupos[g].eq[1].ico
            origenProdeUnico[49].prodePartido.prode_eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[49].prodePartido.prode_icovisitante = orDatos.grupos[g].eq[1].ico
            document.getElementById("eqVis_" + 49).innerHTML = orDatos.grupos[g].eq[1].equipo
            document.getElementById("imgIcoVis_" + 49).src = "img/equipos/" + orDatos.grupos[g].eq[1].ico + ".png"
        }
        if (g === 4) {
            //E
            origenProdeUnico[52].datosPartido.eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[52].datosPartido.icolocal = orDatos.grupos[g].eq[0].ico
            origenProdeUnico[52].prodePartido.prode_eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[52].prodePartido.prode_icolocal = orDatos.grupos[g].eq[0].ico
            document.getElementById("eqLoc_" + 52).innerHTML = orDatos.grupos[g].eq[0].equipo
            document.getElementById("imgIcoLoc_" + 52).src = "img/equipos/" + orDatos.grupos[g].eq[0].ico + ".png"
            origenProdeUnico[54].datosPartido.eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[54].datosPartido.icovisitante = orDatos.grupos[g].eq[1].ico
            origenProdeUnico[54].prodePartido.prode_eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[54].prodePartido.prode_icovisitante = orDatos.grupos[g].eq[1].ico
            document.getElementById("eqVis_" + 54).innerHTML = orDatos.grupos[g].eq[1].equipo
            document.getElementById("imgIcoVis_" + 54).src = "img/equipos/" + orDatos.grupos[g].eq[1].ico + ".png"
        }
        if (g === 5) {
            //F
            origenProdeUnico[54].datosPartido.eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[54].datosPartido.icolocal = orDatos.grupos[g].eq[0].ico
            origenProdeUnico[54].prodePartido.prode_eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[54].prodePartido.prode_icolocal = orDatos.grupos[g].eq[0].ico
            document.getElementById("eqLoc_" + 54).innerHTML = orDatos.grupos[g].eq[0].equipo
            document.getElementById("imgIcoLoc_" + 54).src = "img/equipos/" + orDatos.grupos[g].eq[0].ico + ".png"
            origenProdeUnico[52].datosPartido.eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[52].datosPartido.icovisitante = orDatos.grupos[g].eq[1].ico
            origenProdeUnico[52].prodePartido.prode_eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[52].prodePartido.prode_icovisitante = orDatos.grupos[g].eq[1].ico
            document.getElementById("eqVis_" + 52).innerHTML = orDatos.grupos[g].eq[1].equipo
            document.getElementById("imgIcoVis_" + 52).src = "img/equipos/" + orDatos.grupos[g].eq[1].ico + ".png"
        }
        if (g === 6) {
            //G
            origenProdeUnico[53].datosPartido.eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[53].datosPartido.icolocal = orDatos.grupos[g].eq[0].ico
            origenProdeUnico[53].prodePartido.prode_eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[53].prodePartido.prode_icolocal = orDatos.grupos[g].eq[0].ico
            document.getElementById("eqLoc_" + 53).innerHTML = orDatos.grupos[g].eq[0].equipo
            document.getElementById("imgIcoLoc_" + 53).src = "img/equipos/" + orDatos.grupos[g].eq[0].ico + ".png"
            origenProdeUnico[55].datosPartido.eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[55].datosPartido.icovisitante = orDatos.grupos[g].eq[1].ico
            origenProdeUnico[55].prodePartido.prode_eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[55].prodePartido.prode_icovisitante = orDatos.grupos[g].eq[1].ico
            document.getElementById("eqVis_" + 55).innerHTML = orDatos.grupos[g].eq[1].equipo
            document.getElementById("imgIcoVis_" + 55).src = "img/equipos/" + orDatos.grupos[g].eq[1].ico + ".png"
        }
        if (g === 7) {
            //H
            origenProdeUnico[55].datosPartido.eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[55].datosPartido.icolocal = orDatos.grupos[g].eq[0].ico
            origenProdeUnico[55].prodePartido.prode_eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[55].prodePartido.prode_icolocal = orDatos.grupos[g].eq[0].ico
            document.getElementById("eqLoc_" + 55).innerHTML = orDatos.grupos[g].eq[0].equipo
            document.getElementById("imgIcoLoc_" + 55).src = "img/equipos/" + orDatos.grupos[g].eq[0].ico + ".png"
            origenProdeUnico[53].datosPartido.eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[53].datosPartido.icovisitante = orDatos.grupos[g].eq[1].ico
            origenProdeUnico[53].prodePartido.prode_eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[53].prodePartido.prode_icovisitante = orDatos.grupos[g].eq[1].ico
            document.getElementById("eqVis_" + 53).innerHTML = orDatos.grupos[g].eq[1].equipo
            document.getElementById("imgIcoVis_" + 53).src = "img/equipos/" + orDatos.grupos[g].eq[1].ico + ".png"
        }
        //await disenoProdeUnico(8, origenProdeUnico, 8, 56);
    }
}





/*************************************** */
//Calcula los resultados de los partidos y guarda los equipos
const calcularGanadorPartido = async (nfila) => {
    let n = nfila; //número de fila y partido
    let loc = document.getElementById("resLoc_L" + n).textContent
    let vis = document.getElementById("resVis_V" + n).textContent
    let ext = document.getElementById("extSelect_" + n).value
    let resul = "";
    let resul_ext = "";
    if (!(loc === "" && vic === "")) {
        if (loc > vis) resul = "L"
        if (loc < vis) resul = "V"
        if (loc === vis) {
            document.getElementById("extSelect_" + n).style = "display: inline;  -webkit-appearance: none; background-color: #f0f0f0; width: 2vw;text-align: center; font-weight:bold; font-size: 16px;"

            resul = "E"
            resul_ext = ext; // L o V
        }
        if (!(loc === vis)) {
            document.getElementById("extSelect_" + n).style = "display: none;"
            document.getElementById("extSelect_" + n).innerHTML
        }
        origenProdeUnico[n].prodePartido.prode_eqlocal = origenProdeUnico[n].datosPartido.eqlocal
        origenProdeUnico[n].prodePartido.prode_icolocal = origenProdeUnico[n].datosPartido.icolocal
        origenProdeUnico[n].prodePartido.prode_eqvisitante = origenProdeUnico[n].datosPartido.eqvisitante
        origenProdeUnico[n].prodePartido.prode_icovisitante = origenProdeUnico[n].datosPartido.icovisitante
        origenProdeUnico[n].prodePartido.prode_loc = loc
        origenProdeUnico[n].prodePartido.prode_vis = vis
        origenProdeUnico[n].prodePartido.prode_resul = resul

        if (n > 47) {
            origenProdeUnico[n].prodePartido.prode_ext = resul_ext
            if ((resul === "L") || (resul_ext === "L")) {
                origenProdeUnico[n].prodePartido.prode_eqwin = origenProdeUnico[n].datosPartido.eqlocal
                origenProdeUnico[n].prodePartido.prode_icowin = origenProdeUnico[n].datosPartido.icolocal
            } else if ((resul === "V") || (resul_ext === "V")) {
                origenProdeUnico[n].prodePartido.prode_eqwin = origenProdeUnico[n].datosPartido.eqvisitante
                origenProdeUnico[n].prodePartido.prode_icowin = origenProdeUnico[n].datosPartido.icovisitante
            }
        }
    }
    console.log({ origenProdeUnico })
    clasificados(nfila);
}

const clasificados = async (nfila) => {
    const octavosWinACuartos = [50, 48, 54, 52, 51, 49, 55, 53] //cuartos van del 56 al 60 [56,57,58,59] los primeros son locales
    const cuartosPartidos = [56, 57, 58, 59, 56, 57, 58, 59]
    const cuartosWinASemi = [57, 56, 59, 58]
    const semiPartidos = [60, 61, 60, 61]
    const semiWinAFinal = [60, 61]
    const final = [63, 63]

    let pos;
    let iof;
    let arrayFase = new Array()
    let n = Number(nfila)

    if (octavosWinACuartos.includes(n)) {
        iof = octavosWinACuartos.indexOf(n)
        pos = cuartosPartidos[iof]
        arrayFase = cuartosPartidos;
    } else if (cuartosWinASemi.includes(n)) {
        iof = cuartosWinASemi.indexOf(n)
        pos = semiPartidos[iof]
        arrayFase = semiPartidos;
    } else if (semiWinAFinal.includes(n)) {
        iof = semiWinAFinal.indexOf(n)
        pos = final[iof]
        arrayFase = final;
    }
    //console.log("nfila:", nfila, " pos: ", pos, "lenght: ", arrayFase.length, "mitadlenght: ", (Number(arrayFase.length / 2)), " iof: ", iof)

    if (!(n === 62 || n === 63)) {
        if (iof < Number(arrayFase.length / 2)) {//local
            origenProdeUnico[pos].datosPartido.eqlocal = origenProdeUnico[n].prodePartido.prode_eqwin
            origenProdeUnico[pos].datosPartido.icolocal = origenProdeUnico[n].prodePartido.prode_icowin
            document.getElementById("eqLoc_" + pos).innerHTML = origenProdeUnico[n].prodePartido.prode_eqwin
            document.getElementById("imgIcoLoc_" + pos).src = "img/equipos/" + origenProdeUnico[n].prodePartido.prode_icowin + ".png"
        } else {//visitante
            origenProdeUnico[pos].datosPartido.eqvisitante = origenProdeUnico[n].prodePartido.prode_eqwin
            origenProdeUnico[pos].datosPartido.icovisitante = origenProdeUnico[n].prodePartido.prode_icowin
            document.getElementById("eqVis_" + pos).innerHTML = origenProdeUnico[n].prodePartido.prode_eqwin
            document.getElementById("imgIcoVis_" + pos).src = "img/equipos/" + origenProdeUnico[n].prodePartido.prode_icowin + ".png"
        }
    }
    if (n === 60 || n === 61) {
        if (origenProdeUnico[60].prodePartido.prode_resul === "L" || origenProdeUnico[60].prodePartido.prode_ext === "L") {
            origenProdeUnico[62].datosPartido.eqlocal = origenProdeUnico[60].prodePartido.prode_eqvisitante
            origenProdeUnico[62].datosPartido.icolocal = origenProdeUnico[60].prodePartido.prode_icovisitante
            document.getElementById("eqLoc_" + 62).innerHTML = origenProdeUnico[60].prodePartido.prode_eqvisitante
            document.getElementById("imgIcoLoc_" + 62).src = "img/equipos/" + origenProdeUnico[60].prodePartido.prode_icovisitante + ".png"
        } else if (origenProdeUnico[60].prodePartido.prode_resul === "V" || origenProdeUnico[60].prodePartido.prode_ext === "V") {
            origenProdeUnico[62].datosPartido.eqlocal = origenProdeUnico[60].prodePartido.prode_eqlocal
            origenProdeUnico[62].datosPartido.icolocal = origenProdeUnico[60].prodePartido.prode_icolocal
            document.getElementById("eqLoc_" + 62).innerHTML = origenProdeUnico[60].prodePartido.prode_eqlocal
            document.getElementById("imgIcoLoc_" + 62).src = "img/equipos/" + origenProdeUnico[60].prodePartido.prode_icolocal + ".png"
        }
        if (origenProdeUnico[61].prodePartido.prode_resul === "L" || origenProdeUnico[61].prodePartido.prode_ext === "L") {
            origenProdeUnico[62].datosPartido.eqvisitante = origenProdeUnico[61].prodePartido.prode_eqvisitante
            origenProdeUnico[62].datosPartido.icovisitante = origenProdeUnico[61].prodePartido.prode_icovisitante
            document.getElementById("eqVis_" + 62).innerHTML = origenProdeUnico[61].prodePartido.prode_eqvisitante
            document.getElementById("imgIcoVis_" + 62).src = "img/equipos/" + origenProdeUnico[61].prodePartido.prode_icovisitante + ".png"
        } else if (origenProdeUnico[61].prodePartido.prode_resul === "V" || origenProdeUnico[61].prodePartido.prode_ext === "V") {
            origenProdeUnico[62].datosPartido.eqvisitante = origenProdeUnico[61].prodePartido.prode_eqlocal
            origenProdeUnico[62].datosPartido.icovisitante = origenProdeUnico[61].prodePartido.prode_icolocal
            document.getElementById("eqVis_" + 62).innerHTML = origenProdeUnico[61].prodePartido.prode_eqlocal
            document.getElementById("imgIcoVis_" + 62).src = "img/equipos/" + origenProdeUnico[61].prodePartido.prode_icolocal + ".png"
        }
    }

    //console.log({ origenProdeUnico })

}

const extSelec = Object.values(document.getElementsByClassName("selOpcion"));
extSelec.forEach(e => {
    e.addEventListener("change", f => {
        let n = f.target.id.match(/\d+/g);
        calcularGanadorPartido(n);
    })
})

/*************************************** */


const resFinal = () => {
    //Cargo todos los resultados
    console.log("Resultados Finales")
    console.log("CAMPEON: ", equiposFinales[1], "SEGUNDO: ", equiposTercer[1], "TERCERO: ", equiposFinales[0], "CUARTO: ", equiposTercer[0])

    for (let i = 0; i < origenProdeUnico.length; i++) {
        let loc = document.getElementById("resLoc_L" + i).textContent
        let vis = document.getElementById("resVis_V" + i).textContent
        let ext = document.getElementById("extSelect_" + i).value
        let resul = "";
        let resul_ext = "";
        if (loc > vis) resul = "L"
        if (loc < vis) resul = "V"
        if (loc === vis) {
            resul = "E"
            resul_ext = ext; // L o V
        }

        origenProdeUnico[i].prodePartido.prode_eqlocal = origenProdeUnico[i].datosPartido.eqlocal
        origenProdeUnico[i].prodePartido.prode_icolocal = origenProdeUnico[i].datosPartido.icolocal
        origenProdeUnico[i].prodePartido.prode_eqvisitante = origenProdeUnico[i].datosPartido.eqvisitante
        origenProdeUnico[i].prodePartido.prode_icovisitante = origenProdeUnico[i].datosPartido.icovisitante
        origenProdeUnico[i].prodePartido.prode_loc = loc
        origenProdeUnico[i].prodePartido.prode_vis = vis
        origenProdeUnico[i].prodePartido.prode_resul = resul
        if (i > 47) {
            origenProdeUnico[i].prodePartido.prode_ext = resul_ext
        }
        if (i === 63 && loc != "") {
            let encObjPUF = encryptObj(JSON.stringify(origenProdeUnico), noPasa);
            //window.localStorage.setItem("prodeUnicoFINAL", JSON.stringify(origenProdeUnico))
            window.localStorage.setItem("prodeUnicoFINAL", encObjPUF)
            console.log("objFinal:", origenProdeUnico)
        }
    }
    let encObjPUFF = encryptObj(JSON.stringify(origenProdeUnico), noPasa);
    window.localStorage.setItem("prodeUnicoFINAL", encObjPUFF)
}

const btnGuardar = document.getElementById("btnGuardarProdeUnico")
/*OCULTAR BOTON PARA CERRAR CARGA*/
//document.getElementById("btnGuardarProdeUnico").style.display = 'none'
/********************************* */
btnGuardar.addEventListener('click', async (event) => {
    resFinal();
    event.target.disabled = true;
    event.target.innerText = "Guardando...";
    console.log("guardando...")
    let encObjOrDatos = await encryptObj(JSON.stringify(orDatos), noPasa);
    window.localStorage.setItem("orDatosTablaGrupos", encObjOrDatos)

    //window.localStorage.setItem("orDatosTablaGrupos", JSON.stringify(orDatos))
    let objFinal = new Object()
    //objFinal.tablaGrupos = JSON.parse(window.localStorage.getItem("orDatosTablaGrupos"))
    objFinal.tablaGrupos = await JSON.parse(decryptObj(window.localStorage.getItem("orDatosTablaGrupos"), noPasa));
    //objFinal.partidos = JSON.parse(window.localStorage.getItem("prodeUnicoFINAL"));
    objFinal.partidos = await JSON.parse(decryptObj(window.localStorage.getItem("prodeUnicoFINAL"), noPasa));
    objFinal.user = usuario;
    console.log(objFinal)
    let encObjProdeUU = encryptObj(JSON.stringify(objFinal), noPasa);
    window.localStorage.setItem("prodeUnicoAdmin", encObjProdeUU);
    //await saveProdeUnicoUser(objFinal, usuario);
    await updateProdeUnicoResultados(objFinal, usuario)
    setTimeout(() => {
        event.target.disabled = false;
        event.target.innerText = "Guardar Prode";
    }, "5000")
})



/********************** */
var unicoAdmin;
var unicoUnificado;
//Calcular puntajes
const actualizarPuntajes = async () => {
    await unificarTodosUsuariosProdeUnico()
    unicoAdmin = await JSON.parse(decryptObj(window.localStorage.getItem("prodeUnicoAdmin"), noPasa));
    unicoUnificado = JSON.parse(window.localStorage.getItem("todosDocsProdeUnico"));

    unicoAdmin.partidos.forEach(p => {
        if (!(p.prodePartido.prode_loc === "") && !(p.prodePartido.prode_vis === "")) {
            //Guardo en real partido lo cargado en prodepartido de ADMIN
            p.realPartido.resul_eqlocal = p.prodePartido.prode_eqlocal
            p.realPartido.resul_eqvisitante = p.prodePartido.prode_eqvisitante
            p.realPartido.resul_icolocal = p.prodePartido.prode_icolocal
            p.realPartido.resul_icovisitante = p.prodePartido.prode_icovisitante
            p.realPartido.resul_loc = p.prodePartido.prode_loc
            p.realPartido.resul_vis = p.prodePartido.prode_vis
            p.realPartido.resul_ext = p.prodePartido.prode_ext
            p.realPartido.resultado = p.prodePartido.prode_resul
        } else { //reseteo realPartido de admin
            p.realPartido.resul_eqlocal = ""
            p.realPartido.resul_eqvisitante = ""
            p.realPartido.resul_icolocal = "vacio"
            p.realPartido.resul_icovisitante = "vacio"
            p.realPartido.resul_loc = ""
            p.realPartido.resul_vis = ""
            p.realPartido.resul_ext = ""
            p.realPartido.resultado = ""
            p.prodePartido.prode_resul = ""
        }
    })
    console.log({ unicoAdmin })
    await updateProdeUnicoResultados(unicoAdmin, usuario)
    //Cargar a usuarios en la parte real y calcula puntos. Primera fase
    unicoUnificado.forEach(async usu => {
        for (let p = 0; p < 48; p++) {
            usu.partidos[p].realPartido = unicoAdmin.partidos[p].realPartido
            let prodeLoc = usu.partidos[p].prodePartido.prode_loc != "" ? Number(usu.partidos[p].prodePartido.prode_loc) : ""
            let prodeVis = usu.partidos[p].prodePartido.prode_vis != "" ? Number(usu.partidos[p].prodePartido.prode_vis) : ""
            let realLoc = unicoAdmin.partidos[p].realPartido.resul_loc != "" ? Number(unicoAdmin.partidos[p].realPartido.resul_loc) : ""
            let realVis = unicoAdmin.partidos[p].realPartido.resul_vis != "" ? Number(unicoAdmin.partidos[p].realPartido.resul_vis) : ""
            let prodeResul = usu.partidos[p].prodePartido.prode_resul
            let realResul = unicoAdmin.partidos[p].realPartido.resultado

            if (realResul != "") {
                if (prodeResul === realResul) {
                    if (prodeLoc === realLoc && prodeVis === realVis) { //resultado exacto
                        usu.partidos[p].puntosP = 3 //acierto y resultado exacto
                    } else {
                        usu.partidos[p].puntosP = 1 //acierto resultado
                    }
                } else {
                    usu.partidos[p].puntosP = 0 //no acierto
                }
                //puntos por diferencia de gol
                if ((prodeLoc - prodeVis) === (realLoc - realVis)) {
                    usu.partidos[p].puntosDG = 1;
                } else {
                    usu.partidos[p].puntosDG = 0;
                }
                //puntos por cantidad de goles en el partido
                if ((prodeLoc + prodeVis) === (realLoc + realVis)) {
                    usu.partidos[p].puntosCG = 1;
                } else {
                    usu.partidos[p].puntosCG = 0;
                }
                usu.partidos[p].puntos = Number(usu.partidos[p].puntosP) + Number(usu.partidos[p].puntosDG) + Number(usu.partidos[p].puntosCG)
                usu.partidos[p].puntosPartExacto = "0";
                usu.partidos[p].puntosEqFase = "0";
            } else {
                usu.partidos[p].puntos = "0";
                usu.partidos[p].puntosP = "0";
                usu.partidos[p].puntosCG = "0";
                usu.partidos[p].puntosDG = "0";
                usu.partidos[p].puntosPartExacto = "0";
                usu.partidos[p].puntosEqFase = "0";
            }

        }
        /****************************************** */
        for (let p = 48; p < 64; p++) {
            let modifFase = 0;

            if (p >= 48 && p < 56) {
                modifFase = 1
            } else if (p >= 56 && p < 60) {
                modifFase = 2
            } else if (p >= 60 && p < 62) {
                modifFase = 3
            } else if (p === 63) {
                modifFase = 4
            }

            usu.partidos[p].realPartido = unicoAdmin.partidos[p].realPartido
            let prodeLoc = usu.partidos[p].prodePartido.prode_loc != "" ? Number(usu.partidos[p].prodePartido.prode_loc) : ""
            let prodeVis = usu.partidos[p].prodePartido.prode_vis != "" ? Number(usu.partidos[p].prodePartido.prode_vis) : ""
            let realLoc = unicoAdmin.partidos[p].realPartido.resul_loc != "" ? Number(unicoAdmin.partidos[p].realPartido.resul_loc) : ""
            let realVis = unicoAdmin.partidos[p].realPartido.resul_vis != "" ? Number(unicoAdmin.partidos[p].realPartido.resul_vis) : ""
            let prodeResul = usu.partidos[p].prodePartido.prode_resul
            let realResul = unicoAdmin.partidos[p].realPartido.resultado
            let prodeExt = usu.partidos[p].prodePartido.prode_ext
            let realExt = unicoAdmin.partidos[p].realPartido.resul_ext
            let prodeEqLoc = usu.partidos[p].prodePartido.prode_eqlocal
            let prodeEqVis = usu.partidos[p].prodePartido.prode_eqvisitante
            let realEqLoc = usu.partidos[p].realPartido.resul_eqlocal
            let realEqVis = usu.partidos[p].realPartido.resul_eqvisitante


            let aciertoEqFase = 0
            let aciertoPartExacto = 0
            //console.log({ p, realEqLoc, prodeEqLoc })
            if (realEqLoc === prodeEqLoc) { // si acierta equipo que pasa de fase
                aciertoEqFase = 3 + aciertoEqFase + modifFase;
            }
            if (realEqVis === prodeEqVis) {// si acierta equipo que pasa de fase
                aciertoEqFase = 3 + aciertoEqFase + modifFase;
            }
            usu.partidos[p].puntosEqFase = aciertoEqFase;
            if ((prodeEqLoc === realEqLoc) && (prodeEqVis === realEqVis)) { // Acierta partido exacto
                aciertoPartExacto = 3 + modifFase;
                usu.partidos[p].puntosPartExacto = aciertoPartExacto;
                if (realResul != "") {
                    if (prodeResul === realResul) {
                        if (((prodeLoc === realLoc && prodeVis === realVis) && (realResul != "E")) || ((prodeLoc === realLoc && prodeVis === realVis) & (realResul === "E") && (realExt === prodeExt))) { //resultado exacto
                            usu.partidos[p].puntosP = 3 + modifFase //acierto y resultado exacto
                        } else if (((prodeLoc === realLoc && prodeVis === realVis) && (realResul === "E") && (realExt != prodeExt)) || (!(prodeLoc === realLoc && prodeVis === realVis))) {
                            usu.partidos[p].puntosP = 1 + modifFase //acierto resultado
                        }
                    } else if ((prodeResul != realResul) && ((realResul === "E" && realExt === prodeResul) || (prodeResul === "E" && prodeExt === realResul))) {
                        usu.partidos[p].puntosP = 1 + modifFase //acierto resultado
                    } else {
                        usu.partidos[p].puntosP = 0 //no acierto
                    }
                    //puntos por diferencia de gol
                    if ((prodeLoc - prodeVis) === (realLoc - realVis)) {
                        usu.partidos[p].puntosDG = 1 + modifFase;
                    } else {
                        usu.partidos[p].puntosDG = 0;
                    }
                    //puntos por cantidad de goles en el partido
                    if ((prodeLoc + prodeVis) === (realLoc + realVis)) {
                        usu.partidos[p].puntosCG = 1 + modifFase;
                    } else {
                        usu.partidos[p].puntosCG = 0;
                    }
                    usu.partidos[p].puntos = Number(usu.partidos[p].puntosP) + Number(usu.partidos[p].puntosDG) + Number(usu.partidos[p].puntosCG) + Number(usu.partidos[p].puntosPartExacto) + Number(usu.partidos[p].puntosEqFase)
                } else {
                    usu.partidos[p].puntos = "0";
                    usu.partidos[p].puntosP = "0";
                    usu.partidos[p].puntosCG = "0";
                    usu.partidos[p].puntosDG = "0";
                    usu.partidos[p].puntosPartExacto = "0";

                }
            } else {
                usu.partidos[p].puntos = "0";
                usu.partidos[p].puntosP = "0";
                usu.partidos[p].puntosCG = "0";
                usu.partidos[p].puntosDG = "0";
                usu.partidos[p].puntosPartExacto = "0";
            }
            usu.partidos[p].puntos = Number(usu.partidos[p].puntosP) + Number(usu.partidos[p].puntosDG) + Number(usu.partidos[p].puntosCG) + Number(usu.partidos[p].puntosPartExacto) + Number(usu.partidos[p].puntosEqFase)
        }
        await updateResultadosUsuariosProdeUnico(usu, usu.user)
    });
    console.log(unicoUnificado)
    window.localStorage.setItem("todosDocsProdeUnico", JSON.stringify(unicoUnificado));

}

/******************************** */
/** actualiza pronosticos */
var objPronosticosProdeUnico;

//Genero documento con todos los pronosticos de usuarios
export const generarDocPronosticos = async () => {
    let objTodosDocProdeUnico = JSON.parse(window.localStorage.getItem("todosDocsProdeUnico"));
    objPronosticosProdeUnico = JSON.parse(JSON.stringify(objModeloPronosticosProdeUnico))
    console.log({ objTodosDocProdeUnico })
    console.log({ objPronosticosProdeUnico })
    const docAdmin = unicoAdmin.partidos
    console.log({ docAdmin })
    // tomo doc admin para cargar partidos no jugados pero con equipos clasificados
    docAdmin.sort((a, b) => a.id - b.id);

    //ordeno los partidos de cada usuario
    objTodosDocProdeUnico.forEach(usu => {
        usu.partidos.sort((a, b) => a.id - b.id)
    });

    //Asigno a cada uno de los 64 partidos del modelo, el pronostico de cada usuario.
    objPronosticosProdeUnico.forEach((part, ind) => {
        part.prodes = new Array()
        objTodosDocProdeUnico.forEach(usu => {
            part.realPartido = usu.partidos[ind].realPartido
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
            part.datosPartido.eqlocal = (part.realPartido.resul_eqlocal != "") ? part.realPartido.resul_eqlocal : part.datosPartido.eqlocal
            part.datosPartido.icolocal = (part.realPartido.resul_icolocal != "vacio") ? part.realPartido.resul_icolocal : part.datosPartido.icolocal
            part.datosPartido.eqvisitante = (part.realPartido.resul_eqvisitante != "") ? part.realPartido.resul_eqvisitante : part.datosPartido.eqvisitante
            part.datosPartido.icovisitante = (part.realPartido.resul_icovisitante != "vacio") ? part.realPartido.resul_icovisitante : part.datosPartido.icovisitante
        });
        if ((part.datosPartido.eqlocal.includes("GANADOR") || part.datosPartido.eqlocal.includes("PERDEDOR")) && (!(docAdmin[ind].datosPartido.eqlocal.includes("GANADOR")) || !(docAdmin[ind].datosPartido.eqlocal.includes("PERDEDOR")))) {
            part.datosPartido.eqlocal = docAdmin[ind].datosPartido.eqlocal
            part.datosPartido.icolocal = docAdmin[ind].datosPartido.icolocal
            part.datosPartido.eqvisitante = docAdmin[ind].datosPartido.eqvisitante
            part.datosPartido.icovisitante = docAdmin[ind].datosPartido.icovisitante

        }
    });
    let objPronFinal = new Object()
    objPronFinal.partidos = objPronosticosProdeUnico
    console.log({ objPronFinal })
    await updatePronosticosProdeUnico(objPronFinal);

}



//------------------------------------------------------------------------------------------------
// Función para crear la tabla de posiciones
const actualizarTablaPosicionesProdeUnico = async () => {
    //Primero tiene que generar obj con puntajes de usuario
    console.log("Actualizando *-----> ActualizarTablaPosicionesProdeUnico")
    let objTodosDocProdeUnico = JSON.parse(window.localStorage.getItem("todosDocsProdeUnico"));
    let objTablaPosicionesProdeUnico = new Object();
    objTablaPosicionesProdeUnico.usuarios = new Array();

    objTodosDocProdeUnico.forEach(usu => {
        let user = usu.user;
        user = user.substring(0, user.indexOf('@'));
        let ptsmascincopt = 0
        let mascincopt = 0
        let cincopt = 0
        let cuatropt = 0
        let trespt = 0
        let dospt = 0
        let unopt = 0
        let ceropt = 0
        let puntos = 0
        let pj = 0
        let puntosExtra = 0
        usu.partidos.forEach(p => {
            if (!(p.puntos === "") && (!(p.realPartido.resultado === ""))) {
                if (Number(p.puntos) > 5) {
                    mascincopt++;
                    ptsmascincopt = ptsmascincopt + p.puntos;
                }
                if (Number(p.puntos) === 5) {
                    cincopt++;
                }
                if (Number(p.puntos) === 4) {
                    cuatropt++;
                }
                if (Number(p.puntos) === 3) {
                    trespt++;
                }
                if (Number(p.puntos) === 2) {
                    dospt++;
                }
                if (Number(p.puntos) === 1) {
                    unopt++;
                }
                if (Number(p.puntos) === 0) {
                    ceropt++;
                }
                pj++;
                //console.log("pj: ", pj, " usu: ", usu.user)
                //puntosExtra = puntosExtra + Number(p.puntosCG) + Number(p.puntosDG) + Number(p.puntosEqFase) + Number(p.puntosPartExacto)
                puntosExtra = puntosExtra + Number(p.puntosEqFase) + Number(p.puntosPartExacto)
                puntos = puntos + Number(p.puntos)
            }
        })

        objTablaPosicionesProdeUnico.usuarios.push({ "user": user, "puntos": puntos, "pj": pj, "cincopt": cincopt, "cuatropt": cuatropt, "trespt": trespt, "dospt": dospt, "unopt": unopt, "ceropt": ceropt, "DG_CG": puntosExtra, "mascincopt": mascincopt, "ptsmascincopt": ptsmascincopt })
    });
    console.log("Obj tabla Posiciones:");
    console.log(objTablaPosicionesProdeUnico);
    //await updateTablaPosicionesFechas(objTablaPosiciones);
    await updateTablaPosicionesProdeUnico(objTablaPosicionesProdeUnico)
    //window.localStorage.setItem("tablaPosicionesProdeUnico", JSON.stringify(objTablaPosicionesProdeUnico));
}

//--------------------------------------------------------------------------------

const btnActualizar = document.getElementById("btnActualizarResultados");
btnActualizar.addEventListener('click', async (event) => {
    await actualizarPuntajes()
    await generarDocPronosticos()
    await actualizarTablaPosicionesProdeUnico()
});




