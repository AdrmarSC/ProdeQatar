import { modeloProdeUnicoCero, modeloTablaGruposCero } from "./js/modeloCEROProdeUnico.js"
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
//var prodeUnicoInicial = new Array();
//prodeUnicoInicial = JSON.parse(window.localStorage.getItem("prodeUnico"));
//window.localStorage.setItem("prodeUnicoInicial ", JSON.stringify(prodeUnicoInicial));





/******************************************************************************************** */
//prodeUnico
const disenoProdeUnico = async (cantPart, origenDatos, fase, posInicial) => {
    //origenDatos = JSON.parse(window.localStorage.getItem("prodeUnico"));
    fechaFiltrada = new Array();
    posInicial = posInicial - cantPart; //posiciones de los campos de los HTML generados dinamicamente
    const posFinal = Number(posInicial) + Number(cantPart);
    //console.log("pIni: ", posInicial, "pfin: ", posFinal)
    for (let pos = posInicial; pos < posFinal; pos++) {
        //console.log(origenDatos[i])
        fechaFiltrada.push(origenDatos[pos])
    }
    let visible = "none";
    let tituloCuadroFecha = ["GRUPO A", "GRUPO B", "GRUPO C", "GRUPO D", "GRUPO E", "GRUPO F", "GRUPO G", "GRUPO H", "OCTAVOS DE FINAL", "CUARTOS DE FINAL", "SEMIFINALES", "3° Y 4° PUESTO", "FINALES"]
    let tituloCuadro = tituloCuadroFecha[fase]
    //fase < 8 ? visible = "none" : visible = "";

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
                <select id="extSelect_${j}" style="display:${visible}"> 
                    <option value="L">L</option>
                    <option value="V">V</option>
                </select>
                </div>
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

//***************************************************** */
//************INICIO */
document.getElementById("animacion").innerHTML = `<div class="loading">Loading&#8230;</div>`
document.getElementById("btnGuardarProdeUnico").style.display = "none";
if (!(localStorage.getItem("user") === null)) {
    usuario = decryptObj(localStorage.getItem("user"), noPasa);
    console.log("usuario logeado")
    await cargaProdeUnicoUser(usuario);
    //console.log(JSON.parse(window.localStorage.getItem("prodeUnicoUser")))
    document.getElementById("animacion").remove();
    document.getElementById("btnGuardarProdeUnico").style.display = "block";
    //origenProdeUnico = JSON.parse(window.localStorage.getItem("prodeUnico"));
    //let recuFBuserUnico = JSON.parse(window.localStorage.getItem("prodeUnicoUser"));   
    let recuFBuserUnico = await JSON.parse(decryptObj(window.localStorage.getItem('prodeUnicoUser'), noPasa));
    // recuFBuserUnico = JSON.parse(recuFBuserUnico)
    console.log(recuFBuserUnico)
    origenProdeUnico = recuFBuserUnico.partidos
    let orDatosTabGru = recuFBuserUnico.tablaGrupos

    const encObj = encryptObj(JSON.stringify(orDatosTabGru), noPasa);
    window.localStorage.setItem("orDatosProdeUnicoUser", encObj)
    //window.localStorage.setItem("orDatosProdeUnicoUser", JSON.stringify(orDatosTabGru))
    const partidosPorFases = [6, 6, 6, 6, 6, 6, 6, 6, 8, 4, 2, 1, 1]
    let result = 0;
    partidosPorFases.forEach(async (p, index) => {
        result += p;
        await disenoProdeUnico(p, origenProdeUnico, index, result);
    });
} else {
    document.getElementById("mitad2").style.display = 'none'
    document.getElementById("animacion").innerHTML = `<div>Iniciar sesión y Actualizar para visualizar los partidos</div>`
}

//************************** */

// tablaProdeUnico.reverse().forEach(f => {
//     document.getElementById("tablaProdeUnico").insertAdjacentHTML("afterend", f)
// })

//flechas subir y bajar marcador
const btnFlecha = document.getElementsByClassName("flechas");
Array.from(btnFlecha).forEach(b => {
    b.addEventListener('click', async (event) => {
        console.log("boton: " + event.target.id);

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
        if ((n > 47) && (n < 56)) calcularOctavos(n);         // await calcularCuartos(n);
        if ((n > 55) && (n < 60)) calcularCuartos(n);
        if ((n > 59) && (n < 62)) calcularSemi(n);
        if ((n > 61) && (n < 64)) calcularFinal(n);

    })
});


//funcion para cargar tabla de Posiciones por Gruposresutlados
//var tablaPosGrupos = new Array();
//var orDatos = modeloTablaGruposCero;

//var orDatos = JSON.parse(window.localStorage.getItem("orDatosProdeUnicoUser"));
//orDatos = JSON.parse(window.localStorage.getItem("orDatosProdeUnicoUser"));
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
    console.log("fila: ", n, " grupo: ", g, " pos: ", po)
    let lo = document.getElementById("resLoc_L" + n).textContent;
    let vi = document.getElementById("resVis_V" + n).textContent;
    let equipoGanador;
    let equipoPerdedor;
    //console.log("lo: ", lo, " vi: ", vi)
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
    //console.log(orDatos)
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
            document.getElementById("eqLoc_" + 48).innerHTML = orDatos.grupos[g].eq[0].equipo
            document.getElementById("imgIcoLoc_" + 48).src = "img/equipos/" + orDatos.grupos[g].eq[0].ico + ".png"
            origenProdeUnico[51].datosPartido.eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[51].datosPartido.icovisitante = orDatos.grupos[g].eq[1].ico
            document.getElementById("eqVis_" + 51).innerHTML = orDatos.grupos[g].eq[1].equipo
            document.getElementById("imgIcoVis_" + 51).src = "img/equipos/" + orDatos.grupos[g].eq[1].ico + ".png"
        }
        if (g === 1) {
            //B
            origenProdeUnico[51].datosPartido.eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[51].datosPartido.icolocal = orDatos.grupos[g].eq[0].ico
            document.getElementById("eqLoc_" + 51).innerHTML = orDatos.grupos[g].eq[0].equipo
            document.getElementById("imgIcoLoc_" + 51).src = "img/equipos/" + orDatos.grupos[g].eq[0].ico + ".png"
            origenProdeUnico[48].datosPartido.eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[48].datosPartido.icovisitante = orDatos.grupos[g].eq[1].ico
            document.getElementById("eqVis_" + 48).innerHTML = orDatos.grupos[g].eq[1].equipo
            document.getElementById("imgIcoVis_" + 48).src = "img/equipos/" + orDatos.grupos[g].eq[1].ico + ".png"
        }
        if (g === 2) {
            //C
            origenProdeUnico[49].datosPartido.eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[49].datosPartido.icolocal = orDatos.grupos[g].eq[0].ico
            document.getElementById("eqLoc_" + 49).innerHTML = orDatos.grupos[g].eq[0].equipo
            document.getElementById("imgIcoLoc_" + 49).src = "img/equipos/" + orDatos.grupos[g].eq[0].ico + ".png"
            origenProdeUnico[50].datosPartido.eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[50].datosPartido.icovisitante = orDatos.grupos[g].eq[1].ico
            document.getElementById("eqVis_" + 50).innerHTML = orDatos.grupos[g].eq[1].equipo
            document.getElementById("imgIcoVis_" + 50).src = "img/equipos/" + orDatos.grupos[g].eq[1].ico + ".png"
        }
        if (g === 3) {
            //D
            origenProdeUnico[50].datosPartido.eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[50].datosPartido.icolocal = orDatos.grupos[g].eq[0].ico
            document.getElementById("eqLoc_" + 50).innerHTML = orDatos.grupos[g].eq[0].equipo
            document.getElementById("imgIcoLoc_" + 50).src = "img/equipos/" + orDatos.grupos[g].eq[0].ico + ".png"
            origenProdeUnico[49].datosPartido.eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[49].datosPartido.icovisitante = orDatos.grupos[g].eq[1].ico
            document.getElementById("eqVis_" + 49).innerHTML = orDatos.grupos[g].eq[1].equipo
            document.getElementById("imgIcoVis_" + 49).src = "img/equipos/" + orDatos.grupos[g].eq[1].ico + ".png"
        }
        if (g === 4) {
            //E
            origenProdeUnico[52].datosPartido.eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[52].datosPartido.icolocal = orDatos.grupos[g].eq[0].ico
            document.getElementById("eqLoc_" + 52).innerHTML = orDatos.grupos[g].eq[0].equipo
            document.getElementById("imgIcoLoc_" + 52).src = "img/equipos/" + orDatos.grupos[g].eq[0].ico + ".png"
            origenProdeUnico[54].datosPartido.eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[54].datosPartido.icovisitante = orDatos.grupos[g].eq[1].ico
            document.getElementById("eqVis_" + 54).innerHTML = orDatos.grupos[g].eq[1].equipo
            document.getElementById("imgIcoVis_" + 54).src = "img/equipos/" + orDatos.grupos[g].eq[1].ico + ".png"
        }
        if (g === 5) {
            //F
            origenProdeUnico[54].datosPartido.eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[54].datosPartido.icolocal = orDatos.grupos[g].eq[0].ico
            document.getElementById("eqLoc_" + 54).innerHTML = orDatos.grupos[g].eq[0].equipo
            document.getElementById("imgIcoLoc_" + 54).src = "img/equipos/" + orDatos.grupos[g].eq[0].ico + ".png"
            origenProdeUnico[52].datosPartido.eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[52].datosPartido.icovisitante = orDatos.grupos[g].eq[1].ico
            document.getElementById("eqVis_" + 52).innerHTML = orDatos.grupos[g].eq[1].equipo
            document.getElementById("imgIcoVis_" + 52).src = "img/equipos/" + orDatos.grupos[g].eq[1].ico + ".png"
        }
        if (g === 6) {
            //G
            origenProdeUnico[53].datosPartido.eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[53].datosPartido.icolocal = orDatos.grupos[g].eq[0].ico
            document.getElementById("eqLoc_" + 53).innerHTML = orDatos.grupos[g].eq[0].equipo
            document.getElementById("imgIcoLoc_" + 53).src = "img/equipos/" + orDatos.grupos[g].eq[0].ico + ".png"
            origenProdeUnico[55].datosPartido.eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[55].datosPartido.icovisitante = orDatos.grupos[g].eq[1].ico
            document.getElementById("eqVis_" + 55).innerHTML = orDatos.grupos[g].eq[1].equipo
            document.getElementById("imgIcoVis_" + 55).src = "img/equipos/" + orDatos.grupos[g].eq[1].ico + ".png"
        }
        if (g === 7) {
            //H
            origenProdeUnico[55].datosPartido.eqlocal = orDatos.grupos[g].eq[0].equipo
            origenProdeUnico[55].datosPartido.icolocal = orDatos.grupos[g].eq[0].ico
            document.getElementById("eqLoc_" + 55).innerHTML = orDatos.grupos[g].eq[0].equipo
            document.getElementById("imgIcoLoc_" + 55).src = "img/equipos/" + orDatos.grupos[g].eq[0].ico + ".png"
            origenProdeUnico[53].datosPartido.eqvisitante = orDatos.grupos[g].eq[1].equipo
            origenProdeUnico[53].datosPartido.icovisitante = orDatos.grupos[g].eq[1].ico
            document.getElementById("eqVis_" + 53).innerHTML = orDatos.grupos[g].eq[1].equipo
            document.getElementById("imgIcoVis_" + 53).src = "img/equipos/" + orDatos.grupos[g].eq[1].ico + ".png"
        }
        //await disenoProdeUnico(8, origenProdeUnico, 8, 56);
    }
}

