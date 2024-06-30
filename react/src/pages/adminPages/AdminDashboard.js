import { useCallback, useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  getMonthlyPackageAPI,
  getSummaryAPI,
  getTopSellerAPI,
  getTopSellingProductAPI,
} from "../../api/doashboard";

const pieData = [
  { name: "Gói Cơ bản", value: 5 },
  { name: "Gói Chuyên Nghiệp", value: 3 },
  { name: "Gói Pro", value: 2 },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4D4D",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { promotionName, totalPrice } = payload[0].payload;
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <p className="label">{`Tên khuyến mãi: ${promotionName}`}</p>
        <p className="intro">{`Giá trị: ${totalPrice.toLocaleString(
          "vi-VN"
        )} VND`}</p>
      </div>
    );
  }

  return null;
};

const formatPrice = (value) => {
  if(value){
    return value.toLocaleString('vi-VN');
  }
  return value;

};


function AdminDoashboard() {
  const [summary, setSummary] = useState();
  const [topSellProduct, setTopSellProduct] = useState([]);
  const [topSeller, setTopSeller] = useState([]);

  const [sellingPakages, setSellingPakages] = useState([]);

  const fetchData = async () => {
    try {
      const topSellProData = await getTopSellingProductAPI();
      setTopSellProduct(topSellProData);

      const sumaryData = await getSummaryAPI();
      setSummary(sumaryData);

      const topSellerDate = await getTopSellerAPI();
      setTopSeller(topSellerDate);

      const packageData = await getMonthlyPackageAPI();
      setSellingPakages(packageData);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="admin_page">
      <nav className="navbar">
        <AdminHeader />
      </nav>
      <div className="admin_main container-fluid d-flex justify-content-center p-0 pt-3 mt-5">
        <nav className="w-13 p-0 bg-white">
          <div className="col-lg-12 ">
            <AdminSidebar />
          </div>
        </nav>
        <div className="doashboard-content m-0 w-87 pt-3 row px-4 d-flex justify-content-between ">
          <div className="col-lg-4 p-2 news-info">
            <div className="bg-gradient-danger p-4 rounded-3">
              <img
                src={require(`../../assets/img/doashboard/circle.png`)}
                alt="decoration"
              />
              <div className="title">
                Doanh thu trong tháng{" "}
                <i class="fa fa-line-chart ms-2" aria-hidden="true"></i>{" "}
              </div>
              <div className="statistic mb-2">{formatPrice(summary?.totalRevenue)} đ</div>
              <div> ㅤ</div>
            </div>
          </div>
          <div className="col-lg-4 p-2 news-info">
            <div className="bg-gradient-info p-4 rounded-3">
              <img
                src={require(`../../assets/img/doashboard/circle.png`)}
                alt="decoration"
              />
              <div className="title">
                Số lượng hóa đơn được tạo trong tháng
                <i class="fa fa-bookmark ms-2" aria-hidden="true"></i>
              </div>
              <div className="statistic  mb-2">{summary?.totalOrderCount}</div>
              <div>ㅤ </div>
            </div>
          </div>
          <div className="col-lg-4 p-2 news-info">
            <div className="bg-gradient-success p-4 rounded-3">
              <img
                src={require(`../../assets/img/doashboard/circle.png`)}
                alt="decoration"
              />
              <div className="title">
                Số lượng người dùng mới trong tháng
                <i class="fa fa-user-plus ms-2  mb-2" aria-hidden="true"></i>
              </div>
              <div className="statistic">{summary?.totalUserCount}</div>
              <div>ㅤ </div>
            </div>
          </div>
          <div className="col-md-6 py-3 px-2 ">
            <div className="py-4 ps-2 pe-4 bg-white rounded-5 ">
              <div>
                <div className="row mb-2">
                  <div className="ms-4 fs-5 fw-bold">
                    Các sản phẩm bán chạy trong tháng
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <BarChart width={800} height={300} data={topSellProduct}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="productName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantity" name="Số lượng" fill="#82ca9d">
                    {topSellProduct?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </div>
            </div>
          </div>
          <div className="col-md-6 py-3 px-2 ">
            <div className="py-4 ps-2 pe-4 bg-white rounded-5 ">
              <div>
                <div className="row mb-2">
                  <div className="ms-4 fs-5 fw-bold">
                    Những người bán hàng tiêu biểu
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <BarChart width={800} height={300} data={topSeller}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sellerName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="totalOrders"
                    name="Số lượng hóa đơn bán ra"
                    fill="#82ca9d"
                  >
                    {topSeller?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </div>
            </div>
          </div>
          <div className="col-md-6 py-3 px-2 ">
            <div className="py-4 ps-2 pe-4 bg-white rounded-5 ">
              <div>
                <div className="row mb-2">
                  <div className="ms-4 fs-5 fw-bold">Biểu đồ gói bán hàng</div>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <PieChart width={400} height={400}>
                  <Pie
                    dataKey="totalPrice"
                    isAnimationActive={false}
                    data={sellingPakages}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ promotionName }) => promotionName} // Hiển thị tên khuyến mãi trên nhãn của biểu đồ tròn
                  >
                    {sellingPakages?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />{" "}
                  {/* Sử dụng CustomTooltip */}
                </PieChart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDoashboard;
