import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const Chat = ({ readMessages, client, username }) => {
    const [chatOpen, setChatOpen] = useState(false);
    const chatlog = useSelector((state) => state.chatlog);
    const loggedIn = useSelector((state) => state.loggedIn);
    const newMessages = useSelector((state) => state.newMessages);
    const dispatch = useDispatch();
    console.log(newMessages);
    const sendChat = (message) => {
        client.send(
            JSON.stringify({
                type: "CHAT",
                data: { username: username, message: message },
            })
        );
    };
    return (
        <>
            
            <ChatBubble
                onClick={() => {
                    setChatOpen((cur) => !cur);
                    dispatch(readMessages());
                }}
                top={chatOpen ? 0 : 0}
                newMessages={!chatOpen && newMessages ? "red" : "inherit"}
                visible={loggedIn && "visible"}
            ><NumberMessages chatOpen={chatOpen ? "hidden" : "visible"}>
                {newMessages > 0 ? newMessages : ""}
            </NumberMessages></ChatBubble>
            
           
            <ChatWindow
                fullScreen={loggedIn ? "visible" : "hidden"}
                visible={chatOpen && loggedIn ? "visible" : "hidden"}
            >
                <TextArea>
                    {chatlog.split("\n").map((message, index) => (
                        <>
                            <p style={{ marginBlockEnd: (index % 2) + "rem" }}>
                                {message}{" "}
                            </p>
                        </>
                    ))}
                </TextArea>
                <ChatInput
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            sendChat(e.target.value);
                            e.target.value = "";
                        }
                    }}
                    placeholder="Chat"
                />
            </ChatWindow>
        </>
    );
};
let NumberMessages = styled.div`
    background-color: rgba(0, 0, 0, 0);
    color: red;
    font-size: 25px;
    margin: 0;
    cursor: pointer;
    visibility: ${(props) => props.chatOpen};
    /* @media only screen and (min-width: 700px) {
        visibility: hidden;
    } */
`;
let TextArea = styled.div`
    height: 70%;
    height: 60vh;
    border-style: solid;
    overflow: auto;
    padding: 10px 0 0 5px;
    line-height: 0.75;
    ::-webkit-scrollbar {
        width: 10px;
    }
    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey;
        background: #222;
    }
    ::-webkit-scrollbar-thumb {
        background-image: linear-gradient(to right, #222, hsl(272, 36%, 63%));
        border-radius: 50px;
        width: 5px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;
let ChatInput = styled.input`
    width: 100%;
    height: 50px;
`;
let ChatWindow = styled.div`
    bottom: 0;

    position: absolute;

    right: 0;
    width: 33vw;

    z-index: 4;
    background-color: black;
    position: absolute;
    color: #1f9bcf;
    font-weight: 600;
    visibility: ${(props) => props.fullScreen || "hidden"};
    @media only screen and (max-width: 700px) {
        width: 90%;
        right: unset;
        bottom: unset;
        left: 5%;
        top: 45px;
        visibility: ${(props) => props.visible || "hidden"};
    }
`;
let ChatBubble = styled.div`
    border-radius: ${(props) => props.radius || 50}%;
    width: 45px;
    height: 45px;
    position: absolute;
    border-style: solid;
    z-index: 5;
    right: 0;
    border-color: ${(props) => props.newMessages};
    top: ${(props) => props.top}%;
    visibility: ${(props) => props.visible || "hidden"};
    @media only screen and (min-width: 700px) {
        visibility: hidden;
    }
    display: flex;
    justify-content: center;
    align-items: center;
`;
export default Chat;