var equiposGanadoresOctavos = new Array();
var icoWinOct = ["vacio", "vacio", "vacio", "vacio", "vacio", "vacio", "vacio", "vacio"]


const calcularOctavos = async (nfila) => {
    //cuando hacen click en un resultado de octavos se activa esta función
    console.log("calcularOctavos")
    let partJugados = 0; // cantidad de partidos jugados (48 primera fase pero son96 por la suma)
    orDatos.grupos.forEach(g =>
        g.eq.forEach((e, i) => { partJugados = partJugados + e.pj.reduce((x, y) => x + y) })
    )
    console.log(partJugados)
    let n = nfila; //número de fila y partido
    let nPartOct = n - 48;
    console.log("nPartOct: ", nPartOct)
    let lo = document.getElementById("resLoc_L" + n).textContent;
    let vi = document.getElementById("resVis_V" + n).textContent;
    //if (partJugados === 96) {
    //if (partJugados === 2) {
    console.log("Fase de grupo completa")
    if (!(lo === "" && vi === "")) {
        lo = Number(document.getElementById("resLoc_L" + n).textContent)
        vi = Number(document.getElementById("resVis_V" + n).textContent)
        if (lo === vi) {//Evalua empate
            document.getElementById("extSelect_" + n).style = "display: inline;  -webkit-appearance: none; background-color: #f0f0f0; width: 2vw;text-align: center; font-weight:bold; font-size: 16px;"
            document.getElementById("extSelect_" + n).innerHTML
            document.getElementById("extSelect_" + n).value = "L"
            equiposGanadoresOctavos[nPartOct] = origenProdeUnico[n].datosPartido.eqlocal
            icoWinOct[nPartOct] = origenProdeUnico[n].datosPartido.icolocal
            console.log("eqGANA: ", equiposGanadoresOctavos[nPartOct])

            const ext = document.getElementById("extSelect_" + n)
            ext.addEventListener("change", f => {
                //console.log(document.getElementById("extSelect_" + n).value)
                if (document.getElementById("extSelect_" + n).value === "L") {
                    equiposGanadoresOctavos[nPartOct] = origenProdeUnico[n].datosPartido.eqlocal
                    icoWinOct[nPartOct] = origenProdeUnico[n].datosPartido.icolocal
                    console.log("eqGANA: ", equiposGanadoresOctavos[nPartOct])
                    console.log("cuartos_LOC:")
                    console.log(equiposGanadoresOctavos)
                    clasifCuartos();
                }
                if (document.getElementById("extSelect_" + n).value === "V") {
                    equiposGanadoresOctavos[nPartOct] = origenProdeUnico[n].datosPartido.eqvisitante
                    icoWinOct[nPartOct] = origenProdeUnico[n].datosPartido.icovisitante
                    console.log("eqGANA: ", equiposGanadoresOctavos[nPartOct])
                    console.log("cuartos_VIS:")
                    console.log(equiposGanadoresOctavos)
                    clasifCuartos();
                }
            })//ingresa opcion de partido
        }
        if (lo > vi) {//Evalua ganadores locales
            document.getElementById("extSelect_" + n).style = "display: none;"
            document.getElementById("extSelect_" + n).innerHTML
            equiposGanadoresOctavos[nPartOct] = origenProdeUnico[n].datosPartido.eqlocal
            icoWinOct[nPartOct] = origenProdeUnico[n].datosPartido.icolocal
            console.log("eqGANA: ", equiposGanadoresOctavos[nPartOct])
            //origenProdeUnico[50].datosPartido.icolocal = orDatos.grupos[g].eq[0].ico

        }
        if (lo < vi) {//Evalua ganadores visitantes
            document.getElementById("extSelect_" + n).style = "display: none;"
            document.getElementById("extSelect_" + n).innerHTML
            equiposGanadoresOctavos[nPartOct] = origenProdeUnico[n].datosPartido.eqvisitante
            icoWinOct[nPartOct] = origenProdeUnico[n].datosPartido.icovisitante
            console.log("eqGANA: ", equiposGanadoresOctavos[nPartOct])
        }
        console.log("cuartos:")
        console.log(equiposGanadoresOctavos)
        clasifCuartos();
        //}
    }

}

