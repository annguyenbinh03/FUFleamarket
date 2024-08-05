import axios from "axios";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({})
const GoogleRedirect = 'https://fufleamarketapis.azurewebsites.net/Auth/loginGoogle';
//  https://localhost:7057/Auth/loginGoogle 

export const AuthProvider = ({children}) =>{
    const [auth,setAuth] = useState({});

    const getToken = async (email, sub, name, avartaLink ) =>{
        try {
        const response = await axios.post(
            GoogleRedirect,
            JSON.stringify({ email, sub, name, avartaLink }),
            {
              headers: { "Content-Type": "application/json" },
            });       
            const accessToken = response?.data?.token;
            const roles = response?.data?.role;
            const fullName = response?.data?.fullName;
            const avarta = response?.data?.avarta;
            const id = response?.data?.id;
            const logged = true;
           setAuth({ email, roles, fullName, avarta, accessToken, id, sub, logged });
           localStorage.setItem('auth',JSON.stringify({ email, roles, fullName, avarta, accessToken, id, sub, logged }));
        } catch (error) {
            console.error("Login fail:", error);
          }
    }

    useEffect( ()=>{
        const storedAuth = localStorage.getItem('auth');
        if(storedAuth != null){
            var loginInfo = JSON.parse(storedAuth)
            setAuth(JSON.parse(storedAuth));   
            getToken(loginInfo.email, loginInfo.sub, loginInfo.fullName, loginInfo.avarta, loginInfo );  
        }else{
            var logged = false;
            setAuth({logged});
        }
        return;
    },[])
    
    return (
        <AuthContext.Provider value ={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContext;