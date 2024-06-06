import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";

const Login = () => {
  const { setAuth } = useContext(AuthContext);

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
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.token;
      const roles = response?.data?.role;
      setAuth({ email, password, roles, accessToken });
      setEmail("");
      setPwd("");
      navigate(from, { replace: true });
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
    <div className="d-flex justify-content-center">
    <section className="register">
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={password}
          required
        />
        <button>Sign In</button>
      </form>
      <p>
        Need an Account?
        <br />
        <span className="line">
          {/*put router link here*/}
          <Link href="#">Sign Up</Link>
        </span>
      </p>
    </section>
    </div>
  );
};

export default Login;