const clasifCuartos = async () => {
    //Actualizo los partidos de Cuartos
    //recibo nPartOct [0,1,2,3,4,5,6,7]
    //cuartos van del 56 al 60
    console.log("clasificaCuartos")
    console.log(equiposGanadoresOctavos[4])

    origenProdeUnico[56].datosPartido.eqlocal = equiposGanadoresOctavos[4] || "GANADOR P. 5"
    origenProdeUnico[56].datosPartido.icolocal = icoWinOct[4] || "vacio"
    document.getElementById("eqLoc_" + 56).innerHTML = origenProdeUnico[56].datosPartido.eqlocal
    document.getElementById("imgIcoLoc_" + 56).src = "img/equipos/" + icoWinOct[4] + ".png"

    origenProdeUnico[56].datosPartido.eqvisitante = equiposGanadoresOctavos[5] || "GANADOR P. 6"
    origenProdeUnico[56].datosPartido.icovisitante = icoWinOct[5] || "vacio"
    document.getElementById("eqVis_" + 56).innerHTML = origenProdeUnico[56].datosPartido.eqvisitante
    document.getElementById("imgIcoVis_" + 56).src = "img/equipos/" + icoWinOct[5] + ".png"

    origenProdeUnico[57].datosPartido.eqlocal = equiposGanadoresOctavos[0] || "GANADOR P. 1"
    origenProdeUnico[57].datosPartido.icolocal = icoWinOct[0] || "vacio"
    document.getElementById("eqLoc_" + 57).innerHTML = origenProdeUnico[57].datosPartido.eqlocal
    document.getElementById("imgIcoLoc_" + 57).src = "img/equipos/" + icoWinOct[0] + ".png"

    origenProdeUnico[57].datosPartido.eqvisitante = equiposGanadoresOctavos[1] || "GANADOR P. 2"
    origenProdeUnico[57].datosPartido.icovisitante = icoWinOct[1] || "vacio"
    document.getElementById("eqVis_" + 57).innerHTML = origenProdeUnico[57].datosPartido.eqvisitante
    document.getElementById("imgIcoVis_" + 57).src = "img/equipos/" + icoWinOct[1] + ".png"

    origenProdeUnico[58].datosPartido.eqlocal = equiposGanadoresOctavos[6] || "GANADOR P. 7"
    origenProdeUnico[58].datosPartido.icolocal = icoWinOct[6] || "vacio"
    document.getElementById("eqLoc_" + 58).innerHTML = origenProdeUnico[58].datosPartido.eqlocal
    document.getElementById("imgIcoLoc_" + 58).src = "img/equipos/" + icoWinOct[6] + ".png"

    origenProdeUnico[58].datosPartido.eqvisitante = equiposGanadoresOctavos[7] || "GANADOR P. 8"
    origenProdeUnico[58].datosPartido.icovisitante = icoWinOct[7] || "vacio"
    document.getElementById("eqVis_" + 58).innerHTML = origenProdeUnico[58].datosPartido.eqvisitante
    document.getElementById("imgIcoVis_" + 58).src = "img/equipos/" + icoWinOct[7] + ".png"

    origenProdeUnico[59].datosPartido.eqlocal = equiposGanadoresOctavos[3] || "GANADOR P. 4"
    origenProdeUnico[59].datosPartido.icolocal = icoWinOct[3] || "vacio"
    document.getElementById("eqLoc_" + 59).innerHTML = origenProdeUnico[59].datosPartido.eqlocal
    document.getElementById("imgIcoLoc_" + 59).src = "img/equipos/" + icoWinOct[3] + ".png"

    origenProdeUnico[59].datosPartido.eqvisitante = equiposGanadoresOctavos[2] || "GANADOR P. 3"
    origenProdeUnico[59].datosPartido.icovisitante = icoWinOct[2] || "vacio"
    document.getElementById("eqVis_" + 59).innerHTML = origenProdeUnico[59].datosPartido.eqvisitante
    document.getElementById("imgIcoVis_" + 59).src = "img/equipos/" + icoWinOct[2] + ".png"
}

