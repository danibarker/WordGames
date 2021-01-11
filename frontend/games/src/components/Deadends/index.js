import React, { useState } from 'react'
import { useSelector } from "react-redux";
import Styles from '../../styled components/Deadends'
import { useDispatch } from "react-redux";
import { loginAction, logoutAction, guessAction, getGameState, startAction } from "../../redux/actions";
export default () => {
    const gameState = useSelector((state) => state.gameState)
    const message = useSelector((state) => state.message)
    const [username, setUsername] = useState('')
    const [word, setWord] = useState('')
    const dispatch = useDispatch();
    const login = () => {
        dispatch(loginAction(username));

    };

    const loggedIn = useSelector((state) => state.loggedIn);
    const guess = () => {
        dispatch(guessAction(word,username))
    }
    const logout = () => {
        dispatch(logoutAction(username));

    }
    const start = () => {
        dispatch(startAction())
    }
    return (
        <>
            
            {!loggedIn ?
                (<Styles.Login>
                    <h1 style={{ color: "white", textAlign: "center" }}>Deadends</h1>
                    <Styles.NameInput onChange={(e) => {
                        setUsername(e.target.value)
                    }} type="text" />
                    <button className="btn btn-info" onClick={() => { login() }}>Login</button>
                </Styles.Login>) :
                (<>
                    <Styles.Title><h1>Deadends</h1></Styles.Title>
                <Styles.Logout>
                    <button className="btn btn-danger" onClick={() => { logout() }}>Leave</button>
                    <button className="btn btn-success" onClick={() => { start() }}>Join Game</button>
                </Styles.Logout>
                <Styles.Main>
                    <Styles.Game>
                        <Styles.CurrentWord>Current Word:</Styles.CurrentWord>
                            <Styles.OnTurn></Styles.OnTurn>
                            <Styles.GuessInput onChange={(e) => {setWord(e.target.value) } } placeholder="Guess" />
                            <Styles.GuessButton onClick={() => { guess() }} className="btn btn-info">Guess</Styles.GuessButton >
                        <h3>Message</h3>
                            <h5 id="message">{message}</h5>
                    </Styles.Game>
                    <Styles.RightPanel>
                        <Styles.GuessDiv>
                            <h2>Guessed words</h2>
                            <table>

                                <Styles.Guessed></Styles.Guessed>
                            </table>
                        </Styles.GuessDiv>
                    </Styles.RightPanel>
                    <Styles.PlayersDiv>
                        <h3>Players logged in</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr><td>Name</td></tr>
                            </thead>
                            <tbody id="players"></tbody>
                        </table>

                    </Styles.PlayersDiv>
                </Styles.Main></>)}
            </>
        )
}