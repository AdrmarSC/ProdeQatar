//Consumo los datos de datosEstatico.js
import { showMessage } from "./js/mensajes.js";
import { updateProdeFecha, cargaUltimoDocumento } from "./firebase.js";

import { datosProdeCero } from "./js/modeloCERO.js";

var noPasa = "prueba";

export const encryptObj = (obj, ps) => CryptoJS.AES.encrypt(JSON.stringify(obj), ps).toString();
export const decryptObj = (cryp, ps) => JSON.parse(CryptoJS.AES.decrypt(cryp, ps).toString(CryptoJS.enc.Utf8));

//Variable que guarda el objecto de datos.
var datosUser;
var fechaFiltrada;
var fechaFiltradaCERO;
var usuario;
var datosLocal = null;


//------------------------------------------------------------------------------------------------
// Función para la creación de html de las 3 primeras fechas;
const partidosFecha = async (num) => {
    var numFecha = num;
    var tituloCuadro;
    //datosUser = await decryptObj(window.localStorage.getItem('objFiBdata'), noPasa)
    //window.localStorage.setItem("prueba", datosUser)
    //console.log(datosUser.fechanro[numFecha - 1].partidos)
    datosUser = JSON.parse(datosLocal)
    //datosUser = JSON.parse(window.localStorage.getItem('objFBdata'))
    //console.log(datosUser.fechanro[0].partidos)
    fechaFiltrada = datosUser.fechanro[numFecha - 1].partidos;

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
            <div class="resultado">REAL</div>
            <div class="puntos">PTS</div>
        </div>
`
    for (let i = 0; i < fechaFiltrada.length; i++) {
        tablaGrupos += `
            <div class="filaPartido">
                <div class="fecha">${fechaFiltrada[i].datosPartido.dia + " " + fechaFiltrada[i].datosPartido.fecha.substring(0, 5)}</div>
                <div class="hora">${fechaFiltrada[i].datosPartido.hora}</div>
                <div class="local">${fechaFiltrada[i].datosPartido.eqlocal}</div>
                <div class="icoLocal">
                    <img src="img/equipos/${fechaFiltrada[i].datosPartido.icolocal}.png" onerror="this.onerror=null;this.src=''" class="imgIco" />
                </div>
                <div id="resLoc_L${i}"  class="resLocal resul" contenteditable="true">${fechaFiltrada[i].prodePartido.prode_loc}</div>
                <div class="resMedio">-</div>
                <div id="resVis_V${i}"  class="resVisitante resul" contenteditable="true">${fechaFiltrada[i].prodePartido.prode_vis}</div>
                <div class="icoVisitante">
                    <img src="img/equipos/${fechaFiltrada[i].datosPartido.icovisitante}.png" onerror="this.onerror=null;this.src=''" class="imgIco" />
                </div>
                <div class="visitante">${fechaFiltrada[i].datosPartido.eqvisitante}</div>
                <div class="resultado">${fechaFiltrada[i].realPartido.resul_loc + "-" + fechaFiltrada[i].realPartido.resul_vis}</div>
                <div class="puntos">${fechaFiltrada[i].puntos}</div>
            </div>
        `
    }
    tablaGrupos += `
    <button class="button" role="button" id="btn${numFecha}">
        Guardar
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
    //Valida que la tecla presionada sea número y no más de 2 caracteres
    //console.log(e.target.id + "" + e.keyCode); //id del div y tecla presionada
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

// const isNotNumber = (e) => {
//     if (!(e.keyCode >= 48 && e.keyCode <= 57 && e.keyCode === 9)) {
//         e.target.style.border = '2px solid red';
//         console.log(e.keyCode)
//     }
// }
//---------------------------------------------------------------------------------

//--------------------------------------------------------------------------------
//Seteo menu según fecha seleccionada, por defecto fecha 1
// const abrirFecha = (evt, fecha) => {
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
    if (!(datosLocal === null)) {
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
                let vis = document.getElementById("resVis_V" + divFila)
                let loc = document.getElementById("resLoc_L" + divFila)
                console.log(event.target.id)
                if (loc.textContent.length > 0 && vis.textContent.length > 0) {
                    console.log("completo ok")
                    vis.style.border = '1px solid white';
                    loc.style.border = '1px solid white';
                } else if (event.target.id === loc.id && event.target.innerText.length === 0) {
                    loc.style.border = '2px solid red';
                    if (vis.textContent.length === 0) {
                        vis.style.border = '2px solid red';
                    }
                } else if (event.target.innerText.length > 0 && vis.textContent.length === 0) {
                    vis.style.border = '2px solid red';
                }
                if (event.target.id === vis.id && event.target.innerText.length === 0) {
                    vis.style.border = '2px solid red';
                    if (loc.textContent.length === 0) {
                        loc.style.border = '2px solid red';
                    }
                } else if (event.target.innerText.length > 0 && loc.textContent.length === 0) {
                    loc.style.border = '2px solid red';
                }
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
            event.target.innerText = "Guardando...";
            //event.target.style.backgroundColor = 'red';
            guardarResultados(numFecha);
            setTimeout(() => {
                //console.log("Delayed", event.target.id);
                event.target.disabled = false;
                event.target.innerText = "Guardar";
                //event.target.style.backgroundColor = 'black';
            }, "5000")

        })
    }
};

