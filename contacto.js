//En el sección Contacto, guarda el formulario en la bd collection "mensajesContacto"
import { guardarContacto } from "./firebase.js";
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = contactForm["name"];
  const mail = contactForm["email"];
  const mensaje = contactForm["message"];
  guardarContacto(nombre.value, mail.value, mensaje.value);
});
