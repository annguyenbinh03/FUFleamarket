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

  const handleBuy = (userId,promotionId) =>{
    window.open(`https://localhost:7057/api/VNPay/payment/${userId}/${promotionId}`);
  }

  const dateConverter = (timeEnd) => {
    const newStartDate = new Date();
    const newEndDate = new Date(timeEnd);
    const one_day = 1000 * 60 * 60 * 24;
    let result;
    result = Math.ceil(
      (newEndDate.getTime() - newStartDate.getTime()) / one_day
    );
    console.log("date Converter result", result);
    if (result < 0) {
      return 0;
    }
    return result;
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
          <div className=" p-1">
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
                  <span className="badge text-bg-success">Đang hoạt động</span>
                  <div className="fs-5">
                    <span className="">
                      {" "}
                      Còn lại {dateConverter(sPackage.endDate)} ngày
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
                      Ngày bắt đầu
                    </th>
                    <th className="text-center" scope="col">
                      Ngày kết thúc
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
                      <td className="text-center">
                        {order.promotionPeriod} ngày
                      </td>
                      <td className="text-center">{formatPrice( order.price)} đ</td>
                      <td className="text-center">
                        {removeTimeFromISOString(order.startDate)}
                      </td>
                      <td className="text-center">
                        {removeTimeFromISOString(order.endDate)}
                      </td>
                      <td className="text-center">{order.paymentMethod}</td>
                      <td className="text-center">{order.transactionCode}</td>
                      <td className="text-center">
                        {" "}
                        {order.transactionStatus === "Completed"
                          ? "Thành công"
                          : "Thất bại"}{" "}
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
