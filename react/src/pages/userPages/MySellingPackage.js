import { useContext, useEffect, useState } from "react";
import Footer from "../../Footer";
import Header from "../../Header";
import AuthContext from "../../context/AuthProvider";
import { getMyPackageAPI } from "../../api/packages";
import { Link } from "react-router-dom";
const MySellingPackage = () => {
  const { auth } = useContext(AuthContext);

  const [sellingPackages, setSellingPackages] = useState([]);
  const fetchMyPackage = async () => {
    try {
      var response = await getMyPackageAPI(auth.accessToken);
      setSellingPackages(response);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    fetchMyPackage();
  }, []);

  const formatPrice = (value) => {
    return value.toLocaleString("vi-VN");
  };

  function removeTimeFromISOString(isoString) {
    const index = isoString.indexOf("T");
    if (index !== -1) {
      return isoString.slice(0, index);
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
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li class="breadcrumb-item">
                  <Link to="/my-posts">Quản lý tin</Link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
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
              <div class="card col-lg-4 py-2">
                <img
                  src={require(`../../assets/img/selling-package/${sPackage.promotion.promotionId}.png`)}
                  class="card-img-top"
                  alt="..."
                />
                <div class="card-body">
                  <h5 class="card-title fw-bold">{sPackage.promotion.name}</h5>
                  <p class="card-text" style={{ minHeight: "80px" }}>
                    {sPackage.promotion.description}
                  </p>
                  <span class="badge text-bg-success">Đang hoạt động</span>
                  <div className="fs-5">
                    <span className=""> Còn lại {sPackage.period} ngày</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold my-3">
                    <div>
                      <span className="text-success">
                        <i class="fa fa-check-circle" aria-hidden="true"></i>
                      </span>{" "}
                      Lượt đăng sản phẩm
                    </div>
                    <div>{sPackage.productQuantity}</div>
                  </div>
                  <div className="d-flex justify-content-start fw-bold my-3">
                    <div>
                      <span className="text-success">
                        <i class="fa fa-check-circle" aria-hidden="true"></i>
                      </span>{" "}
                      Duyệt tin nhanh dưới 5 phút
                    </div>
                  </div>
                  <div className="d-flex justify-content-between fw-bold my-3">
                    <div>
                      <span className="text-success">
                        <i class="fa fa-check-circle" aria-hidden="true"></i>
                      </span>{" "}
                      Ngày hết hạn
                    </div>
                    <div>{removeTimeFromISOString(sPackage.endDate)}</div>
                  </div>
                  <button
                    // onClick={() => handleBuy(auth.id, sPackage.promotionId)}
                    class="btn btn-dark w-100"
                  >
                    Gia hạn
                  </button>
                  <div class="accordion  mt-2">
                    <div class="accordion-item">
                      <h2 class="accordion-header">
                        <button
                          class="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          Thông tin giao dịch
                        </button>
                      </h2>
                      <div
                        id="collapseOne"
                        class="accordion-collapse collapse"
                        data-bs-parent="#accordionExample"
                      >
                        <div class="accordion-body">
                        <div>
                            <strong>Ngày mua gói: </strong>
                            <span>{removeTimeFromISOString(sPackage.startDate)}</span>
                          </div>
                          <div>
                            <strong>Phương thức thanh toán: </strong>
                            <span>{sPackage.paymentMethod}</span>
                          </div>
                          <div>
                            <strong>Mã giao dịch: </strong>
                            <span>{sPackage.transactionCode}</span>
                          </div>
                          <div>
                            <strong>Giá: </strong>
                            <span>{formatPrice(sPackage.price)} đ</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {sellingPackages ? (
              <div></div>
            ) : (
                <div className="d-flex flex-column justify-content-center align-items-center" style={{height:"500px"}}>
                    <div className="fs-3 fw-bold mb-3">Bạn chưa sở hữu bất kì gói bàn hàng nào</div>
                    <Link className="btn btn-primary" to="/selling-package">Mua gói bán hàng ngay </Link>
                </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MySellingPackage;
