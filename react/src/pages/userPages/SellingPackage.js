import { useContext, useEffect, useState } from "react";
import Footer from "../../Footer";
import Header from "../../Header";
import AuthContext from "../../context/AuthProvider";
import sellingPackageBanner from "../../assets/img/selling-package/sellingPackageBanner.png";
import { getPackagesAPI } from "../../api/packages";


const SellingPackage = () => {
  const { auth } = useContext(AuthContext);

  const [sellingPackages, setSellingPackages] = useState([]);
  const fetchPackage = async () => {
    try {
      var response = await getPackagesAPI(auth.accessToken);
      setSellingPackages(response);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    fetchPackage();
  }, []);

  const handleBuy = (userId,promotionId) =>{
    window.open(`https://fufleamarketapis.azurewebsites.net/api/VNPay/payment/${userId}/${promotionId}`);
  }


  const formatPrice = (value) => {
    if(value){
      return value.toLocaleString('vi-VN');
    }
    return value;
  };


  return (
    <div>
      <Header />
      <section className="selling-package spad">
        <div className="container bg-white py-4">
          <div className="row d-flex align-items-center">
            <div className="col-lg-6">
              <div className="fs-2 text-center fw-bold px-5 mx-3">
                Chỉ 15,000đ cho 30 ngày dùng gói cơ bản
              </div>
              <div className="text-start  px-5 mx-3 mt-2">
                Trải nghiệm gói bán hàng tiết kiệm, tiện lợi và hiệu quả cao,
                không giới hạn số tin đăng hiển thị trên FUFM
              </div>
              <div className="text-start  px-5 mx-3 mt-2">
                <li>15 lượt đăng bài</li>
              </div>
            </div>
            <div className="col-lg-6">
              <img
                className="img-fluid"
                src={sellingPackageBanner}
                alt="banner images"
              />
            </div>
          </div>
          <div className="fs-3 fw-bold   text-center px-5 mb-4">
            Chọn gói bán hàng theo nhu cầu
          </div>
          <div className="row d-flex justify-content-around">
            {sellingPackages?.map((sPackage) => (
              <div class="card col-lg-3 py-2">
                <img src={ require(`../../assets/img/selling-package/${sPackage.promotionId}.png`)} class="card-img-top" alt="..." />
                <div class="card-body">
                  <h5 class="card-title fw-bold">{sPackage.name}</h5>
                  <p class="card-text">
                    {sPackage.description}
                  </p>
                  <div className="fs-5">
                    <strong>{ formatPrice(sPackage.price)}đ</strong>
                    <span className="text-secondary">
                      {" "}/ tháng
                    </span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold my-3">
                    <div>
                      <span className="text-success">
                        <i class="fa fa-check-circle" aria-hidden="true"></i>
                      </span>{" "}
                      Lượt đăng sản phẩm
                    </div>
                    <div>{sPackage.productQuantityLimit}</div>
                  </div>
                  <button 
                  onClick={()=> handleBuy(auth.id, sPackage.promotionId)}
                  class="btn btn-dark w-100"
                  >
                    Mua ngay
                    </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4">
            <h3 className="text-center fw-bold mb-4">Câu hỏi thường gặp</h3>
            <div class="accordion" id="accordionPanelsStayOpenExample">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed fw-bold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseOne"
                    aria-expanded="true"
                    aria-controls="panelsStayOpen-collapseOne"
                  >
                    Gói bán hàng áp dụng cho tin đăng mới kể từ khi mua gói hay có thể áp dụng cho cả tin đã đăng trước đó?
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseOne"
                  class="accordion-collapse collapse"
                >
                  <div class="accordion-body">
                  Gói bán hàng được áp dụng cho cả tin đăng mới và tin bạn đã đăng trước đó, chỉ cần tin đăng này vẫn còn thời hạn hiển thị trên FUFM.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed fw-bold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseTwo"
                    aria-expanded="false"
                    aria-controls="panelsStayOpen-collapseTwo"
                  >
                   Tôi có thể mua nhiều lần gói PRO trong vòng 1 tháng hay không?
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseTwo"
                  class="accordion-collapse collapse"
                >
                  <div class="accordion-body">
                  Khách hàng có thể mua thêm Gói PRO mới (cùng loại gói hoặc khác loại gói) trong thời gian gói PRO hiện tại còn hạn sử dụng, hiệu lực của gói Pro mới mua thêm như sau:

                  <li>Cùng loại gói: Hạn sử dụng của gói mới là 30 ngày, tính từ ngày gói cũ hết hạn. Gói PRO mới sẽ có hiệu lực sau khi gói PRO hiện tại hết hạn sử dụng (30 ngày).</li>
                  <li>Khác loại gói: Hạn sử dụng của gói mới là 30 ngày, bắt đầu tính từ ngày mua gói. Tuy nhiên, gói mới chỉ được dùng khi khách hàng ĐÃ SỬ DỤNG HẾT số lượng tin đăng, đẩy tin của gói cũ.</li>
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed fw-bold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseThree"
                    aria-expanded="false"
                    aria-controls="panelsStayOpen-collapseThree"
                  >
                    Tôi có thể được hoàn tiền trong trường hợp không sử dụng hết gói PRO, hoặc đổi ý không muốn dùng tiếp không?
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseThree"
                  class="accordion-collapse collapse"
                >
                  <div class="accordion-body">
                  <li> Bạn sẽ không được hoàn tiền một khi đã thanh toán thành công gói PRO.</li>
                  <li>Và nếu hết 30 ngày và bạn chưa dùng hết số lượng tin đăng trong gói thì các tin đăng chưa dùng sẽ bị hết hiệu lực.</li>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SellingPackage;
