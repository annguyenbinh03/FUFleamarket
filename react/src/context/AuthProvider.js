import axios from "axios";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({})
 
export const AuthProvider = ({children}) =>{
    const [auth,setAuth] = useState({});

    const getToken = async (email, sub, name, avartaLink ) =>{
        const response = await axios.post(
            "https://localhost:7057/Auth/loginGoogle",
            JSON.stringify({ email, sub, name, avartaLink }),
            {
              headers: { "Content-Type": "application/json" },
            });       
            const accessToken = response?.data?.token;
            const roles = response?.data?.role;
            const fullName = response?.data?.fullName;
            const avarta = response?.data?.avarta;
            const id = response?.data?.id;
           setAuth({ email, roles, fullName, avarta, accessToken, id, sub });
           localStorage.setItem('auth',JSON.stringify({ email, roles, fullName, avarta, accessToken, id, sub }));
    }

    useEffect( ()=>{
        const storedAuth = localStorage.getItem('auth');
        if(storedAuth != null){
            var loginInfo = JSON.parse(storedAuth)
            // setAuth(JSON.parse(storedAuth));   
            console.log(loginInfo);
            getToken(loginInfo.email, loginInfo.sub, loginInfo.fullName, loginInfo.avarta );  
        }
    },[])
    
    return (
        <AuthContext.Provider value ={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContext;