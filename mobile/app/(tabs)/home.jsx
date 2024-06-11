import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { images } from "../../constants";
import Carousel from "../../components/Carousel ";
import SearcInput from "../../components/SearchInput";
import CategoriesList from "../../components/CategoriesList";

const FeaturedItem = ({ item, isSeeMoreButton }) => {
  if (isSeeMoreButton) {
    const navigation = useNavigation();
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ProductList")}
        style={styles.seeMoreButton}
      >
        <Text style={styles.seeMoreButtonText}>Xem thêm</Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <View style={styles.featuredItem}>
        <Image source={item.image} style={styles.featuredItemPic} />
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <Text style={styles.featuredPrice}>{item.price}</Text>
        <Text style={styles.featuredPrice}>{item.time}</Text>
        <Text style={styles.featuredPrice}>{item.location}</Text>
      </View>
    );
  }
};

const FeaturedContainer = ({ featuredData }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.featuredContainer}>
      <Text style={styles.featuredTitle}>Sản phẩm nổi bật</Text>
      <FlatList
        data={[...featuredData.slice(0, 5), { isSeeMoreButton: true }]}
        renderItem={({ item }) => (
          <FeaturedItem item={item} isSeeMoreButton={item.isSeeMoreButton} />
        )}
        keyExtractor={(item) =>
          item.isSeeMoreButton
            ? "seeMore"
            : item.id
            ? item.id.toString()
            : "null"
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredList}
      />
    </View>
  );
};

const Home = () => {
  const [featuredData, setFeaturedData] = useState([]); // Khởi tạo mảng sản phẩm rỗng

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(
          "https://localhost:7057/api/product/listproduct"
        );
        const data = await response.json();
        setFeaturedData(data); // Cập nhật mảng sản phẩm
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    fetchFeaturedProducts();
  }, []); // Chạy useEffect một lần khi component được render

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
      <CategoriesList />

      {/* Featured */}
      <FeaturedContainer featuredData={featuredData} />
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
  categoryDropdown: {
    flex: 1,
    alignItems: "center",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#fff", // Màu trắng
    borderRadius: 5,
    borderWidth: 1, // Độ dày viền
    borderColor: "#000", // Màu viền đen
  },
  categoryButtonText: {
    color: "#000", // Màu đen
    marginLeft: 5,
    fontSize: 12, // Thu nhỏ font size
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
  // userContainer: {
  //   width: 50, // Đặt kích thước chiều rộng
  //   height: 50, // Đặt kích thước chiều cao để bằng chiều rộng tạo thành hình vuông
  //   flexDirection: "row",
  //   alignItems: "center",
  //   padding: 4, // Giảm kích thước padding
  //   backgroundColor: "#fff", // Màu trắng
  //   borderRadius: 5,
  //   borderWidth: 2, // Độ dày viền
  //   borderColor: "#000", // Màu viền đen
  //   justifyContent: "space-between",
  // },

  // userLogo: {
  //   width: 25, // Thu nhỏ chiều rộng
  //   height: 25, // Thu nhỏ chiều cao
  //   borderRadius: 15,
  // },
  // userText: {
  //   color: "#000", // Màu đen
  //   marginLeft: 5,
  //   fontSize: 12, // Thu nhỏ font size
  // },
  // upPostButton: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   padding: 8,
  //   backgroundColor: "#fff", // Màu trắng
  //   borderRadius: 5,
  //   borderWidth: 2, // Độ dày viền
  //   borderColor: "#000", // Màu viền đen
  // },
  // upPostButtonText: {
  //   color: "#000", // Màu đen
  //   marginLeft: 5,
  //   fontSize: 12, // Thu nhỏ font size
  // },

  featuredContainer: {
    marginTop: 10,
    padding: 5,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",

    width: "100%", // Hoặc đặt giá trị cụ thể (ví dụ: 300)
    height: 300, // Hoặc đặt giá trị cụ thể (ví dụ: 300)
  },
  featuredTitle: {
    fontSize: 16, // Thu nhỏ font size
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000", // Màu đen
  },
  featuredList: {
    paddingHorizontal: 5, // Thu nhỏ padding
  },
  featuredItem: {
    backgroundColor: "#fff", // Màu trắng
    padding: 8, // Thu nhỏ padding
    borderRadius: 10,
    marginRight: 5, // Thu nhỏ margin
    width: Dimensions.get("window").width * 0.4,
    borderWidth: 2, // Độ dày viền
    borderColor: "#000", // Màu viền đen
  },
  featuredItemPic: {
    width: "100%",
    height: 60, // Thu nhỏ chiều cao
    borderRadius: 10,
    marginBottom: 3, // Thu nhỏ margin
    flex: 1,
  },
  featuredItemTitle: {
    color: "#000", // Màu đen
    fontSize: 12, // Thu nhỏ font size
    fontWeight: "bold",
    marginBottom: 3, // Thu nhỏ margin
  },
  featuredItemPrice: {
    color: "#000", // Màu đen
    marginBottom: 3, // Thu nhỏ margin
    fontSize: 10, // Thu nhỏ font size
  },
  featuredItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeMoreButton: {
    backgroundColor: "#FFA500", // Màu cam nổi bật
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 10, // Khoảng cách với các sản phẩm khác
    width: Dimensions.get("window").width * 0.3, // Chiều rộng chiếm 30% màn hình
  },

  seeMoreButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
