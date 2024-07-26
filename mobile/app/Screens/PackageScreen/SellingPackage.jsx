import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { getPackagesAPI } from "../../api/packages";
import AuthContext from "../../../context/AuthProvider";
import formatPrice from "../../../utils/formatPrice";

const { width } = Dimensions.get("window");

const SellingPackage = () => {
  const [sellingPackages, setSellingPackages] = useState([]);
  const { auth } = useContext(AuthContext);

  const fetchPackages = async () => {
    try {
      const response = await getPackagesAPI(auth.token);
      setSellingPackages(response.data);
      console.log("Fetched packages:", response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleBuy = (userId, promotionId) => {
    const url = `https://fufleamarketapis.azurewebsites.net/api/VNPay/payment/${userId}/${promotionId}`;
    console.log("Opening payment URL:", url);
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Chỉ {formatPrice(15000)} cho 30 ngày dùng gói cơ bản
        </Text>
        <Text style={styles.subHeaderText}>
          Trải nghiệm gói bán hàng tiết kiệm, tiện lợi và hiệu quả cao
        </Text>
        <Text style={styles.benefitText}>
          • Đăng nhiều sản phẩm{"\n"}• Quản lý kinh doanh và chi tiêu hiệu quả
          {"\n"}• Tiếp cận thêm liên hệ của nhóm khách hàng thụ động cần tư vấn
        </Text>
      </View>
      <Text style={styles.sectionTitle}>Chọn gói bán hàng theo nhu cầu</Text>
      <View style={styles.packagesContainer}>
        {sellingPackages.map((sPackage) => (
          <View key={sPackage.promotionId} style={styles.card}>
            <Image
              style={styles.cardImage}
              source={{ uri: sPackage.imageLink }}
            />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{sPackage.name}</Text>
              <Text style={styles.cardDescription}>{sPackage.description}</Text>
              <Text style={styles.cardPrice}>
                {formatPrice(sPackage.price)}
                <Text style={styles.pricePerMonth}> / tháng</Text>
              </Text>
              <View style={styles.cardDetail}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.detailText}>
                  Lượt đăng sản phẩm: {sPackage.productQuantityLimit}
                </Text>
              </View>
              <View style={styles.cardDetail}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.detailText}>
                  Duyệt tin nhanh dưới 5 phút
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => handleBuy(auth.userId, sPackage.promotionId)}
            >
              <Text style={styles.buyButtonText}>Mua ngay</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.faq}>
        <Text style={styles.faqHeader}>Câu hỏi thường gặp</Text>
        <Text style={styles.faqQuestion}>
          Gói bán hàng áp dụng cho tin đăng mới kể từ khi mua gói hay có thể áp
          dụng cho cả tin đã đăng trước đó?
        </Text>
        <Text style={styles.faqAnswer}>
          Gói bán hàng được áp dụng cho cả tin đăng mới và tin bạn đã đăng trước
          đó, chỉ cần tin đăng này vẫn còn thời hạn hiển thị trên FUFM.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subHeaderText: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },
  benefitText: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  packagesContainer: {
    paddingHorizontal: 10,
  },
  card: {
    width: width - 40,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: "center",
  },
  cardImage: {
    width: "auto",
    height: 300,
    resizeMode: "cover",
  },
  cardBody: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardDescription: {
    marginBottom: 10,
    fontSize: 14,
    color: "#666",
  },
  cardPrice: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pricePerMonth: {
    fontSize: 16,
    color: "#666",
  },
  cardDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  checkIcon: {
    color: "green",
    marginRight: 5,
    fontSize: 16,
  },
  detailText: {
    fontSize: 14,
  },
  buyButton: {
    backgroundColor: "#000",
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  faq: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
  },
  faqHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  faqAnswer: {
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
});

export default SellingPackage;
