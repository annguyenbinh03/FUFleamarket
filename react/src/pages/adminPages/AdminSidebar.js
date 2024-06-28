import { useContext, useEffect} from "react";
import AuthContext from "../../context/AuthProvider";
import { Link } from "react-router-dom";

function AdminSidebar(){
  const { auth } = useContext(AuthContext);
  //1 dashboard, 2 manageUser, 3 manageProduct, 4 managePackage, 5 manageOrder, 6 managePolicy


  return (
    <aside className="sidebar">
      <div className="py-3">
        <div className="d-flex justify-content-between px-4 mb-2">
          <div className="d-flex align-items-center">
            <img className="userLogo" src={auth?.avarta} alt="profile" />
            <div className="d-flex flex-column px-3">
              <span className="fw-bold mb-1">{auth.fullName}</span>
              <span className="text-secondary text-small">
                {auth?.roles?.[0] === 1 ? "Moderator" : "Admin"}
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <i className="fa fa-bookmark text-danger" aria-hidden="true"></i>
          </div>
        </div>
      </div>
      <ul className="sidebar-nav">
        <li className="sidebar-item ">
          <Link to="/admin"  >Màn hình chính</Link>
        </li>
        <li className="sidebar-item ">
        <Link to="/admin/users" > Quản lý người dùng</Link>
         
          </li>
        <li className="sidebar-item ">
          <div
            className="sidebar-link collapsed has-dropdown d-flex justify-content-between"
            data-bs-toggle="collapse"
            data-bs-target="#product"
            aria-expanded="false"
            aria-controls="product"
          >
            <span>Quản lý sản phẩm</span>
            <i className="fa fa-angle-down pe-3" aria-hidden="true"></i>
          </div>
          <ul
            id="product"
            className="sidebar-dropdown list-unstyled collapse"
            data-bs-parent="#sidebar"
          >
            <li className="sidebar-item">
              <Link href="#" className="sidebar-link"  >
                Danh mục sản phẩm
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/admin/product-requests" className="sidebar-link" >
                Sản phẩm chờ duyệt
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/admin/product" className="sidebar-link" >
                Tất cả sản phẩm
              </Link>
            </li>
          </ul>
        </li>
        <li className="sidebar-item ">  
             <Link to="/admin/selling-packages" >
             Quản lý gói bán hàng
             </Link> 
        </li>

        <li className="sidebar-item">
          <div
            className="sidebar-link collapsed has-dropdown d-flex justify-content-between"
            data-bs-toggle="collapse"
            data-bs-target="#order"
            aria-expanded="false"
            aria-controls="order"
          >
            <span>Quản lý hóa đơn</span>
            <i className="fa fa-angle-down pe-3" aria-hidden="true"></i>
          </div>
          <ul
            id="order"
            className="sidebar-dropdown list-unstyled collapse"
            data-bs-parent="#sidebar"
          >
            <li className="sidebar-item">
              <Link to="/admin/order-product" className="sidebar-link">
                Hóa đơn mua sản phẩm
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/admin/order-packages" className="sidebar-link">
                Hóa đơn gói bán hàng
              </Link>
            </li>
          </ul>
        </li>
        <li className="sidebar-item">
          <Link to="">Cài đặt chính sách</Link>
        </li>
      </ul>
      <div className="d-flex mt-5">
        <button className="toggle-btn" type="button">
          Toggle
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
