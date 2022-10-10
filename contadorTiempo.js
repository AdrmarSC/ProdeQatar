const segundo = 1000;
const minuto = segundo * 60;
const hora = minuto * 60;
const dia = hora * 24;

const partidoInicial = new Date("2022-11-20 13:00:00");

function ceroIzq(num) {
  return String(num).padStart(2, "0");
}

function tiempoFaltante() {
  const hoy = new Date().getTime();
  return partidoInicial.getTime() - hoy;
}

function setCuentaRegresiva(element, value) {
  document.querySelector(`.${element}`).innerHTML = value;
}

function difDia(dif) {
  return Math.floor(dif / dia);
}

function difHora(dif) {
  const redHora = Math.floor((dif % dia) / hora);
  return ceroIzq(redHora);
}

function difMinuto(dif) {
  const redMin = Math.floor((dif % hora) / minuto);
  return ceroIzq(redMin);
}

function difSeg(dif) {
  const redSeg = Math.floor((dif % minuto) / segundo);
  return ceroIzq(redSeg);
}

function cuentaRegresiva() {
  const dif = tiempoFaltante();
  setCuentaRegresiva("dias", difDia(dif));
  setCuentaRegresiva("horas", difHora(dif));
  setCuentaRegresiva("minutos", difMinuto(dif));
  setCuentaRegresiva("segundos", difSeg(dif));
}

window.load = setInterval(cuentaRegresiva, 1000);
