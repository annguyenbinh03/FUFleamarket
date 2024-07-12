import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthProvider";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const ChatRoom = ({ messages, sendMessage, receiverAvarta }) => {
  const { auth } = useContext(AuthContext);
  const [msg, setMessage] = useState("");
  const [isPickerVisible, setPickerVisible] = useState(false);

  const calculateTimeAgo = (messageTimestamp) => {
    const MINUTE = 60;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const MONTH = 30 * DAY;
    const YEAR = 365 * DAY;

    const currentTime = new Date().getTime();
    const messageTime = new Date(messageTimestamp).getTime();

    const elapsedSeconds = Math.floor((currentTime - messageTime) / 1000);

    if(!elapsedSeconds || elapsedSeconds < 0){
      return `vài giây trước`;
    }

    if (elapsedSeconds < MINUTE) {
      return `${elapsedSeconds + 1} giây trước`;
    } else if (elapsedSeconds < HOUR) {
      const minutes = Math.floor(elapsedSeconds / MINUTE);
      return `${minutes} phút trước`;
    } else if (elapsedSeconds < DAY) {
      const hours = Math.floor(elapsedSeconds / HOUR);
      return `${hours} giờ trước`;
    } else if (elapsedSeconds < MONTH) {
      const days = Math.floor(elapsedSeconds / DAY);
      return `${days} ngày trước`;
    } else if (elapsedSeconds < YEAR) {
      const months = Math.floor(elapsedSeconds / MONTH);
      return `${months} tháng trước`;
    } else {
      const years = Math.floor(elapsedSeconds / YEAR);
      return `${years} năm trước`;
    }
  };

  useEffect(() => {
    const container = document.getElementById("chat-messsages-container");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="h-100">
      <div className="row px-5 pt-2 h-100">
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
                        {calculateTimeAgo(msg.createdDate)}
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
                    <span className="mess-create-time">
                      {" "}
                      {calculateTimeAgo(msg.createdDate)}{" "}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="d-flex ps-0 pb-1">
        <div className="position-relative">
            <div
              className={
                isPickerVisible
                  ? "d-block position-absolute end-0 Picker"
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
        <button
            type=""
            className="btn bnt-primary"
            onClick={() => setPickerVisible(!isPickerVisible)}
          >
            😀
          </button>
          <form
            className="mt-2"
            style={{ minWidth: "90%" }}
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
                <i className="fa fa-paper-plane" aria-hidden="true"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