var equiposGanadoresCuartos = new Array();
var icoWinCuartos = ["vacio", "vacio", "vacio", "vacio"]

const calcularCuartos = async (nfila) => {
    console.log("calcularCuartos")
    let n = nfila; //número de fila y partido
    let nPartCua = n - 56;
    let lo = document.getElementById("resLoc_L" + n).textContent;
    let vi = document.getElementById("resVis_V" + n).textContent;
    if (!(lo === "" && vi === "")) {
        lo = Number(document.getElementById("resLoc_L" + n).textContent)
        vi = Number(document.getElementById("resVis_V" + n).textContent)
        if (lo === vi) {//Evalua empate
            document.getElementById("extSelect_" + n).style = "display: inline;  -webkit-appearance: none; background-color: #f0f0f0; width: 2vw;text-align: center; font-weight:bold; font-size: 16px;"
            document.getElementById("extSelect_" + n).innerHTML
            document.getElementById("extSelect_" + n).value = "L"
            equiposGanadoresCuartos[nPartCua] = origenProdeUnico[n].datosPartido.eqlocal
            icoWinCuartos[nPartCua] = origenProdeUnico[n].datosPartido.icolocal

            console.log(origenProdeUnico[n].datosPartido.icolocal)
            const ext = document.getElementById("extSelect_" + n)
            ext.addEventListener("change", f => {
                if (document.getElementById("extSelect_" + n).value === "L") {
                    equiposGanadoresCuartos[nPartCua] = origenProdeUnico[n].datosPartido.eqlocal
                    icoWinCuartos[nPartCua] = origenProdeUnico[n].datosPartido.icolocal
                    console.log("cuartos_LOC:")
                    console.log(equiposGanadoresCuartos)
                    console.log(origenProdeUnico[n].datosPartido.icolocal)
                    clasifSemi();
                }
                if (document.getElementById("extSelect_" + n).value === "V") {
                    equiposGanadoresCuartos[nPartCua] = origenProdeUnico[n].datosPartido.eqvisitante
                    icoWinCuartos[nPartCua] = origenProdeUnico[n].datosPartido.icovisitante
                    console.log("cuartos_VIS:")
                    console.log(equiposGanadoresCuartos)

                    console.log(origenProdeUnico[n].datosPartido.icovisitante)
                    clasifSemi();
                }
            })//ingresa opcion de partido
        }
        if (lo > vi) {//Evalua ganadores locales
            document.getElementById("extSelect_" + n).style = "display: none;"
            document.getElementById("extSelect_" + n).innerHTML
            equiposGanadoresCuartos[nPartCua] = origenProdeUnico[n].datosPartido.eqlocal
            icoWinCuartos[nPartCua] = origenProdeUnico[n].datosPartido.icolocal
            console.log(origenProdeUnico[n].datosPartido.icolocal)


        }
        if (lo < vi) {//Evalua ganadores visitantes
            document.getElementById("extSelect_" + n).style = "display: none;"
            document.getElementById("extSelect_" + n).innerHTML
            equiposGanadoresCuartos[nPartCua] = origenProdeUnico[n].datosPartido.eqvisitante
            icoWinCuartos[nPartCua] = origenProdeUnico[n].datosPartido.icovisitante
            console.log(origenProdeUnico[n].datosPartido.icovisitante)
        }
        console.log("Semifinal:")
        console.log(equiposGanadoresCuartos)
        clasifSemi();

    }
}


