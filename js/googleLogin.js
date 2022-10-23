import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth } from './firebase.js'
import { showMessage } from "./mensajes.js"

const googleButton = document.querySelector('#googleLogin')

googleButton.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider()
    try {
        const credentials = await signInWithPopup(auth, provider)
        const modal = bootstrap.Modal.getInstance(signinModal)
        modal.hide()
        showMessage("Bienvenido " + credentials.user.displayName, "success")
        localStorage.setItem("user", credentials.user.email);
    } catch (error) {

    }
})
