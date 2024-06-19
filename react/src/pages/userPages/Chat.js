import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useContext, useEffect, useState } from "react";
import ChatRoom from "../../component/ChatRoom";
import Header from "../../Header";
import AuthContext from "../../context/AuthProvider";
import { getChattersAPI } from "../../api/user";

const Chat = () => {
  const [chatters, setChatters] = useState([]);

  const [conn, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const { auth } = useContext(AuthContext);

  const [chatTarget, setChatTarget] = useState();

  useEffect(() => {
    const getChatter = async () => {
      try {
        const response = await getChattersAPI(auth.accessToken);
        setChatters(response);
      } catch (error) {
        console.error("Error fetching chatters:", error);
      }
    };
    getChatter();
  }, []);

  const joinChatRoom = async (userid, receiverId, username) => {
    try {
      const conn = new HubConnectionBuilder()
        .withUrl("https://localhost:7057/Chat")
        .configureLogging(LogLevel.Information)
        .build();
      conn.on("JoinSpecificChatRoom", (listmessage) => {
        setMessages((messages) => [...messages, ...listmessage]);
      });

      conn.on("ReceiveSpecificMessage", (message) => {
        setMessages((messages) => [...messages, message]);
      });

      await conn.start();
      await conn.invoke("JoinSpecificChatRoom", {
        userid,
        receiverId,
        username,
      });
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

  const changeChatter = async (fullName, avarta, receiverId) => {
    try {
      if (conn) {
        await conn.stop();
        setConnection(null);
        setMessages([]);
        setConnection(null);
      }
      await joinChatRoom(auth.id, receiverId, auth.fullName);
      setChatTarget({ fullName, avarta, receiverId });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Header />

      <div className="container-fluid spad px-0 pb-4 chat">
        <div className="row mt-3 mx-0">
          <div className="col-lg-2">
            {chatters?.map((chatter, key) => (
              <div>
                {chatTarget?.fullName === chatter?.fullName ? (
                  <div>
                    <button
                      key={key}
                      className="w-100 border border-0 d-flex justify-content-start align-items-center py-3 bg-primary-subtle"
                      onClick={() =>
                        changeChatter(
                          chatter?.fullName,
                          chatter?.avarta,
                          chatter?.userId
                        )
                      }
                    >
                      <img
                        className="userLogo mx-3 img-fluid"
                        src={`${chatter?.avarta}`}
                        alt="a user avarta"
                      />
                      <div className="fw-bold"> {chatter?.fullName} </div>
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      key={key}
                      className="w-100 border border-0 d-flex justify-content-start align-items-center py-3"
                      onClick={() =>
                        changeChatter(
                          chatter?.fullName,
                          chatter?.avarta,
                          chatter?.userId
                        )
                      }
                    >
                      <img
                        className="userLogo mx-3 img-fluid"
                        src={`${chatter?.avarta}`}
                        alt="a user avarta"
                      />
                      <div> {chatter?.fullName} </div>
                    </button>
                  </div>
                )}
              </div>
            ))}
            ;
          </div>
          <div className="col-lg-8">
            <div className="chat-container">
              {!conn ? (
                <div className="row px-5 pt-5">
                  <div
                    className="chat-messsages-container"
                    id="chat-messsages-container"
                  >
                    &nbsp; Hãy chọn người bạn muốn nhắn tin
                    {/* <button > Bắt đầu chat </button> */}
                  </div>
                </div>
              ) : (
                <ChatRoom
                  messages={messages}
                  sendMessage={sendMessage}
                  receiverAvarta = {chatTarget.avarta}
                ></ChatRoom>
              )}
            </div>
          </div>
          <div className="col-lg-2">
            <div className="container d-flex flex-column justify-content-between h-100">
              <div className="container d-flex flex-column justify-content-center align-items-center">
                <img
                  className="receiverLogo mx-1 img-fluid"
                  src={
                    chatTarget
                      ? chatTarget.avarta
                      : "https://th.bing.com/th/id/R.7ea4af7d8401d2b43ee841bfa2abe89d?rik=xidyUKdveUKULQ&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fuser-png-icon-download-icons-logos-emojis-users-2240.png&ehk=2%2bOqgdMZqFkKaBclc%2fPL9B86vLju3iBGiFmH64kXaTM%3d&risl=&pid=ImgRaw&r=0"
                  }
                  alt=""
                />
                <div className="my-3 fs-4 fw-bold">
                  {chatTarget ? chatTarget.fullName : ""}
                </div>
                {chatTarget ? (
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <div>
                      <button className="btn btn-primary rounded-pill">
                        Xem gian hàng
                      </button>
                    </div>
                    <div>
                      <button className="btn btn-danger rounded-pill mt-2">
                        {" "}
                        Tố cáo người dùng{" "}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>{/* nothing */}</div>
                )}
              </div>

              <div className="container fst-italic text-center text-secondary">
                Không chia sẻ mật khẩu của bạn cho bất kỳ ai, kể cả nhân viên FUFM, gia đình, bạn bè hoặc nhân viên của Shop. Mật khẩu tài khoản của bạn phải được bảo mật tuyệt đối.
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
