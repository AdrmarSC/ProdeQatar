
// Función para mostrar mensajes cuando intenta registrar usuario nuevo
export function showMessage(mensajes, tipo) {
    Toastify({
        text: mensajes,
        duration: 4000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: tipo === "success" ? "green" : "red",
        },
        onClick: function () { } // Callback after click
    }).showToast();

}


export function showMessageCargando(mensajes, tipo) {
    Toastify({
        text: mensajes,
        duration: 6000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: tipo === "success" ? "green" : "red",
        },
        onClick: function () { } // Callback after click
    }).showToast();
}
