const express = require("express");
const { Server } = require("ws");
const path = require("path");
const {
    processStart,
    processReset,
    processLogout,
    processLogin,
    processGuess,
    processChat,
} = require("./processMessages");
const { loadGameState } = require("./game-logic/fileManager");
let chatlog = "";

const PORT = process.env.PORT || 5002;

let gameState = loadGameState();

const server = express()
    .use("/", express.static(path.join(__dirname, "public")))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("close", () => console.log("Client disconnected"));

    ws.on("message", (message) => {
        processMessage(message);
    });
});

const processMessage = (data) => {
    let req = JSON.parse(data);
    let toSend = "";
    gameState = loadGameState();
    switch (req.type) {
        case "CHAT":
            chatlog = processChat(req.data, chatlog);
            toSend = JSON.stringify({
                type: "CHAT",
                data: chatlog,
            });
            break;
        case "RESET":
            toSend = processReset(gameState);
            break;
        case "LOGIN":
            toSend = processLogin(gameState, req.data);

            break;
        case "LOGOUT":
            toSend = processLogout(gameState, req.data);

            break;
        case "GUESS":
            toSend = processGuess(gameState, req.data);
            break;
        case "START":
            toSend = processStart(gameState);
            break;
        case "GAME_STATE":
            toSend = JSON.stringify({ type: "GAME_STATE", data: gameState });
            break;
        default:
            break;
    }

    wss.clients.forEach((client) => {
        client.send(toSend);
    });
};
