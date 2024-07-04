import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";

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
    console.log("Current user ID:", auth.userId);
    if (messages.length > 0) {
      console.log("Sample message structure:", messages[0]);
    }
  }, [messages, auth.userId]);

  const renderMessage = ({ item, index }) => {
    const isSentByMe = item.receiverId !== auth.userId;
    console.log(
      "Message:",
      item.messageText,
      "isSentByMe:",
      isSentByMe,
      "receiverId:",
      item.receiverId
    );

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
            {new Date(item.createdDate).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => `message-${item.messageId}-${index}`}
        style={styles.messageList}
        extraData={messages}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={msg}
          onChangeText={setMessage}
          placeholder="Aa"
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
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  messageList: {
    flex: 1,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContent: {
    borderRadius: 20,
    padding: 10,
    maxWidth: "70%",
  },
  sentMessageContent: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  receivedMessageContent: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: "white",
  },
  receivedMessageText: {
    color: "black",
  },
  messageTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  sentMessageTime: {
    alignSelf: "flex-end",
  },
  receivedMessageTime: {
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ChatRoom;
