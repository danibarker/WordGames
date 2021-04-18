import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Styles from "../../styled components/Deadends";
import { useDispatch } from "react-redux";
import { w3cwebsocket as WS } from "websocket";

import CustomSocket from "./ws";
import {
    loginAction,
    logoutAction,
    guessAction,
    getGameState,
    startAction,
    chatAction,
    setUsername,
    readMessages
} from "../../redux/actions";
import Chat from "../Chat";
setInterval(() => {
    fetch('/keepAlive')
}, 60000);
let host = window.location.href;
host = host.replace("http", "ws");
host = host.replace("3000", "5002");

export default function Deadends() {
    const gameState = useSelector((state) => state.gameState);
    const username = useSelector((state) => state.username);
    // const [username, setUsername] = useState("");
    const [chatOpen, setChatOpen] = useState(false);
    const [word, setWord] = useState("");

    const dispatch = useDispatch();
    function messageFunction(message) {
        let response = JSON.parse(message.data);
        switch (response.type) {
            case "CHAT":
                dispatch(chatAction(response.data));
                break;
            case "RESET":
                dispatch(getGameState(response.data));
                break;
            case "LOGIN":
                dispatch(loginAction(response.data));

                break;
            case "GUESS":
                dispatch(guessAction(response.data)).then(() => {
                    refresh();
                });
                break;
            case "GAME_STATE":
                dispatch(getGameState(response.data));
                break;
            case "LOGOUT":
                dispatch(logoutAction(response.data));

                break;
            case "START":
                dispatch(startAction(response.data));

                break;
            default:
                break;
        }
        // dispatch(getGameState(response.data));
    }
    const [client, setClient] = useState(
        new CustomSocket(host, messageFunction)
    );
    useEffect(() => {
        client.connect();
    }, [client]);
    const login = () => {
        client.send(JSON.stringify({ type: "LOGIN", data: username }));
    };

    const loggedIn = useSelector((state) => state.loggedIn);
    const refresh = () => {
        client.send(JSON.stringify({ type: "GAME_STATE", data: gameState }));
    };
    const guess = () => {
        client.send(
            JSON.stringify({
                type: "GUESS",
                data: { username: username, guess: word },
            })
        );
    };
    const reset = () => {
        client.send(JSON.stringify({ type: "RESET" }));
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
            <Chat readMessages={readMessages} client={client} username={username} />
            {!loggedIn ? (
                <Styles.Login>
                    <Styles.NameInput
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                login();
                            }
                        }}
                        onChange={(e) => {
                            dispatch(setUsername(e.target.value));
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
                    <Styles.Title
                        onClick={() => {
                            setChatOpen(false);
                        }}
                    >
                        {/* <h1>Deadends</h1> */}
                    </Styles.Title>
                    <Styles.Logout
                        onClick={() => {
                            setChatOpen(false);
                        }}
                    >
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
                        <button
                            className="btn btn-success"
                            onClick={() => {
                                reset();
                            }}
                        >
                            Reset All
                        </button>
                    </Styles.Logout>
                    <Styles.Main
                        onClick={() => {
                            setChatOpen(false);
                        }}
                    >
                        <Styles.Game>
                            <Styles.CurrentWord>
                                Current Word: {gameState.currentWord}
                                <br />
                                On Turn:
                                {gameState.players
                                    ? gameState.players[gameState.playerOnTurn]
                                        ? gameState.players[
                                              gameState.playerOnTurn
                                          ].name
                                        : ""
                                    : ""}
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
                                placeholder={
                                    gameState.players
                                        ? gameState.players[
                                              gameState.playerOnTurn
                                          ]
                                            ? gameState.players[
                                                  gameState.playerOnTurn
                                              ].name === username
                                                ? "Your turn.  Enter Guess"
                                                : gameState.players[
                                                      gameState.playerOnTurn
                                                  ].name +
                                                  "'s turn.  Please Wait"
                                            : ""
                                        : ""
                                }
                            />
                            <Styles.GuessButton
                                onClick={() => {
                                    guess();
                                }}
                                className="btn btn-info"
                            >
                                Guess
                            </Styles.GuessButton>

                            <h3 id="message">{gameState.message || ""}</h3>
                        </Styles.Game>
                        <Styles.RightPanel>
                            <Styles.GuessDiv>
                                <h3 style={{ marginRight: "20px" }}>
                                    Guessed words
                                </h3>
                                <table>
                                    <Styles.Guessed>
                                        {gameState.guessed ? (
                                            gameState.guessed.map((guess) => {
                                                return (
                                                    <tr>
                                                        <td>{guess}</td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <></>
                                        )}
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
                                    {gameState.players ? (
                                        gameState.players.map((player) => {
                                            return (
                                                <tr>
                                                    <td>{player.name}</td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <></>
                                    )}
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
