//En el sección Contacto, guarda el formulario en la bd collection "mensajesContacto"
import { showMessage } from "/login/js/mensajes.js"
import { guardarContacto } from "/firebase.js";
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = contactForm["name"];
  const mail = contactForm["email"];
  const mensaje = contactForm["message"];
  const fechaHora = new Date().toLocaleString();
  guardarContacto(nombre.value, mail.value, mensaje.value, fechaHora);
  contactForm.reset();
  showMessage("¡Mensaje enviado!", "success")
});


