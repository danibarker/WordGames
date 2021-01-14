const initState = {
    message: "",
    user: {},
    chatlog:
        "Another Line\nHere's another\nHere's one more\nDaniB:Hey guys how's it going, here's the new chat window feature.\nTilerunner:Neat",
    gameState: {
        numPlayers: 0,
        playerOnTurn: 0,
        currentWord: "",
        guessed: [],
        players: [{ name: "" }],
        fails: [],
        message: "",
    },
    loggedIn: false,
};

const reducer = (state = initState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case "CHAT":
            newState.chatlog = action.payload;
            return newState;
        case "START":
            console.log("reducing start", action.payload);
            newState.gameState = action.payload;
            console.log("newState", newState);
            return newState;
        case "LOGIN":
            newState.user = { name: action.payload };
            newState.loggedIn = true;

            return newState;
        case "LOGOUT":
            newState.user = {};
            newState.loggedIn = false;
            newState.message = "";
            return newState;
        case "GUESS":
            newState.message = action.payload;
            return newState;
        case "GET_GAME_STATE":
            newState.gameState = action.payload;
            console.log(action.payload);
            if (action.payload.numPlayers === 0) {
                newState.loggedIn = false;
                newState.message = "";
                newState.user = {};
            }
            return newState;
        default:
            return newState;
    }
};

export default reducer;
