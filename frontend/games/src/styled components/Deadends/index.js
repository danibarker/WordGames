import styled from "styled-components";

let components = {
    PlayersDiv: styled.div`
        td,
        th {
            filter: invert(0);
            color: #dddddd;
        }
        @media only screen and (min-width: 501px) {
            margin-left: 20px;
            margin-right: 20px;
        }
        @media only screen and (max-width: 500px) {
            margin-top: 20px;
            margin-bottom: 45px;
            text-align: center;
            width: 100%;
            height: 200px;
            overflow-y: scroll;

            &::-webkit-scrollbar {
                width: 12px;
            }

            &::-webkit-scrollbar-track {
                -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
                border-radius: 10px;
            }

            &::-webkit-scrollbar-thumb {
                border-radius: 10px;
                -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
            }
        }
    `,
    GuessDiv: styled.div`
        td {
            color: #dddddd;
        }
        h2 {
            filter: invert(0);
            color: #dddddd;
        }
        height: 90%;
        overflow-y: scroll;
        &::-webkit-scrollbar {
            width: 12px;
        }

        &::-webkit-scrollbar-track {
            box-shadow:inset 0 0 6px rgba(245, 0, 0, 0.5);
            -webkit-box-shadow: inset 0 0 6px rgba(245, 0, 0, 0.5);
            border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.75);
            box-shadow: inset 0 0 6px rgba(245, 0, 0, 0.75);
        }
        @media only screen and (max-width: 500px) {
            height: 100%;
            overflow-y: scroll;
        }
    `,
    CurrentWord: styled.h3``,

    Main: styled.div`
        display: flex;
        justify-content: space-around;
        height: 100%;
        @media only screen and (min-width: 501px) {
            margin-top: 150px;
            display: flex;
            justify-content: space-around;
            height: 75%;
        }
        @media only screen and (max-width: 500px) {
            display: flex;
            justify-content: space-around;
            height: 100%;
            width: 100%;

            flex-direction: column;
        }
    `,
    Logout: styled.div`
        z-index: 3;
        position: absolute;
        bottom: 20px;
        left: 20px;
        filter:invert(0);

        @media only screen and (max-width: 500px) {
            bottom: 0px;

            button {
                height: 50px;
                margin-bottom: 5px;
            }
        }
    `,
    Login: styled.div`
        padding: 25% 0 0 0;
        filter:invert(0);
        width: 100%;
        z-index: 3;
        position: absolute;
        height: 100%;
        text-align: center;
        
        @media only screen and (max-width: 500px) {
            padding: 40% 3%;

            input {
                width: 100%;
                height: 50px;
            }
            button {
                width: 100%;
                height: 50px;
            }
        }
    `,
    Game: styled.div`
        h5 {
            color: #dddddd;
        }
        width: 33%;
        @media only screen and (min-width: 501px) {
            margin-left: 20px;
            margin-right: 20px;
        }
        @media only screen and (max-width: 500px) {
            width: 100%;
            height: 300px;
            text-align: center;
        }
    `,
    RightPanel: styled.div`
        max-height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        @media only screen and (min-width: 501px) {
            margin-left: 20px;
            margin-right: 20px;
        }
        @media only screen and (max-width: 500px) {
            width: 100%;
            height: 200px;
            text-align: center;
            max-height: unset;
            display: unset;
            flex-direction: unset;
            align-items: unset;
            justify-content: unset;
            margin-top: unset;
        }
    `,
    OnTurn: styled.div`
        color:white;
        @media only screen and (min-width: 501px) {
            font-size: 20px;
        }
        @media only screen and (max-width: 500px) {
            font-size: 30px;
        }
    `,
    NameInput: styled.input`
        @media only screen and (min-width: 501px) {
            height: 50px;
            font-size: 15px;
        }
    `,
    GuessButton: styled.button`
        @media only screen and (min-width: 501px) {
            margin: 10px 0 10px 0;
            width: 100%;
        }
        @media only screen and (max-width: 500px) {
            width: 100%;
            height: 50px;
            margin-bottom: 20px;
        }
    `,
    GuessInput: styled.input`
        @media only screen and (min-width: 501px) {
            padding-left: 10px;
            height: 50px;
            font-size: 20px;
            width: 100%;
        }

        @media only screen and (max-width: 500px) {
            height: 50px;
            width: 100%;
        }
    `,
    Title: styled.div`
        @media only screen and (min-width: 501px) {
            position: absolute;

            text-align: center;

            width: 100%;
            h1 {
                font-size: 100px;
                color: #333333;
            }
        }
        @media only screen and (max-width: 500px) {
            h1 {
                color: #dddddd;
            }
            position: absolute;
        }
    `,

    Guessed: styled.tbody`
        @media only screen and (max-width: 500px) {
            font-size: 30px;
        }
    `,
};
export default components;
