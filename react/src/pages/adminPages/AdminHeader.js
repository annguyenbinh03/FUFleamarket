import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const logout = (e) => {
    e.preventDefault();
    setAuth({});
    navigate("/");
  };
  return (
    <div>
      <div>
        <header className="header container-fluid d-flex justify-content-between px-4">
          <div className="logo p-2">
            <Link to="/">
              <img
                className="img-fluid"
                src={`../assets/img/logo.png`}
                alt="logo"
              />
            </Link>
          </div>
          <div className="d-flex align-items-center w-90 justify-content-between">
            <div className="d-flex ps-4">
              <div className="dropdown ">
                <button
                  type="button"
                  className="btn dropdown-toggle text-white fs-5"
                >
                  <i className="fa fa-list" aria-hidden="true"></i>
                  <span> Danh mục </span>
                </button>
                <ul className="dropdown-menu ">
                  <li>
                    <Link to="/search-product/1" className="dropdown-item py-2">
                      <i className="fa fa-desktop me-2" aria-hidden="true"></i>{" "}
                      Đồ điện tử
                    </Link>
                  </li>
                  <li>
                    <Link to="/search-product/2" className="dropdown-item py-2">
                      <i className="fa fa-book me-2" aria-hidden="true"></i> Đồ
                      dùng học tập
                    </Link>
                  </li>
                  <li>
                    <Link to="/search-product/3" className="dropdown-item py-2">
                      <img
                        width="20px"
                        src={`../assets/img/icon/fridge.png`}
                        alt="frideIcon"
                      />
                      Điện lạnh
                    </Link>
                  </li>
                  <li>
                    <Link to="/search-product/4" className="dropdown-item py-2">
                      <img
                        width="20px"
                        src={`../assets/img/icon/sofa.png`}
                        alt="sofaIcon"
                      />
                      Đồ gia dụng, nội thất
                    </Link>
                  </li>
                  <li>
                    <Link to="/search-product/5" className="dropdown-item py-2">
                      <i className="fa fa-cutlery me-2" aria-hidden="true"></i>{" "}
                      Đồ ăn, thực phẩm
                    </Link>
                  </li>
                  <li>
                    <Link to="/search-product/6" className="dropdown-item py-2">
                      <img
                        width="20px"
                        src={`../assets/img/icon/woman-clothes.png`}
                        alt="sofaIcon"
                      />
                      Thời trang
                    </Link>
                  </li>
                  <li>
                    <Link to="/search-product/7" className="dropdown-item py-2">
                      <img
                        width="20px"
                        src={`../assets/img/icon/console.png`}
                        alt="sofaIcon"
                      />
                      Giải trí, thể thao, sở thích
                    </Link>
                  </li>
                </ul>
              </div>
              <form className="w-40 px-3" action="">
                <div className="input-group text-white">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm"
                  />
                  <Link
                    to="/search-product"
                    className="btn btn-outline-secondary bg-white"
                  >
                    {/* Sử dụng Link */}
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </Link>
                </div>
              </form>
            </div>
            <div className="d-flex">
              <div className="px-3">
                <img
                  className="userLogo mx-1 img-fluid"
                  src="https://cdn.chotot.com/uac2/27021569"
                  alt=""
                />
                <span className="fs-5 username text-white px-2">Best yasuo</span>
              </div>
              <div className="d-flex align-items-center">
                <button className="btn fs-5 text-white px-4">
                  <i className="fa fa-bell" aria-hidden="true"></i>
                </button>
                <button className="btn fs-5 text-white px-4">
                  <i className="fa fa-comments-o" aria-hidden="true"></i>
                </button>
                <button className="btn fs-5 text-white px-4">
                  <i className="fa fa-heart" aria-hidden="true"></i>
                </button>
                <button className="btn fs-5 text-white px-4" onClick={(e)=> logout(e)}>
                  <i class="fa fa-sign-in" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default AdminHeader;
