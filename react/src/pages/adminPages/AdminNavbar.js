import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import { Link } from "react-router-dom";

const AdminNavBar = () => {
  const { auth } = useContext(AuthContext);

  return (
    <nav  className="nav flex-column">
      <ul className="nav">
        <li className="nav-item  pt-2">
          <Link to="#" className="nav-link d-flex">
            <div className="d-flex align-items-center">
              <img className="userLogo"  src="https://cdn.chotot.com/uac2/27021569" alt="profile" />
            </div>
            <div className="d-flex flex-column px-3">
              <span className="fw-bold mb-1">David Grey. H</span>
              <span className="text-secondary text-small">{auth.fullName}</span>
            </div>
            <div className="d-flex align-items-center">
            <i class="fa fa-bookmark text-danger" aria-hidden="true"></i>
            </div>
          
          </Link>
        </li>
        <li className="nav-item active px-4">
          <Link className=" d-flex justify-content-between" to="">
            <span className="menu-title">Dashboard</span>
            <i class="fa fa-home" aria-hidden="true"></i>
          </Link>
        </li>
        <li className="nav-item px-4">
          <Link className=" d-flex justify-content-between" >
            <span className="menu-title">Hóa đơn</span>
            <i class="fa fa-file-text" aria-hidden="true"></i>
          </Link>
        </li>
        <li className="nav-item px-4">
          <Link className=" d-flex justify-content-between" to="">
            <span className="menu-title">Người dùng</span>
            <i class="fa fa-users" aria-hidden="true"></i>
          </Link>
        </li>
        <li className="nav-item px-4">
          <Link className="d-flex justify-content-between" to="">
            <span className="menu-title">Gói Premium</span>
            <i class="fa fa-product-hunt" aria-hidden="true"></i>
          </Link>
        </li>
        <li className="nav-item px-4">
          <Link className=" d-flex justify-content-between" to="">
            <span className="menu-title">Chính sách</span>
            <i class="fa fa-id-card-o" aria-hidden="true"></i>
          </Link>
        </li>       
      </ul>
    </nav>
  );
};

export default AdminNavBar;
