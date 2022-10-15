import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { showMessage } from "./mensajes.js";

const signupForm = document.querySelector("#signup-form");

// Registro de usuario 
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

    const signupModal = document.querySelector('#signupModal')
    const modal = bootstrap.Modal.getInstance(signupModal)
    modal.hide()
    showMessage("Bienvenido " + email, "success")
    document.getElementById('login-usuario').innerText = userCredentials.user.email

  } catch (error) {

    if (error.code === 'auth/invalid-email') {
      showMessage("Email inválido " + email, "error")
    } else if (error.code === 'auth/weak-password') {
      showMessage("Password no cumple con las condiciones mínimas de seguridad.", "error")
    } else if (error.code === 'auth/email-already-in-use') {
      showMessage("Email ya se encuentra en uso", "error")
    } else if (error.code) {
      showMessage("No se puede registrar el usuario", "error")
    }

  }
});
