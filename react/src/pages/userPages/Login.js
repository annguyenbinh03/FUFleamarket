import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import Header from "../../Header";
import Footer from "../../Footer";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

const GoogleRedirect = 'https://fufleamarketapi.azurewebsites.net/Auth/loginGoogle';
//  https://localhost:7057/Auth/loginGoogle
const Login = () => {
  const { setAuth } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  useEffect(() => {}, []);

  const loginGoogle = async (email, sub, name, avartaLink) => {
    try {
      // if (!email.endsWith("@fpt.edu.vn")) {
      //   alert("Chỉ người dùng có email @fpt.edu.vn được phép đăng nhập.");
      //   return;
      // }
      const response = await axios.post(
        GoogleRedirect,
        JSON.stringify({ email, sub, name, avartaLink }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const accessToken = response?.data?.token;
      const roles = response?.data?.role;
      const fullName = response?.data?.fullName;
      const avarta = response?.data?.avarta;
      const id = response?.data?.id;
      const logged = true;
      setAuth({ email, roles, fullName, avarta, accessToken, id, sub, logged });
      localStorage.setItem(
        "auth",
        JSON.stringify({
          email,
          roles,
          fullName,
          avarta,
          accessToken,
          id,
          sub,
          logged,
        })
      );
      if (roles.includes(2)) {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Error login Google:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="d-flex justify-content-center" style={{minHeight:"700px"}}>
        <section className="login bg-danger pt-5 pb-1" style={{boxShadow:"0px 0px 10px black"}}>
          <div className="px-4">
            <div className="text-center fs-1 text-white fw-bold">Đăng nhập</div>
            <img
              className="img-fluid my-5"
              src={`../assets/img/logo.png`}
              alt="logo"
            />
            <div className="d-flex justify-content-center mt-5">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log(credentialResponse);
                  var credentialResponseDecoded = jwtDecode(
                    credentialResponse.credential
                  );
                  loginGoogle(
                    credentialResponseDecoded.email,
                    credentialResponseDecoded.sub,
                    credentialResponseDecoded.name,
                    credentialResponseDecoded.picture
                  );
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
