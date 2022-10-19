//Consumo los datos de datosEstatico.js
// Función para la creación de html de las 3 primeras fechas;
var fechaFiltrada;
function partidosFecha(num) {
    var numFecha = num;

    fechaFiltrada = datosProde.filter(partido => partido.fecha_n == numFecha)
    // return fechaFiltrada;

    console.log(numFecha)
    console.log(fechaFiltrada);
    switch (Number(numFecha)) {
        case 1:
            tituloCuadro = "FECHA 1"
            break;
        case 2:
            tituloCuadro = "FECHA 2"
            break;
        case 3:
            tituloCuadro = "FECHA 3"
            break;
        case 4:
            tituloCuadro = "OCTAVOS DE FINAL"
            break;
        case 5:
            tituloCuadro = "CUARTOS DE FINAL"
            break;
        case 6:
            tituloCuadro = "SEMIFINALES"
            break;
        case 7:
            tituloCuadro = "FINALES"
            break;
    }

    var tablaGrupos = `
<div class="cuadroCompleto solapa${numFecha}">
    <div class="tituloCuadro">${tituloCuadro}</div>
        <div class="titulosPartidos">
            <div class="fecha">DIA</div>
            <div class="hora">HORA</div>
            <div class="resMedio">PRÓNOSTICO</div>
            <div class="resultado">RESULTADO</div>
            <div class="puntos">PTS</div>
        </div>
`
    for (let i = 0; i < fechaFiltrada.length; i++) {
        tablaGrupos += `
            <div class="filaPartido">
                <div class="fecha">${fechaFiltrada[i].dia + " " + fechaFiltrada[i].fecha.substring(0, 5)}</div>
                <div class="hora">${fechaFiltrada[i].hora}</div>
                <div class="local">${fechaFiltrada[i].local}</div>
                <div class="icoLocal">
                    <img src="img/equipos/${fechaFiltrada[i].icolocal}.png" onerror="this.onerror=null;this.src=''" class="imgIco" />
                </div>
                <div id="resLoc_L${i}" onKeypress="return isNum_MaxCar(event,this)" class="resLocal" contenteditable>${fechaFiltrada[i].prode_l}</div>
                <div class="resMedio">-</div>
                <div id="resVis_V${i}" onKeypress="return isNum_MaxCar(event,this)" class="resVisitante" contenteditable>${fechaFiltrada[i].prode_v}</div>
                <div class="icoVisitante">
                    <img src="img/equipos/${fechaFiltrada[i].icovisitante}.png" onerror="this.onerror=null;this.src=''" class="imgIco" />
                </div>
                <div class="visitante">${fechaFiltrada[i].visitante}</div>
                <div class="resultado">${fechaFiltrada[i].resul_l + "-" + fechaFiltrada[i].resul_v}</div>
                <div class="puntos">${fechaFiltrada[i].puntos}</div>
            </div>
        `
    }
    tablaGrupos += `
    <button class="button" role="button" onclick="guardarResultados(${numFecha})">
        Guardar
    </button>
</div>
<div id="fecha${numFecha}" class="tabcontent">
<div id="tablaProde"></div>
</div>
`
    document.getElementById("tablaProde").innerHTML = tablaGrupos
}

//Seteo menu según fecha seleccionada
function abrirFecha(evt, fecha) {
    var i, tabcontent, menuLinks
    tabcontent = document.getElementsByClassName("tabcontent")
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none"
    }
    menuLinks = document.getElementsByClassName("menuLinks")
    for (i = 0; i < menuLinks.length; i++) {
        menuLinks[i].className = menuLinks[i].className.replace(" active", "")
    }
    document.getElementById("fecha" + fecha).style.display = "block"
    evt.currentTarget.className += " active"
    partidosFecha(fecha)
}

//valida que sea número y no más de 2 caracteres
function isNum_MaxCar(e, elem) {
    // Valida el ingreso de resultados, verifica que sean números y no más de 2 caracteres
    if (!(e.charCode >= 48 && e.charCode <= 57) || elem.innerText.length > 1) {
        return false;
    }
}

function guardarResultados(num) {
    //funcion para tomar los resultados ingresados
    for (let i = 0; i < fechaFiltrada.length; i++) {
        // console.log(i);
        // console.log(fechaFiltrada)
        // let uri = document.documentURI;
        // console.log(uri);
        fechaFiltrada[i].prode_l = document.getElementById("resLoc_L" + i).textContent;
        fechaFiltrada[i].prode_v = document.getElementById("resVis_V" + i).textContent;
        let resultadoProde = "";
        if ((fechaFiltrada[i].prode_l) && (fechaFiltrada[i].prode_v)) {
            if (fechaFiltrada[i].prode_l > fechaFiltrada[i].prode_v) {
                resultadoProde = "L"
            } else if (fechaFiltrada[i].prode_l < fechaFiltrada[i].prode_v) {
                resultadoProde = "V"
            } else if (fechaFiltrada[i].prode_l == fechaFiltrada[i].prode_v) {
                resultadoProde = "E"
            }
        }
        console.log(resultadoProde);
        console.log(fechaFiltrada);
    }
}