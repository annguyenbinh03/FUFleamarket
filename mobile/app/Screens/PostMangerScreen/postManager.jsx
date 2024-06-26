// import React, { useState, useEffect, useCallback, useContext } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   FlatList,
//   Dimensions,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
// import axios from "axios";
// import AuthContext from "../../../context/AuthProvider";
// import { formatDate } from "../../../utils/formatDate";

// const { width, height } = Dimensions.get("screen");
// const thumbMeasure = (width - 48 - 32) / 3;

// const PostManager = () => {
//   const [products, setProducts] = useState([]);
//   const [activeTab, setActiveTab] = useState("ĐANG HIỂN THỊ");
//   const [sellingPackages, setSellingPackages] = useState([]);
//   const { auth } = useContext(AuthContext);
//   const navigation = useNavigation();

//   const fetchProduct = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         "http://192.168.146.25:7057/api/product/getmyproducts",
//         {
//           headers: {
//             Authorization: `Bearer ${auth.accessToken}`,
//           },
//         }
//       );
//       console.log("API response:", response);
//       setProducts(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       console.error("Error fetching product:", error);
//       setProducts([]);
//     }
//   }, [auth.accessToken]);

//   const fetchMyPackage = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         "http://192.168.146.25:7075/api/promotionOder/GetMyPackage",
//         {
//           headers: {
//             Authorization: `Bearer ${auth.accessToken}`,
//           },
//         }
//       );
//       setSellingPackages(response.data);
//     } catch (error) {
//       console.error("Error fetching package:", error);
//     }
//   }, [auth.accessToken]);

//   useEffect(() => {
//     fetchProduct();
//     fetchMyPackage();
//   }, [fetchProduct, fetchMyPackage]);

//   const handleTabChange = (tabName) => {
//     setActiveTab(tabName);
//   };

//   const filteredProducts = Array.isArray(products)
//     ? products.filter((product) => {
//         if (activeTab === "ĐANG HIỂN THỊ") {
//           return product.status === 1;
//         } else if (activeTab === "HẾT HẠN") {
//           return product.status === 2;
//         } else if (activeTab === "BỊ TỪ CHỐI") {
//           return product.status === 0;
//         }
//         return true;
//       })
//     : [];

