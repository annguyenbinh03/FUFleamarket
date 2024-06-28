import { useContext, useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AuthContext from "../../context/AuthProvider";
import { getPackagesAPI } from "../../api/packages";

function AdminSellingPackage() {
  const { auth } = useContext(AuthContext);
  const [sellingPackages, setSellingPakages] = useState([]);

  const fetchData = async () => {
    try {
      const packageData = await getPackagesAPI(auth.accessToken);
      setSellingPakages(packageData);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="card-title">Gói bán hàng</h4>
              <span className="">Danh mục tất cả gói bán hàng </span>
            </div>
            <div>
                <button className="btn btn-success me-4">Tạo gói mới</button>
            </div>
          </div>

          <table className="product-table table text-center table-bordered mb-4">
            <thead className="bg-secondary">
              <tr>
                <th>Tên gói</th>
                <th>Miêu tả</th>
                <th>Giá</th>
                <th>Giới hạn tin</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sellingPackages?.map((sellingPakage) => (
                <tr>
                  <td>
                    <div className="td-seller-content">
                      <img
                        className="rounded-3 me-2"
                        src={require(`../../assets/img/selling-package/${sellingPakage?.promotionId}.png`)}
                        style={{ maxWidth: "60px" }}
                        alt="package"
                      />
                      <span> {sellingPakage?.name}</span>
                    </div>
                  </td>
                  <td>{sellingPakage?.description}</td>
                  <td>{sellingPakage?.price}</td>
                  <td>{sellingPakage?.productQuantity}</td>
                  <td>
                    <button className="btn btn-warning me-2">Sửa gói</button>
                    <button className="btn btn-danger ms-2">Xóa gói</button>
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

export default AdminSellingPackage;
