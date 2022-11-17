import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

import { auth } from "./firebase.js";

import { loginCheck } from "./js/login.js"
// Verifica el estado del usuario(si está logeado o no)
onAuthStateChanged(auth, async (user) => {
    if (user) {
        loginCheck(user);
        document.getElementById('login-usuario').innerText = user.email.toUpperCase()

    } else {
        loginCheck(user);
    }
})
