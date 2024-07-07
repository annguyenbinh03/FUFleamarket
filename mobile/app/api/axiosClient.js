import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosClient = axios.create({
  baseURL: "http://192.168.0.112:7057/api/",
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("auth").then((authData) =>
      authData ? JSON.parse(authData).token : null
    );
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log("Full URL:", `${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
