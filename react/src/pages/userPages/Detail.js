import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductByProductIdAPI } from "../../api/product";
import Header from "../../Header";
import Footer from "../../Footer";
import AuthContext from "../../context/AuthProvider";

function Detail() {
  const { productId } = useParams();
  const [data, setData] = useState(null);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductByProductIdAPI(productId);
        setData(response);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId) {
      fetchProduct();
    }
    const body = document.querySelector("#root");
    body.scrollIntoView(
      {
        behavior: "smooth",
      },
      500
    );
  }, [productId]);

  const formatPrice = (value) => {
    return value.toLocaleString("vi-VN");
  };

  return (
    <div>
      <Header />
      <section className="product-details spad">
        <div className="container bg-white py-4 d-flex">
          <div className="col-md-8 pb-5">
            <div className="d-flex justify-content-center">
              {data &&
              data?.product?.images &&
              data?.product?.images.length > 0 ? (
                <div
                  id="carouselExampleIndicators"
                  className="carousel slide w-90"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-indicators">
                    {data.product.images.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to={index}
                        className={index === 0 ? "active" : ""}
                        aria-label={`Slide ${index + 1}`}
                      ></button>
                    ))}
                  </div>
                  <div className="carousel-inner">
                    {data.product.images.map((image, index) => (
                      <div
                        key={index}
                        className={`carousel-item ${
                          index === 0 ? "active" : ""
                        }`}
                      >
                        <img
                          src={image}
                          className="d-block w-100"
                          alt="Product name"
                        />
                      </div>
                    ))}
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
                    ></span>
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
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  {" "}
                  <img
                    className="carousel-inner"
                    style={{ maxWidth: "75%" }}
                    src={data?.product?.productImages}
                    alt="product photos"
                  />
                </div>
              )}
            </div>
            <div className="px-5 mt-2">
              <div className="product_name d-flex justify-content-start align-items-center">
                {data?.product?.dealType ? (
                  <span className="badge rounded-pill text-bg-info text-white py-1">
                    <i
                      className="fa fa-exchange py-1 me-2"
                      aria-hidden="true"
                    ></i>
                    Trao đổi
                  </span>
                ) : (
                  <span className="badge rounded-pill text-bg-primary py-1">
                    <i
                      className="fa fa-credit-card py-1 me-2"
                      aria-hidden="true"
                    ></i>
                    Buôn bán
                  </span>
                )}

                <div className="ms-2" style={{ fontSize: "24px" }}>
                  {data?.product
                    ? data?.product?.productName
                    : "Sản phẩm không tồn tại"}
                </div>
              </div>
              <div className="price_wistlist d-flex justify-content-between mb-2">
                <p className="price_wistlist_left fs-5">
                  {data?.product ? formatPrice(data?.product?.price) : ""} đ
                </p>
                <button className="btn price_wistlist_right rounded-pill">
                  Lưu tin
                  <i className="fa fa-heart-o" aria-hidden="true"></i>
                </button>
              </div>
              <div className="product_description">
                <p>
                  {data?.product?.description
                    ? data.product.description
                    : "Sản phẩm không có mô tả"}
                </p>
              </div>
              <div className="seller_address">
                <span className="khuvuc">Khu Vực</span>
                <div className="seller_address_flex d-flex justify-content-between">
                  <div className="seller_address_left">
                    <img
                      width="25px"
                      className="img-fluid"
                      alt="location"
                      src={`../assets/img/icon/map.png`}
                    />
                  </div>
                  <div className="seller_address_right ps-1">
                    {data?.Contact ? (
                      <div>
                        {data?.address ||
                          "Người này chưa tiết lộ thông tin về địa chỉ"}
                      </div>
                    ) : (
                      <span> Hãy giao dịch để liên hệ </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="report_wrapper mt-3">
                <div className="reprt_wrapper_text d-flex justify-content-between">
                  <div className="reprt_wrapper_text_left">
                    <img
                      width="25px"
                      className="img-fluid sc-bxivhb dhhSqq"
                      src={`../assets/img/icon/shield.png`}
                      alt="mua bán an toàn"
                    />
                  </div>
                  <div className="reprt_wrapper_text_right">
                    Tin đăng này đã được kiểm duyệt. Nếu gặp vấn đề, vui lòng
                    báo cáo tin đăng hoặc liên hệ CSKH để được trợ giúp.
                    <a
                      target=""
                      rel="noopener"
                      href="http://trogiup.chotot.com/ban-hang-tai-chotot-vn/kiem-duyet-tin/tai-sao-chotot-vn-duyet-tin-truoc-khi-dang/?utm_source=chotot&utm_medium=user_protection&utm_campaign=user_protection_ad_view&_gl=1*14e8mao*_ga*MjQyNTUxNzAzLjE3MTU4Njk2NDg.*_ga_XQVN5K27XX*MTcxNzA3NjM5OC4yNi4xLjE3MTcwNzY0NzUuNTYuMC4w&_ga=2.244153987.769978206.1716909043-242551703.1715869648"
                    >
                      Xem thêm ››
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 px-4">
            <div className="shopview">
              <div className="d-flex justify-content-center">
                <div
                  className="shop_avartar col-lg-2"
                  style={{
                    backgroundImage: `url(${
                      data?.product && data?.product?.seller
                        ? data?.product?.seller?.avarta
                        : "https://cdn.chotot.com/G-1Z5ZbUlOQ2uJVjMhxxCver9aggaeYCn5ViRzXSzJY/preset:uac/plain/5880693cc1e7c23bec7c83355df078f1-731e14cfed11748e400f5a652062afa74f966b5d.jpg"
                    })`,
                  }}
                ></div>
                <div
                  style={{ textDecoration: "none" }}
                  className="shopname col-md-7 fw-bold ms-2 text-black"
                >
                  {data?.product && data?.product?.seller
                    ? data?.product?.seller?.fullName
                    : "Shop của best yasuo viet nam"}
                  <div className="product__details__rating">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star-half-o"></i>
                    <span>(18 reviews)</span>
                  </div>
                </div>
                <div className="col-md-3 col-lg-3 my-auto">
                  <Link
                    to={`/shopprofile/${data?.sellerId}`}
                    className="badge text-bg-dark px-2 py-2"
                    style={{ textDecoration: "none" }}
                  >
                    <span>Xem trang</span>
                  </Link>
                </div>
              </div>
            </div>

            {auth?.id === data?.sellerId ? (
              <></>
            ) : (
              <>
                {data?.Contact ? (
                  <div className="show_phone_button  d-flex justify-content-between align-items-center p-3 mt-5">
                    <span>
                      <img
                        alt="loadingIcon"
                        className="show_phone_button_icon"
                        src="https://static.chotot.com/storage/chotot-icons/svg/white-phone.svg"
                      />
                    </span>
                    <span>
                      {data?.product && data?.product.seller
                        ? data?.product.seller.phoneNumber
                        : "096595 ***"}
                    </span>
                  </div>
                ) : (
                  <div className="show_phone_button bg-secondary text-white d-flex justify-content-between align-items-center p-3 mt-5">
                    <span>
                      <img
                        alt="loadingIcon"
                        className="show_phone_button_icon"
                        src="https://static.chotot.com/storage/chotot-icons/svg/white-phone.svg"
                      />
                    </span>
                    <span>
                      <span>Hãy giao dịch để liên hệ</span>
                    </span>
                  </div>
                )}

                {data?.contact ? (
                  <button className="chat_button w-100  px-3 mt-2">
                    <Link
                      className="d-flex justify-content-between align-items-center"
                      to={`/chat`}
                      state={{
                        receiverId: data?.sellerId,
                        receiverName: data?.product?.seller.fullName,
                      }}
                    >
                      <span>
                        <i className="fa fa-comments-o" aria-hidden="true"></i>
                      </span>
                      <span>CHAT VỚI NGƯỜI BÁN</span>
                    </Link>
                  </button>
                ) : (
                  <div className="chat_button bg-secondary text-white border-0 w-100 px-3 mt-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        <i className="fa fa-comments-o" aria-hidden="true"></i>
                      </span>
                      <span>Hãy giao dịch để liên hệ</span>
                    </div>
                  </div>
                )}

                {data?.product?.dealType ? (
                  <button className="chat_button  w-100  px-3 mt-2">
                    <Link
                      className="d-flex justify-content-between align-items-center"
                      to={`/create-trading-order/${productId}`}
                    >
                      <span>
                        <i class="fa fa-exchange" aria-hidden="true"></i>
                      </span>
                      <span>TẠO HÓA ĐƠN TRAO ĐỔI</span>
                    </Link>
                  </button>
                ) : (
                  <button className="chat_button  w-100  px-3 mt-2">
                    <Link
                      className="d-flex justify-content-between align-items-center"
                      to={`/create-order/${productId}`}
                    >
                      <span>
                        <i className="fa fa-plus-square" aria-hidden="true"></i>
                      </span>
                      <span>TẠO HÓA ĐƠN MUA</span>
                    </Link>
                  </button>
                )}
              </>
            )}

            <div className="safe_tip mt-5">
              <img
                alt="safe tips"
                className="pull-left"
                width="80"
                height="auto"
                src={`../assets/img/icon/communication.png`}
              />
              <div className="safe_tip_text">
                <p className="pt-2" style={{ fontSize: "13px" }}>
                  NÊN gặp mặt trực tiếp kiểm tra hàng trước khi giao dịch.
                </p>
                <a
                  href="https://www.youtube.com/watch?v=4oStw0r33so"
                  target="blank"
                  rel="nofollow"
                >
                  Tìm hiểu thêm »
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Detail;