const clasifSemi = async () => {
    console.log("clasificaSemi")
    console.log(equiposGanadoresCuartos)
    console.log(icoWinCuartos)

    origenProdeUnico[60].datosPartido.eqlocal = equiposGanadoresCuartos[1] || "GANADOR P. 10"
    origenProdeUnico[60].datosPartido.icolocal = icoWinCuartos[1] || "vacio"
    document.getElementById("eqLoc_" + 60).innerHTML = origenProdeUnico[60].datosPartido.eqlocal
    document.getElementById("imgIcoLoc_" + 60).src = "img/equipos/" + icoWinCuartos[1] + ".png"

    origenProdeUnico[60].datosPartido.eqvisitante = equiposGanadoresCuartos[0] || "GANADOR P. 9"
    origenProdeUnico[60].datosPartido.icovisitante = icoWinCuartos[0] || "vacio"
    document.getElementById("eqVis_" + 60).innerHTML = origenProdeUnico[60].datosPartido.eqvisitante
    document.getElementById("imgIcoVis_" + 60).src = "img/equipos/" + icoWinCuartos[0] + ".png"

    origenProdeUnico[61].datosPartido.eqlocal = equiposGanadoresCuartos[3] || "GANADOR P. 12"
    origenProdeUnico[61].datosPartido.icolocal = icoWinCuartos[3] || "vacio"
    document.getElementById("eqLoc_" + 61).innerHTML = origenProdeUnico[61].datosPartido.eqlocal
    document.getElementById("imgIcoLoc_" + 61).src = "img/equipos/" + icoWinCuartos[3] + ".png"

    origenProdeUnico[61].datosPartido.eqvisitante = equiposGanadoresCuartos[2] || "GANADOR P. 2"
    origenProdeUnico[61].datosPartido.icovisitante = icoWinCuartos[2] || "vacio"
    document.getElementById("eqVis_" + 61).innerHTML = origenProdeUnico[61].datosPartido.eqvisitante
    document.getElementById("imgIcoVis_" + 61).src = "img/equipos/" + icoWinCuartos[2] + ".png"
}




