import useAuth from "./useAuth";

const userRefreshToken = () => {
    const {setAuth} = useAuth();
    const refresh = aync()=>{
        const response = await axios.get('',{
            withCredentials: true;
        });
        setAuth(preev=>{
            console.log(JSON.stringify(prev));
            console.log(response.data.token);
            return{...prev, accessToken: response.data.token }
        });
        return response.data.token;
    }
    return (  
        refresh;
    );
}
 
export default userRefreshToken;