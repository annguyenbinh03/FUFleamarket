import React from "react";
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
          item.isSeeMoreButton ? "seeMore" : item.id.toString()
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredList}
      />
    </View>
  );
};

const Home = () => {
  const navigation = useNavigation();
  const featuredData = [
    {
      id: 1,
      image: {
        uri: "https://th.bing.com/th/id/R.615fbddd5d36723e18d1778551444013?rik=8hxKBlr57HaP9A&pid=ImgRaw&r=0",
      },
      title: "Crab Pool Security",
      price: "$30.00",
      time: "15 giờ trước",
      location: "Tp Hồ Chí Minh",
    },
    {
      id: 2,
      image: {
        uri: "https://th.bing.com/th/id/R.615fbddd5d36723e18d1778551444013?rik=8hxKBlr57HaP9A&pid=ImgRaw&r=0",
      },
      title: "Crab Pool Security",
      price: "$30.00",
      time: "15 giờ trước",
      location: "Tp Hồ Chí Minh",
    },
    {
      id: 3,
      image: {
        uri: "https://th.bing.com/th/id/R.615fbddd5d36723e18d1778551444013?rik=8hxKBlr57HaP9A&pid=ImgRaw&r=0",
      },
      title: "Crab Pool Security",
      price: "$30.00",
      time: "15 giờ trước",
      location: "Tp Hồ Chí Minh",
    },
    {
      id: 4,
      image: {
        uri: "https://th.bing.com/th/id/R.615fbddd5d36723e18d1778551444013?rik=8hxKBlr57HaP9A&pid=ImgRaw&r=0",
      },
      title: "Crab Pool Security",
      price: "$30.00",
      time: "15 giờ trước",
      location: "Tp Hồ Chí Minh",
    },
    {
      id: 5,
      image: {
        uri: "https://th.bing.com/th/id/R.615fbddd5d36723e18d1778551444013?rik=8hxKBlr57HaP9A&pid=ImgRaw&r=0",
      },
      title: "Crab Pool Security",
      price: "$30.00",
      time: "15 giờ trước",
      location: "Tp Hồ Chí Minh",
    },
    {
      id: 6,
      image: {
        uri: "https://th.bing.com/th/id/R.615fbddd5d36723e18d1778551444013?rik=8hxKBlr57HaP9A&pid=ImgRaw&r=0",
      },
      title: "Crab Pool Security",
      price: "$30.00",
      time: "15 giờ trước",
      location: "Tp Hồ Chí Minh",
    },
    {
      id: 7,
      image: {
        uri: "https://th.bing.com/th/id/R.615fbddd5d36723e18d1778551444013?rik=8hxKBlr57HaP9A&pid=ImgRaw&r=0",
      },
      title: "Crab Pool Security",
      price: "$30.00",
      time: "15 giờ trước",
      location: "Tp Hồ Chí Minh",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#161622" style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Image source={images.logo} style={styles.logoImage} />
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log("Bell")}
          >
            <FontAwesome5 name="bell" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log("Message")}
          >
            <FontAwesome5 name="comments" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log("List")}
          >
            <FontAwesome5 name="list-alt" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log("Heart")}
          >
            <FontAwesome5 name="heart" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Thanh timf kiem */}
      <SearcInput />

      {/* Carousel */}
      <Carousel />

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => console.log("Menu")}
        >
          <FontAwesome5 name="list" size={20} color="#fff" />
          <Text style={styles.categoryButtonText}>Danh mục</Text>
        </TouchableOpacity>
      </View>

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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFA500",
    borderWidth: 2,
    borderColor: "#000",
    width: "100%", // Chiều rộng chiếm toàn bộ màn hình
  },
  logo: {
    flex: 1, // Chiếm 1/3 chiều rộng header
    alignItems: "center",
  },
  logoImage: {
    width: 70,
    height: 25,
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
  userContainer: {
    width: 50, // Đặt kích thước chiều rộng
    height: 50, // Đặt kích thước chiều cao để bằng chiều rộng tạo thành hình vuông
    flexDirection: "row",
    alignItems: "center",
    padding: 4, // Giảm kích thước padding
    backgroundColor: "#fff", // Màu trắng
    borderRadius: 5,
    borderWidth: 2, // Độ dày viền
    borderColor: "#000", // Màu viền đen
    justifyContent: "space-between",
  },

  userLogo: {
    width: 25, // Thu nhỏ chiều rộng
    height: 25, // Thu nhỏ chiều cao
    borderRadius: 15,
  },
  userText: {
    color: "#000", // Màu đen
    marginLeft: 5,
    fontSize: 12, // Thu nhỏ font size
  },
  upPostButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff", // Màu trắng
    borderRadius: 5,
    borderWidth: 2, // Độ dày viền
    borderColor: "#000", // Màu viền đen
  },
  upPostButtonText: {
    color: "#000", // Màu đen
    marginLeft: 5,
    fontSize: 12, // Thu nhỏ font size
  },
  categoriesContainer: {
    flexDirection: "row", // Thêm để đặt các nút cạnh nhau
    justifyContent: "flex-start", // Đặt nút Danh mục ở bên trái
    alignItems: "center",
    marginTop: 10,
    padding: 5,
    backgroundColor: "#fff", // Màu trắng
    borderWidth: 2, // Độ dày viền
    borderColor: "#000", // Màu viền đen
    width: "100%", // Chiều rộng chiếm toàn bộ màn hình
  },

  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#FFA500", // Màu cam
    borderRadius: 5,
    borderWidth: 1, // Độ dày viền
    borderColor: "#000", // Màu viền đen
    marginRight: 10, // Khoảng cách giữa các nút
  },

  categoryButtonText: {
    color: "#fff", // Màu trắng
    marginLeft: 5,
    fontSize: 12, // Thu nhỏ font size
  },
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
    width: Dimensions.get("window").width * 0.4, // Chiều rộng 40% màn hình
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
  featuredItemFooterIcon: {
    // ...
  },
  featuredItemFooterText: {
    // ...
  },
  featuredItemFooterTime: {
    color: "#000", // Màu đen
    fontSize: 10, // Thu nhỏ font size
  },
  featuredItemFooterLocation: {
    color: "#000", // Màu đen
    fontSize: 10, // Thu nhỏ font size
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
