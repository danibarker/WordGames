const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const PORT = process.env.PORT || 5001;
const app = express();
let playerOnTurn = 0
let numPlayers = 0
let players = []
app.use(express.json())
app.get("/login/:name", async (req, res) => {
  players = JSON.parse(fs.readFileSync("players.json"));
    players.push(req.params.name);
    numPlayers=players.length
  fs.writeFileSync("players.json", JSON.stringify(players));
  res.status(200).send(req.params.name);
});
app.get("/logout/:name", async (req, res) => {
    players = JSON.parse(fs.readFileSync("players.json"));
    players.push(req.params.name);
    numPlayers = players.length
  fs.writeFileSync("players.json", JSON.stringify(players)); 
  res.sendStatus(201)
});
app.get('/gameState', async (req, res) => {
    res.json(players)
})
app.get('/whois', async (req, res) => {
    players = JSON.parse(fs.readFileSync("players.json"));
    res.status(200).send(JSON.stringify(players))
})

app.post('/guess', async (req, res) => {
    let guess = req.body.guess
    let players = JSON.parse(fs.readFileSync("players.json"));
    res.send(`guess: ${guess}, player: ${players[playerOnTurn]}`)
    playerOnTurn = (playerOnTurn + 1) % numPlayers
    

})
app.use("/", express.static(path.join(__dirname, "public")));
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