var equiposGanadoresSemi = new Array();
var icoWinSemi = ["vacio", "vacio"]
var equiposPerdedoresSemi = new Array();
var icoLoseSemi = ["vacio", "vacio"]


const clasifFinal = async () => {
    console.log("clasificaFinal")
    console.log(equiposGanadoresSemi)
    console.log(icoWinSemi)

    origenProdeUnico[62].datosPartido.eqlocal = equiposPerdedoresSemi[1] || "PERDEDOR P. 13"
    origenProdeUnico[62].datosPartido.icolocal = icoLoseSemi[1] || "vacio"
    document.getElementById("eqLoc_" + 62).innerHTML = origenProdeUnico[62].datosPartido.eqlocal
    document.getElementById("imgIcoLoc_" + 62).src = "img/equipos/" + icoLoseSemi[1] + ".png"

    origenProdeUnico[62].datosPartido.eqvisitante = equiposPerdedoresSemi[0] || "PERDEDOR P. 14"
    origenProdeUnico[62].datosPartido.icovisitante = icoLoseSemi[0] || "vacio"
    document.getElementById("eqVis_" + 62).innerHTML = origenProdeUnico[62].datosPartido.eqvisitante
    document.getElementById("imgIcoVis_" + 62).src = "img/equipos/" + icoLoseSemi[0] + ".png"

    origenProdeUnico[63].datosPartido.eqlocal = equiposGanadoresSemi[0] || "GANADOR P. 13"
    origenProdeUnico[63].datosPartido.icolocal = icoWinSemi[0] || "vacio"
    document.getElementById("eqLoc_" + 63).innerHTML = origenProdeUnico[63].datosPartido.eqlocal
    document.getElementById("imgIcoLoc_" + 63).src = "img/equipos/" + icoWinSemi[0] + ".png"

    origenProdeUnico[63].datosPartido.eqvisitante = equiposGanadoresSemi[1] || "GANADOR P. 14"
    origenProdeUnico[63].datosPartido.icovisitante = icoWinSemi[1] || "vacio"
    document.getElementById("eqVis_" + 63).innerHTML = origenProdeUnico[63].datosPartido.eqvisitante
    document.getElementById("imgIcoVis_" + 63).src = "img/equipos/" + icoWinSemi[1] + ".png"
}


