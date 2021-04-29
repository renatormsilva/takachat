import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import groupIcon from "./assets/icon.png";
import "./App.css";

let socket;
const CONNECTION_PORT = "takachat.herokuapp.com";

function App() {
  // // Before Login
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState("Your room");
  const [userName, setUserName] = useState("");

  // // After Login
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket = io(CONNECTION_PORT);
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data]);
    });
  });

  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit("join_room", room);
  };

  const handler = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (message !== "") {
      let messageContent = {
        room: room,
        content: {
          author: userName,
          message: message,
        },
      };
      document.getElementById("text").value = "";
      await socket.emit("send_message", messageContent);
      setMessageList([...messageList, messageContent.content]);
      setMessage("");
    } else {
      return;
    }
  };

  return (
    <div className="con">
      {!!loggedIn ? (
        <>
          <div id="head">
            <img src={groupIcon} alt="group" />
            <h1> {room} </h1>
            <h3>Online</h3>
          </div>
          <div id="body">
            {messageList.map((val, key) => {
              return (
                <div id={val.author === userName ? "user2" : "user1"}>
                  <div className="messageIndividual">
                    <p>{val.author}:</p> {val.message}
                  </div>
                </div>
              );
            })}
          </div>
          <div id="btm">
            <input
              type="text"
              id="text"
              placeholder="Enter your Message..."
              autocomplete="off"
              onKeyPress={(e) => handler(e)}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button id="chat-button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </>
      ) : (
        <div id="head-login">
          <form method="post" action="">
            <h1>TakaChat</h1>
            <p>
              <label for="nome_login">User</label>
              <input
                id="nome_login"
                name="nome_login"
                required="required"
                type="text"
                placeholder="ex. Renatinho"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </p>

            <p>
              <label for="email_login">Room </label>
              <input
                id="email_login"
                name="email_login"
                required="required"
                type="text"
                placeholder="ex. Kerigmas e didaches"
                onfocus="this.value=''"
                onChange={(e) => {
                  setRoom(e.target.value);
                }}
              />
            </p>

            <p>
              <button onClick={connectToRoom}>Enter Chat</button>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