//   const renderProductItem = ({ item }) => (
//     <View style={styles.productContainer}>
//       <View style={styles.productRow}>
//         <View style={styles.productInfo}>
//           <View style={styles.productImageContainer}>
//             <Image
//               source={{
//                 uri: item.imageLink || "https://via.placeholder.com/150",
//               }}
//               style={styles.productImage}
//             />
//             <View style={styles.productStatus}>
//               <Text style={styles.productStatusText}>
//                 {item.status === 0
//                   ? "Đang chờ duyệt"
//                   : item.status === 1
//                     ? "Đã được duyệt"
//                     : "Từ chối duyệt"}
//               </Text>
//             </View>
//           </View>
//           <TouchableOpacity
//             onPress={() =>
//               navigation.navigate("ProductDetails", {
//                 productId: item.productId,
//               })
//             }
//           >
//             <Text style={styles.productName}>{item.productName}</Text>
//           </TouchableOpacity>
//           <Text style={styles.productPrice}>
//             {item.price.toLocaleString("vi-VN")} đ
//           </Text>
//           <Text style={styles.productAddress}>
//             Phường Dĩ An, Thành phố Dĩ An, Bình Dương
//           </Text>
//           <Text style={styles.productCreatedDate}>
//             Ngày đăng tin: {formatDate(item.createdDate)}
//           </Text>
//         </View>
//         <View style={styles.productActions}>
//           <TouchableOpacity style={styles.productActionButton}>
//             <FontAwesome5 name="pencil-alt" size={16} color="#fff" />
//             <Text style={styles.productActionButtonText}>Sửa tin</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.productActionButton}>
//             <FontAwesome5 name="eye-slash" size={16} color="#fff" />
//             <Text style={styles.productActionButtonText}>Ẩn tin</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.productActionButton}>
//             <FontAwesome5 name="share" size={16} color="#fff" />
//             <Text style={styles.productActionButtonText}>Chia sẻ</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <FontAwesome5 name="arrow-left" size={20} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Quản lý tin</Text>
//       </View>
//       <ScrollView style={styles.scrollView}>
//         {/* Display user avatar in shopInfo */}
//         <View style={styles.shopview}>
//           <View style={styles.shopInfo}>
//             <View style={styles.shopAvatar}>
//               <Image
//                 source={
//                   auth.avarta
//                     ? { uri: auth.avarta }
//                     : require("../../../assets/images/empty.png")
//                 }
//                 style={styles.shopAvatarImage}
//               />
//             </View>
//             <View style={styles.shopName}>
//               <Text style={styles.shopNameText}>{auth.fullName}</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.postNav}>
//           <View style={styles.tabContainer}>
//             {["ĐANG HIỂN THỊ", "HẾT HẠN", "BỊ TỪ CHỐI"].map((tab) => (
//               <TouchableOpacity
//                 key={tab}
//                 style={[
//                   styles.tabButton,
//                   activeTab === tab && styles.activeTab,
//                 ]}
//                 onPress={() => handleTabChange(tab)}
//               >
//                 <Text style={styles.tabButtonText}>
//                   {tab} (
//                   {
//                     filteredProducts.filter((p) =>
//                       tab === "ĐANG HIỂN THỊ"
//                         ? p.status === 1
//                         : tab === "HẾT HẠN"
//                           ? p.status === 2
//                           : p.status === 0
//                     ).length
//                   }
//                   )
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         <FlatList
//           data={filteredProducts}
//           renderItem={renderProductItem}
//           keyExtractor={(item) => item.productId.toString()}
//           style={styles.productList}
//         />
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8F8F8",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     backgroundColor: "#DD0000",
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   shopview: {
//     padding: 16,
//     backgroundColor: "#fff",
//     marginBottom: 10,
//   },
//   shopInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   shopAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10,
//     overflow: "hidden", // Ensures image stays within the circle
//   },
//   shopAvatarImage: {
//     width: "100%",
//     height: "100%",
//   },
//   shopName: {
//     flex: 1,
//   },
//   shopNameText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   shopRating: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 5,
//   },
//   shopRatingText: {
//     fontSize: 12,
//     marginLeft: 5,
//   },
//   postNav: {
//     paddingHorizontal: 16,
//     backgroundColor: "#fff",
//     marginBottom: 10,
//   },
//   tabContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   tabButton: {
//     padding: 10,
//     backgroundColor: "#fff",
//     borderColor: "#ddd",
//     borderWidth: 1,
//     borderRadius: 5,
//     marginBottom: 10,
//     flex: 1,
//     margin: 5,
//   },
//   activeTab: {
//     backgroundColor: "#FFA500",
//   },
//   tabButtonText: {
//     textAlign: "center",
//     fontSize: 14,
//     color: "#333",
//   },
//   productList: {
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   productContainer: {
//     marginBottom: 10,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 15,
//   },
//   productRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   productInfo: {
//     flex: 1,
//   },
//   productImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   productStatusPending: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     backgroundColor: "#ccc",
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 5,
//   },
//   productStatusApproved: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     backgroundColor: "#4CAF50",
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 5,
//   },
//   productStatusRejected: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     backgroundColor: "#f44336",
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 5,
//   },
//   productStatusText: {
//     color: "#fff",
//     fontSize: 10,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   productPrice: {
//     fontSize: 14,
//     marginBottom: 5,
//   },
//   productAddress: {
//     fontSize: 12,
//     marginBottom: 5,
//   },
//   productCreatedDate: {
//     fontSize: 12,
//     marginBottom: 5,
//     color: "#777",
//   },
//   productActions: {
//     flexDirection: "row",
//   },
//   productActionButton: {
//     backgroundColor: "#FFA500",
//     padding: 8,
//     borderRadius: 5,
//     margin: 5,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//   },
//   productActionButtonText: {
//     color: "#fff",
//     fontSize: 12,
//     marginLeft: 5,
//   },
// });

// export default PostManager;
import { View, Text } from "react-native";
import React from "react";

export default function PostManager() {
  return (
    <View>
      <Text>PostManager</Text>
    </View>
  );
}
