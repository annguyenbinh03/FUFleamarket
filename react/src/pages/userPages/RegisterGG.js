import React, { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import AuthContext from "../../context/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import emailjs from 'emailjs-com';
import { editUserProfileAPI } from "../../api/user";

const GoogleRedirect = 'https://fufleamarketapi.azurewebsites.net/Auth/loginGoogle';

const RegisterGG = () => {
  const { setAuth } = useContext(AuthContext);

  const sendPasswordEmail = async (email, password) => {
    const templateParams = {
      to_email: email,
      to_name: email.split('@')[0],
      from_name: "FU Flea Market Team",
      message: `Your account has been successfully created.`,
      password: password
    };

    try {
      const result = await emailjs.send(
        'service_gsr6vbn',
        'template_srcpa55',
        templateParams,
        'RO9uU9KEq2gS9TEuE'
      );

      console.log('Email sent successfully:', result.text);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  };

  const registerGoogle = async (email, sub, name, avartaLink) => {
    try {
      const password = Math.floor(1000 + Math.random() * 9000).toString();
      console.log("Generated password:", password);

      console.log("Sending request to:", GoogleRedirect);
      console.log("Request payload:", { email, sub, name, avartaLink });

      const response = await axios.post(
        GoogleRedirect,
        JSON.stringify({ email, sub, name, avartaLink }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Response from server:", response.data);

      const { token: accessToken, role: roles, id } = response.data;
      console.log("Extracted data:", { accessToken, roles, id });

      // Update user profile with password
      const user = {
        fullName: name,
        email: email,
        avarta: avartaLink,
        password: password,
      };
      console.log("Updating user profile:", user);

      // Gửi yêu cầu cập nhật hồ sơ nhưng không đợi kết quả
      editUserProfileAPI(accessToken, user).then((profileUpdateResponse) => {
        console.log("Profile update response:", profileUpdateResponse);
      }).catch((error) => {
        console.error("Failed to update user profile:", error);
      });

      // Gửi email ngay lập tức
      const emailSent = await sendPasswordEmail(email, password);
      console.log("Email sent:", emailSent);

      if (emailSent) {
        toast.success("Đăng ký thành công! Kiểm tra email của bạn để lấy mật khẩu.", {
          autoClose: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.warning("Đăng ký thành công nhưng không gửi được email. Vui lòng liên hệ hỗ trợ.", {
          autoClose: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      const authData = { email, roles, fullName: name, avarta: avartaLink, accessToken, id, sub, logged: true };
      console.log("Auth data:", authData);
      setAuth(authData);
      localStorage.setItem("auth", JSON.stringify(authData));
      console.log("Auth data stored in localStorage");

    } catch (error) {
      console.error("Error registering with Google:", error);
      console.error("Error details:", error.response ? error.response.data : error.message);
      toast.error("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.", {
        autoClose: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Đăng ký với Google</h2>
      <div className="d-flex justify-content-center">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log("Google login success:", credentialResponse);
            var credentialResponseDecoded = jwtDecode(
              credentialResponse.credential
            );
            console.log("Decoded credential:", credentialResponseDecoded);
            registerGoogle(
              credentialResponseDecoded.email,
              credentialResponseDecoded.sub,
              credentialResponseDecoded.name,
              credentialResponseDecoded.picture
            );
          }}
          onError={() => {
            console.log("Đăng ký thất bại");
            toast.error("Đăng ký Google thất bại. Vui lòng thử lại.", {
              autoClose: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }}
        />
      </div>
    </div>
  );
};

export default RegisterGG;