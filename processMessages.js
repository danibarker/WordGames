const { saveGameState } = require("./game-logic/fileManager");
const deadends = require("./game-logic/deadends");

const processChat = (chat, chatlog) => {
    let newChatLog = chatlog;
    newChatLog = newChatLog.split("\n").slice(0, 40).join("\n");
    newChatLog =
        `[${new Date().toLocaleString()}]\n${chat.username}: ${
            chat.message
        }\n` + newChatLog;
    return newChatLog;
};
const processReset = () => {
    let gameState = {
        numPlayers: 0,
        playerOnTurn: 0,
        currentWord: "",
        guessed: [],
        players: [],
        fails: [],
        message: "",
    };
    saveGameState(gameState);
    return JSON.stringify({ type: "RESET", data: gameState });
};
const processLogin = (gameState, data) => {
    let newGameState = { ...gameState };
    newGameState.players.push({ name: data, score: 0 });
    newGameState.numPlayers = newGameState.players.length;
    saveGameState(newGameState);
    return JSON.stringify({ type: "LOGIN", data: data });
};
const processLogout = (gameState, data) => {
    let newGameState = { ...gameState };
    newGameState.players = newGameState.players.filter(
        (user) => user.name != data
    );
    newGameState.numPlayers = newGameState.players.length;
    newGameState.playerOnTurn = Math.max(newGameState.numPlayers - 1, 0);
    saveGameState(newGameState);
    return JSON.stringify({ type: "LOGOUT", data: data });
};
const processGuess = (gameState, data) => {
    let newGameState = { ...gameState };
    if (
        data.username === newGameState.players[newGameState.playerOnTurn].name
    ) {
        response = deadends.guess(
            newGameState.currentWord,
            data.guess.toUpperCase(),
            newGameState.guessed,
            newGameState.fails
        );
        if (response.loseTurn || response.valid) {
            newGameState.playerOnTurn =
                (newGameState.playerOnTurn + 1) % newGameState.numPlayers;

            newGameState.currentWord = response.valid
                ? data.guess.toUpperCase()
                : newGameState.currentWord;
        }
        newGameState.message = response.message;
        saveGameState(newGameState);
    }

    return JSON.stringify({ type: "GUESS", data: newGameState });
};
const processStart = (gameState) => {
    let newGameState = { ...gameState };
    if (!newGameState.currentWord) {
        newGameState.currentWord = deadends.start();
    }
    saveGameState(newGameState);
    return JSON.stringify({ type: "START", data: newGameState });
};
module.exports = {
    processChat,
    processGuess,
    processLogin,
    processLogout,
    processReset,
    processReset,
    processStart,
};
