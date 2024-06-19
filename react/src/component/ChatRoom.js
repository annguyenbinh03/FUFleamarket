import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthProvider";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const ChatRoom = ({ messages, sendMessage, receiverAvarta }) => {
  const { auth } = useContext(AuthContext);
  const [msg, setMessage] = useState("");
  const [isPickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    const container = document.getElementById("chat-messsages-container");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);
  return (
    <div>
      <div className="row px-5 pt-2">
        <div className="chat-messsages-container" id="chat-messsages-container">
          <div>
            {messages.map((msg, index) => (
              <div>
                {auth.id !== msg.receiverId ? (
                  <div
                    className="d-flex justify-content-end container-fluid"
                    key={index}
                  >
                    <div className="d-flex flex-column">
                      <div className="d-flex justify-content-end">
                        <div className="bg-primary-subtle chat-messsages ms-2 px-3 p-2">
                          {msg.messageText}
                        </div>
                      </div>
                      <span className="mess-create-time text-end">
                        {msg.createdDate}{" "}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <div className="d-flex align-items-center">
                      <img
                        className="userLogo"
                        height={`40px`}
                        src={`${receiverAvarta}`}
                        alt="avarta"
                      />
                      <div className="" key={index}>
                        <span className="bg-body-secondary d-flex flex-column chat-messsages ms-1 px-3  p-2">
                          {msg.messageText}
                        </span>
                      </div>
                    </div>
                    <span className="mess-create-time">{msg.createdDate} </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="d-flex">
          <form
            className="mt-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(msg);
              setMessage("");
            }}
          >
            <div className="input-group">
              <span className="input-group-text">Chat</span>
              <input
                className="form-control "
                type="text"
                onChange={(e) => setMessage(e.target.value)}
                value={msg}
                placeholder="Aa"
              />
              <button className="btn btn-primary" type="submit" disabled={!msg}>
                <i class="fa fa-paper-plane" aria-hidden="true"></i>
              </button>
            </div>
          </form>
          <button
            type=""
            className="btn bnt-primary"
            onClick={() => setPickerVisible(!isPickerVisible)}
          >
            😀
          </button>

          <div className="position-relative">
            <div
              className={
                isPickerVisible
                  ? "d-block position-absolute bottom-0 start-0"
                  : "d-none"
              }
            >
              <Picker
                data={data}
                previewPosition="none"
                onEmojiSelect={(e) => {
                  setMessage(msg + e.native);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
