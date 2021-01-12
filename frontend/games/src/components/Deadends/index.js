import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Styles from "../../styled components/Deadends";
import { useDispatch } from "react-redux";
import Axios from "axios";
import { w3cwebsocket as WS } from "websocket";

import {
    loginAction,
    logoutAction,
    guessAction,
    getGameState,
    startAction,
} from "../../redux/actions";
const client = new WS("wss://wordgamesonlinews.herokuapp.com/");
client.onopen = () => {
    console.log("WebSocket Client Connected");
};

export default function Deadends() {
    const gameState = useSelector((state) => state.gameState);
    const [username, setUsername] = useState("");
   
    const [word, setWord] = useState("");

    const dispatch = useDispatch();
    client.onmessage = (message) => {
        let response = JSON.parse(message.data);
        console.log('response',response)
        
        switch (response.type) {
            case "LOGIN":
                if (response.data === username) {
                    dispatch(loginAction(response.data));
                } else {
                    refresh()
                }
                break;
            case "GUESS":
                dispatch(guessAction(response.data)).then(() => {
                    refresh();
                });
                break;
            case "GAME_STATE":
                dispatch(getGameState(response.data));
                break
            case "LOGOUT":
                if (response.data === username) {
                    dispatch(logoutAction());
                } else {
                    refresh()
                }
             
                break
            case "START":
                dispatch(startAction(response.data));
                
                break
            default:
                break;
        }
        dispatch(getGameState(JSON.parse(message.data)));
    };
    const login = () => {
        client.send(JSON.stringify({ type: "LOGIN", data: username }));
    };

    const loggedIn = useSelector((state) => state.loggedIn);
    const refresh = () => {
        client.send(JSON.stringify({type:"GAME_STATE",data:gameState}))
        
    };
    const guess = () => {
        client.send(
            JSON.stringify({
                type: "GUESS",
                data: { username: username, guess: word },
            })
        );
    };

    const logout = () => {
        client.send(JSON.stringify({ type: "LOGOUT", data: username }));
        
    };
    const start = () => {
        client.send(JSON.stringify({ type: "START" }));
        
    };
    // return !gameState.players ? (
    //     <></>
    // ) : (
            return (
        <>
            {!loggedIn ? (
                <Styles.Login>
                    <h1 style={{ color: "#DDDDDD", textAlign: "center" }}>
                        {username}
                    </h1>
                    <Styles.NameInput
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                login();
                            }
                        }}
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                        type="text"
                    />
                    <button
                        className="btn btn-info"
                        onClick={() => {
                            login();
                        }}
                    >
                        Login
                    </button>
                </Styles.Login>
            ) : (
                <>
                    <Styles.Title>
                        <h1>{username}</h1>
                    </Styles.Title>
                    <Styles.Logout>
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                logout();
                            }}
                        >
                            Leave
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={() => {
                                start();
                            }}
                        >
                            Join Game
                        </button>
                    </Styles.Logout>
                    <Styles.Main>
                        <Styles.Game>
                            <Styles.CurrentWord>
                                        Current Word: {gameState.currentWord}
                                        <br/>On Turn: {gameState.players? gameState.players[gameState.playerOnTurn]? gameState.players[gameState.playerOnTurn].name:'':''}
                            </Styles.CurrentWord>

                            <Styles.GuessInput
                                onKeyUp={(e) => {
                                    if (e.key === "Enter") {
                                        guess();
                                        e.target.value = "";
                                    }
                                }}
                                onChange={(e) => {
                                    setWord(e.target.value);
                                }}
                                placeholder="Guess"
                            />
                            <Styles.GuessButton
                                onClick={() => {
                                    guess();
                                }}
                                className="btn btn-info"
                            >
                                Guess
                            </Styles.GuessButton>

                            <h3 id="message">{gameState.message || ''}</h3>
                        </Styles.Game>
                        <Styles.RightPanel>
                            <Styles.GuessDiv>
                                <h2 style={{ marginRight: "20px" }}>
                                    Guessed words
                                </h2>
                                <table>
                                    <Styles.Guessed>
                                                    {(gameState.guessed) ?
                                                        gameState.guessed.map((guess) => {
                                            return (
                                                <tr>
                                                    <td>{guess}</td>
                                                </tr>
                                            );
                                        }):<></>}
                                    </Styles.Guessed>
                                </table>
                            </Styles.GuessDiv>
                        </Styles.RightPanel>
                        <Styles.PlayersDiv>
                            <h3>Players logged in</h3>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <td>Name</td>
                                    </tr>
                                    {gameState.players?gameState.players.map((player) => {
                                        return (
                                            <tr>
                                                <td>{player.name}</td>
                                            </tr>
                                        );
                                    }):<></>}
                                </thead>
                                <tbody id="players"></tbody>
                            </table>
                        </Styles.PlayersDiv>
                    </Styles.Main>
                </>
            )}
        </>
    );
}
