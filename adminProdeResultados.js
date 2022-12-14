import { showMessage } from "./js/mensajes.js";
import {
    updateProdeFecha, cargaUltimoDocumento, generarObjPronosticos, docCierreFecha, updateDocResultados, cargaResultados, updateResultadosUsuarios, docFechasCerradas,
    unificarTodosUsuario, updatePronosFechasCerradas, updateTablaPosicionesFechas, cargaProdeFechasAdmin
} from "./firebase.js";
import { objModeloCierreFechas } from "./js/modeloCierreFechas.js";
import { noPasa, userAdmin, verFechasCerradas, ultUpdAdminProdeResul } from "./js/env.js"



export const encryptObj = (obj, ps) => CryptoJS.AES.encrypt(JSON.stringify(obj), ps).toString();
export const decryptObj = (cryp, ps) => JSON.parse(CryptoJS.AES.decrypt(cryp, ps).toString(CryptoJS.enc.Utf8));

//Variable que guarda el objecto de datos.
var datosUserResultado;
var fechaFiltrada;
var usuario;
var datosLocalResultado = null;
var objPronosFecCer = null;
var objTablaPosiciones = new Object();

//------------------------------------------------------------------------------------------------
// Función para la creación de html de las 3 primeras fechas;
const partidosFecha = async (num) => {
    var numFecha = num;
    var tituloCuadro;
    datosUserResultado = JSON.parse(datosLocalResultado);
    fechaFiltrada = datosUserResultado.fechanro[numFecha - 1].partidos;

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
            <div class="hora">HORA</div>
            <div class="resMedio">PRÓNOSTICO</div>
            <div class="extendido">EXT</div>
        </div>
`
    for (let i = 0; i < fechaFiltrada.length; i++) {

        let visible = "none";
        let seleccionadoL;
        let seleccionadoV;

        if ((numFecha > 3) && (fechaFiltrada[i].realPartido.resultado === "E")) {
            visible = "inline;  -webkit-appearance: none; background-color: #f0f0f0; width: 2vw;text-align: center; font-weight:bold; font-size: 16px;"
            if (fechaFiltrada[i].realPartido.resul_ext === "L") {
                seleccionadoL = "selected"
            } else {
                seleccionadoV = "selected"
            }
        }

        tablaGrupos += `
            <div class="filaPartido">
                <div class="fecha">${fechaFiltrada[i].datosPartido.dia + " " + fechaFiltrada[i].datosPartido.fecha.substring(0, 5)}</div>
                <div class="hora">${fechaFiltrada[i].datosPartido.hora}</div>
                <div class="local">${fechaFiltrada[i].datosPartido.eqlocal}</div>
                <div class="icoLocal">
                    <img src="img/equipos/${fechaFiltrada[i].datosPartido.icolocal}.png" onerror="this.onerror=null;this.src=''" class="imgIco" />
                </div>
                <div id="resLoc_L${i}"  class="resLocal resul" contenteditable="true">${fechaFiltrada[i].realPartido.resul_loc}</div>
                <div class="resMedio">-</div>
                <div id="resVis_V${i}"  class="resVisitante resul" contenteditable="true">${fechaFiltrada[i].realPartido.resul_vis}</div>
                <div class="icoVisitante">
                    <img src="img/equipos/${fechaFiltrada[i].datosPartido.icovisitante}.png" onerror="this.onerror=null;this.src=''" class="imgIco" />
                </div>
                <div class="visitante">${fechaFiltrada[i].datosPartido.eqvisitante}</div>
                <!--<div class="resultado">${fechaFiltrada[i].realPartido.resul_loc + "-" + fechaFiltrada[i].realPartido.resul_vis}</div>-->
                <div class="extendido" id="ext_${i}">
                <select id="extSelect_${i}" style="display:${visible}" class="selOpcion"> 
                    <option value="L" ${seleccionadoL}>L</option>
                    <option value="V" ${seleccionadoV}>V</option>
                </select>
                </div>
            </div>
        `
    }
    tablaGrupos += `
    <button class="button1" role="button" id="cerrarFecha${numFecha}">
        Cerrar Fecha
    </button>
    <button class="button" role="button" id="btn${numFecha}">
        Guardar y Actualizar
    </button>
    <button class="button2" role="button" id="actualizar${numFecha}">
        Actualizar Resultados
    </button>
</div>
<div id="fecha${numFecha}" class="tabcontent">
<div id="tablaProde"></div>
</div>
`
    document.getElementById("tablaProde").innerHTML = tablaGrupos
};
//------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
const isNumer_MaxCarac = (e) => {
    // Valida el ingreso de resultados, verifica que sean números y no más de 2 caracteres
    if (!(e.keyCode >= 48 && e.keyCode <= 57) || e.target.innerText.length > 1) {
        e.preventDefault();
        e.target.style.border = '2px solid red';
    } else {
        if (e.keyCode >= 48 && e.keyCode <= 57) {
            e.target.style.border = '1px solid white';
        }
    }
}

//Seteo menu según fecha seleccionada, por defecto fecha 1
const abrirFecha = async (fecha) => {
    //console.log(fecha);
    var i, tabcontent, menuLinks
    tabcontent = document.getElementsByClassName("tabcontent")
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none"
    }
    menuLinks = document.getElementsByClassName("menuLinks")
    for (i = 0; i < menuLinks.length; i++) {
        menuLinks[i].className = menuLinks[i].className.replace(" active", "")
    }
    document.getElementById("fecha" + fecha).style.display = "block";
    // evt.currentTarget.className += " active"
    document.getElementById("fecha" + fecha).className += " active";

    //Valido si no trajo el doc del user logeado
    if (!(datosLocalResultado === null)) {
        await partidosFecha(fecha);

        //Validaciones en el ingreso de números
        let divresultados = document.getElementsByClassName("resul")
        for (let div of divresultados) {
            //console.log(div.id);
            div.addEventListener("keypress", isNumer_MaxCarac);
            //div.addEventListener("keydown", isNotNumber);

            // Validaciones al clickear en otro casillero si quedó vacío
            div.addEventListener('focusout', (event) => {
                //console.log(event.target.id) //nombre del div anterior focuseado
                //console.log(event.target.innerText) //valor ingresado    
                let divFila = event.target.id.match(/\d+/g);
                //console.log(event.target.id)
                let vis = document.getElementById("resVis_V" + divFila).textContent
                let loc = document.getElementById("resLoc_L" + divFila).textContent
                let ext = document.getElementById("extSelect_" + divFila).value
                console.log(fecha)
                if ((!(loc === "" && vis === "")) && (fecha > 3)) {
                    console.log("no vacio, loc: ", loc, " vis: ", vis)
                    if (loc === vis) {
                        document.getElementById("extSelect_" + divFila).style = "display: inline;  -webkit-appearance: none; background-color: #f0f0f0; width: 2vw;text-align: center; font-weight:bold; font-size: 16px;"
                    }
                    if (!(loc === vis)) {
                        document.getElementById("extSelect_" + divFila).style = "display: none;"
                        document.getElementById("extSelect_" + divFila).innerHTML
                    }
                }

                console.log(event.target.id)
            });
        }

        //click en botón Guardar de cada fecha
        const btnGuardar = document.getElementsByClassName("button");
        //console.log(btnGuardar[0].id);
        btnGuardar[0].addEventListener('click', (event) => {
            console.dir("boton: " + event.target.id);
            let numFecha = event.target.id.match(/\d+/g);
            //console.log("fecha numero: " + numFecha);
            event.target.disabled = true;
            event.target.innerText = "Actualizando...";
            //event.target.style.backgroundColor = 'red';
            guardarResultados(numFecha);
            setTimeout(() => {
                //console.log("Delayed", event.target.id);
                event.target.disabled = false;
                event.target.innerText = "Guardar y Actualizar";
                //event.target.style.backgroundColor = 'black';
            }, "4000")
        })
    }
    //actualizar a todos los usuarios el resultado de partido
    const btnActualizar = document.getElementsByClassName("button2");
    btnActualizar[0].addEventListener('click', (event) => {
        let numFecha = event.target.id.match(/\d+/g);
        actualizarResultadoTodosUsuarios(numFecha)
        console.log("actualizando");
        console.log("fecha: ", numFecha)
    });
    //actualizar a todos los usuarios el resultado de partido
    const btnCerrarFecha = document.getElementsByClassName("button1");
    btnCerrarFecha[0].addEventListener('click', (event) => {
        let numFecha = event.target.id.match(/\d+/g);
        cerrarFecha(numFecha);
        console.log("cerrandoFecha");
    });
};

//--------------------------------------------------------------------------------
//Función para detectar el click en botones de fechas. INICIO DE LA PAGE
//Click en la fecha1, modificar al avanzar fechas.
window.onload = async () => {
    document.getElementById("animacion").innerHTML = `<div class="loading">Loading&#8230;</div>`
    console.log("Inicio admin")
    let actualizar = false;
    if (!(localStorage.getItem("user") === null)) {
        usuario = decryptObj(localStorage.getItem("user"), noPasa);
        console.log("usuario logeado")
        if (usuario === userAdmin) {
            console.log("usuario ADMIN logeado")
            if (!(localStorage.getItem("ultUpdAdminProdeResul") === null)) {
                console.log("localUPD: " + localStorage.getItem("ultUpdAdminProdeResul") + ", EnvUPD: " + ultUpdAdminProdeResul)
                if (!(Number(localStorage.getItem("ultUpdAdminProdeResul")) === Number(ultUpdAdminProdeResul))) {
                    console.log("datos en storage no actualizados. LocUpd menor a EnvUpd")
                    actualizar = true;
                } else {
                    console.log("datos en storage actualizados. LocUpd igual EnvUpd")
                    actualizar = false;
                }
            } else {
                actualizar = true;
            }

            if (actualizar) {
                console.log("actualizando..")
                window.localStorage.setItem("ultUpdAdminProdeResul", ultUpdAdminProdeResul)
                window.localStorage.removeItem("resultadoFechas");
                console.log("recuperando datos")
                //console.log("generando datos inicial")
                //------------------------------------------------------------------------------
                //carga por unica vez el archivo modelo
                await updateDocResultados(null, usuario);
                //------------------------------------------------------------------------------
                //await cargaResultados(usuario);
                //datosLocalResultado = window.localStorage.getItem("resultadoFechas");
                window.localStorage.removeItem("FechasCerradas");
                if (verFechasCerradas > 0) {
                    await docFechasCerradas()
                }
            }

            await cargaResultados(usuario);

            if (verFechasCerradas > 0) {
                objPronosFecCer = JSON.parse(window.localStorage.getItem("FechasCerradas"));
                console.log(objPronosFecCer);
                datosLocalResultado = window.localStorage.getItem("resultadoFechas");
            }
            datosLocalResultado = window.localStorage.getItem("resultadoFechas");
            document.getElementById("fecha1").onclick = abrirFecha(7);
        }
    } else {
        document.getElementById("animacion").innerHTML = `<div>Iniciar sesión y clickear en la sección "Prode" para visualizar los partidos</div>`
    }
}
//--------------------------------------------------------------------------------
const botones = document.getElementById('fechasTab');
botones.addEventListener('click', (event) => {
    const isButton = event.target.nodeName === 'BUTTON';
    if (!isButton) {
        return;
    }
    // Id de los botones
    //console.dir(event.target.id);
    let numFecha = event.target.id.match(/\d+/g);
    //console.log("fecha numero: " + numFecha);
    abrirFecha(numFecha);
})
//--------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------------------
//Guardo los resultados cargados en cada fecha por usuario.
const guardarResultados = async (numF) => {
    for (let i = 0; i < fechaFiltrada.length; i++) {
        if (document.getElementById("resLoc_L" + i).textContent.length > 0 && document.getElementById("resVis_V" + i).textContent.length > 0) {
            datosUserResultado.fechanro[numF - 1].partidos[i].realPartido.resul_loc = document.getElementById("resLoc_L" + i).textContent;
            datosUserResultado.fechanro[numF - 1].partidos[i].realPartido.resul_vis = document.getElementById("resVis_V" + i).textContent;
            let resultadoProde = "";
            if ((datosUserResultado.fechanro[numF - 1].partidos[i].realPartido.resul_loc) && (datosUserResultado.fechanro[numF - 1].partidos[i].realPartido.resul_vis)) {
                if (datosUserResultado.fechanro[numF - 1].partidos[i].realPartido.resul_loc > datosUserResultado.fechanro[numF - 1].partidos[i].realPartido.resul_vis) {
                    resultadoProde = "L"
                } else if (datosUserResultado.fechanro[numF - 1].partidos[i].realPartido.resul_loc < datosUserResultado.fechanro[numF - 1].partidos[i].realPartido.resul_vis) {
                    resultadoProde = "V"
                } else if (datosUserResultado.fechanro[numF - 1].partidos[i].realPartido.resul_loc == datosUserResultado.fechanro[numF - 1].partidos[i].realPartido.resul_vis) {
                    resultadoProde = "E"
                    datosUserResultado.fechanro[numF - 1].partidos[i].realPartido.resul_ext = document.getElementById("extSelect_" + i).value;
                }
            }
            datosUserResultado.fechanro[numF - 1].partidos[i].realPartido.resultado = resultadoProde;
        } else {
            break;
        }
    }
    //Update resultados cargados por ADMIN en FB=>resultadoFechas => admin
    updateDocResultados(datosUserResultado, usuario);
    showMessage("Se guardaron los resultados.", "success");
};



