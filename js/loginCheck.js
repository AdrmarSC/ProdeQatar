
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