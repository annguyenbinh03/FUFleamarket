import { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const formatPrice = (value) => {
  if(value){
    return value.toLocaleString('vi-VN');
  }
  return value;

};


function AdminUserReport() {
  const [summary, setSummary] = useState();
  const [topSellProduct, setTopSellProduct] = useState([]);
  const [topSeller, setTopSeller] = useState([]);

  const [sellingPakages, setSellingPakages] = useState([]);

  const fetchData = async () => {
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="admin_page">
      <nav className="navbar">
        <AdminHeader />
      </nav>
      <div className="admin_main container-fluid d-flex justify-content-center p-0 pt-1 mt-5">
        <nav className="w-13 p-0 bg-white">
          <div className="col-lg-12 ">
            <AdminSidebar />
          </div>
        </nav>
        <div className="main-content w-87 pt-3 px-4">
          <h4 className="card-title">Báo cáo người dùng</h4>
          <p className="">
            Danh mục các báo cáo{" "}
            <span className="text-primary">đang chờ duyệt</span>
          </p>
          <table className="product-table table text-center table-bordered mb-4">
            <thead className="bg-secondary">
              <tr>
                <th>Người báo cáo</th>
                <th>Người bị báo cáo</th>
                <th>Lý do</th>
                <th>Ngày báo cáo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
}

export default AdminUserReport;
