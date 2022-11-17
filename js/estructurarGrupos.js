//******************************************************************************* */
//Funcion para reestructurar a grupos, ordenar o filtrar partidos por grupo
import { datosProdeCero } from "./js/modeloCERO.js"
let origen = datosProdeCero;
var destinoGrupo = new Array();
var idg = 0;
var FASES = ["GRUPO A", "GRUPO B", "GRUPO C", "GRUPO D", "GRUPO E", "GRUPO F", "GRUPO G", "GRUPO H", "OCTAVOS DE FINAL", "CUARTOS DE FINAL", "SEMIFINAL", "3° Y 4° PUESTO", "FINAL"]
const estructurarGrupos = async () => {
    FASES.forEach(elem => {
        //console.log(elem)
        origen.fechanro.forEach(f => {
            f.partidos.forEach(p => {
                if (p.datosPartido.grupo === elem) {
                    idg++
                    p.idg = idg;
                    destinoGrupo.push(p)
                }
            })
        })
        //console.log(destinoGrupo)
        window.localStorage.setItem("prodeUnico", JSON.stringify(destinoGrupo))
    })
};
estructurarGrupos()
//******************************************************************************* */

