// src/pages/SearchProduct.js

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductAPI, getProductByCategoryAPI } from "../api/product";
import Loading from "../component/Loading";
import ProductList from "../component/ProductList";

function SearchProduct() {
  const { categoryIdParam } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    firstFetchData();
  }, [categoryIdParam]);


  return (
    <section className="product spad">
      <div className="container py-5 bg-white">
        <div className="row">
          <div className="col-12">
            <div className="filter__item mb-4">
              <div className="row d-flex justify-content-between align-items-center">
                <div className="col-lg-4 col-md-4">
                  <div className="filter__found">
                    <h6>
                      <span>{products?.length}</span> Sản phẩm được tìm thấy
                    </h6>
                  </div>
                </div>
                <div className="col-lg-8 col-md-8 d-flex justify-content-end">
                  <div className="filter__sort me-3">
                    <span className="me-2">Sắp xếp theo</span>
                    <select className="form-select form-select-sm">
                      <option value="0">Giá từ thấp đến cao</option>
                      <option value="1">Giá từ cao xuống thấp</option>
                    </select>
                  </div>
                  <div className="filter__option">
                    <span>
                      <i className="fa fa-th-large" aria-hidden="true"></i>
                      <i className="fa fa-th-list" aria-hidden="true"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <ProductList products={products} />

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
  );
}

export default SearchProduct;
