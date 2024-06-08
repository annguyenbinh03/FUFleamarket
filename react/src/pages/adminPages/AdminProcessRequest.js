import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { acceptCreateProductRequestAPI, getAdminProductAPI, rejectCreateProductRequestAPI } from "../../api/product";

import AdminHeader from "./AdminHeader";
import AdminNavBar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";
import AuthContext from "../../context/AuthProvider";

function AdminProcessRequest() {
  const [products, setProducts] = useState([]);
  const { auth } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const productsData = await getAdminProductAPI(auth.accessToken);
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
      await acceptCreateProductRequestAPI(auth.accessToken,productId);
      fetchData(); 
    } catch (error) {
      console.error("Lỗi khi duyệt sản phẩm:", error);
    }
  };

  const handleRejectProduct = async (productId) => {
    try {
      await rejectCreateProductRequestAPI(auth.accessToken,productId);
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
      <div className="container-fluid d-flex justify-content-center p-0 pt-3 mt-5">
        <nav className="sidebar w-13 p-0 bg-white">
          <div className="col-lg-12 ">
            <AdminNavBar />
          </div>
        </nav>
        <div className="main-content w-87 pt-3 px-4">
          <h4 className="card-title">Sản phẩm</h4>
          <p className="">
            Danh mục các sản phẩm{" "}
            <span className="text-primary">đang chờ duyệt</span>
          </p>
          <table className="table text-center table-bordered mb-4">
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
                  <td>{product.seller.fullName}</td>
                  <td>{product.productName}</td>
                  <td>{product.status === 1 ? "Mới" : "Đã sử dụng"}</td>
                  <td>{product.price}</td>
                  <td>
                    <div className="td-description-content">
                      {product.description}
                    </div>
                  </td>
                  <td>{product.categoryName}</td>
                  <td>
                    <Link
                      className="btn btn-primary"
                      to={`/detail/${product.productId}`}
                    >
                      Xem sản phẩm
                    </Link>
                  </td>
                  <td>
                    {product.status === 0 ? (
                      <div>
                        <button
                          className="btn btn-success mx-2"
                          onClick={() =>
                            handleApproveProduct(product.productId)
                          }
                        >
                          Duyệt
                        </button>
                        <button
                          className="btn btn-danger mx-2"
                          onClick={() => handleRejectProduct(product.productId)}
                        >
                          Loại bỏ
                        </button>
                      </div>
                    ) :  product.status === 1 ? 
                      <div className="btn btn-success">Đã được duyệt</div>
                    : 
                    <div className="btn btn-danger">Đã loại bỏ</div>
                     }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
}

export default AdminProcessRequest;
