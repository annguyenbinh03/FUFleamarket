import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import Header from "../../Header";
import Footer from "../../Footer";

const Login = () => {
  const { auth ,setAuth } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setEmail("");
    setPwd("");
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://localhost:7057/api/LoginAdmin/login",
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const accessToken = response?.data?.token;
      const roles = response?.data?.role;
      const fullName = response?.data?.fullName;
      const avarta = response?.data?.avarta;
      setAuth({ email, roles, fullName, avarta, accessToken });
      localStorage.setItem('auth',JSON.stringify({ email, roles, fullName, avarta, accessToken }));
      setEmail("");
      setPwd("");
      if(roles.includes(2)){
        navigate("/admin", {replace: true});
      }else{
        navigate(from, { replace: true });
      }
     
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div>
       <Header />
    <div className="d-flex  justify-content-center">
      <section className="register bg-white p-5">
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h1 className="text-center p-3 pb-4">Đăng nhập</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group input-group-lg mb-3">
            <span className="input-group-text" id="basic-addon1">
            <i className="fa fa-envelope-o" aria-hidden="true"></i>
            </span>
            <input
              type="text"
              className="form-control"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              placeholder="Email"
            />
          </div>

          <div className="input-group input-group-lg mb-3">
            <span className="input-group-text" id="basic-addon1">
            <i className="fa fa-lock" aria-hidden="true"></i>
            </span>
            <input
              type="password"
              className="form-control"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={password}
              required
              placeholder="Mật khẩu"
            />
          </div>
          <div className="d-flex justify-content-center py-2"> <button className="btn btn-secondary btn-lg px-5">Sign In</button></div>
         
        </form>
        <div className="text-center pt-3">
          Chưa có tài khoản?
          <span className="line">
            {/*put router link here*/}
            <Link  href="#">Tạo ngay</Link>
          </span>
        </div>
      </section>
    </div>
    <Footer/>
    </div>
  );
};

export default Login;
