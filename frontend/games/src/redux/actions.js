import Axios from "axios";
export const startAction = () => {
    return async (dispatch) => {
        let response = await Axios.get('http://localhost:5001/start')
        dispatch({
            type: "START",
            payload:response.data
        })
    }
}
export const loginAction = (username) => {

    return async (dispatch) => {
        let response = await Axios.get(`http://localhost:5001/login/${username}`);
        console.log(response)
            let name = response.data

        dispatch({
            type: "LOGIN",
            payload: name,
        });
    };
};
export const logoutAction = (username) => {
    return (dispatch) => {
        Axios.get("http://localhost:5001/logout/" + username);
        dispatch({
            type: "LOGOUT",
        });
    };
};

export const guessAction = (word,player) => {
    return async (dispatch, getState) => {
        const body = { name: player, guess: word };
        let response = await Axios.post('http://localhost:5001/guess', body);
        //response example {loseTurn:false,valid:false,message:"Reset"}

        dispatch({
            type: "GUESS",
            payload: response.data,
        });
    };
};

export const getGameState = () => {
    return async (dispatch, getState) => {
        
        const response = await Axios.get("http://localhost:5001/gameState");
        const data = await response.json();

        dispatch({
            type: "GET_GAME_STATE",
            payload: data,
        });
    };
}
