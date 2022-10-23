
// Función para mostrar mensajes cuando intenta registrar usuario nuevo
export function showMessage(mensajes, tipo) {
    Toastify({
        text: mensajes,
        duration: 3000,
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


