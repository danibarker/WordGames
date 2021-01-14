import React, { useState } from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";

const Chat = ({ client, username }) => {
    const [chatOpen, setChatOpen] = useState(false);
    const chatlog = useSelector((state) => state.chatlog);
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
                }}
                visible={"visible"}
                top={chatOpen ? 0 : 50}
            />
            <ChatWindow visible={chatOpen ? "visible" : "hidden"}>
                <div
                    style={{
                        height: "70%",
                        borderStyle: "solid",
                        borderColor: "#e28430",
                        overflow: "scroll",
                        padding: "10px 0 0 5px",
    lineHeight: ".75"
                    }}
                >
                    {chatlog.split("\n").map((message,index) => (
                        <>
                            <p style={{ marginBlockEnd: index%2 + "rem" }}>{message} </p>
                        </>
                    ))}
                </div>
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
let ChatInput = styled.input`
    width: 100%;
    height: 50px;
`;
let ChatWindow = styled.div`
    width: 100%;
    height: 80%;

    top: 45px;
    z-index: 4;
    background-color: black;
    position: absolute;
    visibility: ${(props) => props.visible || "hidden"};
    color: #1f9bcf;
    font-size: 20px;
    font-weight: 600;
`;
let ChatBubble = styled.div`
    border-radius: ${(props) => props.radius || 50}%;
    width: 45px;
    height: 45px;
    position: absolute;
    border-style: solid;
    border-color: red;
    z-index: 5;
    background-color: black;
    right: 0;
    top: ${(props) => props.top}%;
    visibility: ${(props) => props.visible || "hidden"};
`;
export default Chat;
