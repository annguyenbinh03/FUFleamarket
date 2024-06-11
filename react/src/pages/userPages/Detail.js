import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductByProductIdAPI } from "../../api/product";
import Header from "../../Header";
import Footer from "../../Footer";

function Detail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductByProductIdAPI(productId);
        setProduct(response.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return (
    <div>
         <Header />
      <section className="product-details spad">
        <div className="container bg-white py-4 d-flex">
          <div className="col-lg-8 col-md-8">
            <div className="d-flex justify-content-center">
              {product && product.images && product.images.length > 0 ? (
                <div
                  id="carouselExampleIndicators"
                  className="carousel slide w-90"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-indicators">
                    {product.images.map((image, index) => (
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
                    {product.images.map((image, index) => (
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
                <div>
                  {" "}
                  <img
                    className="carousel-inner"
                    src="https://th.bing.com/th?id=OIF.2m25a1%2fuZzRYolfaFpysYw&rs=1&pid=ImgDetMain"
                  alt="product photos"
                 />
                </div>
              )}
            </div>
            <div className="px-5 mt-2">
              <div className="product_name">
                {product ? product.productName : "Sản phẩm không tồn tại"}
              </div>
              <div className="price_wistlist d-flex justify-content-between">
                <p className="price_wistlist_left">
                  ${product ? product.price : ""}
                </p>
                <button className="btn price_wistlist_right rounded-pill">
                  Lưu tin
                  <i className="fa fa-heart-o" aria-hidden="true"></i>
                </button>
              </div>
              <div className="product_description">
                <p>
                  {product
                    ? product.description
                    : "Cửa Mình thanh lý tủ lạnh máy giặt đang sử dụng hoạt động tốt ạ tủ lạnh từ 90l đến 500l Giá tủ lạnh từ 1tr2 chở lên Máy giặt từ 1tr5 chở lên Máy giặt từ 7kg đến 15kg Bảo hành lâu dài uy tín miễn phí vận chuyển"}
                </p>
              </div>
              <div className="seller_address">
                <span className="khuvuc">Khu Vực</span>
                <div className="seller_address_flex d-flex justify-content-between">
                  <div className="seller_address_left">
                    <img
                      className="img-fluid"
                      alt="location"
                      src="https://static.chotot.com/storage/icons/logos/ad-param/location.svg"
                    />
                  </div>
                  <div className="seller_address_right">
                   {product?.seller?.addresses?.[0]?.specificAddress || "Người này chưa tiết lộ thông tin về địa chỉ"}
                  </div>
                </div>
              </div>
              <div className="report_wrapper mt-3">
                <div className="reprt_wrapper_text d-flex justify-content-between">
                  <div className="reprt_wrapper_text_left">
                    <img
                      className="img-fluid sc-bxivhb dhhSqq"
                      src="https://static.chotot.com/storage/marketplace/shield-iconx4.png"
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
                <div className="report_wrapper_button mt-3 d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-default btn-xs reportButton"
                  >
                    Báo tin không hợp lệ
                  </button>
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
                      product && product.seller
                        ? product.seller.avarta
                        : "https://cdn.chotot.com/G-1Z5ZbUlOQ2uJVjMhxxCver9aggaeYCn5ViRzXSzJY/preset:uac/plain/5880693cc1e7c23bec7c83355df078f1-731e14cfed11748e400f5a652062afa74f966b5d.jpg"
                    })`,
                  }}
                ></div>
                <div className="shopname col-lg-10 fw-bold ms-2">
                  {product && product.seller
                    ? product.seller.fullName
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
              </div>
              <div className="show_phone_button  d-flex justify-content-between align-items-center p-3 mt-5">
                <span>
                  <img
                    alt="loadingIcon"
                    className="show_phone_button_icon"
                    src="https://static.chotot.com/storage/chotot-icons/svg/white-phone.svg"
                  />
                  {product && product.seller ? product.seller.phoneNumber : "096595 ***"}
                </span>
                <span>BẤM ĐỂ HIỆN SỐ</span>
              </div>
            </div>

            <button className="chat_button w-100 d-flex justify-content-between align-items-center px-3 mt-2">
              <span>
                <i className="fa fa-comments-o" aria-hidden="true"></i>
              </span>
              <span>CHAT VỚI NGƯỜI BÁN</span>
            </button>

            <button className="chat_button  w-100  px-3 mt-2">
              <Link className="d-flex justify-content-between align-items-center" to={`/create-order/${productId}`}>
                <span>
                  <i className="fa fa-plus-square" aria-hidden="true"></i>
                </span>
                <span >TẠO HÓA ĐƠN</span>
              </Link>
            </button>

            <div className="safe_tip mt-5">
              <img
                alt="safe tips"
                className="pull-left"
                width="100"
                height="auto"
                src="https://st.chotot.com/storage/images/tips/2_other_cate.png"
              />
              <div className="safe_tip_text">
                <p className="pt-3" style={{ fontSize: "13px" }}>
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
      <Footer/>
    </div>
  );
}

export default Detail;
