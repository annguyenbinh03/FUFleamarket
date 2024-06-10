import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import Stars from "react-native-stars";
import Icon from "react-native-vector-icons/FontAwesome";

const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;

const Profile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Image
              source={{
                uri: "https://th.bing.com/th/id/R.615fbddd5d36723e18d1778551444013?rik=8hxKBlr57HaP9A&pid=ImgRaw&r=0",
              }}
              style={styles.avatar}
            />
          </View>
        </View>
        <View style={styles.nameInfo}>
          <Text style={styles.nameText}>Sống Cho Có</Text>
          <Stars
            default={4}
            count={5}
            half={true}
            starSize={50}
            fullStar={<Text style={[styles.starStyle]}>★</Text>}
            emptyStar={
              <Text style={[styles.starStyle, styles.emptyStarStyle]}>☆</Text>
            }
            halfStar={<Text style={[styles.starStyle]}>★</Text>}
          />
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statText}>5</Text>
              <Text style={styles.statLabel}>Đã mua</Text>
            </View>
            {/* <View style={styles.stat}>
              <Text style={styles.statText}>26</Text>
              <Text style={styles.statLabel}>Comments</Text>
            </View> */}
            <View style={styles.stat}>
              <Text style={styles.statText}>48</Text>
              <Text style={styles.statLabel}>Đã bán</Text>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          {/* Wishlist */}
          <TouchableOpacity style={styles.followButton}>
            <Icon name="heart" size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.followButton}>
            <Icon name="shopping-cart" size={30} color="#fff" />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.followButton}>
            <Icon name="" size={30} color="#fff" />
          </TouchableOpacity> */}
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.aboutSection}>
            <Text style={styles.aboutTitle}>Thông tin liên hệ </Text>
            <Text style={styles.aboutText}>Số điện thoại: 0375995822</Text>
            <View style={styles.myShopHeader}>
              <Text style={styles.myShopTitle}>Sản phẩm</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>Xem thêm</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.myShopImages}>
              <View style={styles.item}>
                <Image
                  source={{
                    uri: "https://th.bing.com/th/id/R.615fbddd5d36723e18d1778551444013?rik=8hxKBlr57HaP9A&pid=ImgRaw&r=0",
                  }}
                  style={styles.image}
                />
              </View>
              <View style={styles.item}>
                <Image
                  source={{
                    uri: "https://th.bing.com/th/id/R.615fbddd5d36723e18d1778551444013?rik=8hxKBlr57HaP9A&pid=ImgRaw&r=0",
                  }}
                  style={styles.image}
                />
              </View>
              <View style={styles.item}>
                <Image
                  source={{
                    uri: "https://th.bing.com/th/id/R.615fbddd5d36723e18d1778551444013?rik=8hxKBlr57HaP9A&pid=ImgRaw&r=0",
                  }}
                  style={styles.image}
                />
              </View>
              <View style={styles.item}>
                <Image
                  source={{
                    uri: "https://th.bing.com/th/id/R.615fbddd5d36723e18d1778551444013?rik=8hxKBlr57HaP9A&pid=ImgRaw&r=0",
                  }}
                  style={styles.image}
                />
              </View>
              <View style={styles.item}>
                <Image
                  source={{
                    uri: "https://th.bing.com/th/id/R.615fbddd5d36723e18d1778551444013?rik=8hxKBlr57HaP9A&pid=ImgRaw&r=0",
                  }}
                  style={styles.image}
                />
              </View>
              <View style={styles.item}>
                <Image
                  source={{
                    uri: "https://th.bing.com/th/id/R.615fbddd5d36723e18d1778551444013?rik=8hxKBlr57HaP9A&pid=ImgRaw&r=0",
                  }}
                  style={styles.image}
                />
              </View>
              <View style={styles.item}>
                <Image
                  source={{
                    uri: "https://th.bing.com/th/id/R.615fbddd5d36723e18d1778551444013?rik=8hxKBlr57HaP9A&pid=ImgRaw&r=0",
                  }}
                  style={styles.image}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: { flex: 0.6, backgroundColor: "#ff8600", padding: 20 },
  avatarContainer: { alignItems: "center", marginTop: height * 0.1 },
  avatar: {
    width: thumbMeasure,
    height: thumbMeasure,
    borderRadius: 50,
    backgroundColor: "#ccc",
  },
  nameInfo: { alignItems: "center", marginTop: 20 },
  nameText: { fontSize: 26, fontWeight: "900", color: "#fff" },
  starStyle: { fontSize: 20, color: "#FFD700" },
  emptyStarStyle: { color: "#CCCCCC" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
  stat: { alignItems: "center" },
  statText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  statLabel: { fontSize: 14, color: "#fff" },
  actions: { flexDirection: "row", justifyContent: "center", marginTop: 60 },
  followButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  followButtonText: { fontSize: 16, color: "#007AFF" },
  socialButton: {
    backgroundColor: "#888888",
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  socialButtonText: { fontSize: 16, color: "#fff" },
  detailsContainer: { flex: 0.4, padding: 20, backgroundColor: "#f8f9fa" },
  aboutSection: { marginTop: 20 },
  aboutTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#2c2c2c",
    marginBottom: 15,
  },
  aboutText: {
    fontSize: 16,
    color: "#9A9A9A",
    lineHeight: 25,
    textAlign: "left",
    marginBottom: 20,
  },
  myShopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  myShopTitle: { fontSize: 16, fontWeight: "bold", color: "#2c2c2c" },
  viewAllText: { fontSize: 14, color: "#007AFF" },
  myShopImages: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  thumb: {
    width: thumbMeasure,
    height: thumbMeasure,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
  item: {
    width: thumbMeasure,
    height: thumbMeasure,
    padding: 5,
    paddingBottom: 10,
  },
  image: {
    width: "100%", // Ảnh sẽ lấp đầy width của phần tử cha
    height: 100, // Thiết lập chiều cao cố định hoặc sử dụng các giá trị khác tùy thuộc vào nhu cầu của bạn
    resizeMode: "cover", // Đảm bảo ảnh sẽ được tự động điều chỉnh kích thước để lấp đầy khung hình
  },
});

export default Profile;
