import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { getCategoryAPI } from "../api/category";
import { getProductAPI, getProductByCategoryAPI } from "../api/product";

function SearchProduct() {
  const { categoryIdParam } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Lưu trữ danh mục sản phẩm

  useEffect( () => {
    firstFetchData();
  });

  const firstFetchData = async () => {
    setCategories(await getCategoryAPI());
    if(categoryIdParam != null){
      setProducts(await getProductByCategoryAPI(categoryIdParam));     
    }else{
      setProducts(await getProductAPI());
    }  
  };

  const fetchData = async (categoryId) => {
    setCategories(await getCategoryAPI());
      if (categoryId != null) {
        setProducts(await getProductByCategoryAPI(categoryId));
      } else {
        setProducts(await getProductAPI());
      }
  };

  const getProductByCategory = (categoryId) => {
    fetchData(categoryId);
  };

  return (
    <section className="product spad">
      <div className="container py-5 bg-white">
        <div className="row">
          <div className="col-lg-3 col-md-5">
            <div className="sidebar px-2">
              <div className="sidebar__item">
                <h4>Danh mục sản phẩm</h4>
                <ul>
                  <li>
                    <a onClick={() => fetchData()}>Tất cả</a>
                  </li>
                  {categories?.map((category, key) => (
                    <li
                      key={key}
                      onClick={() => getProductByCategory(category.categoryId)}
                    >
                      <a>{category.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="sidebar__item">
                <h4>Giá</h4>
                <div className="price-range">
                  <input type="number" id="minamount" placeholder="Tối thiểu" />
                  <div className="dash">-</div>
                  <input type="number" id="maxamount" placeholder="Tối đa" />
                  <button className="btn-search">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-9 col-md-7">
            <div className="filter__item">
              <div className="row d-flex justify-content-between">
                <div className="col-lg-4 col-md-4">
                  <div className="filter__found">
                    <h6>
                      <span>{products.length}</span> Sản phẩm được tìm thấy
                    </h6>
                  </div>
                </div>
                <div className="col-lg-8 col-md-8 d-flex justify-content-between">
                  <div className="col-lg-10 col-md-10">
                    <div className="filter__sort d-flex justify-content-center">
                      <span className="me-3">Sắp xếp theo</span>
                      <select className="form-select form-select-sm">
                        <option value="0">Giá từ thấp đến cao</option>
                        <option value="0">Giá từ cao xuống thấp</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-2">
                    <div className="filter__option text-center">
                      <span>
                        <i className="fa fa-th-large" aria-hidden="true"></i>
                        <i className="fa fa-th-list" aria-hidden="true"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row featured__filter">
              {products?.map((product) => (
                <div
                  className="col-lg-3 col-md-4 col-sm-6"
                  key={product.productId}
                >
                  <div className="featured__item">
                    <div
                      className="featured__item__pic set-bg"
                      style={{
                        backgroundImage: `url(https://th.bing.com/th?id=OIF.2m25a1%2fuZzRYolfaFpysYw&rs=1&pid=ImgDetMain)`,
                      }}
                    >
                      <ul className="featured__item__pic__hover">
                        <li>
                          <Link to={`/detail/${product.productId}`}>
                            <i className="fa fa-heart"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to={`/detail/${product.productId}`}>
                            <i className="fa fa-shopping-cart"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="featured__item__text">
                      <h6>
                        <Link to={`/detail/${product.productId}`}>
                          {product.productName}
                        </Link>
                      </h6>
                      <h5>${product.price.toFixed(2)}</h5>
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
                          <span>15 giờ trước{product.createdAt}</span>
                        </div>
                        <div>   -  </div>
                        <div>
                          <span>Tp Hồ Chí Minh{product.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div cclassName="product__pagination">
              <Link to="/search-product">1</Link>
              <Link to="/search-product">2</Link>
              <Link to="/search-product">3</Link>
              <Link to="/search-product">
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
