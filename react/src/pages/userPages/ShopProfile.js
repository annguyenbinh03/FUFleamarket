import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../Footer";
import Header from "../../Header";
import { getShopProfileAPI } from "../../api/user";
import { Link as LinkRouter } from "react-router-dom";

function ShopProfile() {
  const { userId } = useParams();

  const [userInfo, setUserInfo] = useState();
  const [products, setProducts] = useState();

  const fetchShopInfo = async () => {
    try {
      const response = await getShopProfileAPI(userId);
      setProducts(response.products);
      setUserInfo(response.user);
      console.log(userInfo);
      console.log(products);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchShopInfo();
    }
  }, [userId]);

  const formatPrice = (value) => {
    return value.toLocaleString("vi-VN");
  };

  function removeTimeFromISOString(isoString) {
    if(isoString){
      var index = -1;
      index = isoString.indexOf("T");
      if (index !== -1) {
        return isoString.slice(0, index);
      }
    }
    return isoString;
  }

  return (
    <div>
      <Header />
      <section className="shopProfile spad">
        <div className="container py-4 d-flex">
          <div
            className="col-lg-4 mx-1 bg-white p-3"
            style={{ fontSize: "1.1em" }}
          >
            <div className="text-center">
              <img
                className="img-fluid w-75 rounded-5 p-1"
                src={
                  userInfo?.avarta ||
                  "https://i.pinimg.com/originals/d9/b8/3a/d9b83aa1a08be3e46ebb47254db8cf75.jpg"
                }
                alt="shop avarta"
              />
            </div>
            <div className="fs-5 fw-bold mt-3">{userInfo?.fullName}</div>
            <div>
              {" "}
              {userInfo?.sellRating !== 0
                ? userInfo?.sellRating
                : "Chưa có đánh giá"}{" "}
            </div>
            <button className="btn text-white fw-bold btn-danger my-2 w-100">
              <i class="fa fa-comments-o" aria-hidden="true"></i> Chat ngay
            </button>
            <div className="mb-2">
              <span className="text-body-secondary">
                <i
                  class="fa fa-info-circle"
                  style={{ minWidth: "20px" }}
                  aria-hidden="true"
                ></i>{" "}
                Giới thiệu:{" "}
              </span>
              {(userInfo?.introduction) || " "}
            </div>
            <div className="mb-1">
              <span className="text-body-secondary">
                <i
                  class="fa fa-calendar-check-o "
                  style={{ minWidth: "20px" }}
                  aria-hidden="true"
                ></i>{" "}
                Đã tham gia:{" "}
              </span>
              {removeTimeFromISOString(userInfo?.createdDate) || " "}
            </div>
            <div className="mb-1">
              <span className="text-body-secondary">
                <i
                  class="fa fa-phone-square"
                  style={{ minWidth: "20px" }}
                  aria-hidden="true"
                ></i>{" "}
                Số điện thoại:{" "}
              </span>
              {userInfo?.phoneNumber || "Người dùng này chưa cài số điện thoại"}
            </div>
            <div className="mb-1">
              <span className="text-body-secondary">
                <i
                  class="fa fa-map-marker"
                  style={{ minWidth: "20px" }}
                  aria-hidden="true"
                ></i>{" "}
                Địa chỉ:
              </span>{" "}
              {userInfo?.addresses?.[0]?.specificAddress ||
                "Người dùng này chưa cài địa chỉ"}
            </div>
          </div>
          <div className="col-lg-8 mx-1 bg-white p-3 rounded">
            <div className="text-center text-danger fs-5 fw-bold border-bottom border-danger bg-opacity-10  border-3 mb-2">
              Đang bán
            </div>
            <div className="d-flex">
              {products?.map((product) => (
                <div
                  className="col-lg-4 col-md-4 col-sm-6"
                  key={product.productId}
                >
                  <div className="featured__item">
                    <div
                      className="featured__item__pic set-bg"
                      style={{
                        backgroundImage: `url(${
                          product?.imageLink ||
                          "https://i.pinimg.com/originals/d9/b8/3a/d9b83aa1a08be3e46ebb47254db8cf75.jpg"
                        })`,
                      }}
                    >
                      <ul className="featured__item__pic__hover">
                        <li>
                          <LinkRouter to={`/detail/${product.productId}`}>
                            <i className="fa fa-heart"></i>
                          </LinkRouter>
                        </li>
                        <li>
                          <LinkRouter to={`/detail/${product.productId}`}>
                            <i className="fa fa-search"></i>
                          </LinkRouter>
                        </li>
                      </ul>
                    </div>
                    <div className="featured__item__text">
                      <h6>
                        <LinkRouter
                          className="featured__item_product_name"
                          to={`/detail/${product.productId}`}
                        >
                          {product.productName}
                        </LinkRouter>
                      </h6>
                      <h5>{formatPrice(product.price)} vnd</h5>
                      <div className="featured__item__text__footer">
                        <div>
                          <img
                            height="16"
                            width="16"
                            src="https://static.chotot.com/storage/chotot-icons/svg/user.svg"
                            alt="shopicon"
                          />
                        </div>
                        <div>
                          <span>{product.createdDate}</span>
                        </div>
                        <div>   -  </div>
                        <div>
                          <span>Tp Hồ Chí Minh</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default ShopProfile;
