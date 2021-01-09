
const login = async () => {
    let name = document.getElementById('name-input').value
    let res = await fetch(`/login/${name}`)
    console.log(res)
}

setInterval(async () => {
    let res = await fetch('/gameState')
    let guesses = document.getElementById('guesses')
    let gameState = await res.json()
    guesses.innerHTML = ''
    for (guess of gameState) {
        let g = document.createElement('li')
        g.innerText = guess
        guesses.appendChild(g) 
    }
},1000)