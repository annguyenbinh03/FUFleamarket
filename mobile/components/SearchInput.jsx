import React, { useState, useEffect } from "react";
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
import formatPrice from "../utils/formatPrice";
import { getProductAPI } from "../app/api/product";

function SearchInput({ initialQuery }) {
  const [searchProductName, setSearchProductName] = useState(
    initialQuery || ""
  );
  const [topSearchResults, setTopSearchResults] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchTopSearch(searchProductName);
  }, [searchProductName]);

  const fetchTopSearch = (value) => {
    if (value) {
      getProductAPI()
        .then((response) => {
          const json = response.data;
          const results = json.filter((product) => {
            return (
              product &&
              product.productName &&
              product.productName.toLowerCase().includes(value.toLowerCase())
            );
          });
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
    if (searchProductName === "") {
      return Alert.alert("Vui lòng nhập sản phẩm bạn muốn vào ô tìm kiếm");
    }
    // Add navigation logic if needed
  };

  const handleProductPress = (productId) => {
    navigation.navigate("Detail", { productId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleProductPress(item.productId)}
    >
      <Text style={styles.itemName}>{item.productName}</Text>
      <Text style={styles.price}>{formatPrice(item.price)} VND</Text>
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
      {topSearchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={topSearchResults}
            renderItem={renderItem}
            keyExtractor={(item) => item.productId.toString()}
            style={styles.resultsList}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  searchButton: {
    padding: 10,
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: "#999",
  },
  resultsContainer: {
    width: "100%",
    marginTop: 10,
  },
  resultsList: {
    width: "100%",
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    color: "black",
    fontWeight: "600",
  },
  price: {
    color: "red",
  },
});

export default SearchInput;
