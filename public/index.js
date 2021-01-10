window.onbeforeunload = () => {
    logout();
    window.localStorage.removeItem("username");
};

const guessInput = document.querySelector("#guess-input");
guessInput.addEventListener("keypress", (event) => {
    
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
    gameState.guessed = [];
    gameState.fails = [];
    let res = await fetch("/start");
    const first = await res.json();
    const currentWord = document.getElementById("current-word");
    currentWord.innerText = `Current word: ${first.currentWord}`;
    const game = document.getElementById("game");
    game.classList.remove("hidden");

    res = await fetch("/gameState");
    gameState = await res.json();
    loadPage()
};
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
let gameState;
res = fetch("/gameState").then((res) => {
    res.json().then((g) => {
        gameState = g;
        loadPage()
    });
});
setInterval(async () => {
    
    let res = await fetch(
        "/myTurn/" +
            window.localStorage.getItem("username") +
            "/" +
            (gameState.guessed.length + gameState.fails.length)
    );
    let myTurn = await res.text();
    
    if (myTurn === "t") {
        res = await fetch("/gameState");
        gameState = await res.json();
        loadPage()
    }
}, 1000);

const loadPage = () => {
    let players = document.getElementById("players");
        const currentWord = document.getElementById("current-word");

        currentWord.innerText = "Current Word: " + gameState.currentWord;
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
        const guessed = document.getElementById("guessed");
        guessed.innerHTML = "";
        gameState.guessed.forEach((word) => {
            let wordRow = document.createElement("tr");
            let wordData = document.createElement("td");
            wordData.innerText = word;
            wordRow.appendChild(wordData);
            guessed.appendChild(wordRow);
        });
}
