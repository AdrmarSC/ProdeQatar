import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

import { auth } from "./js/firebase.js";
import { } from "./js/signupForm.js";
import { } from "./js/logout.js"
import { loginCheck } from "./js/loginCheck.js"
import { } from "./js/signinForm.js"
import { } from './js/googleLogin.js'

// Verifica el estado del usuario(si está logeado o no)
onAuthStateChanged(auth, async (user) => {
    if (user) {
        loginCheck(user);
        document.getElementById('login-usuario').innerText = user.email

    } else {
        loginCheck(user);
    }
})
