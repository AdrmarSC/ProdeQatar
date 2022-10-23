import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { showMessage } from "./mensajes.js"

//login de usuario

const signInForm = document.querySelector('#login-form')
signInForm.addEventListener('submit', async e => {
    e.preventDefault()
    const email = signInForm['login-email'].value;
    const password = signInForm['login-password'].value;

    try {
        const credentials = await signInWithEmailAndPassword(auth, email, password);

        const signinModal = document.querySelector('#signinModal')
        const modal = bootstrap.Modal.getInstance(signinModal)
        document.getElementById('login-usuario').innerText = credentials.user.email
        modal.hide()
        showMessage("Bienvenido " + email, "success")
        localStorage.setItem("user", credentials.user.email);
    } catch (error) {
        if (error.code === 'auth/wrong-password') {
            showMessage("Contraseña incorrecta.", "error")
        } else if (error.code === 'auth/user-not-found') {
            showMessage("Usuario no encontrado.", "error")
        } else if (error.code) {
            showMessage(error.message, "error")
        }
    }
})