const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const PORT = process.env.PORT || 5001;
const app = express();
let playerOnTurn = 0;
let numPlayers = 0;
let players = [];
let gameState = {};
app.use(express.json());
app.get("/login/:name", async (req, res) => {
    players = JSON.parse(fs.readFileSync("players.json"));
    players.push(req.params.name);
    numPlayers = players.length;
    fs.writeFileSync("players.json", JSON.stringify(players));
    res.status(200).send(req.params.name);
});
app.get("/logout/:name", async (req, res) => {
    players = JSON.parse(fs.readFileSync("players.json"));
    players = players.filter((user) => user != req.params.name);
    numPlayers = players.length;
    fs.writeFileSync("players.json", JSON.stringify(players));
    res.sendStatus(201);
});
app.get("/gameState", async (req, res) => {
    gameState = { players: players, playerOnTurn: playerOnTurn };
    res.json(gameState);
});

app.post("/guess", async (req, res) => {
    let guess = req.body.guess;
    if (guess.name === players[playerOnTurn]) {
        let players = JSON.parse(fs.readFileSync("players.json"));
        res.send({ guess: guess.word, player: players[playerOnTurn] });
    } else {
        res.send({ guess: false });
    }
    playerOnTurn = (playerOnTurn + 1) % numPlayers;
});
app.use("/", express.static(path.join(__dirname, "public")));
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
