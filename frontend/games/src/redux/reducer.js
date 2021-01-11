const initState = {
    message: '',user: {}, gameState: {}, loggedIn: false};

const productReducer = (state = initState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case "START":
            newState.gameState = action.payload
            return newState
        case "LOGIN":
            newState.user = { name: action.payload };
            newState.loggedIn = true
            return newState;
        case "LOGOUT":
            newState.user = {}
            newState.loggedIn = false
            return newState;
        case "GUESS":
            newState.message = action.payload.message;
            return newState;
        case "GET_GAME_STATE":
            newState.gameState = action.payload;
            return newState;
        default:
            return newState;
    }
};

export default productReducer;
