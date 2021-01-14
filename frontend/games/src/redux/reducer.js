const initState = {
    message: "",
    username: "",
    user: {},
    chatlog: "",
    gameState: {
        numPlayers: 0,
        playerOnTurn: 0,
        currentWord: "",
        guessed: [],
        players: [],
        fails: [],
        message: "",
    },
    loggedIn: false,
};

const reducer = (state = initState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case "USERNAME":
            newState.username = action.payload;
            return newState;
        case "CHAT":
            newState.chatlog = action.payload;
            return newState;
        case "START":
            newState.gameState = action.payload;
            return newState;
        case "LOGIN":
            if (newState.username === action.payload) {
                newState.user = { name: action.payload };
                newState.loggedIn = true;
            }

            return newState;
        case "LOGOUT":
            if (action.payload === newState.username) {
                newState.user = {};
                newState.username = "";
                newState.loggedIn = false;
                newState.message = "";
            }
            return newState;
        case "GUESS":
            newState.message = action.payload;
            return newState;
        case "GET_GAME_STATE":
            newState.gameState = action.payload;
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
