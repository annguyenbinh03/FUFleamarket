import React, { useState, useEffect } from "react";
import { router, usePathname } from "expo-router";
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  FlatList,
} from "react-native";
import { icons } from "../constants";
import { useNavigation } from "@react-navigation/native";

function SearchInput({ initialQuery }) {
  const [searchProductName, setSearchProductName] = useState(
    initialQuery || ""
  );
  const [topSearchResults, setTopSearchResults] = useState([]);
  const pathname = usePathname();
  const navigation = useNavigation();

  useEffect(() => {
    fetchTopSearch(searchProductName);
  }, [searchProductName]);

  const fetchTopSearch = (value) => {
    console.log("Fetching search results for:", value);
    if (value) {
      fetch("https://fufleamarketapi.azurewebsites.net/api/product/listproduct")
        .then((response) => response.json())
        .then((json) => {
          const results = json.filter((product) => {
            return (
              product &&
              product.productName &&
              product.productName.toLowerCase().includes(value.toLowerCase())
            );
          });
          console.log("Filtered results:", results);
          console.log("Số lượng sản phẩm tìm kiếm:", results.length);
          setTopSearchResults(results);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    } else {
      setTopSearchResults([]);
    }
  };

  const handleSubmit = () => {
    console.log("Submitting search for:", searchProductName);
    if (searchProductName === "") {
      return Alert.alert("Vui lòng nhập sản phẩm bạn muốn vào ô tìm kiếm");
    }

    if (pathname.startsWith("/search")) {
      router.setParams({ query: searchProductName });
    } else {
      router.push(`/search/${searchProductName}`);
    }
  };

  const handleProductPress = (productId) => {
    console.log("Navigating to product details for ID:", productId);
    navigation.navigate("Detail", { productId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleProductPress(item.productId)}
    >
      <Text style={styles.itemName}>{item.productName}</Text>
      <Text style={styles.itemCategory}>
        trong {item.category || "Danh mục"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          value={searchProductName}
          placeholder="Tìm kiếm"
          placeholderTextColor="#999"
          onChangeText={(text) => setSearchProductName(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSubmit}>
          <Image
            source={icons.search}
            style={styles.searchIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={topSearchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.productId.toString()}
        style={styles.resultsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFA500",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "gray",
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 10,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "black",
  },
  searchButton: {
    padding: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#999",
  },
  resultsList: {
    backgroundColor: "white",
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemName: {
    fontSize: 16,
    color: "black",
  },
  itemCategory: {
    fontSize: 14,
    color: "#FFA500",
  },
});

export default SearchInput;
