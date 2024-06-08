import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductAPI, getProductByCategoryAPI } from "../../api/product";
import Loading from "../../component/Loading";
import ProductList from "../../component/ProductList";
import Header from "../../Header";
import Footer from "../../Footer";

function SearchProduct() {
  const { categoryIdParam } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const firstFetchData = async () => {
    try {
      setLoading(true);
      if (categoryIdParam) {
        const productsData = await getProductByCategoryAPI(categoryIdParam);
        setProducts(productsData);
      } else {
        const productsData = await getProductAPI();
        setProducts(productsData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    firstFetchData();
  }, [categoryIdParam]);

  return (
    <div>
      <Header/>
      <section className="product spad">
        <div className="container py-5 bg-white">
          <div className="row">
            <div className="col-12">
              <div className="filter__item mb-4">
                <div className="row d-flex justify-content-between align-items-center">
                  <div className="col-lg-4 col-md-4">
                    <div className="filter__found ps-5">
                      <h6>
                        <span>{products?.length}</span> Sản phẩm được tìm thấy
                      </h6>
                    </div>
                  </div>
                  <div className="col-lg-8 col-md-8 d-flex justify-content-end">
                    <div className="filter__sort d-flex me-3">
                      <span className="me-2">Sắp xếp theo</span>
                      <select className="form-select form-select-sm">
                        <option value="0">Mới nhất</option>
                        <option value="1">Giá từ thấp đến cao</option>
                        <option value="2">Giá từ cao xuống thấp</option>
                      </select>
                    </div>
                    <div className="filter__option">
                      <span>
                        <i className="fa fa-th-large px-2" aria-hidden="true"></i>
                        <i className="fa fa-th-list px-2" aria-hidden="true"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {products?.length !== 0 ? (
                  <div>
                     <ProductList products={products} />
                  </div>
              ) : (
                  <div className="not-found-text fs-3">
                     Không tìm thấy sản phẩm nào phù hợp                               
                  </div>
              )}
             
              <div className="product__pagination d-flex justify-content-center">
                <Link to="/search-product/1">1</Link>
                <Link to="/search-product/2">2</Link>
                <Link to="/search-product/3">3</Link>
                <Link to="/search-product/4">
                  <i className="fa fa-long-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default SearchProduct;
