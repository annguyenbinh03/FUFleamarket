import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; // Assuming you are using expo
import { images } from "../../../constants";
import SearchInput from "../../../components/SearchInput"; // Adjust the path as needed

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.bannerContainer}>
        <Image source={images.logo} style={styles.logoImage} />
      </View>
      <View style={styles.searchContainer}>
        <SearchInput style={styles.searchInput} />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => console.log("Thông báo")}
        >
          <FontAwesome5 name="bell" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    alignItems: "center",
  },
  bannerContainer: {
    width: "100%",
    backgroundColor: "#FF4C4C",
    paddingVertical: 5,
    alignItems: "center",
  },
  bannerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoImage: {
    width: 100,
    height: 30,
  },
  searchContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
  },
  iconButton: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
});
