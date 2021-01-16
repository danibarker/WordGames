import styled from "styled-components";

let components = {
    PlayersDiv: styled.div`
        margin-bottom:100px;
        @media only screen and (max-height: 600px) {
            position: absolute;
            top: -1000px;
        }
        @media only screen and (min-width: 701px) {
            width:30vw;
            margin-left: 20px;
            margin-right: 20px;
        }
        @media only screen and (max-width: 700px) {
            
            text-align: center;
            width: 100%;
            height: 15vh;
            overflow-y: auto;

            &::-webkit-scrollbar {
                width: 12px;
            }

            &::-webkit-scrollbar-track {
                -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
                box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
                border-radius: 10px;
            }

            &::-webkit-scrollbar-thumb {
                border-radius: 10px;
                -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
                box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
            }
        }
    `,
    GuessDiv: styled.div`
        height: 90%;
        overflow-y: auto;
        ::-webkit-scrollbar {
            width: 10px;
        }
        ::-webkit-scrollbar-track {
            box-shadow: inset 0 0 5px grey;
            background: #222;
        }
        ::-webkit-scrollbar-thumb {
            background-image: linear-gradient(
                to right,
                #222,
                hsl(272, 36%, 63%)
            );
            border-radius: 50px;
            width: 5px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        @media only screen and (max-width: 700px) {
            height: 100%;
            overflow-y: auto;
        }
        @media only screen and (min-width: 700px) {
            
            width:25vw;
            overflow-y: auto;
        }
    `,
    CurrentWord: styled.h3``,

    Main: styled.div`
        display: flex;
        height: 100%;

        @media only screen and (max-width: 700px) {
            display: flex;
            justify-content: space-between;
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

   
        @media only screen and (max-width: 700px) {
            bottom: 0%;
            button {
                height: 50px;
                margin-bottom: 5px;
            }
        }
    `,
    Login: styled.div`
        top: 40vh;
        width: 100%;
        z-index: 3;
        position: absolute;
        height: 100%;
        text-align: center;

        @media only screen and (max-width: 700px) {
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
        
        @media only screen and (min-width: 701px) {
            width:35vw;
            margin-left: 20px;
            margin-right: 20px;
        }
        @media only screen and (max-width: 700px) {
            width: 100%;
            height: 40vh;
            min-height: 100px;
            text-align: center;
        }
    `,
    RightPanel: styled.div`
        max-height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        @media only screen and (min-width: 701px) {
            width:25vw;
            margin-left: 20px;
            margin-right: 20px;
        }
        @media only screen and (max-width: 700px) {
            width: 100%;
            height: 30vh;
            text-align: center;
            display: unset;
        }
    `,
    OnTurn: styled.div``,
    NameInput: styled.input`
        @media only screen and (min-width: 701px) {
            height: 50px;
            font-size: 15px;
        }
    `,
    GuessButton: styled.button`
        @media only screen and (max-height: 450px) {
            position: absolute;
            top: -1000px;
            width: 100%;
        }
        @media only screen and (min-width: 701px) {
            margin: 10px 0 10px 0;
            width:90%;
        }
        @media only screen and (max-width: 700px) {
            height: 50px;
            margin-bottom: 20px;
            width:100%;
        }
    `,
    GuessInput: styled.input`
        @media only screen and (min-width: 701px) {
            padding-left: 10px;
            height: 50px;
            font-size: 20px;
            width: 90%;
        }
        @media only screen and (max-width: 700px) {
            height: 50px;
            width: 100%;
        }
    `,
    Title: styled.div`
        @media only screen and (min-width: 701px) {
            position: absolute;
            text-align: center;
            width: 100%;
            h1 {
                font-size: 100px;
            }
        }
        @media only screen and (max-width: 700px) {
            position: absolute;
        }
    `,

    Guessed: styled.tbody``,
};
export default components;