const calcularSemi = async (nfila) => {
    console.log("calcularSemi")
    let n = nfila; //número de fila y partido
    let nPartSemi = n - 60;
    let lo = document.getElementById("resLoc_L" + n).textContent;
    let vi = document.getElementById("resVis_V" + n).textContent;
    if (!(lo === "" && vi === "")) {
        lo = Number(document.getElementById("resLoc_L" + n).textContent)
        vi = Number(document.getElementById("resVis_V" + n).textContent)
        if (lo === vi) {//Evalua empate
            document.getElementById("extSelect_" + n).style = "display: inline;  -webkit-appearance: none; background-color: #f0f0f0; width: 2vw;text-align: center; font-weight:bold; font-size: 16px;"
            document.getElementById("extSelect_" + n).innerHTML
            document.getElementById("extSelect_" + n).value = "L"
            equiposGanadoresSemi[nPartSemi] = origenProdeUnico[n].datosPartido.eqlocal
            icoWinSemi[nPartSemi] = origenProdeUnico[n].datosPartido.icolocal
            equiposPerdedoresSemi[nPartSemi] = origenProdeUnico[n].datosPartido.eqvisitante
            icoLoseSemi[nPartSemi] = origenProdeUnico[n].datosPartido.icovisitante

            const ext = document.getElementById("extSelect_" + n)
            ext.addEventListener("change", f => {
                //console.log(document.getElementById("extSelect_" + n).value)
                if (document.getElementById("extSelect_" + n).value === "L") {
                    equiposGanadoresSemi[nPartSemi] = origenProdeUnico[n].datosPartido.eqlocal
                    icoWinSemi[nPartSemi] = origenProdeUnico[n].datosPartido.icolocal
                    equiposPerdedoresSemi[nPartSemi] = origenProdeUnico[n].datosPartido.eqvisitante
                    icoLoseSemi[nPartSemi] = origenProdeUnico[n].datosPartido.icovisitante
                    console.log("Semi_LOC:")
                    console.log(equiposGanadoresSemi)
                    clasifFinal();
                }
                if (document.getElementById("extSelect_" + n).value === "V") {
                    equiposGanadoresSemi[nPartSemi] = origenProdeUnico[n].datosPartido.eqvisitante
                    icoWinSemi[nPartSemi] = origenProdeUnico[n].datosPartido.icovisitante
                    equiposPerdedoresSemi[nPartSemi] = origenProdeUnico[n].datosPartido.eqlocal
                    icoLoseSemi[nPartSemi] = origenProdeUnico[n].datosPartido.icolocal

                    console.log("Semi_VIS:")
                    console.log(equiposGanadoresSemi)

                    clasifFinal();
                }
            })//ingresa opcion de partido
        }
        if (lo > vi) {//Evalua ganadores locales
            document.getElementById("extSelect_" + n).style = "display: none;"
            document.getElementById("extSelect_" + n).innerHTML
            equiposGanadoresSemi[nPartSemi] = origenProdeUnico[n].datosPartido.eqlocal
            icoWinSemi[nPartSemi] = origenProdeUnico[n].datosPartido.icolocal
            equiposPerdedoresSemi[nPartSemi] = origenProdeUnico[n].datosPartido.eqvisitante
            icoLoseSemi[nPartSemi] = origenProdeUnico[n].datosPartido.icovisitante

        }
        if (lo < vi) {//Evalua ganadores visitantes
            document.getElementById("extSelect_" + n).style = "display: none;"
            document.getElementById("extSelect_" + n).innerHTML
            equiposGanadoresSemi[nPartSemi] = origenProdeUnico[n].datosPartido.eqvisitante
            icoWinSemi[nPartSemi] = origenProdeUnico[n].datosPartido.icovisitante
            equiposPerdedoresSemi[nPartSemi] = origenProdeUnico[n].datosPartido.eqlocal
            icoLoseSemi[nPartSemi] = origenProdeUnico[n].datosPartido.icolocal

        }
        console.log("Semifinal:")
        console.log(equiposGanadoresSemi)
        clasifFinal();

    }
}

