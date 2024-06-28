import { useContext, useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AuthContext from "../../context/AuthProvider";
import { getAdminAllPromoTransac } from "../../api/promotionOrder";

function AdminOrderPackages() {
  const { auth } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  const fetchData = async () => {
    try {
      const orderData = await getAdminAllPromoTransac(auth.accessToken);
      setOrders(orderData);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatPrice = (value) => {
    return value.toLocaleString("vi-VN");
  };
  function removeTimeFromISOString(isoString) {
    if (isoString) {
      var index = -1;
      index = isoString.indexOf("T");
      if (index !== -1) {
        return isoString.slice(0, index);
      }
    }
    return isoString;
  }

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
        <div className="main-content w-87 pt-3 px-4">
          <h4 className="card-title">Hóa đơn gói bán hàng</h4>
          <p className="">Danh mục tất cả hóa đơn mua bán gói bán hàng </p>
          <table className="order-package-table table text-center table-bordered mb-4">
            <thead className="bg-secondary">
              <tr>
                <th>Gói</th>
                <th>Người mua</th>
                <th>Giá</th>
                <th>Phương thức thanh toán</th>
                <th>Mã giao dịch</th>
                <th>Ngày tiếp nối</th>
                <th>Ngày kết thúc</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr>
                  <td>
                    <div className="td-order-package">
                      <img
                        className="rounded-3 me-2"
                        src={require(`../../assets/img/selling-package/${order?.promotionId}.png`)}
                        style={{ maxWidth: "40px", maxHeight: "40px" }}
                        alt="user"
                      />
                      <span> {order?.promotionName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="td-order-seller">
                      <img
                        className="rounded-3 me-2"
                        src={order?.avarta}
                        style={{ maxWidth: "40px", maxHeight: "40px" }}
                        alt="user"
                      />
                      <span> {order?.fullName}</span>
                    </div>
                  </td>
                  <td>
                    <span> {formatPrice(order?.price)}</span>
                  </td>
                  <td>
                    <span> {order?.paymentMethod}</span>
                  </td>
                  <td>
                    <span> {order?.transactionCode}</span>
                  </td>
                  <td>
                    <span> {removeTimeFromISOString(order?.startDate)}</span>
                  </td>
                  <td>
                    <span> {removeTimeFromISOString(order?.endDate)}</span>
                  </td>
                  <td>
                    <span>
                      {order?.promotionOrderStatus === "Active" ? (
                        <span class="badge text-bg-success ">Success</span>
                      ) : (
                        <span class="badge text-bg-danger ">Danger</span>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderPackages;
