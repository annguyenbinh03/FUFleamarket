import React, { useState } from "react";
import { router, usePathname } from "expo-router";
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import { icons } from "../constants";

const SearchInput = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="flex flex-row items-center space-x-4 w-5/6 h-12 px-4 bg-white rounded-2xl border-2 border-gray-300 focus:border-secondary">
      <TextInput
        className="text-base mt-0.5 text-black flex-1 font-pregular"
        value={query}
        placeholder="Tìm kiếm"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => {
          if (query === "")
            return Alert.alert(
              "Missing Query",
              "Vui lòng nhập sản phẩm bạn muốn vào ô tìm kiếm "
            );

          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <View style={styles.iconContainer}>
          <Image
            source={icons.search}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    tintColor: "black",
  },
});

export default SearchInput;