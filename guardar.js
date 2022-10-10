// import { saveResultGrupo } from "./firebase.js";

// saveResultGrupo();

function returnText(grupo) {
  //funcion para tomar los resultados ignresados
  let uri = document.documentURI;
  console.log(uri);
  let input = document.getElementById("res_" + grupo + "_L1").textContent;
  console.log(input);
  input = document.getElementById("res_" + grupo + "_L2").textContent;
  console.log(input);
  input = document.getElementById("res_" + grupo + "_L3").textContent;
  console.log(input);
  input = document.getElementById("res_" + grupo + "_L4").textContent;
  console.log(input);
  input = document.getElementById("res_" + grupo + "_L5").textContent;
  console.log(input);
  input = document.getElementById("res_" + grupo + "_L6").textContent;
  console.log(input);
  input = document.getElementById("res_" + grupo + "_V1").textContent;
  console.log(input);
  input = document.getElementById("res_" + grupo + "_V2").textContent;
  console.log(input);
  input = document.getElementById("res_" + grupo + "_V3").textContent;
  console.log(input);
  input = document.getElementById("res_" + grupo + "_V4").textContent;
  console.log(input);
  input = document.getElementById("res_" + grupo + "_V5").textContent;
  console.log(input);
  input = document.getElementById("res_" + grupo + "_V6").textContent;
  console.log(input);
}

function isNum_MaxCar(e, elem) {
  // Valida el ingreso de resultados, verifica que sean números y no más de 2 caracteres
  if (!(e.charCode >= 48 && e.charCode <= 57) || elem.innerText.length > 1) {
    return false;
  }
}
