import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByProductIdAPI } from "../../api/product";
import AuthContext from "../../context/AuthProvider";
import { getUserProfileAPI } from "../../api/user";
import { createOrderAPI } from "../../api/order";
import Header from "../../Header";
import Footer from "../../Footer";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

function CreateOrder() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [buyerAddress, setBuyerAddress] = useState(null);
  const [buyer, setBuyer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //upload
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [paymentMethod, setpaymentMethod] = useState("");
  const [receiverAddress, setAddress] = useState("");
  const [note, setNote] = useState("");

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      var response = await getProductByProductIdAPI(productId);
      setProduct(response.product);
      setBuyerAddress(response.address);
      response = await getUserProfileAPI(auth.accessToken);
      setBuyer(response.profile);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (product === null) {
      fetchProduct();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    var totalPrice = price*quantity;
    e.preventDefault();
    const order = {
      totalPrice,
      quantity,
      paymentMethod,
      receiverAddress,
      note,
      productId
    };
    const response = await createOrderAPI(order, auth.accessToken);
    console.log(response);
    toast.info("Đã tạo đơn hàng, đang chờ xác nhận từ người bán!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    navigate("/buy-order", { replace: true });
  };

  const formatPrice = (value) => {
    if(value){
      return value.toLocaleString("vi-VN");
    }
    return value;
  };
  const CheckQuantity = (value) => {
    if (value > product.storedQuantity) {
      showErrorToast("Số lượng muốn mua không được vượt quá số lượng trong kho!", 5000)
    } else {
      setQuantity(value);
    }
  };

  const showErrorToast = (message, closeTime) =>{
    toast.error(message, {
      position: "bottom-right",
      autoClose: closeTime,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  const handleChangePrice = (price) =>{
    if(price){
      if(price<1){
          showErrorToast("Giá sản phẩm phải lớn hơn 0", 5000);
      }else{
        setPrice(price);
      }
    }else{
      setPrice(price);
    }

  }

  return (
    <div>
      <Header />
      <section className="create-order spad">
        <div className="container bg-white py-4">
          <div className="row p-3">
            <div className="fs-3 fw-bold">Thông tin đơn hàng</div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-md-6 p-3">
              <div className="seller_buyer_wrapper rounded p-3 d-flex">
                <div className="fs-2 text-info px-2">
                  <i className="fa fa-dot-circle-o" aria-hidden="true" />
                </div>
                <div className="ps-2">
                  <div>
                    {" "}
                    <strong> Người mua</strong>
                  </div>
                  <div>Từ: {buyer?.fullName}</div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 p-3">
              <div className="seller_buyer_wrapper rounded p-3 d-flex">
                <div className="fs-2 text-danger px-2">
                  <i className="fa fa-map-marker" aria-hidden="true" />
                </div>
                <div className="ps-2">
                  <div>
                    <strong>Người bán</strong>
                  </div>

                  {isLoading ? (
                    <div>Đang tải thông tin người bán...</div>
                  ) : (
                    <>
                      {product?.seller?.fullName && (
                        <>
                          <div>Đến: {product.seller.fullName}</div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row px-5 pt-3">
            <div className="col-lg-4 col-md-4 product_infor">
              <div
                id="carouselExampleIndicators"
                className="carousel slide w-90"
                data-bs-ride="carousel"
              >
                <div className="carousel-indicators">
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={0}
                    className="active"
                    aria-current="true"
                    aria-label="Slide 1"
                  />
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={1}
                    aria-label="Slide 2"
                  />
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={2}
                    aria-label="Slide 3"
                  />
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={3}
                    aria-label="Slide 4"
                  />
                </div>
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img
                      src={product?.productImages}
                      className="d-block w-100"
                      alt="..."
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src={product?.productImages}
                      className="d-block w-100"
                      alt="..."
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src={product?.productImages}
                      className="d-block w-100"
                      alt="..."
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src={product?.productImages}
                      className="d-block w-100"
                      alt="..."
                    />
                  </div>
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">Next</span>
                </button>
              </div>

              {product ? (
                <>
                  <div className="product_name">{product.productName}</div>
                  <div>
                    <p className="price_wistlist_left">
                      {" "}
                      {formatPrice(product.price)}đ
                    </p>
                  </div>
                  <div>
                    {product.isNew ? (
                      <div>Tình trạng: mới</div>
                    ) : (
                      <div>Tình trạng: đã qua sử dụng</div>
                    )}
                  </div>
                  <div>Số lượng trong kho: {product.storedQuantity}</div>
                  <div>
                    <p className="">{product.description}</p>
                  </div>
                </>
              ) : (
                <div>Đang tải thông tin sản phẩm...</div>
              )}
            </div>
            <div className="col-lg-8 col-md-8">
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="300.000đ"
                    required
                    value={price}
                    onChange={(e) => handleChangePrice(e.target.value)}
                  />
                  <label className="ms-2">
                    Giá mong muốn cho 1 sản phẩm (vnd) *
                  </label>
                </div>
                <div className="d-flex">
                  <div className="form-floating mb-3 pe-1 col-md-6">
                    <input
                      type="number"
                      className="form-control"
                      required
                      value={quantity}
                      onChange={(e) => CheckQuantity(e.target.value)}
                    />
                    <label className="ms-2">Số lượng sản phẩm muốn mua *</label>
                  </div>
                  <div className="form-floating mb-3 ps-1 col-md-6">
                    <div
                      type="number"
                      className="form-control"
                      required
                    >
                      { formatPrice( quantity*price)} đ
                      </div>
                    <label className="ms-2">Tổng giá trị hóa đơn</label>
                  </div>
                </div>

                <div className="form-floating mb-3">
                  <select
                    className="form-select"
                    defaultValue="Thanh toán trực tiếp"
                    required
                    value={paymentMethod}
                    onChange={(e) => setpaymentMethod(e.target.value)}
                  >
                    <option value="Thanh toán trực tiếp">
                      Thanh toán trực tiếp
                    </option>
                    <option value="Chuyển khoản">Chuyển khoản</option>
                  </select>
                  <label>Phương thức thanh toán</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={receiverAddress}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <label className="ms-2">Địa điểm giao dịch</label>
                </div>
                <div className="form-floating mb-3">
                  <textarea
                    className="form-control"
                    style={{ height: 200 }}
                    defaultValue={""}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <label className="ms-3">Ghi chú</label>
                </div>
                <div className="container text-end px-5 pt-3">
                  <button type="submit" className="btn btn-warning">
                    Tạo hóa đơn
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default CreateOrder;
