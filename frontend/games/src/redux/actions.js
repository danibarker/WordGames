export const startAction = (gameState) => {
    return async (dispatch) => {
        // let response = await Axios.get("http://localhost:5001/start");
        dispatch({
            type: "START",
            payload: gameState,
        });
    };
};
export const setUsername = (username) => {
    return async (dispatch) => {
        dispatch({
            type: "USERNAME",
            payload: username,
        });
    };
};
export const chatAction = (chatlog) => {
    return async (dispatch) => {
        dispatch({
            type: "CHAT",
            payload: chatlog,
        });
    };
};
export const loginAction = (username) => {
    return async (dispatch) => {
        // let response = await Axios.get(
        //     `http://localhost:5001/login/${username}`
        // );
        // let name = response.data;
        dispatch({
            type: "LOGIN",
            payload: username,
        });
    };
};
export const logoutAction = (username) => {
    return (dispatch) => {
        dispatch({
            type: "LOGOUT",
            payload: username,
        });
    };
};

export const guessAction = (validate) => {
    return async (dispatch) => {
        // const body = { name: player, guess: word };
        // let response = await Axios.post("http://localhost:5001/guess", body);
        //response example {loseTurn:false,valid:false,message:"Reset"}

        dispatch({
            type: "GUESS",
            payload: validate,
        });
    };
};

export const getGameState = (gameState) => {
    return async (dispatch) => {
        // const response = await Axios.get("http://localhost:5001/gameState");
        // const data = response.data

        dispatch({
            type: "GET_GAME_STATE",
            payload: gameState,
        });
    };
};
