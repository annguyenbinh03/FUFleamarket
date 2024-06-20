import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; // Assuming you are using expo
import { images } from "../../../constants";
import SearchInput from "../../../components/SearchInput"; // Adjust the path as needed

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.logo}>
        <Image source={images.logo} style={styles.logoImage} />
        <View style={styles.searchContainer}>
          <SearchInput style={styles.searchInput} />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log("Bell")}
          >
            <FontAwesome5 name="bell" size={20} color="#111111" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log("Message")}
          >
            <FontAwesome5 name="comments" size={20} color="#111111" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#DD0000",
    borderWidth: 0,
    width: "100%",
  },
  logo: {
    alignItems: "center",
    flex: 1,
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconButton: {
    padding: 8,
    margin: 3,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  searchInput: {
    flex: 1,
  },
});
