window.onunload = () => {
    window.localStorage.removeItem('username')
    logout()
}
const login = async () => {
    let login = document.getElementById('login')
    login.classList.add('hidden')
    let logout = document.getElementById('logout')
    logout.classList.remove('hidden')
    let nameInput = document.getElementById('name-input').value
    let res = await fetch(`/login/${nameInput}`)
    let name = await res.text()
    window.localStorage.setItem('username',name)
}

const logout = async () => {
    let res = await fetch(`/logout/${window.localStorage.getItem('username')}`)
    let login = document.getElementById('login')
    login.classList.remove('hidden')
    let logout = document.getElementById('logout')
    logout.classList.add('hidden')
    let name = await res.text()
    window.localStorage.removeItem('username')
}


setInterval(async () => {
    let res = await fetch('/gameState')
    let players = document.getElementById('players')
    let gameState = await res.json()
    players.innerHTML = ''
    for (player of gameState.players) {
        let p = document.createElement('li')
        p.innerText = player
        players.appendChild(p) 
    }
    let playerOnTurn = document.getElementById('on-turn')
    playerOnTurn.innerText = 'On turn: '+(gameState.players[gameState.playerOnTurn]||'Waiting for game to start')
},1000)