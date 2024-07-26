import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { FontAwesome } from "@expo/vector-icons";
import {
  getMonthlyPackageAPI,
  getSummaryAPI,
  getTopSellerAPI,
  getTopSellingProductAPI,
} from "../api/admin";

const { width } = Dimensions.get("screen");

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4D4D",
];

const formatPrice = (value) => {
  if (value) {
    return value.toLocaleString("vi-VN");
  }
  return "0";
};

export default function AdminDashboard() {
  const [summary, setSummary] = useState({});
  const [topSellProduct, setTopSellProduct] = useState([]);
  const [topSeller, setTopSeller] = useState([]);
  const [sellingPackages, setSellingPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [topSellProData, summaryData, topSellerData, packageData] =
        await Promise.all([
          getTopSellingProductAPI(),
          getSummaryAPI(),
          getTopSellerAPI(),
          getMonthlyPackageAPI(),
        ]);

      setTopSellProduct(topSellProData.data || []);
      setSummary(summaryData.data || {});
      setTopSeller(topSellerData.data || []);
      setSellingPackages(packageData.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderSummaryCard = (title, value, iconName) => (
    <View style={styles.summaryCard}>
      <FontAwesome
        name={iconName}
        size={24}
        color="#007AFF"
        style={styles.summaryIcon}
      />
      <View style={styles.summaryTextContainer}>
        <Text style={styles.summaryTitle}>{title}</Text>
        <Text style={styles.summaryValue}>{value || "0"}</Text>
      </View>
    </View>
  );

  const renderBarChart = (data, dataKey, valueKey, title) => {
    const chartData = {
      labels:
        data.length > 0
          ? data.map((item) => item[dataKey] || "").slice(0, 5)
          : ["Không có dữ liệu"],
      datasets: [
        {
          data:
            data.length > 0
              ? data.map((item) => item[valueKey] || 0).slice(0, 5)
              : [0],
        },
      ],
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{title}</Text>
        <BarChart
          data={chartData}
          width={width - 40}
          height={220}
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={styles.chart}
        />
      </View>
    );
  };

  const renderPieChart = () => {
    const pieData =
      sellingPackages.length > 0
        ? sellingPackages.map((item, index) => ({
            name: item.promotionName || "Không xác định",
            population: item.totalPrice || 0,
            color: COLORS[index % COLORS.length],
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
          }))
        : [
            {
              name: "Không có dữ liệu",
              population: 1,
              color: COLORS[0],
              legendFontColor: "#7F7F7F",
              legendFontSize: 12,
            },
          ];

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Biểu đồ gói bán hàng</Text>
        <PieChart
          data={pieData}
          width={width - 40}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryContainer}>
        {renderSummaryCard(
          " Doanh thu trong tháng",
          `${formatPrice(summary?.totalRevenue)} đ`,
          "line-chart"
        )}
        {renderSummaryCard(
          "Số lượng hóa đơn được tạo trong tháng",
          summary?.totalOrderCount || "0",
          "file-text-o"
        )}
        {renderSummaryCard(
          "Người dùng mới trong tháng",
          summary?.totalUserCount || "0",
          "user-plus"
        )}
      </View>
      {renderBarChart(
        topSellProduct,
        "productName",
        "quantity",
        "Top 5 sản phẩm bán chạy"
      )}
      {renderBarChart(
        topSeller,
        "sellerName",
        "totalOrders",
        "Top 5 người bán hàng"
      )}
      {renderPieChart()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  summaryCard: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryIcon: {
    marginBottom: 10,
  },
  summaryTextContainer: {
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    margin: 15,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
