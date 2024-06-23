import * as React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";

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
        setUserInfo(JSON.parse(user));
      }
    } catch (error) {
      console.error("Error handling Google sign-in:", error);
      // Handle error appropriately (e.g., show error message to user)
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
      navigation.navigate("TabNavigation", { screen: "Hồ sơ", userInfo: user });
    } catch (error) {
      console.error("Error fetching user info:", error.message);
      // Handle error appropriately (e.g., show error message to user)
    }
  };

  const handleDeleteLocalStorage = async () => {
    try {
      await AsyncStorage.removeItem("@user");
      navigation.navigate("TabNavigation", { screen: "Hồ sơ", userInfo: user });
      setUserInfo(null);
    } catch (error) {
      console.error("Error deleting local storage:", error);
      // Handle error appropriately (e.g., show error message to user)
    }
  };

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(userInfo, null, 2)}</Text>
      <Text>LoginGoogle</Text>
      <Button title="Sign in with Google" onPress={() => promptAsync()} />
      <Button title="Delete local storage" onPress={handleDeleteLocalStorage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
