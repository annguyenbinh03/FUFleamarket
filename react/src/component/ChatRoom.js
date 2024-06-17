import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../context/AuthProvider";

const ChatRoom = ({ messages, sendMessage }) => {
  const { auth } = useContext(AuthContext);
  const [msg, setMessage] = useState("");
  const containerRef = useRef(null);
  const dummyRef = useRef(null);

  useEffect(() => {
    const container = document.getElementById('chat-messsages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);
  return (
    <div>
      <div className="row px-5 pt-5">
        <div className="chat-messsages-container" id="chat-messsages-container">
          <div>
            {messages.map((msg, index) => (
              <div>
                {auth.fullName === msg.username ? (
                  <div
                    className="container-fluid bg-primary-subtle d-flex flex-column chat-messsages p-3 mt-2"
                    key={index}
                  >
                    <span>{msg.username}</span>
                    <span> {msg.msg} </span>
                    <span>11:30 pm</span>
                  </div>
                ) : (
                  <div
                    className="container-fluid bg-body-secondary d-flex flex-column chat-messsages p-3 mt-2"
                    key={index}
                  >
                    <span>{msg.username}</span>
                    <span> {msg.msg} </span>
                    <span>11:30 pm</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <form className="mt-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(msg);
              setMessage("");
            }}
          >
            <div className="input-group">
              <span className="input-group-text">Chat</span>
              <input
                className="form-control"
                type="text"
                onChange={(e) => setMessage(e.target.value)}
                value={msg}
                placeholder="type message"
              />
              <button className="btn btn-primary" type="submit" disabled={!msg}>
                send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
