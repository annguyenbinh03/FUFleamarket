import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getProductAPI, getProductByCategoryAPI, getSearchProductAPI } from "../../api/product";
import ProductList from "../../component/ProductList";
import Header from "../../Header";
import Footer from "../../Footer";

function SearchProduct() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const productName = queryParams.get('ProductName');
  const { CategoryId  } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const firstFetchData = async () => {
    try {
      setLoading(true);
      if(productName){
        const productsData = await getSearchProductAPI(productName);
           setProducts(productsData);
      }else{
        if (CategoryId) {
          const productsData = await getProductByCategoryAPI(CategoryId);
          setProducts(productsData);
        } 
        else {
          const productsData = await getProductAPI();
          setProducts(productsData);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    firstFetchData();
  }, [CategoryId, productName]);

  return (
    <div>
      <Header/>
      <section className="product spad">
        <div className="container pt-3 pb-3 bg-white">
          <div className="row">
            <div className="col-12">
              <div className="filter-item mb-4">
                <div className="row d-flex justify-content-between align-items-center">
                  <div className="col-lg-4 col-md-4">
                    <div className="filter-found ps-5">
                      <h6>
                        <span>{products?.length}</span> Sản phẩm được tìm thấy
                      </h6>
                    </div>
                  </div>
                  <div className="col-lg-8 col-md-8 d-flex justify-content-end">
                    <div className="filter-sort d-flex me-4">
                      <span className="me-2">Sắp xếp theo</span>
                      <select className="form-select form-select-sm">
                        <option value="0">Mới nhất</option>
                        <option value="0">Cũ nhất</option>
                        <option value="1">Giá từ thấp đến cao</option>
                        <option value="2">Giá từ cao xuống thấp</option>
                      </select>
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
             
              
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default SearchProduct;
