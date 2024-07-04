import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import AuthContext from "../../../context/AuthProvider";
import ChatRoom from "../../../components/ChatRoom";

const CHATTERS = "http://192.168.146.25:7057/api/user/getlistsellerforchat";

const getChattersAPI = (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(CHATTERS, {
    method: "GET",
    headers: config.headers,
  }).then((response) => response.json());
};

const Chat = () => {
  const [chatters, setChatters] = useState([]);
  const [conn, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const { auth } = useContext(AuthContext);
  const [chatTarget, setChatTarget] = useState(null);

  useEffect(() => {
    const fetchChatters = async () => {
      try {
        console.log("Đang lấy danh sách người chat...");
        const data = await getChattersAPI(auth.token);
        setChatters(data);
        console.log("Đã lấy được danh sách người chat");
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người chat:", error);
      }
    };
    fetchChatters();
  }, [auth.token]);

  const joinChatRoom = async (userid, receiverId, username) => {
    try {
      console.log("Đang kết nối đến phòng chat...");
      const conn = new HubConnectionBuilder()
        .withUrl("http://192.168.146.25:7057/Chat")
        .configureLogging(LogLevel.Information)
        .build();

      conn.on("JoinSpecificChatRoom", (listmessage) => {
        setMessages(listmessage);
        console.log("Đã vào phòng chat");
      });

      conn.on("ReceiveSpecificMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log("Đã nhận tin nhắn mới");
      });

      await conn.start();
      await conn.invoke("JoinSpecificChatRoom", {
        userid,
        receiverId,
        username,
      });
      setConnection(conn);
    } catch (e) {
      console.log("Lỗi khi vào phòng chat:", e);
    }
  };

  const sendMessage = async (message) => {
    try {
      await conn.invoke("SendMessage", message);
      console.log("Đã gửi tin nhắn");
    } catch (e) {
      console.log("Lỗi khi gửi tin nhắn:", e);
    }
  };

  const changeChatter = async (fullName, avarta, receiverId) => {
    try {
      if (conn) {
        await conn.stop();
        setConnection(null);
        setMessages([]);
        console.log("Đã ngắt kết nối phòng chat cũ");
      }
      await joinChatRoom(auth.userId, receiverId, auth.fullName);
      setChatTarget({ fullName, avarta, receiverId });
      console.log("Đã chuyển sang chat với:", fullName);
    } catch (e) {
      console.log("Lỗi khi chuyển người chat:", e);
    }
  };

  const renderChatter = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.chatterItem,
        chatTarget?.fullName === item.fullName && styles.selectedChatter,
      ]}
      onPress={() => changeChatter(item.fullName, item.avarta, item.userId)}
    >
      <Image source={{ uri: item.avarta }} style={styles.avatar} />
      <Text style={styles.chatterName}>{item.fullName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.chatterListContainer}>
        <FlatList
          data={chatters}
          renderItem={renderChatter}
          keyExtractor={(item) => item.userId.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.chatRoomContainer}>
        {conn && chatTarget ? (
          <ChatRoom
            messages={messages}
            sendMessage={sendMessage}
            receiverAvarta={chatTarget.avarta}
            auth={auth}
          />
        ) : (
          <View style={styles.noChatSelected}>
            <Text>Hãy chọn người bạn muốn nhắn tin</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  chatterListContainer: {
    height: 100,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  chatterItem: {
    alignItems: "center",
    padding: 10,
    marginRight: 10,
  },
  selectedChatter: {
    backgroundColor: "#e6e6e6",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  chatterName: {
    fontSize: 12,
    textAlign: "center",
  },
  chatRoomContainer: {
    flex: 1,
  },
  noChatSelected: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Chat;
