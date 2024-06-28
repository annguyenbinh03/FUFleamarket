import { useContext, useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AuthContext from "../../context/AuthProvider";
import { getAdminAllOrders } from "../../api/order";

function AdminOrderProduct() {
  const { auth } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  const fetchData = async () => {
    try {
      const orderData = await getAdminAllOrders(auth.accessToken);
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
          <h4 className="card-title">Hóa đơn mua bán hàng hóa</h4>
          <p className="">Danh mục tất cả hóa đơn mua bán sản phẩm </p>
          <table className="order-table table text-center table-bordered mb-4">
            <thead className="bg-secondary">
              <tr>
                <th>Sản phẩm</th>
                <th>Người mua</th>
                <th>Người bán</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Phương thức thanh toán</th>
                <th>Ngày giao hàng</th>
                <th>Địa chỉ giao hàng</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr>
                  <td>
                    <div className="td-order-product">
                      <img
                        className="rounded-3 me-2"
                        src={order?.product?.imageLink}
                        style={{ maxWidth: "30px", maxHeight:"40px" }}
                        alt="user"
                      />
                      <span> {order?.product?.productName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="td-order-user">
                      <img
                        className="rounded-3 me-2"
                        src={order?.buyer?.avatar}
                        style={{ maxWidth: "30px" }}
                        alt="user"
                      />
                      <span> {order?.buyer?.fullName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="td-order-user">
                      <img
                        className="rounded-3 me-2"
                        src={order?.seller?.avatar}
                        style={{ maxWidth: "30px" }}
                        alt="user"
                      />
                      <span> {order?.seller?.name}</span>
                    </div>
                  </td>
                  <td>{order?.quantity}</td>
                  <td>{formatPrice(order?.price)} đ</td>
                  <td>{order?.paymentMethod}</td>
                  <td>{removeTimeFromISOString(order?.deliveryDate)}</td>
                  <td>
                    <div className="td-order-address">
                      {order?.receiverAddress}
                    </div>
                  </td>
                  <td>
                    <div className="td-order-note">
                        {order?.note}
                        </div>
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

export default AdminOrderProduct;
