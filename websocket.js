const fs = require("fs");
const WebSocket = require("websocket").server;
const deadends = require("./deadends");
const http = require("http");
const server = http.createServer();
const PORT = process.env.PORT || 5002
server.listen(PORT);
const wss = new WebSocket({ httpServer: server });
const clients = {};
let gameState = JSON.parse(fs.readFileSync("gameState.json"));
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