var equiposFinales = new Array();
var equiposTercer = new Array();
var icoFinales = ["vacio", "vacio"]
var icoTercer = ["vacio", "vacio"]

const calcularFinal = async (nfila) => {
    console.log("calcularFinal")
    let n = nfila; //número de fila y partido
    let nPartFin = n - 62;
    let lo = document.getElementById("resLoc_L" + n).textContent;
    let vi = document.getElementById("resVis_V" + n).textContent;
    if (!(lo === "" && vi === "")) {
        lo = Number(document.getElementById("resLoc_L" + n).textContent)
        vi = Number(document.getElementById("resVis_V" + n).textContent)
        if (lo === vi) {//Evalua empate
            document.getElementById("extSelect_" + n).style = "display: inline;  -webkit-appearance: none; background-color: #f0f0f0; width: 2vw;text-align: center; font-weight:bold; font-size: 16px;"
            document.getElementById("extSelect_" + n).innerHTML
            document.getElementById("extSelect_" + n).value = "L"
            equiposFinales[nPartFin] = origenProdeUnico[n].datosPartido.eqlocal
            icoFinales[nPartFin] = origenProdeUnico[n].datosPartido.icolocal
            equiposTercer[nPartFin] = origenProdeUnico[n].datosPartido.eqvisitante
            icoTercer[nPartFin] = origenProdeUnico[n].datosPartido.icovisitante

            const ext = document.getElementById("extSelect_" + n)
            ext.addEventListener("change", f => {
                //console.log(document.getElementById("extSelect_" + n).value)
                if (document.getElementById("extSelect_" + n).value === "L") {
                    equiposFinales[nPartFin] = origenProdeUnico[n].datosPartido.eqlocal
                    icoFinales[nPartFin] = origenProdeUnico[n].datosPartido.icolocal
                    equiposTercer[nPartFin] = origenProdeUnico[n].datosPartido.eqvisitante
                    icoTercer[nPartFin] = origenProdeUnico[n].datosPartido.icovisitante
                    console.log("Final_LOC:")
                    console.log(equiposFinales)
                    resFinal();
                }
                if (document.getElementById("extSelect_" + n).value === "V") {
                    equiposFinales[nPartFin] = origenProdeUnico[n].datosPartido.eqvisitante
                    icoFinales[nPartFin] = origenProdeUnico[n].datosPartido.icovisitante
                    equiposTercer[nPartFin] = origenProdeUnico[n].datosPartido.eqlocal
                    icoTercer[nPartFin] = origenProdeUnico[n].datosPartido.icolocal

                    console.log("Final_VIS:")
                    console.log(equiposFinales)

                    resFinal();
                }
            })//ingresa opcion de partido
        }
        if (lo > vi) {//Evalua ganadores locales
            document.getElementById("extSelect_" + n).style = "display: none;"
            document.getElementById("extSelect_" + n).innerHTML
            equiposFinales[nPartFin] = origenProdeUnico[n].datosPartido.eqlocal
            icoFinales[nPartFin] = origenProdeUnico[n].datosPartido.icolocal
            equiposTercer[nPartFin] = origenProdeUnico[n].datosPartido.eqvisitante
            icoTercer[nPartFin] = origenProdeUnico[n].datosPartido.icovisitante

        }
        if (lo < vi) {//Evalua ganadores visitantes
            document.getElementById("extSelect_" + n).style = "display: none;"
            document.getElementById("extSelect_" + n).innerHTML
            equiposFinales[nPartFin] = origenProdeUnico[n].datosPartido.eqvisitante
            icoFinales[nPartFin] = origenProdeUnico[n].datosPartido.icovisitante
            equiposTercer[nPartFin] = origenProdeUnico[n].datosPartido.eqlocal
            icoTercer[nPartFin] = origenProdeUnico[n].datosPartido.icolocal

        }
        console.log("Final:")
        console.log(equiposFinales)
        resFinal();

    }
}

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
    await saveProdeUnicoUser(objFinal, usuario);
    setTimeout(() => {
        event.target.disabled = false;
        event.target.innerText = "Guardar Prode";
    }, "5000")
})

/*
//Carga de usuario admin en blanco
let objAdmin = new Object()
objAdmin.tablaGrupos = modeloTablaGruposCero;
objAdmin.partidos = modeloProdeUnicoCero;
objAdmin.user = "ADMINISTRADOR@ADMIN.COM"
await updateProdeUnicoResultados(objAdmin, "ADMINISTRADOR@ADMIN.COM");
*/
