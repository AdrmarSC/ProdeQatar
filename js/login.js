import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

import { auth, cargaUserCero, consultaExisteDocumento } from './loginFirebase.js'
import { showMessage } from "./mensajes.js"

import { datosProdeCero } from "./modeloCERO.js"



//------------------------------------------------------------------
//Login con botón de google
const googleButton = document.querySelector('#googleLogin')

googleButton.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider()
    try {

        const credentials = await signInWithPopup(auth, provider);
        var email = credentials.user.email;
        const modal = bootstrap.Modal.getInstance(signinModal);
        modal.hide();
        showMessage("Bienvenido " + credentials.user.displayName, "success");
        localStorage.setItem("user", credentials.user.email);
    } catch (error) {
        console.log(error);
    } finally {
        //cargaUserCero(datosProdeCero, email, 0)
        consultaExisteDocumento(email);
    }
})
//------------------------------------------------------------------

//------------------------------------------------------------------
// Check login
const loggedOutLinks = document.querySelectorAll('.logged-out')
const loggedINLinks = document.querySelectorAll('.logged-in')

export const loginCheck = user => {
    if (user) {
        loggedOutLinks.forEach(link => link.style.display = 'none')
        loggedINLinks.forEach(link => link.style.display = 'block')

    } else {
        loggedOutLinks.forEach(link => link.style.display = 'block')
        loggedINLinks.forEach(link => link.style.display = 'none')
    }
}
//------------------------------------------------------------------

//------------------------------------------------------------------
// Logout
const logout = document.querySelector('#logout')
logout.addEventListener('click', async () => {
    await signOut(auth);
    localStorage.removeItem("user");
})
//------------------------------------------------------------------

//------------------------------------------------------------------
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
    } finally {

    }
})
//------------------------------------------------------------------

//------------------------------------------------------------------
// Registro de usuario 
const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signupForm["signup-email"].value;
    const password = signupForm["signup-password"].value;

    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

        const signupModal = document.querySelector('#signupModal')
        const modal = bootstrap.Modal.getInstance(signupModal)
        //cargo el doc CERO en la bd para el usuario
        console.log(datosProdeCero);
        console.log(email);

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
    finally {
        localStorage.setItem("user", email);
        cargaUserCero(datosProdeCero, email, 0)
    }
});