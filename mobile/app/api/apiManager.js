import axios from "axios";

 const ApiManager = axios.create({
    baseURL: "http://localhost:5144/api",
    responseType:'json',
    withCredentials: true,
});

export  default ApiManager;