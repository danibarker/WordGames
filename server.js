const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const WebSocket = require("websocket").server;
const deadends = require("./deadends");
const http = require("http");
const PORT = 5001;
const app = express();

const server = http.createServer();
server.listen(PORT + 1);
const wss = new WebSocket({ httpServer: server });
const clients = {};
const getUniqueID = () => {
    const s4 = () =>
        Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    return s4() + s4() + "-" + s4();
};

wss.on("request", function (request) {
    var userID = getUniqueID();
    console.log(
        new Date() +
            " Recieved a new connection from origin " +
            request.origin +
            "."
    );
    // You can rewrite this part of the code to accept only the requests from allowed origin
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log(
        "connected: " + userID + " in " + Object.getOwnPropertyNames(clients)
    );
    connection.on("message", function incoming(data) {
        let req = JSON.parse(data.utf8Data);
        let toSend = "";
        console.log(req)
        switch (req.type) {
            case "LOGIN":
                gameState.players.push({ name: req.data, score: 0 });
                gameState.numPlayers = gameState.players.length;
                fs.writeFileSync("gameState.json", JSON.stringify(gameState));
                toSend = JSON.stringify({ type: "LOGIN", data: req.data });
                break;
            case "LOGOUT":
                gameState.players = gameState.players.filter(
                    (user) => user.name != req.data
                );
                gameState.numPlayers = gameState.players.length;
                gameState.playerOnTurn = Math.max((gameState.numPlayers - 1),0);
                console.log(gameState)
                fs.writeFileSync("gameState.json", JSON.stringify(gameState));
                toSend = JSON.stringify({type:"LOGOUT", data:req.data});
                break;
            case "GUESS":
                if (
                    req.data.username ===
                    gameState.players[gameState.playerOnTurn].name
                ) {
                    response = deadends.guess(
                        gameState.currentWord,
                        req.data.guess.toUpperCase(),
                        gameState.guessed,
                        gameState.fails
                    );
                    console.log(response)
                    if (response.loseTurn || response.valid) {
                        gameState.playerOnTurn =
                            (gameState.playerOnTurn + 1) % gameState.numPlayers;

                        gameState.currentWord = response.valid
                            ? req.data.guess.toUpperCase()
                            : gameState.currentWord;
                    }
                    gameState.message = response.message;
                    fs.writeFileSync(
                        "gameState.json",
                        JSON.stringify(gameState)
                    );
                }

                toSend = JSON.stringify(gameState);

                break;
            case "START":
                if (!gameState.currentWord) {
                    gameState.currentWord = deadends.start();
                }
                toSend = JSON.stringify(gameState);
                break;
            case "GAME_STATE":
                console.log("sending game state: ", gameState);
                toSend = JSON.stringify(gameState);
                break;
            default:
                

                break;
        }
        Object.keys(clients).forEach((client) => {
            clients[client].sendUTF(toSend);
        });
    });
});

let gameState = JSON.parse(fs.readFileSync("gameState.json"));

app.use(express.json());
app.use(cors());
app.get("/start", async (req, res) => {
    // gameState = {
    //     numPlayers: gameState.numPlayers,
    //     playerOnTurn: gameState.numPlayers,
    //     currentWord: gameState.currentWord,
    //     guessed: gameState.guessed,
    //     players: gameState.players,
    //     fails:gameState.fails
    // };
    try {
        if (!gameState.currentWord) {
            gameState.currentWord = deadends.start();
        }
        res.json(gameState);
    } catch (e) {
        res.status(400).send(e);
    }
});
app.get("/login/:name", async (req, res) => {
    try {
        gameState.players.push({ name: req.params.name, score: 0 });
        gameState.numPlayers = gameState.players.length;
        fs.writeFileSync("gameState.json", JSON.stringify(gameState));

        res.status(200).send(req.params.name);
    } catch (e) {
        res.status(400).send(e);
    }
});
app.get("/logout/:name", async (req, res) => {
    try {
        gameState.players = gameState.players.filter(
            (user) => user.name != req.params.name
        );
        gameState.numPlayers = gameState.players.length;
        fs.writeFileSync("gameState.json", JSON.stringify(gameState));
        res.sendStatus(201);
    } catch (e) {
        res.status(400).send(e);
    }
});
app.get("/gameState", async (req, res) => {
    try {
        res.json(gameState);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/myTurn/:name/:leng", async (req, res) => {
    try {
        if (
            req.params.leng !=
            gameState.guessed.length + gameState.fails.length
        ) {
            res.send("t");
        } else {
            res.send("f");
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post("/guess", async (req, res) => {
    try {
        if (req.body.guess == "&reset") {
            gameState = {
                numPlayers: gameState.players.length,
                playerOnTurn: 0,
                currentWord: deadends.start(),
                guessed: [],
                players: gameState.players,
                fails: [],
            };
            res.json({ loseTurn: false, valid: false, message: "" });
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
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});


app.use("/", express.static(path.join(__dirname, "public")));
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});