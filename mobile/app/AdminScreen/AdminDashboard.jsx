import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import axios from "axios";
import { PieChart, BarChart } from "react-native-chart-kit";

const { width } = Dimensions.get("screen");

const TOP_SELLING_PRODUCT =
  "http://192.168.146.25:7057/api/DashBoard/topsellingproducts";
const DASHBOARD_SUMMARY =
  "http://192.168.146.25:7057/api/DashBoard/dashboardsummary";
const MONTHLY_PACKAGE =
  "http://192.168.146.25:7057/api/DashBoard/packagemonthlydata";
const TOP_SELLER = "http://192.168.146.25:7057/api/DashBoard/topsellers";

export default function AdminDashboard() {
  const [summaryData, setSummaryData] = useState({});
  const [topSellProductData, setTopSellProductData] = useState([]);
  const [topSellerData, setTopSellerData] = useState([]);
  const [sellingPackagesData, setSellingPackagesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const summaryResponse = await axios.get(DASHBOARD_SUMMARY);
      setSummaryData(summaryResponse.data);
      console.log("summaryResponse: ", summaryResponse.data);

      const topSellProductResponse = await axios.get(TOP_SELLING_PRODUCT);
      setTopSellProductData(topSellProductResponse.data);
      console.log("topSellProductResponse:", topSellProductResponse.data);

      const topSellerResponse = await axios.get(TOP_SELLER);
      setTopSellerData(topSellerResponse.data);
      console.log("topSellerResponse:", topSellerResponse.data);

      const sellingPackagesResponse = await axios.get(MONTHLY_PACKAGE);
      setSellingPackagesData(sellingPackagesResponse.data);
      console.log("sellingPackagesResponse:", sellingPackagesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryContainerItem}>
        Tổng doanh thu: {summaryData.totalRevenue}
      </Text>
      <Text style={styles.summaryContainerItem}>
        Tổng số đơn hàng: {summaryData.totalOrderCount}
      </Text>
      <Text style={styles.summaryContainerItem}>
        Tổng số người dùng mới: {summaryData.totalUserCount}
      </Text>
    </View>
  );

  const renderBarChart = (chartData, dataKey, valueKey, title) => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <BarChart
        data={{
          labels: chartData.map((item) => item[dataKey]),
          datasets: [{ data: chartData.map((item) => item[valueKey]) }],
        }}
        width={300}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
      />
    </View>
  );

  const renderPieChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Biểu đồ gói bán hàng</Text>
      <PieChart
        data={sellingPackagesData.map((item, index) => ({
          name: item.promotionName,
          population: item.totalPrice,
          color: `rgba(0, 0, 255, ${0.5 + index * 0.1})`,
        }))}
        width={300}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {renderSummary()}
      {renderBarChart(
        topSellProductData,
        "productName",
        "quantity",
        "Sản phẩm bán chạy"
      )}
      {renderBarChart(
        topSellerData,
        "sellerName",
        "totalOrders",
        "Người bán hàng tiêu biểu"
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
    flexDirection: "column",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  summaryContainerItem: {
    textAlign: "center",
    backgroundColor: "#FFA500",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000000",
    fontWeight: "bold",
    padding: 10,
    margin: 5,
    elevation: 2,
    shadowColor: "#000",
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
  },
});
