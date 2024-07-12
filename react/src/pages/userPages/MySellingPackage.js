import { useContext, useEffect, useState } from "react";
import Footer from "../../Footer";
import Header from "../../Header";
import AuthContext from "../../context/AuthProvider";
import { getMyPackageAPI } from "../../api/packages";
import { Link } from "react-router-dom";
import { getUserPromoTransac } from "../../api/promotionOrder";
const MySellingPackage = () => {
  const { auth } = useContext(AuthContext);

  const [sellingPackages, setSellingPackages] = useState([]);
  const [transactionOrders, setTransactionOrders] = useState([]);
  const fetchMyPackage = async () => {
    try {
      var response = await getMyPackageAPI(auth.accessToken);
      setSellingPackages(response);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
  const fetchPromoOrderTransactions = async () => {
    try {
      var response = await getUserPromoTransac(auth.accessToken);
      setTransactionOrders(response);
      console.log(transactionOrders);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    fetchMyPackage();
    fetchPromoOrderTransactions();
  }, []);

  const formatPrice = (value) => {
    if (value) {
      return value.toLocaleString("vi-VN");
    }
    return value;
  };

  const handleBuy = (userId, promotionId) => {
    window.open(
      `https://fufleamarketapi.azurewebsites.net/api/VNPay/payment/${userId}/${promotionId}`  
    );
  };

  function removeTimeFromISOString(isoString) {
    if (isoString) {
      const index = isoString.indexOf("T");
      if (index !== -1) {
        return isoString.slice(0, index);
      }
    }
    return isoString;
  }

  return (
    <div>
      <Header />
      <section className="selling-package spad">
        <div className="container bg-white py-4">
          <div className="d-flex justify-content-between">
            <div className="px-4 py-2">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/my-posts">Quản lý tin</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Quản lý gói bán hàng
                  </li>
                </ol>
              </nav>
            </div>
            <div>
              {sellingPackages && (
                <div className="me-4">
                  <Link className="btn btn-primary" to="/selling-package">
                    Mua thêm gói bán hàng{" "}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="fs-3 fw-bold   text-center px-5 mb-4">
            Các gói đang hoạt động
          </div>
          <div className="row d-flex justify-content-around">
            {sellingPackages?.map((sPackage) => (
              <div className="card col-lg-3 py-2">
                <img
                  src={require(`../../assets/img/selling-package/${sPackage.promotion.promotionId}.png`)}
                  className="card-img-top"
                  alt="..."
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">
                    {sPackage.promotion.name}
                  </h5>
                  <p className="card-text" style={{ minHeight: "80px" }}>
                    {sPackage.promotion.description}
                  </p>
                  {sPackage.status === "Active" ? (
                    <span className="badge text-bg-success">
                      Đang hoạt động
                    </span>
                  ) : (
                    <span class="badge rounded-pill text-bg-info text-white">Đang chờ</span>
                  )}
                  <div className="fs-5">
                    <span className="">
                      Còn lại {sPackage.remainedDate} ngày
                    </span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold my-3">
                    <div>
                      <span className="text-success">
                        <i
                          className="fa fa-check-circle"
                          aria-hidden="true"
                        ></i>
                      </span>{" "}
                      Lượt đăng sản phẩm
                    </div>
                    <div>{sPackage.promotion.productQuantityLimit}</div>
                  </div>
                  <div className="d-flex justify-content-start fw-bold my-3">
                    <div>
                      <span className="text-success">
                        <i
                          className="fa fa-check-circle"
                          aria-hidden="true"
                        ></i>
                      </span>{" "}
                      Duyệt tin nhanh dưới 5 phút
                    </div>
                  </div>
                  <div className="d-flex justify-content-between fw-bold my-3">
                    <div>
                      <span className="text-success">
                        <i
                          className="fa fa-check-circle"
                          aria-hidden="true"
                        ></i>
                      </span>{" "}
                      Ngày hết hạn
                    </div>
                    <div>{removeTimeFromISOString(sPackage.endDate)}</div>
                  </div>
                  <button
                    onClick={() => handleBuy(auth.id, sPackage.promotionId)}
                    className="btn btn-dark w-100"
                  >
                    Gia hạn
                  </button>
                </div>
              </div>
            ))}
            {sellingPackages ? (
              <div></div>
            ) : (
              <div
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: "500px" }}
              >
                <div className="fs-3 fw-bold mb-3">
                  Bạn chưa sở hữu bất kì gói bàn hàng nào
                </div>
                <Link className="btn btn-primary" to="/selling-package">
                  Mua gói bán hàng ngay{" "}
                </Link>
              </div>
            )}
          </div>
          <div className="row mt-4 p-3">
            <div class="table-responsive bg-white p-2 border rounded-3">
              <table class="table  ">
                <thead>
                  <tr>
                    <th scope="col">Gói</th>
                    <th className="text-center" scope="col">
                      Thời lượng
                    </th>
                    <th className="text-center" scope="col">
                      Giá
                    </th>
                    <th className="text-center" scope="col">
                      Ngày mua
                    </th>
                    <th className="text-center" scope="col">
                      Phương thức thanh toán
                    </th>
                    <th className="text-center" scope="col">
                      Mã giao dịch
                    </th>
                    <th className="text-center" scope="col">
                      Trạng thái
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {transactionOrders?.map((order) => (
                    <tr>
                      <th scope="row" style={{ color: "#666666" }}>
                        <img
                          src={require(`../../assets/img/selling-package/${order.promotionId}.png`)}
                          className="card-img-top"
                          alt="promotion"
                          style={{ maxWidth: "20px" }}
                        />{" "}
                        {order.promotionName}
                      </th>
                      <td className="text-center">{order.quantity} tháng</td>
                      <td className="text-center">
                        {formatPrice(order.price)} đ
                      </td>
                      <td className="text-center">
                        {removeTimeFromISOString(order.transactionCreatedDate)}
                      </td>
                      <td className="text-center">{order.paymentMethod}</td>
                      <td className="text-center">{order.transactionCode}</td>
                      <td className="text-center">
                        {" "}
                        {order.transactionStatus === "Completed" ? (
                          <span class="badge rounded-pill text-bg-success">
                            Thành công
                          </span>
                        ) : (
                          <span class="badge rounded-pill text-bg-danger">
                            Thất bại
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactionOrders?.length > 0 ? (
                <></>
              ) : (
                <div className="not-found-text fs-3">
                  Bạn vẫn chưa có đơn bán nào
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MySellingPackage;
