import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnectionState,
} from "@microsoft/signalr";
import ChatRoom from "./../../../components/ChatRoom";
import { getChattersAPI } from "../../api/user_api";
import AuthContext from "../../../context/AuthProvider";
import { StatusBar } from "expo-status-bar";
import { FontAwesome5 } from "@expo/vector-icons";

const Chat = () => {
  const [chatters, setChatters] = useState([]);
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedChatter, setSelectedChatter] = useState(null);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    console.log("Đang tải danh sách người chat...");
    fetchChatters();

    return () => {
      if (connection) {
        console.log("Đóng kết nối khi component unmount");
        connection.stop();
      }
    };
  }, []);

  const fetchChatters = async () => {
    try {
      const response = await getChattersAPI(auth.token);
      if (response && response.data) {
        console.log("Đã tải danh sách người chat thành công");
        setChatters(response.data);
      } else {
        console.error("Phản hồi không hợp lệ từ getChattersAPI");
        Alert.alert("Lỗi", "Không thể tải danh sách người chat");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách người chat:", error);
      Alert.alert(
        "Lỗi",
        "Không thể tải danh sách người chat. Vui lòng thử lại sau."
      );
    }
  };

  const connectToChatRoom = async (receiverId) => {
    console.log("Đang kết nối đến phòng chat...");
    try {
      const newConnection = new HubConnectionBuilder()
        .withUrl("https://fufleamarketapi.azurewebsites.net/Chat")
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      newConnection.onreconnecting(() => console.log("Đang kết nối lại..."));
      newConnection.onreconnected(() =>
        console.log("Đã kết nối lại thành công")
      );
      newConnection.onclose(() => console.log("Kết nối đã đóng"));

      newConnection.on("JoinSpecificChatRoom", (messages) => {
        console.log("Đã tham gia phòng chat cụ thể");
        setMessages(messages);
      });
      newConnection.on("ReceiveSpecificMessage", (message) => {
        console.log("Đã nhận tin nhắn mới");
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      await newConnection.start();
      console.log("Kết nối SignalR đã được thiết lập");

      await newConnection.invoke("JoinSpecificChatRoom", {
        userid: auth.userId,
        receiverId,
        username: auth.fullName,
      });
      console.log("Đã tham gia phòng chat thành công");

      setConnection(newConnection);
    } catch (error) {
      console.error("Lỗi khi kết nối đến phòng chat:", error);
      Alert.alert(
        "Lỗi",
        "Không thể kết nối đến phòng chat. Vui lòng thử lại sau."
      );
    }
  };

  const handleChatterSelect = async (chatter) => {
    console.log("Đang chọn người chat:", chatter.fullName);
    if (connection) {
      await connection.stop();
      console.log("Đã đóng kết nối cũ");
    }
    setMessages([]);
    setSelectedChatter(chatter);
    await connectToChatRoom(chatter.userId);
  };

  const sendMessage = async (message) => {
    console.log("Đang gửi tin nhắn...");
    try {
      if (connection && connection.state === HubConnectionState.Connected) {
        await connection.invoke("SendMessage", message);
        console.log("Đã gửi tin nhắn thành công");
      } else {
        console.error("Kết nối không ở trạng thái 'Connected'");
        Alert.alert("Lỗi", "Không thể gửi tin nhắn. Vui lòng thử kết nối lại.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      Alert.alert("Lỗi", "Không thể gửi tin nhắn. Vui lòng thử lại.");
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
      <StatusBar backgroundColor="#DD0000" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý tin nhắn</Text>
        <View style={{ width: 20 }} />
      </View>
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
            Chọn một người để bắt đầu trò chuyện
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#DD0000",
  },
  headerTitle: { flex: 1, textAlign: "center", color: "#fff", fontSize: 18 },
  chatterList: {
    maxHeight: 100,
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
  },
  chatterItem: { alignItems: "center", padding: 10, marginRight: 10 },
  selectedChatter: { backgroundColor: "#e6e6e6" },
  avatar: { width: 50, height: 50, borderRadius: 25, marginBottom: 5 },
  chatterName: { fontSize: 12, textAlign: "center" },
  chatRoomContainer: { flex: 1, padding: 10 },
  noSelection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

export default Chat;
