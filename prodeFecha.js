//Consumo los datos de datosEstatico.js
import { showMessage } from "./js/mensajes.js";
import { updateProdeFecha, cargaUltimoDocumento } from "./firebase.js";
import { datosProdeCero } from "./js/modeloCERO.js";

//Variable que guarda el objecto de datos.
var fechaFiltrada;
var fechaFiltradaCERO;

cargaUltimoDocumento(localStorage.getItem("user"));
fechaFiltrada = JSON.parse(window.localStorage.getItem('objFBdata')).fechanro[0].partidos;
console.log(fechaFiltrada);
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------


// Función para la creación de html de las 3 primeras fechas;
const partidosFecha = async (num) => {
    var numFecha = num;
    var tituloCuadro;
    fechaFiltrada = datosProde.filter(partido => partido.fecha_n == numFecha)
    //Filtro el objecto según la fecha
    fechaFiltradaCERO = datosProdeCero.fechanro[numFecha - 1].partidos
    //----------------------------------------------
    // await consultaDocumento("prueba6@prueba.com", 2);
    // const fechaFiltradaCERO = JSON.parse(window.localStorage.getItem('objFBdata'));
    // console.log(fechaFiltradaCERO)
    //----------------------------------------------
    //console.log(numFecha)
    // console.log(fechaFiltrada);
    // console.log(fechaFiltradaCERO);
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
    for (let i = 0; i < fechaFiltradaCERO.length; i++) {
        tablaGrupos += `
            <div class="filaPartido">
                <div class="fecha">${fechaFiltradaCERO[i].datosPartido.dia + " " + fechaFiltradaCERO[i].datosPartido.fecha.substring(0, 5)}</div>
                <div class="hora">${fechaFiltradaCERO[i].datosPartido.hora}</div>
                <div class="local">${fechaFiltradaCERO[i].datosPartido.eqlocal}</div>
                <div class="icoLocal">
                    <img src="img/equipos/${fechaFiltradaCERO[i].datosPartido.icolocal}.png" onerror="this.onerror=null;this.src=''" class="imgIco" />
                </div>
                <div id="resLoc_L${i}"  class="resLocal resul" contenteditable="true">${fechaFiltradaCERO[i].prodePartido.prode_loc}</div>
                <div class="resMedio">-</div>
                <div id="resVis_V${i}"  class="resVisitante resul" contenteditable="true">${fechaFiltradaCERO[i].prodePartido.prode_vis}</div>
                <div class="icoVisitante">
                    <img src="img/equipos/${fechaFiltradaCERO[i].datosPartido.icovisitante}.png" onerror="this.onerror=null;this.src=''" class="imgIco" />
                </div>
                <div class="visitante">${fechaFiltradaCERO[i].datosPartido.eqvisitante}</div>
                <div class="resultado">${fechaFiltradaCERO[i].realPartido.resul_loc + "-" + fechaFiltradaCERO[i].realPartido.resul_vis}</div>
                <div class="puntos">${fechaFiltradaCERO[i].puntos}</div>
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




//---------------------------------------------------------------------------------
//Valida que la tecla presionada sea número y no más de 2 caracteres
const isNumer_MaxCarac = (e) => {
    //id del div y tecla presionada
    //console.log(e.target.id + "" + e.keyCode);

    // Valida el ingreso de resultados, verifica que sean números y no más de 2 caracteres
    if (!(e.keyCode >= 48 && e.keyCode <= 57) || e.target.innerText.length > 1) {
        e.preventDefault();
    } else {
        if (e.keyCode >= 48 && e.keyCode <= 57) {
            e.target.style.border = '1px solid white';
        }
    }
}

const isNotNumber = (e) => {
    if (!(e.keyCode >= 48 && e.keyCode <= 57)) {
        e.target.style.border = '2px solid red';
    }
}

//---------------------------------------------------------------------------------

//--------------------------------------------------------------------------------
//Seteo menu según fecha seleccionada, por defecto fecha 1
// const abrirFecha = (evt, fecha) => {
const abrirFecha = (fecha) => {
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
    partidosFecha(fecha);

    //Validaciones en el ingreso de números
    let divresultados = document.getElementsByClassName("resul")
    for (let div of divresultados) {
        //console.log(div.id);
        div.addEventListener("keypress", isNumer_MaxCarac);
        div.addEventListener("keydown", isNotNumber);

        // Reviso al clickear en otro casillero si quedó vacío
        div.addEventListener('focusout', (event) => {
            //console.log(event.target.id) //nombre del div anterior focuseado
            //console.log(event.target.innerText) //valor ingresado    
            let divFila = event.target.id.match(/\d+/g);
            //console.log(event.target.id)
            let vis = document.getElementById("resVis_V" + divFila)
            let loc = document.getElementById("resLoc_L" + divFila)
            console.log(event.target.id)
            if (event.target.id === loc.id && event.target.innerText.length === 0) {
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
        console.log("fecha numero: " + numFecha);
        guardarResultados(numFecha);

    })
};

//--------------------------------------------------------------------------------
//Función para detectar el click en botones de fechas
document.getElementById("fecha1").onclick = abrirFecha(1);//Click en la fecha1, modificar al avanzar fechas.
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
const guardarResultados = (num) => {
    let camposIncompletos = true;
    for (let i = 0; i < fechaFiltrada.length; i++) {
        // console.log(i);
        // console.log(fechaFiltrada)
        // let uri = document.documentURI;
        // console.log(uri);
        document.getElementById("resLoc_L" + i).style.border = '1px solid white';
        document.getElementById("resVis_V" + i).style.border = '1px solid white';
        //Reviso resultados no completados:
        if (document.getElementById("resLoc_L" + i).textContent.length === 0 || document.getElementById("resVis_V" + i).textContent.length === 0) {
            //alert("Faltan completar resultados")
            document.getElementById("resLoc_L" + i).style.border = '2px solid red';
            document.getElementById("resVis_V" + i).style.border = '2px solid red';
            camposIncompletos = true;
        } else {
            fechaFiltrada[i].prode_loc = document.getElementById("resLoc_L" + i).textContent;
            fechaFiltrada[i].prode_vis = document.getElementById("resVis_V" + i).textContent;

            let resultadoProde = "";
            if ((fechaFiltrada[i].prode_loc) && (fechaFiltrada[i].prode_vis)) {
                if (fechaFiltrada[i].prode_loc > fechaFiltrada[i].prode_vis) {
                    resultadoProde = "L"
                } else if (fechaFiltrada[i].prode_loc < fechaFiltrada[i].prode_vis) {
                    resultadoProde = "V"
                } else if (fechaFiltrada[i].prode_loc == fechaFiltrada[i].prode_vis) {
                    resultadoProde = "E"
                }
            }

            fechaFiltrada[i].user = localStorage.getItem("user");
            fechaFiltrada[i].prode_resul = resultadoProde;
            fechaFiltrada[i].user_version++

            // console.log(fechaFiltrada[i].user);
            // console.log(fechaFiltrada[i].prode_resul);
            // console.log(fechaFiltrada[i].user_version);

            camposIncompletos = false;
        }
    }
    // console.log(fechaFiltrada)
    // console.log(fechaFiltrada[0].user)
    // console.log(fechaFiltrada[0].user_version)

    // Object.keys(fechaFiltrada).forEach(function (key) {
    //     console.log(key, fechaFiltrada[key]);
    // });

    const fechaHora = new Date().toLocaleString();
    console.log(fechaHora);


    if (!camposIncompletos) {
        showMessage("Se guardaron los resultados.", "success")
    } else {
        showMessage("No se guardaron los resultados. Faltan completar partidos de la fecha.", "error")
    }
    console.log(fechaFiltrada);
    var pruebarray = {
        "user": fechaFiltrada[0].user,
        "user_version": 0,
        "user_modificacion": fechaHora,
        "fechanro": [
            {
                "fecha_n": 1,
                "partidos": [
                    {
                        "partido_n": 1,
                        "id": 1,
                        "datosPartido": {
                            "dia": "DOMINGO",
                            "fecha": "20/11/2022",
                            "hora": "13:00",
                            "eqlocal": "QATAR",
                            "icolocal": "qatar",
                            "eqvisitante": "ECUADOR",
                            "icovisitante": "ecuador",
                            "grupo": "GRUPO A"
                        },
                        "prodePartido": {
                            "prode_resul": "L",
                            "prode_loc": 0,
                            "prode_vis": 1,
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "L",
                            "resul_loc": 1,
                            "resul_vis": 0,
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": 0
                    },
                    {
                        "partido_n": 2,
                        "id": 2,
                        "datosPartido": {
                            "dia": "LUNES",
                            "fecha": "21/11/2022",
                            "hora": "10:00",
                            "eqlocal": "INGLATERRA",
                            "icolocal": "inglaterra",
                            "eqvisitante": "IRÁN",
                            "icovisitante": "iran",
                            "grupo": "GRUPO B"
                        },
                        "prodePartido": {
                            "prode_resul": "E",
                            "prode_loc": 2,
                            "prode_vis": 3,
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "V",
                            "resul_loc": 2,
                            "resul_vis": 3,
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": 3
                    },
                    {
                        "partido_n": 3,
                        "id": 3,
                        "datosPartido": {
                            "dia": "LUNES",
                            "fecha": "21/11/2022",
                            "hora": "13:00",
                            "eqlocal": "SENEGAL",
                            "icolocal": "senegal",
                            "eqvisitante": "PAÍSES BAJOS",
                            "icovisitante": "paisesbajos",
                            "grupo": "GRUPO A"
                        },
                        "prodePartido": {
                            "prode_resul": "V",
                            "prode_loc": 4,
                            "prode_vis": 5,
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "E",
                            "resul_loc": 4,
                            "resul_vis": 4,
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": 0
                    },
                    {
                        "partido_n": 4,
                        "id": 4,
                        "datosPartido": {
                            "dia": "LUNES",
                            "fecha": "21/11/2022",
                            "hora": "16:00",
                            "eqlocal": "ESTADOS UNIDOS",
                            "icolocal": "estadosunidos",
                            "eqvisitante": "GALES",
                            "icovisitante": "gales",
                            "grupo": "GRUPO B"
                        },
                        "prodePartido": {
                            "prode_resul": "E",
                            "prode_loc": 6,
                            "prode_vis": 6,
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "E",
                            "resul_loc": 6,
                            "resul_vis": 6,
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": 1
                    },
                    {
                        "partido_n": 5,
                        "id": 5,
                        "datosPartido": {
                            "dia": "MARTES",
                            "fecha": "22/11/2022",
                            "hora": "07:00",
                            "eqlocal": "ARGENTINA",
                            "icolocal": "argentina",
                            "eqvisitante": "ARABIA SAUDITA",
                            "icovisitante": "arabiasaudita",
                            "grupo": "GRUPO C"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 6,
                        "id": 6,
                        "datosPartido": {
                            "dia": "MARTES",
                            "fecha": "22/11/2022",
                            "hora": "10:00",
                            "eqlocal": "DINAMARCA",
                            "icolocal": "dinamarca",
                            "eqvisitante": "TÚNEZ",
                            "icovisitante": "tunez",
                            "grupo": "GRUPO D"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 7,
                        "id": 7,
                        "datosPartido": {
                            "dia": "MARTES",
                            "fecha": "22/11/2022",
                            "hora": "13:00",
                            "eqlocal": "MÉXICO",
                            "icolocal": "mexico",
                            "eqvisitante": "POLONIA",
                            "icovisitante": "polonia",
                            "grupo": "GRUPO C"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 8,
                        "id": 8,
                        "datosPartido": {
                            "dia": "MARTES",
                            "fecha": "22/11/2022",
                            "hora": "16:00",
                            "eqlocal": "FRANCIA",
                            "icolocal": "francia",
                            "eqvisitante": "AUSTRALIA",
                            "icovisitante": "australia",
                            "grupo": "GRUPO D"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 9,
                        "id": 9,
                        "datosPartido": {
                            "dia": "MIÉRCOLES",
                            "fecha": "23/11/2022",
                            "hora": "07:00",
                            "eqlocal": "MARRUECOS",
                            "icolocal": "marruecos",
                            "eqvisitante": "CROACIA",
                            "icovisitante": "croacia",
                            "grupo": "GRUPO F"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 10,
                        "id": 10,
                        "datosPartido": {
                            "dia": "MIÉRCOLES",
                            "fecha": "23/11/2022",
                            "hora": "10:00",
                            "eqlocal": "ALEMANIA",
                            "icolocal": "alemania",
                            "eqvisitante": "JAPÓN",
                            "icovisitante": "japon",
                            "grupo": "GRUPO E"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 11,
                        "id": 11,
                        "datosPartido": {
                            "dia": "MIÉRCOLES",
                            "fecha": "23/11/2022",
                            "hora": "13:00",
                            "eqlocal": "ESPAÑA",
                            "icolocal": "espana",
                            "eqvisitante": "COSTA RICA",
                            "icovisitante": "costarica",
                            "grupo": "GRUPO E"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 12,
                        "id": 12,
                        "datosPartido": {
                            "dia": "MIÉRCOLES",
                            "fecha": "23/11/2022",
                            "hora": "16:00",
                            "eqlocal": "BÉLGICA",
                            "icolocal": "belgica",
                            "eqvisitante": "CANADÁ",
                            "icovisitante": "canada",
                            "grupo": "GRUPO F"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 13,
                        "id": 13,
                        "datosPartido": {
                            "dia": "JUEVES",
                            "fecha": "24/11/2022",
                            "hora": "07:00",
                            "eqlocal": "SUIZA",
                            "icolocal": "suiza",
                            "eqvisitante": "CAMERÚN",
                            "icovisitante": "camerun",
                            "grupo": "GRUPO G"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 14,
                        "id": 14,
                        "datosPartido": {
                            "dia": "JUEVES",
                            "fecha": "24/11/2022",
                            "hora": "10:00",
                            "eqlocal": "URUGUAY",
                            "icolocal": "uruguay",
                            "eqvisitante": "COREA",
                            "icovisitante": "corea",
                            "grupo": "GRUPO H"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 15,
                        "id": 15,
                        "datosPartido": {
                            "dia": "JUEVES",
                            "fecha": "24/11/2022",
                            "hora": "13:00",
                            "eqlocal": "PORTUGAL",
                            "icolocal": "portugal",
                            "eqvisitante": "GHANA",
                            "icovisitante": "ghana",
                            "grupo": "GRUPO H"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 16,
                        "id": 16,
                        "datosPartido": {
                            "dia": "JUEVES",
                            "fecha": "24/11/2022",
                            "hora": "16:00",
                            "eqlocal": "BRASIL",
                            "icolocal": "brasil",
                            "eqvisitante": "SERBIA",
                            "icovisitante": "serbia",
                            "grupo": "GRUPO G"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    }
                ]
            },
            {
                "fecha_n": 2,
                "partidos": [
                    {
                        "partido_n": 17,
                        "id": 17,
                        "datosPartido": {
                            "dia": "VIERNES",
                            "fecha": "25/11/2022",
                            "hora": "07:00",
                            "eqlocal": "GALES",
                            "icolocal": "gales",
                            "eqvisitante": "IRÁN",
                            "icovisitante": "iran",
                            "grupo": "GRUPO B"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 18,
                        "id": 18,
                        "datosPartido": {
                            "dia": "VIERNES",
                            "fecha": "25/11/2022",
                            "hora": "10:00",
                            "eqlocal": "QATAR",
                            "icolocal": "qatar",
                            "eqvisitante": "SENEGAL",
                            "icovisitante": "senegal",
                            "grupo": "GRUPO A"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 19,
                        "id": 19,
                        "datosPartido": {
                            "dia": "VIERNES",
                            "fecha": "25/11/2022",
                            "hora": "13:00",
                            "eqlocal": "PAÍSES BAJOS",
                            "icolocal": "paisesbajos",
                            "eqvisitante": "ECUADOR",
                            "icovisitante": "ecuador",
                            "grupo": "GRUPO A"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 20,
                        "id": 20,
                        "datosPartido": {
                            "dia": "VIERNES",
                            "fecha": "25/11/2022",
                            "hora": "16:00",
                            "eqlocal": "INGLATERRA",
                            "icolocal": "inglaterra",
                            "eqvisitante": "ESTADOS UNIDOS",
                            "icovisitante": "estadosunidos",
                            "grupo": "GRUPO B"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 21,
                        "id": 21,
                        "datosPartido": {
                            "dia": "SÁBADO",
                            "fecha": "26/11/2022",
                            "hora": "07:00",
                            "eqlocal": "TÚNEZ",
                            "icolocal": "tunez",
                            "eqvisitante": "AUSTRALIA",
                            "icovisitante": "australia",
                            "grupo": "GRUPO D"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 22,
                        "id": 22,
                        "datosPartido": {
                            "dia": "SÁBADO",
                            "fecha": "26/11/2022",
                            "hora": "10:00",
                            "eqlocal": "POLONIA",
                            "icolocal": "polonia",
                            "eqvisitante": "ARABIA SAUDITA",
                            "icovisitante": "arabiasaudita",
                            "grupo": "GRUPO C"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 23,
                        "id": 23,
                        "datosPartido": {
                            "dia": "SÁBADO",
                            "fecha": "26/11/2022",
                            "hora": "13:00",
                            "eqlocal": "FRANCIA",
                            "icolocal": "francia",
                            "eqvisitante": "DINAMARCA",
                            "icovisitante": "dinamarca",
                            "grupo": "GRUPO D"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 24,
                        "id": 24,
                        "datosPartido": {
                            "dia": "SÁBADO",
                            "fecha": "26/11/2022",
                            "hora": "16:00",
                            "eqlocal": "ARGENTINA",
                            "icolocal": "argentina",
                            "eqvisitante": "MÉXICO",
                            "icovisitante": "mexico",
                            "grupo": "GRUPO C"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 25,
                        "id": 25,
                        "datosPartido": {
                            "dia": "DOMINGO",
                            "fecha": "27/11/2022",
                            "hora": "07:00",
                            "eqlocal": "JAPÓN",
                            "icolocal": "japon",
                            "eqvisitante": "COSTA RICA",
                            "icovisitante": "costarica",
                            "grupo": "GRUPO E"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 26,
                        "id": 26,
                        "datosPartido": {
                            "dia": "DOMINGO",
                            "fecha": "27/11/2022",
                            "hora": "10:00",
                            "eqlocal": "BÉLGICA",
                            "icolocal": "belgica",
                            "eqvisitante": "MARRUECOS",
                            "icovisitante": "marruecos",
                            "grupo": "GRUPO F"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 27,
                        "id": 27,
                        "datosPartido": {
                            "dia": "DOMINGO",
                            "fecha": "27/11/2022",
                            "hora": "13:00",
                            "eqlocal": "CROACIA",
                            "icolocal": "croacia",
                            "eqvisitante": "CANADÁ",
                            "icovisitante": "canada",
                            "grupo": "GRUPO F"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 28,
                        "id": 28,
                        "datosPartido": {
                            "dia": "DOMINGO",
                            "fecha": "27/11/2022",
                            "hora": "16:00",
                            "eqlocal": "ESPAÑA",
                            "icolocal": "espana",
                            "eqvisitante": "ALEMANIA",
                            "icovisitante": "alemania",
                            "grupo": "GRUPO E"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 29,
                        "id": 29,
                        "datosPartido": {
                            "dia": "LUNES",
                            "fecha": "28/11/2022",
                            "hora": "07:00",
                            "eqlocal": "CAMERÚN",
                            "icolocal": "camerun",
                            "eqvisitante": "SERBIA",
                            "icovisitante": "serbia",
                            "grupo": "GRUPO G"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 30,
                        "id": 30,
                        "datosPartido": {
                            "dia": "LUNES",
                            "fecha": "28/11/2022",
                            "hora": "10:00",
                            "eqlocal": "COREA",
                            "icolocal": "corea",
                            "eqvisitante": "GHANA",
                            "icovisitante": "ghana",
                            "grupo": "GRUPO H"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 31,
                        "id": 31,
                        "datosPartido": {
                            "dia": "LUNES",
                            "fecha": "28/11/2022",
                            "hora": "13:00",
                            "eqlocal": "BRASIL",
                            "icolocal": "brasil",
                            "eqvisitante": "SUIZA",
                            "icovisitante": "suiza",
                            "grupo": "GRUPO G"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 32,
                        "id": 32,
                        "datosPartido": {
                            "dia": "LUNES",
                            "fecha": "28/11/2022",
                            "hora": "16:00",
                            "eqlocal": "PORTUGAL",
                            "icolocal": "portugal",
                            "eqvisitante": "URUGUAY",
                            "icovisitante": "uruguay",
                            "grupo": "GRUPO H"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    }
                ]
            },
            {
                "fecha_n": 3,
                "partidos": [
                    {
                        "partido_n": 33,
                        "id": 33,
                        "datosPartido": {
                            "dia": "MARTES",
                            "fecha": "29/11/2022",
                            "hora": "12:00",
                            "eqlocal": "PAÍSES BAJOS",
                            "icolocal": "paisesbajos",
                            "eqvisitante": "QATAR",
                            "icovisitante": "qatar",
                            "grupo": "GRUPO A"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 34,
                        "id": 34,
                        "datosPartido": {
                            "dia": "MARTES",
                            "fecha": "29/11/2022",
                            "hora": "12:00",
                            "eqlocal": "ECUADOR",
                            "icolocal": "ecuador",
                            "eqvisitante": "SENEGAL",
                            "icovisitante": "senegal",
                            "grupo": "GRUPO A"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 35,
                        "id": 35,
                        "datosPartido": {
                            "dia": "MARTES",
                            "fecha": "29/11/2022",
                            "hora": "16:00",
                            "eqlocal": "GALES",
                            "icolocal": "gales",
                            "eqvisitante": "INGLATERRA",
                            "icovisitante": "inglaterra",
                            "grupo": "GRUPO B"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 36,
                        "id": 36,
                        "datosPartido": {
                            "dia": "MARTES",
                            "fecha": "29/11/2022",
                            "hora": "16:00",
                            "eqlocal": "IRÁN",
                            "icolocal": "iran",
                            "eqvisitante": "ESTADOS UNIDOS",
                            "icovisitante": "estadosunidos",
                            "grupo": "GRUPO B"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 37,
                        "id": 37,
                        "datosPartido": {
                            "dia": "MIÉRCOLES",
                            "fecha": "30/11/2022",
                            "hora": "12:00",
                            "eqlocal": "TÚNEZ",
                            "icolocal": "tunez",
                            "eqvisitante": "FRANCIA",
                            "icovisitante": "francia",
                            "grupo": "GRUPO D"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 38,
                        "id": 38,
                        "datosPartido": {
                            "dia": "MIÉRCOLES",
                            "fecha": "30/11/2022",
                            "hora": "12:00",
                            "eqlocal": "AUSTRALIA",
                            "icolocal": "australia",
                            "eqvisitante": "DINAMARCA",
                            "icovisitante": "dinamarca",
                            "grupo": "GRUPO D"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 39,
                        "id": 39,
                        "datosPartido": {
                            "dia": "MIÉRCOLES",
                            "fecha": "30/11/2022",
                            "hora": "16:00",
                            "eqlocal": "POLONIA",
                            "icolocal": "polonia",
                            "eqvisitante": "ARGENTINA",
                            "icovisitante": "argentina",
                            "grupo": "GRUPO C"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 40,
                        "id": 40,
                        "datosPartido": {
                            "dia": "MIÉRCOLES",
                            "fecha": "30/11/2022",
                            "hora": "16:00",
                            "eqlocal": "ARABIA SAUDITA",
                            "icolocal": "arabiasaudita",
                            "eqvisitante": "MÉXICO",
                            "icovisitante": "mexico",
                            "grupo": "GRUPO C"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 41,
                        "id": 41,
                        "datosPartido": {
                            "dia": "JUEVES",
                            "fecha": "01/12/2022",
                            "hora": "12:00",
                            "eqlocal": "CROACIA",
                            "icolocal": "croacia",
                            "eqvisitante": "BÉLGICA",
                            "icovisitante": "belgica",
                            "grupo": "GRUPO F"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 42,
                        "id": 42,
                        "datosPartido": {
                            "dia": "JUEVES",
                            "fecha": "01/12/2022",
                            "hora": "12:00",
                            "eqlocal": "CANADÁ",
                            "icolocal": "canada",
                            "eqvisitante": "MARRUECOS",
                            "icovisitante": "marruecos",
                            "grupo": "GRUPO F"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 43,
                        "id": 43,
                        "datosPartido": {
                            "dia": "JUEVES",
                            "fecha": "01/12/2022",
                            "hora": "16:00",
                            "eqlocal": "JAPÓN",
                            "icolocal": "japon",
                            "eqvisitante": "ESPAÑA",
                            "icovisitante": "espana",
                            "grupo": "GRUPO E"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 44,
                        "id": 44,
                        "datosPartido": {
                            "dia": "JUEVES",
                            "fecha": "01/12/2022",
                            "hora": "16:00",
                            "eqlocal": "COSTA RICA",
                            "icolocal": "costarica",
                            "eqvisitante": "ALEMANIA",
                            "icovisitante": "alemania",
                            "grupo": "GRUPO E"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 45,
                        "id": 45,
                        "datosPartido": {
                            "dia": "VIERNES",
                            "fecha": "02/12/2022",
                            "hora": "12:00",
                            "eqlocal": "COREA",
                            "icolocal": "corea",
                            "eqvisitante": "PORTUGAL",
                            "icovisitante": "portugal",
                            "grupo": "GRUPO H"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 46,
                        "id": 46,
                        "datosPartido": {
                            "dia": "VIERNES",
                            "fecha": "02/12/2022",
                            "hora": "12:00",
                            "eqlocal": "GHANA",
                            "icolocal": "ghana",
                            "eqvisitante": "URUGUAY",
                            "icovisitante": "uruguay",
                            "grupo": "GRUPO H"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 47,
                        "id": 47,
                        "datosPartido": {
                            "dia": "VIERNES",
                            "fecha": "02/12/2022",
                            "hora": "16:00",
                            "eqlocal": "CAMERÚN",
                            "icolocal": "camerun",
                            "eqvisitante": "BRASIL",
                            "icovisitante": "brasil",
                            "grupo": "GRUPO G"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 48,
                        "id": 48,
                        "datosPartido": {
                            "dia": "VIERNES",
                            "fecha": "02/12/2022",
                            "hora": "16:00",
                            "eqlocal": "SERBIA",
                            "icolocal": "serbia",
                            "eqvisitante": "SUIZA",
                            "icovisitante": "suiza",
                            "grupo": "GRUPO G"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    }
                ]
            },
            {
                "fecha_n": 4,
                "partidos": [
                    {
                        "partido_n": 49,
                        "id": 49,
                        "datosPartido": {
                            "dia": "SÁBADO",
                            "fecha": "03/12/2022",
                            "hora": "12:00",
                            "eqlocal": "1° A",
                            "icolocal": "1°a",
                            "eqvisitante": "2° B",
                            "icovisitante": "2°b",
                            "grupo": "OCTAVOS DE FINAL"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 50,
                        "id": 50,
                        "datosPartido": {
                            "dia": "SÁBADO",
                            "fecha": "03/12/2022",
                            "hora": "16:00",
                            "eqlocal": "1° C",
                            "icolocal": "1°c",
                            "eqvisitante": "2° D",
                            "icovisitante": "2°d",
                            "grupo": "OCTAVOS DE FINAL"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 51,
                        "id": 51,
                        "datosPartido": {
                            "dia": "DOMINGO",
                            "fecha": "04/12/2022",
                            "hora": "12:00",
                            "eqlocal": "1° D",
                            "icolocal": "1°d",
                            "eqvisitante": "2° C",
                            "icovisitante": "2°c",
                            "grupo": "OCTAVOS DE FINAL"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 52,
                        "id": 52,
                        "datosPartido": {
                            "dia": "DOMINGO",
                            "fecha": "04/12/2022",
                            "hora": "16:00",
                            "eqlocal": "1° B",
                            "icolocal": "1°b",
                            "eqvisitante": "2° A",
                            "icovisitante": "2°a",
                            "grupo": "OCTAVOS DE FINAL"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 53,
                        "id": 53,
                        "datosPartido": {
                            "dia": "LUNES",
                            "fecha": "05/12/2022",
                            "hora": "12:00",
                            "eqlocal": "1° E",
                            "icolocal": "1°e",
                            "eqvisitante": "2° F",
                            "icovisitante": "2°f",
                            "grupo": "OCTAVOS DE FINAL"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 54,
                        "id": 54,
                        "datosPartido": {
                            "dia": "LUNES",
                            "fecha": "05/12/2022",
                            "hora": "16:00",
                            "eqlocal": "1° G",
                            "icolocal": "1°g",
                            "eqvisitante": "2° H",
                            "icovisitante": "2°h",
                            "grupo": "OCTAVOS DE FINAL"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 55,
                        "id": 55,
                        "datosPartido": {
                            "dia": "MARTES",
                            "fecha": "06/12/2022",
                            "hora": "12:00",
                            "eqlocal": "1° F",
                            "icolocal": "1°f",
                            "eqvisitante": "2° E",
                            "icovisitante": "2°e",
                            "grupo": "OCTAVOS DE FINAL"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 56,
                        "id": 56,
                        "datosPartido": {
                            "dia": "MARTES",
                            "fecha": "06/12/2022",
                            "hora": "16:00",
                            "eqlocal": "1° H",
                            "icolocal": "1°h",
                            "eqvisitante": "2° G",
                            "icovisitante": "2°g",
                            "grupo": "OCTAVOS DE FINAL"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    }
                ]
            },
            {
                "fecha_n": 5,
                "partidos": [
                    {
                        "partido_n": 57,
                        "id": 57,
                        "datosPartido": {
                            "dia": "VIERNES",
                            "fecha": "09/12/2022",
                            "hora": "12:00",
                            "eqlocal": "GANADOR P. 5",
                            "icolocal": "ganadorp.5",
                            "eqvisitante": "GANADOR P. 6",
                            "icovisitante": "ganadorp.6",
                            "grupo": "CUARTOS DE FINAL"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 58,
                        "id": 58,
                        "datosPartido": {
                            "dia": "VIERNES",
                            "fecha": "09/12/2022",
                            "hora": "16:00",
                            "eqlocal": "GANADOR P. 1",
                            "icolocal": "ganadorp.1",
                            "eqvisitante": "GANADOR P. 2",
                            "icovisitante": "ganadorp.2",
                            "grupo": "CUARTOS DE FINAL"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 59,
                        "id": 59,
                        "datosPartido": {
                            "dia": "SÁBADO",
                            "fecha": "10/12/2022",
                            "hora": "12:00",
                            "eqlocal": "GANADOR P. 7",
                            "icolocal": "ganadorp.7",
                            "eqvisitante": "GANADOR P. 8",
                            "icovisitante": "ganadorp.8",
                            "grupo": "CUARTOS DE FINAL"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 60,
                        "id": 60,
                        "datosPartido": {
                            "dia": "SÁBADO",
                            "fecha": "10/12/2022",
                            "hora": "16:00",
                            "eqlocal": "GANADOR P. 4",
                            "icolocal": "ganadorp.4",
                            "eqvisitante": "GANADOR P. 3",
                            "icovisitante": "ganadorp.3",
                            "grupo": "CUARTOS DE FINAL"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    }
                ]
            },
            {
                "fecha_n": 6,
                "partidos": [
                    {
                        "partido_n": 61,
                        "id": 61,
                        "datosPartido": {
                            "dia": "MARTES",
                            "fecha": "13/12/2022",
                            "hora": "16:00",
                            "eqlocal": "GANADOR P. 10",
                            "icolocal": "ganadorp.10",
                            "eqvisitante": "GANADOR P. 9",
                            "icovisitante": "ganadorp.9",
                            "grupo": "SEMIFINAL"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 62,
                        "id": 62,
                        "datosPartido": {
                            "dia": "MIÉRCOLES",
                            "fecha": "14/12/2022",
                            "hora": "16:00",
                            "eqlocal": "GANADOR P. 12",
                            "icolocal": "ganadorp.12",
                            "eqvisitante": "GANADOR P. 11",
                            "icovisitante": "ganadorp.11",
                            "grupo": "SEMIFINAL"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    }
                ]
            },
            {
                "fecha_n": 7,
                "partidos": [
                    {
                        "partido_n": 63,
                        "id": 63,
                        "datosPartido": {
                            "dia": "SÁBADO",
                            "fecha": "17/12/2022",
                            "hora": "12:00",
                            "eqlocal": "PERDEDOR P.13",
                            "icolocal": "perdedorp.13",
                            "eqvisitante": "PERDEDOR P. 14",
                            "icovisitante": "perdedorp.14",
                            "grupo": "3° Y 4° PUESTO"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    },
                    {
                        "partido_n": 64,
                        "id": 64,
                        "datosPartido": {
                            "dia": "DOMINGO",
                            "fecha": "18/12/2022",
                            "hora": "12:00",
                            "eqlocal": "GANADOR P. 13",
                            "icolocal": "ganadorp.13",
                            "eqvisitante": "GANADOR P. 14",
                            "icovisitante": "ganadorp.14",
                            "grupo": "FINAL"
                        },
                        "prodePartido": {
                            "prode_resul": "",
                            "prode_loc": "",
                            "prode_vis": "",
                            "prode_penloc": "",
                            "prode_penvis": ""
                        },
                        "realPartido": {
                            "resultado": "",
                            "resul_loc": "",
                            "resul_vis": "",
                            "resul_penloc": "",
                            "resul_penvis": ""
                        },
                        "puntos": ""
                    }
                ]
            }
        ]
    }
    updateProdeFecha(pruebarray, fechaFiltrada[0].user, fechaFiltrada[0].user_version)
};

