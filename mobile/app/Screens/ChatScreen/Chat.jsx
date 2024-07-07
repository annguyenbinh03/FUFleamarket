import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { HubConnectionBuilder } from "@microsoft/signalr";

import ChatRoom from "./../../../components/ChatRoom";
import { getChattersAPI } from "../../api/user_api";
import AuthContext from "../../../context/AuthProvider";

const Chat = () => {
  const [chatters, setChatters] = useState([]);
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedChatter, setSelectedChatter] = useState(null);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetchChatters();
  }, []);

  const fetchChatters = async () => {
    try {
      const response = await getChattersAPI(auth.token);
      setChatters(response.data);
    } catch (error) {
      console.error("Error fetching chatters:", error);
    }
  };

  const connectToChatRoom = async (receiverId) => {
    try {
      const newConnection = new HubConnectionBuilder()
        .withUrl("http://192.168.110.7:7057/Chat")
        .build();

      newConnection.on("JoinSpecificChatRoom", setMessages);
      newConnection.on("ReceiveSpecificMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      await newConnection.start();
      await newConnection.invoke("JoinSpecificChatRoom", {
        userid: auth.userId,
        receiverId,
        username: auth.fullName,
      });

      setConnection(newConnection);
    } catch (error) {
      console.error("Error connecting to chat room:", error);
    }
  };

  const handleChatterSelect = async (chatter) => {
    if (connection) {
      await connection.stop();
    }
    setMessages([]);
    setSelectedChatter(chatter);
    await connectToChatRoom(chatter.userId);
  };

  const sendMessage = async (message) => {
    try {
      await connection.invoke("SendMessage", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderChatter = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.chatterItem,
        selectedChatter?.userId === item.userId && styles.selectedChatter,
      ]}
      onPress={() => handleChatterSelect(item)}
    >
      <Image source={{ uri: item.avarta }} style={styles.avatar} />
      <Text style={styles.chatterName}>{item.fullName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatters}
        renderItem={renderChatter}
        keyExtractor={(item) => item.userId.toString()}
        horizontal
        style={styles.chatterList}
      />
      <View style={styles.chatRoomContainer}>
        {selectedChatter ? (
          <ChatRoom
            messages={messages}
            sendMessage={sendMessage}
            receiver={selectedChatter}
            auth={auth}
          />
        ) : (
          <Text style={styles.noSelection}>
            Chọn chatter để bắt đầu trò chuyện
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatterList: { maxHeight: 100 },
  chatterItem: { alignItems: "center", padding: 10, marginRight: 10 },
  selectedChatter: { backgroundColor: "#e6e6e6" },
  avatar: { width: 50, height: 50, borderRadius: 25, marginBottom: 5 },
  chatterName: { fontSize: 12, textAlign: "center" },
  chatRoomContainer: { flex: 1 },
  noSelection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

export default Chat;
