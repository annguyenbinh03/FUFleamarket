import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import {
  acceptBuyRequestOrdersAPI,
  denyBuyRequestOrdersAPI,
  getMySellOrdersRequestAPI,
  getSellOrdersAPI,
} from "../../api/order";
import Header from "../../Header";
import Footer from "../../Footer";
import { getSellingProductForSlectOrderAPI } from "../../api/product";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/ReactToastify.css'

function BuyOrderRequest() {
  const [orders, setOrder] = useState([]);
  const { auth } = useContext(AuthContext);
  const [sortBy, setSortBy] = useState("date");
  const [sortProductId, setSortProductId] = useState(null);
  const [sellingProducts, setSellingPorudct] = useState([]);

  const fetchOrder = async () => {
    try {
      var response = await getMySellOrdersRequestAPI(
        auth.accessToken,
        sortBy,
        sortProductId
      );
      setOrder(response);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };
  const fetchSellingProduct = async () => {
    try {
      var response = await getSellingProductForSlectOrderAPI(auth.accessToken);
      setSellingPorudct(response);
    } catch (error) {
      console.error("Error fetching SellingProduct:", error);
    }
  };

  useEffect(() => {
    console.log(sortBy);
    fetchOrder();
    fetchSellingProduct();
  }, [sortBy, sortProductId]);

  const handleAcceptOrder = async (productId, orderQuantity, storageQuantity) => {
    if(orderQuantity>storageQuantity ){
      toast.error('Không đủ số lượng trong kho để bán!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
        });
    }else{
      try {
        await acceptBuyRequestOrdersAPI(auth.accessToken, productId);
        fetchOrder();
        toast.success('Đã xác nhận đơn hàng!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
          });
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    }
    
  };

  const handleDenyOrder = async (productId) => {
    try {
      await denyBuyRequestOrdersAPI(auth.accessToken, productId);
      fetchOrder();
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const formatPrice = (value) => {
    return value.toLocaleString("vi-VN");
  };

  function removeTimeFromISOString(isoString) {
    // const index = isoString.indexOf("T");
    // if (index !== -1) {
    //   return isoString.slice(0, index);
    // }
    return isoString;
  }
  const showChoosingProduct = () => {
    if (sortProductId !== null) {
      const filteredProduct = sellingProducts.find(
        (product) => product.productId === sortProductId
      );
      return filteredProduct ? (
        <>
          <img
            style={{ maxWidth: "30px", maxHeight: "24px" }}
            src={`${filteredProduct.imageLink}`}
            alt="product"
          />
          {"   "}
          {filteredProduct.productName} {"   "}
        </>
      ) : (
        "Không tìm thấy sản phẩm"
      );
    } else {
      return "Tất cả";
    }
  };

  return (
    <div>
      <Header />
      <section className="buy_order spad">
        <div className="container bg-white px-1 py-3">
          <div className="product_container px-4 py-2">
            <h3 className="mb-4 pb-2 fw-bold">Yêu cầu mua hàng</h3>
            <div className="row mb-3">
              <div className="">
                <form className="d-flex justify-content-start align-items-center">
                  <div className="my-auto me-2"> Ưu tiên xem </div>
                  <div className="input-group w-75">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="form-select rounded"
                      style={{ maxWidth: "25%" }}
                    >
                      <option value="date">Yêu cầu mới nhất</option>
                      <option value="price">Giá đề xuất cao nhất</option>
                      <option value="rating">Rating người mua cao nhất</option>
                    </select>
                    <label
                      className="input-group-text ms-2 "
                      htmlFor="inputGroupSelect01"
                    >
                      Theo sản phẩm
                    </label>

                    <div class="dropdown" style={{ width: "40%" }}>
                      <button
                        class="btn btn-secondary dropdown-toggle bg-white text-black w-100 text-left"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        id="inputGroupSelect01"
                      >
                        {showChoosingProduct()}
                      </button>
                      <ul class="dropdown-menu" style={{width:"100%"}}>
                        {sellingProducts?.length > 0 ? (
                          <>
                            <li
                              className="dropdown-item text-center"
                              onClick={() => setSortProductId(null)}
                            >
                              <i class="fa fa-list-alt" aria-hidden="true"></i>{" "}
                              Tất cả
                            </li>
                            {sellingProducts.map((product) => (
                              <li
                                className="dropdown-item"
                                value="1"
                                key={product.productId}
                                onClick={() =>
                                  setSortProductId(product.productId)
                                }
                              >
                                <span class="badge text-bg-primary">
                                  {" "}
                                  {product.waitingOrderNumber}
                                </span>
                                {"  "}
                                <img
                                  style={{
                                    maxWidth: "30px",
                                    maxHeight: "24px",
                                  }}
                                  src={`${product.imageLink}`}
                                  alt="product"
                                />
                                {"  "}
                                {product.productName}
                              </li>
                            ))}
                          </>
                        ) : (
                          <>
                            <li className="text-center" value="">Tất cả</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </form>
              </div>
              { orders || orders?.length > 0 ? (
                <div className="row ps-4 mt-4">
                  {orders?.map((order) => (
                    <div
                      key={order.order?.orderId}
                      className="row mb-3 p-2 order"
                    >
                      <div className="col-12 border-bottom ps-2 py-2">
                        <span className="fs-5">
                          <img
                            style={{ borderRadius: "20px" }}
                            src={order.buyer.avarta}
                            width={"30px"}
                            alt="buyer avarta"
                          />{" "}
                          {order.buyer.fullName}
                        </span>
                      </div>
                      <div className="col-9 col-md-9 pt-3">
                        <div className="row">
                          <div className="col-lg-3 w-25 product_image">
                            <img src={order.product.imageLink} alt="" />
                            {/* //order.productImage */}
                          </div>
                          <div className="col-lg-9">
                            <Link href="" className="name">
                              {order.product?.productName}
                            </Link>
                            <div className="price text-secondary">
                              {order.product?.price
                                ? formatPrice(order.product?.price)
                                : ""}{" "}
                              đ
                            </div>
                            <div className="address">
                              {order.order?.receiverAddress}
                            </div>
                            <div className="">
                              {order.order?.status === 0 ? (
                                <div className="d-flex justify-content-center mt-2">
                                  <button
                                    className="btn btn-info mx-3"
                                    onClick={() =>
                                      handleAcceptOrder(order.order?.orderId, order.order?.quantity,order.product?.storedQuantity)
                                    }
                                  >
                                    Xác nhận đơn hàng
                                  </button>
                                  <button
                                    className="btn btn-danger mx-3 "
                                    onClick={() =>
                                      handleDenyOrder(order.order?.orderId)
                                    }
                                  >
                                    Hủy đơn hàng
                                  </button>
                                </div>
                              ) : order.order?.status === 1 ? (
                                <div className="d-flex justify-content-center mt-2">
                                  <button className="btn btn-success mx-3">
                                    Đã xác nhận đơn hàng
                                  </button>
                                </div>
                              ) : (
                                <div className="d-flex justify-content-center mt-2">
                                  <button className="btn btn-danger mx-3">
                                    Đã hủy đơn hàng
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-3 col-md-3 pt-3 order_info">
                        <div>
                          Số lượng muốn mua: <span>{order.order?.quantity}</span>  {" "}
                          {order.product?.storedQuantity > order.order?.quantity ? (
                            <span class="badge text-bg-success">kho: {order.product?.storedQuantity}</span>
                          ) : (
                            <span class="badge text-bg-danger">kho: {order.product?.storedQuantity}</span>
                          ) }
                          
                        </div>
                        <div className="fw-bold">
                          Giá mong muốn:{" "}
                          <span className="text-danger fw-bold">
                            {formatPrice(order.order?.price)} đ
                          </span>
                        </div>
                        <div>
                          Phương thức thanh toán:{" "}
                          <span>{order.order?.paymentMethod}</span>
                        </div>
                        <div>
                          Ngày giao dịch:{" "}
                          <div>
                            {removeTimeFromISOString(order.order?.orderDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="not-found-text fs-3">
                  Bạn vẫn chưa có yêu cầu mua hàng nào
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default BuyOrderRequest;
