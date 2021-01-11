const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const deadends = require("./deadends");

const PORT = process.env.PORT || 5001;
const app = express();

let gameState = JSON.parse(fs.readFileSync("gameState.json"));

app.use(express.json());
app.use(cors())
app.get("/start", async (req, res) => {
    console.log('here',gameState)
    // gameState = {
    //     numPlayers: gameState.numPlayers,
    //     playerOnTurn: gameState.numPlayers,
    //     currentWord: gameState.currentWord,
    //     guessed: gameState.guessed,
    //     players: gameState.players,
    //     fails:gameState.fails
    // };
    if (!gameState.currentWord) {
        console.log('started')
        gameState.currentWord = deadends.start();
    }
    res.json(gameState);
});
app.get("/login/:name", async (req, res) => {
    console.log(req.params.name)
    gameState.players.push({ name: req.params.name, score: 0 });
    gameState.numPlayers = gameState.players.length;
    fs.writeFileSync("gameState.json", JSON.stringify(gameState));
    console.log('login')
    res.status(200).send(req.params.name);
});
app.get("/logout/:name", async (req, res) => {
    gameState.players = gameState.players.filter(
        (user) => user.name != req.params.name
    );
    gameState.numPlayers = gameState.players.length;
    fs.writeFileSync("gameState.json", JSON.stringify(gameState));
    res.sendStatus(201);
});
app.get("/gameState", async (req, res) => {
    res.json(gameState);
});

app.get("/myTurn/:name/:leng", async (req, res) => {
    if (req.params.leng != gameState.guessed.length + gameState.fails.length) {
        res.send("t");
    } else {
        res.send("f");
    }
});

app.post("/guess", async (req, res) => {
    console.log(req.body)
    if (req.body.guess == "&reset") {
        gameState = {
            numPlayers: 0,
            playerOnTurn: 0,
            currentWord: deadends.start(),
            guessed: [],
            players: [],
            fails:[]
        };
        res.json({loseTurn:false,valid:false,message:"Reset"})
    }
    let guess = req.body.guess.toUpperCase().trim();
    if (req.body.name === gameState.players[gameState.playerOnTurn].name) {
        response = deadends.guess(
            gameState.currentWord,
            guess,
            gameState.guessed,
            gameState.fails
        );
        if (response.loseTurn || response.valid) {
            gameState.playerOnTurn =
                (gameState.playerOnTurn + 1) % gameState.numPlayers;

            gameState.currentWord = response.valid
                ? guess
                : gameState.currentWord;
        }
        fs.writeFileSync("gameState.json", JSON.stringify(gameState));
        res.send(response);
    } else {
        res.sendStatus(203);
    }
});
app.use("/", express.static(path.join(__dirname, "public")));
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
