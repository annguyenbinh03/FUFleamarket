import FeaturedProducts from "../../component/FeaturedProducts";
import Header from "../../Header";
import Footer from "../../Footer";
function Home() {
  return (      
    <div>
       <Header />
      <section className="hero">
        <div className="container bg-white pt-3">
          <div
            id="carouselExampleIndicators"
            className="carousel slide w-100"
            data-bs-ride="carousel"
          >
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="0"
                className="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="1"
                aria-label="Slide 2"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="2"
                aria-label="Slide 3"
              ></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="assets/img/hero/b1.jpg"
                  className="d-block w-100"
                  alt="..."
                />
              </div>
              <div className="carousel-item">
                <img
                  src="assets/img/hero/b2.jpg"
                  className="d-block w-100"
                  alt="..."
                />
              </div>
              <div className="carousel-item">
                <img
                  src="assets/img/hero/b3.png"
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
        </div>
      </section>

      <section className="categories mt-3">
        <div className="container bg-white pt-3">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Khám phá danh mục</h2>
              </div>
            </div>
            <div className="categories_slider d-flex justify-content-between">
              <div className="categories_item">
                <a href="aaa">
                  <div className="image-container">
                    <img
                      className="img-fluid"
                      src="assets/img/categories/dodientu.jpg"
                      alt="anhdodientu"
                    />
                  </div>
                  <h5 className="pt-2">Đồ điện tử</h5>
                </a>
              </div>
              <div className="categories_item">
                <a href="aaa">
                  <div className="image-container">
                    <img
                      className="img-fluid"
                      src="assets/img/categories/dodunghoctap.jpg"
                      alt="anhdodientu"
                    />
                  </div>
                  <h5 className="pt-2">Đồ dùng học tập</h5>
                </a>
              </div>
              <div className="categories_item">
                <a href="aaa">
                  <div className="image-container">
                    <img
                      className="img-fluid"
                      src="assets/img/categories/dienlanh.jpg"
                      alt="anhdodientu"
                    />
                  </div>
                  <h5 className="pt-2">Điện lạnh</h5>
                </a>
              </div>
              <div className="categories_item">
                <a href="aaa">
                  <div className="image-container">
                    <img
                      className="img-fluid"
                      src="assets/img/categories/donoithat.jpg"
                      alt="anhdodientu"
                    />
                  </div>
                  <h5 className="pt-2">Đồ gia dụng, nội thất</h5>
                </a>
              </div>
              <div className="categories_item">
                <a href="aaa">
                  <div className="image-container">
                    <img
                      className="img-fluid"
                      src="assets/img/categories/thucpham.jpg"
                      alt="anhdodientu"
                    />
                  </div>
                  <h5 className="pt-2">Đồ ăn, thực phẩm</h5>
                </a>
              </div>

              <div className="categories_item">
                <a href="aaa">
                  <div className="image-container">
                    <img
                      className="img-fluid"
                      src="assets/img/categories/thoitrang.jpg"
                      alt="anhdodientu"
                    />
                  </div>
                  <h5 className="pt-2">Thời trang</h5>
                </a>
              </div>
              <div className="categories_item">
                <a href="aaa">
                  <div className="image-container">
                    <img
                      className="img-fluid"
                      src="assets/img/categories/giaitri.jpg"
                      alt="anhdodientu"
                    />
                  </div>
                  <h5 className="pt-2">Giải trí, thể thao, sở thích</h5>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featured spad">
        <div className="container bg-white px-2">
          <div className="row">
            <div className="col-lg-12 pt-3">
              <div className="section-title">
                <h2>Sản phẩm nổi bật</h2>
              </div>
            </div>
          </div>
          <FeaturedProducts />
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default Home;