//------------------------------------------------------------------------------------------------------------
const cerrarFecha = async (numF) => {
    //await unificarProdes(numF);
    await generarDocPronosticos(numF);
    await docCierreFecha(JSON.parse(window.localStorage.getItem("FechaCerrada_" + numF)), numF);
    await actualizarTablaPosiciones();

}
//************************************************************************************ */
//------------------------------------------------------------------------------------------------------------
//Función para unificar pronosticos de todos los usuarios en la fecha cerrada---------------------------------
//------------------------------------------------------------------------------------------------------------
//Función para cierre de Fecha. Trae todos los documentos y los filtra por la última versión de cada usuario. 
/*
export const unificarProdes = async (numF) => {
    await generarObjPronosticos()
    let objTodosDoc = JSON.parse(window.localStorage.getItem("todosDocs"));
    //Ordeno el objeto Sort y después reduce (al menos una vez el usuario se repite)
    const objTodosDocOrdenado = objTodosDoc.sort((uno, dos) => {
        if (uno.user === dos.user) {
            if (uno.user_version - dos.user_version) {
                return -1
            } else {
                return 1
            }
        }
    }).reduce((arrayObj, usuario) => arrayObj.some(usu => usu.user === usuario.user) ? arrayObj : [...arrayObj, usuario], []);
    console.log(objTodosDocOrdenado)
    //Genero el objecto pronosticos y elimino los datos que no quiero
    const objPronosticos = JSON.parse(JSON.stringify(objModeloCierreFechas))
    //Función que guarda en un objeto, todos los pronosticos. 
    function cargarPronosticosTodos() {
        let fec = numF - 1;
        for (let part in objPronosticos.fechanro[fec].partidos) {
            //Recorro por partidos de la fecha. Elimino y agrego keys del objeto
            objPronosticos.fechanro[fec].partidos[part].prodes = new Array()
            for (let usu in objTodosDocOrdenado) {
                //Recorro por partido y cargo los prodes de cada usuario
                objPronosticos.fechanro[fec].partidos[part].prodes.push(
                    {
                        user: objTodosDocOrdenado[usu].user,
                        prodePartido: objTodosDocOrdenado[usu].fechanro[fec].partidos[part].prodePartido,
                    })
            }
        }
        console.log(objPronosticos.fechanro[fec]);
        window.localStorage.removeItem("FechaCerrada_" + numF);
        window.localStorage.setItem("FechaCerrada_" + numF, JSON.stringify(objPronosticos.fechanro[fec]));
    }
    cargarPronosticosTodos();
}
*/
//************************************************************************************ */
//------------------------------------------------------------------------------------------------------------
//Genero documento con todos los pronosticos de usuarios
export const generarDocPronosticos = async (numF) => {
    await unificarTodosUsuario();
    let objTodosDoc = JSON.parse(window.localStorage.getItem("todosDocsUnificado"));
    await cargaProdeFechasAdmin()
    //const objPronosticos = JSON.parse(JSON.stringify(objModeloCierreFechas))
    const objPronosticos = JSON.parse(window.localStorage.getItem("PFAdmin"));

    let fec = numF - 1;
    for (let part in objPronosticos.fechanro[fec].partidos) {
        //Recorro por partidos de la fecha. Elimino y agrego keys del objeto
        objPronosticos.fechanro[fec].partidos[part].prodes = new Array()
        for (let usu in objTodosDoc) {
            //Recorro por partido y cargo los prodes de cada usuario
            objPronosticos.fechanro[fec].partidos[part].prodes.push(
                {
                    user: objTodosDoc[usu].user,
                    prodePartido: objTodosDoc[usu].fechanro[fec].partidos[part].prodePartido,
                })
        }
    }
    console.log(objPronosticos.fechanro[fec]);
    window.localStorage.removeItem("FechaCerrada_" + numF);
    window.localStorage.setItem("FechaCerrada_" + numF, JSON.stringify(objPronosticos.fechanro[fec]));
}
//----------------------------------------------------------------------------------

