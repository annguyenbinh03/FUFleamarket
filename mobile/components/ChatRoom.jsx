import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const ChatRoom = ({
  messages,
  sendMessage,
  receiverAvarta,
  auth,
  receiverName,
  receiverId,
}) => {
  const [msg, setMessage] = useState("");
  const flatListRef = useRef();

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage = ({ item, index }) => {
    const isSentByMe = item.receiverId !== auth.userId;

    return (
      <View
        style={[
          styles.messageContainer,
          isSentByMe ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        {!isSentByMe && (
          <Image
            source={
              receiverAvarta
                ? { uri: receiverAvarta }
                : require("../assets/images/empty.png")
            }
            style={styles.messageAvatar}
          />
        )}
        <View
          style={[
            styles.messageContent,
            isSentByMe
              ? styles.sentMessageContent
              : styles.receivedMessageContent,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isSentByMe ? styles.sentMessageText : styles.receivedMessageText,
            ]}
          >
            {item.messageText}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isSentByMe ? styles.sentMessageTime : styles.receivedMessageTime,
            ]}
          >
            {new Date(item.createdDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => `message-${item.messageId}-${index}`}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        extraData={messages}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={msg}
          onChangeText={setMessage}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#999"
          accessibilityLabel="Message input"
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {
            if (msg.trim()) {
              sendMessage(msg);
              setMessage("");
            }
          }}
          accessibilityLabel="Send message"
        >
          <FontAwesome5 name="paper-plane" size={20} color="white" solid />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingVertical: 20,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 5,
    marginHorizontal: 10,
  },
  sentMessage: {
    justifyContent: "flex-end",
  },
  receivedMessage: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    alignSelf: "flex-end",
  },
  messageContent: {
    borderRadius: 20,
    padding: 12,
    maxWidth: "75%",
  },
  sentMessageContent: {
    backgroundColor: "#0084FF",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  receivedMessageContent: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  sentMessageText: {
    color: "white",
  },
  receivedMessageText: {
    color: "black",
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  sentMessageTime: {
    alignSelf: "flex-end",
    color: "rgba(255, 255, 255, 0.7)",
  },
  receivedMessageTime: {
    alignSelf: "flex-start",
    color: "#888",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#0084FF",
    borderRadius: 50,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatRoom;
