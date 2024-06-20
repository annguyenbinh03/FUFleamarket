import { useContext, useEffect, useState } from "react";
import Footer from "../../Footer";
import Header from "../../Header";
import AuthContext from "../../context/AuthProvider";
import sellingPackageBanner from "../../assets/img/selling-package/sellingPackageBanner.png";
import { getPackagesAPI } from "../../api/packages";

const SellingPackage = () => {

  const {auth} = useContext(AuthContext);

  const [packages, setPackages] = useState([]);
  const fetchPackage = async () => {
    try {
      var response = await getPackagesAPI(auth.accessToken);
      setPackages(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    fetchPackage();
  }, []);

  return (
    <div>
      <Header />
      <section className="selling-package spad">
        <div className="container bg-white py-4">
          <div className="row d-flex align-items-center">
            <div className="col-lg-6">
              <div className="fs-2 text-center fw-bold px-5 mx-3">
                Chỉ 10,000đ cho 30 ngày dùng gói cơ bản  
              </div>
              <div className="text-start  px-5 mx-3 mt-2">
                Trải nghiệm gói bán hàng tiết kiệm, tiện lợi và hiệu quả cao,
                không giới hạn số tin đăng hiển thị trên FUFM
              </div>
              <div className="text-start  px-5 mx-3 mt-2">
                <li>10 lượt đăng bài</li>
              </div>
            </div>
            <div className="col-lg-6">
              <img className="img-fluid" src={sellingPackageBanner} alt="banner images"/>
            </div>
          </div>
          <div className="fs-3 fw-bold   text-center px-5 mb-4">
            Chọn gói bán hàng theo nhu cầu
          </div>
          <div className="row d-flex justify-content-between px-5 mx-5">
            <div class="card col-lg-3">
              <img src="..." class="card-img-top" alt="..." />
              <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <button class="btn btn-primary">Go somewhere</button>
              </div>
            </div>

            <div class="card col-lg-3">
              <img src="..." class="card-img-top" alt="..." />
              <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <button class="btn btn-primary">Go somewhere</button>
              </div>
            </div>

            <div class="card col-lg-3">
              <img src="..." class="card-img-top" alt="..." />
              <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <button class="btn btn-primary">Go somewhere</button>
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