//---------------------------------------------------------------------------------
//Función del boton ACtualizar Resultados
const actualizarResultadoTodosUsuarios = async (numF) => {
    //actualiza el resultado del partido en la última vesión de todos los doc por usuario
    let fec = Number(numF - 1);
    //archivo de usuario completo
    objPronosFecCer = JSON.parse(window.localStorage.getItem("FechasCerradas"));
    let origenResultados = JSON.parse(window.localStorage.getItem("resultadoFechas"));
    console.log(origenResultados);

    //*****************************************************
    //HABILITAR
    //unifico todos los prodes de usuario en un objeto.
    await unificarTodosUsuario();
    //*****************************************************
    let destinoUsuario = JSON.parse(window.localStorage.getItem("todosDocsUnificado"));
    console.log(destinoUsuario.length);
    console.log("fecha: " + fec);
    //recorro por usuario
    destinoUsuario.forEach(async obj => {
        //console.log(obj.fechanro[fec].partidos.length);
        //console.log("fecha: " + fec);
        for (let i = 0; i < origenResultados.fechanro[fec].partidos.length; i++) {
            //console.log(origenResultados.fechanro[fec])
            if ((origenResultados.fechanro[fec].partidos[i].realPartido.resul_loc) && (origenResultados.fechanro[fec].partidos[i].realPartido.resul_vis)) {
                let rrrr = origenResultados.fechanro[fec].partidos[i].realPartido.resul_loc + "-" + origenResultados.fechanro[fec].partidos[i].realPartido.resul_vis
                let prodeeee = obj.fechanro[fec].partidos[i].prodePartido.prode_loc + "-" + obj.fechanro[fec].partidos[i].prodePartido.prode_vis
                console.log("partido: " + i + "resultado: " + rrrr + "prode: " + prodeeee)
                obj.fechanro[fec].partidos[i].realPartido.resul_loc = origenResultados.fechanro[fec].partidos[i].realPartido.resul_loc
                obj.fechanro[fec].partidos[i].realPartido.resul_vis = origenResultados.fechanro[fec].partidos[i].realPartido.resul_vis
                obj.fechanro[fec].partidos[i].realPartido.resultado = origenResultados.fechanro[fec].partidos[i].realPartido.resultado
                obj.fechanro[fec].partidos[i].realPartido.resul_ext = origenResultados.fechanro[fec].partidos[i].realPartido.resul_ext || ""


                objPronosFecCer.fechanro[fec].partidos[i].realPartido.resul_loc = origenResultados.fechanro[fec].partidos[i].realPartido.resul_loc
                objPronosFecCer.fechanro[fec].partidos[i].realPartido.resul_vis = origenResultados.fechanro[fec].partidos[i].realPartido.resul_vis
                objPronosFecCer.fechanro[fec].partidos[i].realPartido.resultado = origenResultados.fechanro[fec].partidos[i].realPartido.resultado
                objPronosFecCer.fechanro[fec].partidos[i].realPartido.resul_ext = origenResultados.fechanro[fec].partidos[i].realPartido.resul_ext || ""

                if (!(obj.fechanro[fec].partidos[i].prodePartido.prode_resul === "E")) {
                    obj.fechanro[fec].partidos[i].prodePartido.prode_ext = ""
                }

                obj.fechanro[fec].partidos[i].puntosP = "0"
                obj.fechanro[fec].partidos[i].puntosEXT = "0"
                obj.fechanro[fec].partidos[i].puntosDG = "0"
                obj.fechanro[fec].partidos[i].puntosCG = "0"

                let extProde = obj.fechanro[fec].partidos[i].prodePartido.prode_ext
                let extReal = origenResultados.fechanro[fec].partidos[i].realPartido.resul_ext || ""

                if (origenResultados.fechanro[fec].partidos[i].realPartido.resultado != "") {
                    if (obj.fechanro[fec].partidos[i].prodePartido.prode_resul === origenResultados.fechanro[fec].partidos[i].realPartido.resultado) {
                        if ((obj.fechanro[fec].partidos[i].prodePartido.prode_loc === origenResultados.fechanro[fec].partidos[i].realPartido.resul_loc) && (obj.fechanro[fec].partidos[i].prodePartido.prode_vis === origenResultados.fechanro[fec].partidos[i].realPartido.resul_vis)) {
                            if ((fec < 3) || (origenResultados.fechanro[fec].partidos[i].realPartido.resultado != "E")) {
                                obj.fechanro[fec].partidos[i].puntosP = "3";
                                console.log("suma 3 puntos")
                            } else if (extReal === extProde) {
                                obj.fechanro[fec].partidos[i].puntosP = "2";
                                console.log("suma 1 punto por penales")
                            } else {
                                obj.fechanro[fec].partidos[i].puntosP = "1";
                            }
                        } else {
                            obj.fechanro[fec].partidos[i].puntosP = "1";
                            console.log("suma 1 puntos")
                        }
                    } else {
                        obj.fechanro[fec].partidos[i].puntosP = "0";
                        console.log("no suma puntos")
                    }
                } else {//partido no jugado
                    obj.fechanro[fec].partidos[i].puntosP = "0";
                }

                //puntos por diferencia de gol
                let dgProde = Number(obj.fechanro[fec].partidos[i].prodePartido.prode_loc) - Number(obj.fechanro[fec].partidos[i].prodePartido.prode_vis)
                let dgReal = Number(origenResultados.fechanro[fec].partidos[i].realPartido.resul_loc) - Number(origenResultados.fechanro[fec].partidos[i].realPartido.resul_vis)

                if (dgProde === dgReal) {
                    obj.fechanro[fec].partidos[i].puntosDG = "1";
                } else {
                    obj.fechanro[fec].partidos[i].puntosDG = "0";
                }
                //puntos por diferencia de gol
                let cantGolesProde = Number(obj.fechanro[fec].partidos[i].prodePartido.prode_loc) + Number(obj.fechanro[fec].partidos[i].prodePartido.prode_vis)
                let cantGolesReal = Number(origenResultados.fechanro[fec].partidos[i].realPartido.resul_loc) + Number(origenResultados.fechanro[fec].partidos[i].realPartido.resul_vis)
                if (cantGolesProde === cantGolesReal) {
                    obj.fechanro[fec].partidos[i].puntosCG = "1";
                } else {
                    obj.fechanro[fec].partidos[i].puntosCG = "0";
                }

                console.log({ extReal, extProde })
                if ((fec > 2) && (origenResultados.fechanro[fec].partidos[i].realPartido.resultado === "E")) {
                    if (extProde === extReal) {
                        console.log("entre")
                        obj.fechanro[fec].partidos[i].puntosEXT = "1";
                    }
                } else {
                    obj.fechanro[fec].partidos[i].puntosEXT = "0";
                }
                if (obj.fechanro[fec].partidos[i].prodePartido.prode_resul === "") { // no cargó pronostico
                    obj.fechanro[fec].partidos[i].puntosDG = "0";
                    obj.fechanro[fec].partidos[i].puntosCG = "0";
                    obj.fechanro[fec].partidos[i].puntosP = "0";
                    obj.fechanro[fec].partidos[i].puntosEXT = "0"
                }
                let puntos = Number(obj.fechanro[fec].partidos[i].puntosP) + Number(obj.fechanro[fec].partidos[i].puntosDG) + Number(obj.fechanro[fec].partidos[i].puntosCG) + Number(obj.fechanro[fec].partidos[i].puntosEXT)
                obj.fechanro[fec].partidos[i].puntos = puntos;

            } else {
                console.log("resultado no cargado. partido: " + i);
                break;
            }
        }
        console.log(obj);
        console.log("objPronosFecCer: ");
        console.log(objPronosFecCer);
        await updateResultadosUsuarios(obj, obj.user); //cargo los resultados a cada usuario
        await updatePronosFechasCerradas(objPronosFecCer); //html pronosticos
    });
    //window.localStorage.setItem("todosDocsUnificado", JSON.stringify(destinoUsuario));
    window.localStorage.setItem("usuariosResultadosActualizados", JSON.stringify(destinoUsuario));
    actualizarTablaPosiciones(); //actualizo tabla de posiciones
}

