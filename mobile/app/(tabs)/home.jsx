import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { images } from "../../constants";
import Carousel from "../../components/Carousel ";
import SearcInput from "../../components/SearchInput";
import ProductListContainer from "./../../components/ProductList";
import Categories from "../../components/Categories";

const Home = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#161622" style="light" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Image source={images.logo} style={styles.logoImage} />
          <View style={styles.searchContainer}>
            {/* Thanh timf kiem */}
            <SearcInput style={styles.searcInput} />
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
      <View>
        {/* <Carousel /> */}
        <Carousel />
      </View>
      {/* Categories */}
      <Categories />

      {/*Danh sách sản phẩm */}
      <ProductListContainer />
      {/* Footer */}
      <View style={styles.footer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8", // Màu nền xám nhạt
  },
  header: {
    flexDirection: "row",
    justifyContent: "center", // Center the content horizontally
    alignItems: "center",
    padding: 15,
    backgroundColor: "#DD0000",
    borderWidth: 0,
    width: "100%", // Full screen width
  },
  logo: {
    alignItems: "center", // Center the logo within its container
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
    padding: 8, // Thu nhỏ padding
    margin: 3, // Thu nhỏ margin
    backgroundColor: "#fff", // Màu trắng
    borderRadius: 5,
    borderWidth: 2, // Độ dày viền
    borderColor: "#000", // Màu viền đen
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },

  footer: {
    marginTop: 10, // Thu nhỏ margin
    padding: 5, // Thu nhỏ padding
    backgroundColor: "#fff", // Màu trắng
    borderWidth: 2, // Độ dày viền
    borderColor: "#000", // Màu viền đen
  },
  footerText: {
    fontSize: 14, // Thu nhỏ font size
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000", // Màu đen
  },
});

export default Home;
