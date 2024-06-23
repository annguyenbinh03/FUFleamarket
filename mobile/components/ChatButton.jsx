import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Linking,
  StyleSheet,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const ChatButton = ({ phoneNumber }) => {
  const handleSendSMS = async () => {
    try {
      const url = `sms:${phoneNumber}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Không hỗ trợ mở SMS");
      }
    } catch (error) {
      console.log("Lỗi khi mở SMS:", error);
    }
  };

  return (
    <TouchableOpacity style={styles.chatButton} onPress={handleSendSMS}>
      <View style={styles.buttonContent}>
        <FontAwesome5 name="comments" size={20} color="#fff" />
        <Text style={styles.buttonText}>CHAT VỚI NGƯỜI BÁN</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 5,
  },
});

export default ChatButton;