//------------------------------------------------------------------------------------------------

// Función para crear la tabla de posiciones
const actualizarTablaPosiciones = async () => {
    //Primero tiene que generar obj con puntajes de usuario
    console.log("Actualizando *-----> ActualizarTablaPosiciones")
    await unificarTodosUsuario(); //Busco el Doc y seteo en Local Storage
    var objTodosDocsUsuarios = null;
    objTablaPosiciones = new Object();
    objTablaPosiciones.usuarios = new Array();
    objTodosDocsUsuarios = JSON.parse(window.localStorage.getItem("todosDocsUnificado"));

    console.log("TodosDocsUnificado: ")
    console.log(objTodosDocsUsuarios);
    objTodosDocsUsuarios.forEach(usu => {
        let user = usu.user;
        user = user.substring(0, user.indexOf('@'));
        let cincopt = 0
        let trespt = 0
        let dospt = 0
        let unopt = 0
        let ceropt = 0
        let puntos = 0
        let pj = 0
        let puntosExtra = 0
        usu.fechanro.every(f => {
            f.partidos.every(p => {
                if (p.puntos === "") {
                    console.log("frenooooooooooooo")
                    console.log(f.partidos)
                    return false;
                } else {
                    if (Number(p.puntos) === 5) {
                        cincopt++;
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
                    console.log("p.puntosCG: ", p.puntosCG)
                    puntosExtra = puntosExtra + Number(p.puntosCG) + Number(p.puntosDG)
                    puntos = puntos + Number(p.puntos)
                    return true;
                }

            })
            return true;
        })
        objTablaPosiciones.usuarios.push({ "user": user, "puntos": puntos, "pj": pj, "cincopt": cincopt, "trespt": trespt, "dospt": dospt, "unopt": unopt, "ceropt": ceropt, "DG_CG": puntosExtra })
    });
    console.log("Obj tabla Posiciones:");
    console.log(objTablaPosiciones);
    await updateTablaPosicionesFechas(objTablaPosiciones);
    window.localStorage.setItem("tablaPosiciones", JSON.stringify(objTablaPosiciones));
}


//--------------------------------------------------------------------------------

