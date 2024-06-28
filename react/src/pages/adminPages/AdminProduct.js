import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  acceptCreateProductRequestAPI,
  getAdminProductS123API,
  rejectCreateProductRequestAPI,
} from "../../api/product";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AuthContext from "../../context/AuthProvider";

function AdminProduct() {
  const [products, setProducts] = useState([]);
  const { auth } = useContext(AuthContext);
  const [status, setStatus] = useState(null);

  const fetchData = async () => {
    try {
      const productsData = await getAdminProductS123API(
        auth.accessToken,
        status
      );
      setProducts(productsData);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveProduct = async (productId) => {
    try {
      await acceptCreateProductRequestAPI(auth.accessToken, productId);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi duyệt sản phẩm:", error);
    }
  };

  const handleRejectProduct = async (productId) => {
    try {
      await rejectCreateProductRequestAPI(auth.accessToken, productId);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi loại bỏ sản phẩm:", error);
    }
  };

  return (
    <div className="admin_page">
      <nav className="navbar">
        <AdminHeader />
      </nav>
      <div className="admin_main container-fluid d-flex justify-content-center p-0 pt-3 mt-5">
        <nav className="w-13 p-0 bg-white">
          <div className="col-lg-12 ">
            <AdminSidebar />
          </div>
        </nav>
        <div className="main-content w-87 pt-3 px-4">
          <h4 className="card-title">Sản phẩm</h4>
          <p className="">Danh mục tất các sản phẩm </p>
          <table className="product-table table text-center table-bordered mb-4">
            <thead className="bg-secondary">
              <tr>
                <th>Người bán</th>
                <th>Tên sản phẩm</th>
                <th>Tình trạng</th>
                <th>Giá</th>
                <th>Mô tả</th>
                <th>Loại sản phẩm</th>
                <th>Review</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product.productId}>
                  <td>
                    <div className="td-seller-content">
                      <img
                        className="rounded-3 me-2"
                        src={product?.seller?.avarta}
                        style={{ maxWidth: "30px" }}
                        alt="user"
                      />
                      <span> {product.seller.fullName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="td-product-name">
                    <img
                      className="rounded-3 me-2"
                        src={product?.linkImage}
                        style={{ maxWidth: "30px" }} alt="product"
                      />
                      {product.productName}

                    </div>
                  </td>
                  <td>{product.status === 1 ? "Mới" : "Đã sử dụng"}</td>
                  <td>{product.price}</td>
                  <td>
                    <div className="td-description-content">
                      {product.description}
                    </div>
                  </td>
                  <td>{product.categoryName}</td>
                  <td>
                    <button
                      onClick={() =>
                        window.open(`../detail/${product.productId}`)
                      }
                      className="btn btn-primary"
                    >
                      Xem sản phẩm
                    </button>
                  </td>
                  <td>
                    {product.status === 1 ? (
                      <div>
                        <button
                          className="btn btn-danger mx-2"
                          onClick={() =>
                            handleApproveProduct(product.productId)
                          }
                        >
                          Xóa sản phẩm
                        </button>
                      </div>
                    ) : product.status === 2 ? (
                      <div className="btn btn-warning">
                        Sản phẩm không được duyệt
                      </div>
                    ) : (
                      <div className="btn btn-warning">Sản phẩm đã bị xóa</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminProduct;
