import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { approveProductAPI, rejectProductAPI, getProductAPI } from "../api/product";
import { getCategoryAPI } from "../api/category";
import CategoryList from "../component/CategoryList";

function AdminProcessRequest() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProductAPI();
        setProducts(productsData);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategoryAPI();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleApproveProduct = async (productId) => {
    try {
      await approveProductAPI(productId);
      const updatedProducts = products.map((product) =>
        product.productId === productId ? { ...product, status: "Approved" } : product
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Lỗi khi duyệt sản phẩm:", error);
    }
  };

  const handleRejectProduct = async (productId) => {
    try {
      await rejectProductAPI(productId);
      const updatedProducts = products.filter((product) => product.productId !== productId);
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Lỗi khi loại bỏ sản phẩm:", error);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((category) => category.categoryId === categoryId);
    return category ? category.name : "Unknown";
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categoryId === selectedCategory)
    : products;

  return (
    <div className="container-scroller">
      <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        {/* Phần code của navbar */}
      </nav>

      <div className="container-fluid page-body-wrapper">
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
          <CategoryList onCategorySelect={setSelectedCategory} />
        </nav>

        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Sản phẩm đang chờ duyệt</h4>
                    <p className="card-description">
                      Danh mục các sản phẩm <code>đang chờ duyệt</code>
                    </p>
                    <table className="table text-center table-bordered">
                      <thead>
                        <tr>
                          <th>Người bán</th>
                          <th>Tên Người Bán</th>
                          <th>Tên sản phẩm</th>
                          <th>Tình trạng</th>
                          <th>Giá</th>
                          <th>Mô tả</th>
                          <th>Loại sản phẩm</th>
                          <th>Xem ảnh</th>
                          <th>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr key={product.productId}>
                            <td>Sóp bi</td>
                            <td>Sống cho có</td>
                            <td>{product.productName}</td>
                            <td>{product.status}</td>
                            <td>{product.price}</td>
                            <td>{product.description}</td>
                            <td>{getCategoryName(product.categoryId)}</td>
                            <td>
                              <Link to={`/product/${product.productId}/image`}>Xem ảnh</Link>
                            </td>
                            <td>
                              <button
                                className="btn btn-success"
                                onClick={() => handleApproveProduct(product.productId)}
                              >
                                Duyệt
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleRejectProduct(product.productId)}
                              >
                                Loại bỏ
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="footer">
            {/* Nội dung footer */}
          </footer>
        </div>
      </div>
    </div>
  );
}

export default AdminProcessRequest;
