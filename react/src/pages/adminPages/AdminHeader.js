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
        <header className="header container-fluid d-flex justify-content-between px-4 py-1">
          <div className="logo p-2">
            <div>
              <img
                className="img-fluid"
                src={`../assets/img/logo.png`}
                alt="logo"
              />
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center">
              <div className="px-3 d-flex align-items-center">
                <img
                  className="userLogo mx-1 img-fluid"
                  src={auth?.avarta}
                  alt=""  
                />
                <span className="fs-5 username text-white px-2">{auth?.fullName}</span>
              </div>
              <div className="d-flex align-items-center">
                <button className="btn fs-5 text-white px-4" onClick={(e)=> logout(e)}>
                  <i className="fa fa-sign-in" aria-hidden="true"></i>
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
