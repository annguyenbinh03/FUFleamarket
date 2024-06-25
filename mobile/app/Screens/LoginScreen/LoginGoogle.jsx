import * as React from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../../../context/AuthProvider"; // Adjust the path as needed
import { TouchableOpacity } from "react-native-gesture-handler";

WebBrowser.maybeCompleteAuthSession();

export default function LoginGoogle() {
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "153330628632-3kk1q3vt2iin4pl0sp8lfssaau0o7a43.apps.googleusercontent.com",
    androidClientId:
      "153330628632-992n8r05ko89q8dqpblqaralkj43dmbc.apps.googleusercontent.com",
  });
  const navigation = useNavigation();
  const { setAuth } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (response?.type === "success" && response?.authentication?.accessToken) {
      handlerSignInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  async function handlerSignInWithGoogle(token) {
    try {
      if (!token) {
        console.log("Token is not provided");
        return;
      }

      const user = await AsyncStorage.getItem("@user");
      if (!user) {
        await getUserInfo(token);
      } else {
        const parsedUser = JSON.parse(user);
        setUserInfo(parsedUser);
        handleSuccessfulLogin(parsedUser);
      }
    } catch (error) {
      console.error("Error handling Google sign-in:", error);
    }
  }

  const getUserInfo = async (token) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.status}`);
      }

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
      handleSuccessfulLogin(user);
    } catch (error) {
      console.error("Error fetching user info:", error.message);
    }
  };

  const handleSuccessfulLogin = async (userData) => {
    const normalizedData = {
      email: userData.email,
      fullName:
        userData.fullName ||
        userData.name ||
        (userData.given_name && userData.family_name
          ? `${userData.given_name} ${userData.family_name}`
          : "Không có tên"),
      avarta: userData.avarta || userData.picture || null,
      role: userData.role || [1],
    };

    await AsyncStorage.setItem("auth", JSON.stringify(normalizedData));
    setAuth(normalizedData);
    navigation.navigate("TabNavigation", { screen: "Hồ sơ" });
  };

  const handleDeleteLocalStorage = async () => {
    try {
      await AsyncStorage.removeItem("@user");
      await AsyncStorage.removeItem("auth");
      setUserInfo(null);
      setAuth(null);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error deleting local storage:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => promptAsync()} style={styles.button}>
        <Image
          source={{
            uri: "https://th.bing.com/th/id/R.25f9465bc7b57d3e3fb6d4ae15341727?rik=PUq1KdBmy9wiDw&pid=ImgRaw&r=0",
          }}
          style={styles.googleIcon}
        />
        <Text style={styles.buttonText}>Đăng nhập email@fpt.edu.vn</Text>
      </TouchableOpacity>
      {/* {userInfo && <Text>{JSON.stringify(userInfo, null, 2)}</Text>}
      {userInfo && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteLocalStorage}
        >
          <Text style={styles.deleteButtonText}>Delete local storage</Text>
        </TouchableOpacity>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    color: "#00000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