//--------------------------------------------------------------------------------
//Función para detectar el click en botones de fechas. INICIO DE LA PAGE
//Click en la fecha1, modificar al avanzar fechas.
window.onload = async () => {
    document.getElementById("animacion").innerHTML = `<div class="loading">Loading&#8230;</div>`
    if (!(localStorage.getItem("user") === null)) {
        usuario = decryptObj(localStorage.getItem("user"), noPasa);
        console.log("usuario logeado")
        if (window.localStorage.getItem('objFiBdata') === null) {
            await cargaUltimoDocumento(usuario);
            console.log("recuperando datos")
            datosLocal = await decryptObj(window.localStorage.getItem('objFiBdata'), noPasa);
            document.getElementById("fecha1").onclick = abrirFecha(1);
        } else {
            console.log("datos almacenados")
            datosLocal = await decryptObj(window.localStorage.getItem('objFiBdata'), noPasa);
            document.getElementById("fecha1").onclick = abrirFecha(1);
        }
    } else {
        document.getElementById("animacion").innerHTML = `<div>Iniciar sesión para visualizar los partidos</div>`
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
    let camposIncompletos = true;
    for (let i = 0; i < fechaFiltrada.length; i++) {
        document.getElementById("resLoc_L" + i).style.border = '1px solid white';
        document.getElementById("resVis_V" + i).style.border = '1px solid white';
        //Reviso resultados no completados:
        if (document.getElementById("resLoc_L" + i).textContent.length === 0 || document.getElementById("resVis_V" + i).textContent.length === 0) {
            //alert("Faltan completar resultados")
            document.getElementById("resLoc_L" + i).style.border = '2px solid red';
            document.getElementById("resVis_V" + i).style.border = '2px solid red';
            camposIncompletos = true;
        } else {
            //fechaFiltrada[i].prode_loc = document.getElementById("resLoc_L" + i).textContent;
            //fechaFiltrada[i].prode_vis = document.getElementById("resVis_V" + i).textContent;
            datosUser.fechanro[numF - 1].partidos[i].prodePartido.prode_loc = document.getElementById("resLoc_L" + i).textContent;
            datosUser.fechanro[numF - 1].partidos[i].prodePartido.prode_vis = document.getElementById("resVis_V" + i).textContent;
            let resultadoProde = "";
            if ((datosUser.fechanro[numF - 1].partidos[i].prodePartido.prode_loc) && (datosUser.fechanro[numF - 1].partidos[i].prodePartido.prode_vis)) {
                if (datosUser.fechanro[numF - 1].partidos[i].prodePartido.prode_loc > datosUser.fechanro[numF - 1].partidos[i].prodePartido.prode_vis) {
                    resultadoProde = "L"
                } else if (datosUser.fechanro[numF - 1].partidos[i].prodePartido.prode_loc < datosUser.fechanro[numF - 1].partidos[i].prodePartido.prode_vis) {
                    resultadoProde = "V"
                } else if (datosUser.fechanro[numF - 1].partidos[i].prodePartido.prode_loc == datosUser.fechanro[numF - 1].partidos[i].prodePartido.prode_vis) {
                    resultadoProde = "E"
                }
            }
            datosUser.fechanro[numF - 1].partidos[i].prodePartido.prode_resul = resultadoProde;
            camposIncompletos = false;
        }
    }

    // Object.keys(fechaFiltrada).forEach(function (key) {
    //     console.log(key, fechaFiltrada[key]);
    // });

    const fechaHora = new Date().toLocaleString();
    console.log(fechaHora);

    if (!camposIncompletos) {
        let versionUsuario = datosUser.user_version + 1
        console.log(versionUsuario)
        console.log(datosUser)
        datosUser.user_version = versionUsuario;
        datosUser.user_modificacion = fechaHora;
        const encryptedObject = encryptObj(JSON.stringify(datosUser), noPasa);
        window.localStorage.setItem("objFiBdata", encryptedObject)
        datosLocal = await decryptObj(window.localStorage.getItem('objFiBdata'), noPasa);
        updateProdeFecha(datosUser, usuario, versionUsuario)
        showMessage("Se guardaron los resultados.", "success")

    } else {
        showMessage("No se guardaron los resultados. Faltan completar partidos de la fecha.", "error")
    }
};


