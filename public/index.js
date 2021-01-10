window.onbeforeunload = () => {
    logout();
    window.localStorage.removeItem("username");
};

const guessInput = document.querySelector("#guess-input");
guessInput.addEventListener("keypress", (event) => {
    console.log(event);
    if (event.key == "Enter") {
        guess(event.target.value, window.localStorage.getItem("username"));
    }
});
const guessButton = document.querySelector("#guess-button");
guessButton.addEventListener("click", (event) => {
    guess(guessInput.value, window.localStorage.getItem("username"));
});

const login = async () => {
    let login = document.getElementById("login");
    login.classList.add("hidden");
    let logout = document.getElementById("logout");
    logout.classList.remove("hidden");
    let nameInput = document.getElementById("name-input").value;
    let res = await fetch(`/login/${nameInput}`);
    let name = await res.text();
    window.localStorage.setItem("username", name);
};

const logout = async () => {
    fetch(`/logout/${window.localStorage.getItem("username")}`);
    let login = document.getElementById("login");
    login.classList.remove("hidden");
    let logout = document.getElementById("logout");
    logout.classList.add("hidden");
    window.localStorage.removeItem("username");
};
const start = async () => {
    const res = await fetch('/start')
    const first = await res.json()
    const currentWord = document.getElementById('current-word')
    currentWord.innerText = `Current word: ${first.currentWord}`
    const game = document.getElementById('game')
    game.classList.remove('hidden')
}
const guess = async (word, name) => {
    const body = { name: name, guess: word };
    const request = new Request("/guess", {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
    });
    let res = await fetch(request);
    let data = await res.json();
    const message = document.querySelector("#message");
    message.innerText = data.message;
    guessInput.value = "";
};

setInterval(async () => {
    let res = await fetch("/gameState");
    let players = document.getElementById("players");
    const currentWord = document.getElementById('current-word')
    let gameState = await res.json();
    currentWord.innerText = "Current Word: "+gameState.currentWord
    players.innerHTML = "";
    for (player of gameState.players) {
        let tableRow = document.createElement("tr");
        let p = document.createElement("td");
        tableRow.appendChild(p);
        p.innerText = player.name;
        players.appendChild(tableRow);
    }
    let playerOnTurn = document.getElementById("on-turn");
    let onTurn = gameState.players[gameState.playerOnTurn];
    playerOnTurn.innerText = onTurn
        ? "On turn: " + onTurn.name
        : "Waiting for players to join";
    const guessed = document.getElementById('guessed')
    guessed.innerHTML=''
    gameState.guessed.forEach((word) => {
        let wordRow = document.createElement('tr')
        let wordData = document.createElement('td')
        wordData.innerText=word
        wordRow.appendChild(wordData)
        guessed.appendChild(wordRow)
    })
}, 1000);
