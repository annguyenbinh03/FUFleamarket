import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { Linking, Alert } from "react-native";

const GoogleSignUpButton = () => {
  const handleGoogleSignUp = async () => {
    const url = "https://fufleamarket.azurewebsites.net/register-google";

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Lỗi", "Không thể mở đường dẫn này");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi mở URL:", error);
      Alert.alert("Lỗi", "Không thể mở trang đăng ký");
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleGoogleSignUp}>
      <Image
        source={{
          uri: "https://th.bing.com/th/id/R.25f9465bc7b57d3e3fb6d4ae15341727?rik=PUq1KdBmy9wiDw&pid=ImgRaw&r=0",
        }}
        style={styles.logo}
      />
      <Text style={styles.text}>Đăng ký với Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  text: {
    color: "#757575",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default GoogleSignUpButton;
