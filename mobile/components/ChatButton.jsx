import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

const ChatButton = ({ seller }) => {
  const navigation = useNavigation();

  const handleChat = () => {
    navigation.navigate("Chat", {
      initialChat: {
        fullName: seller.fullName,
        avarta: seller.avarta,
        userId: seller.userId,
      },
    });
  };

  return (
    <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
      <View style={styles.buttonContent}>
        <FontAwesome5 name="comments" size={20} color="#fff" />
        <Text style={styles.buttonText}>CHAT VỚI NGƯỜI BÁN</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatButton;

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
