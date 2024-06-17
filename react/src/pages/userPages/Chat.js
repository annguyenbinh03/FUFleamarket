import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useContext, useEffect, useState } from "react";
import WaitingRoom from "../../component/waitinggroup";
import ChatRoom from "../../component/ChatRoom";
import Header from "../../Header";
import Footer from "../../Footer";
import AuthContext from "../../context/AuthProvider";
import { useLocation } from "react-router-dom";

const Chat = () => {
  const location = useLocation();
  const {receiverId} = location.state;
  const {receiverName} = location.state;

  
  const [conn, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const { auth } = useContext(AuthContext);

 

  const joinChatRoom = async (userid , receiverId, username, chatroom) => {
    try {
      const conn = new HubConnectionBuilder()
        .withUrl("https://localhost:7057/Chat")
        .configureLogging(LogLevel.Information)
        .build();
      conn.on("JoinSpecificChatRoom", (username, msg) => {
        console.log("msg: ", msg);
        setMessages((messages) => [...messages, { username, msg }]);
      });

      conn.on("ReceiveSpecificMessage", (username, msg) => {
        setMessages((messages) => [...messages, { username, msg }]);
      });

      await conn.start();
      await conn.invoke("JoinSpecificChatRoom", {userid, receiverId, username, chatroom});
      setConnection(conn);
    } catch (e) {
      console.log(e);
    }
  };

  const sendMessage = async (message) => {
    try {
      await conn.invoke("SendMessage", message);
    } catch (e) {
      console.log(e);
    }
  };
    useEffect(() => {
      console.log(receiverId);
      console.log(receiverName);

      joinChatRoom( auth.id ,receiverId, auth.fullName, receiverId);
    }) 
  return (
    <div>
      <Header />

      <div className="container-fluid spad px-0 pb-4 chat">
        <div className="row mt-3 mx-0">
          <div className="col-lg-2">Chat room</div>
          <div className="col-lg-8">
            <h1 className="font-weight-light bg-primary">Welcome to the F1 ChatApp</h1>
            <div className="chat-container">
            {!conn ? (
              <div></div>
             // <WaitingRoom joinChatRoom={joinChatRoom} receiverId={receiverId} receiverName={receiverName}> </WaitingRoom>
            ) : (
              <ChatRoom
                messages={messages}
                sendMessage={sendMessage}
              ></ChatRoom>
            )}
            </div>
           
          </div>
          <div className="col-lg-2">
              <div className="container d-flex justify-content-center">
              <img
                className="receiverLogo mx-1 img-fluid"
                src="https://th.bing.com/th/id/R.7ea4af7d8401d2b43ee841bfa2abe89d?rik=xidyUKdveUKULQ&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fuser-png-icon-download-icons-logos-emojis-users-2240.png&ehk=2%2bOqgdMZqFkKaBclc%2fPL9B86vLju3iBGiFmH64kXaTM%3d&risl=&pid=ImgRaw&r=0"
                alt=""
              />
              </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
