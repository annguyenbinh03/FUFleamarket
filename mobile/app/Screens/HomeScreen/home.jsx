import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { images } from "../../../constants";
import Carousel from "../../../components/Carousel ";
import SearcInput from "../../../components/SearchInput";
import ProductListContainer from "../../../components/ProductList";
import Categories from "../../../components/Categories";
import Header from "./Header";

const Home = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar backgroundColor="#161622" style="light" />
        <Header />
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Carousel />
          <Categories />
          <ProductListContainer />
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8", // Màu nền xám nhạt
  },
  scrollViewContainer: {
    paddingBottom: 20,
  },
});

export default Home;
