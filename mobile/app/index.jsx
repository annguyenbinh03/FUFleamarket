import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Link } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function App() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#161622" style="light" />
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Chào mừng bạn đến với </Text>
        <Text style={styles.title}>FU FLea Market! </Text>
      </View>

      <Text style={styles.subtitle}>Thứ bạn dư là thứ người khác thiếu</Text>

      <TouchableOpacity
        title="Go to Home"
        onPress={() => router.push("/(tabs)/home")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF6600",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 250,
    height: 84,
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#FFA001",
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
