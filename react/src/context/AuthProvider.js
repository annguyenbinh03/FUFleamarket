import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({})
 
export const AuthProvider = ({children}) =>{
    const [auth,setAuth] = useState({});

    useEffect(()=>{
        const storedAuth = localStorage.getItem('auth');
        if(storedAuth != null){
            setAuth(JSON.parse(storedAuth));
        }
    },[])
    
    return (
        <AuthContext.Provider value ={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContext;