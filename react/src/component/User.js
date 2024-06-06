import { useEffect, useState, useContext } from "react";
import { getUserProfileAPI, } from "../api/user";
import AuthContext from "../context/AuthProvider";
const Users = () => {

    const { auth } = useContext(AuthContext);

    const [users,setUsers] = useState({});

    useEffect(()=>{
        setUsers(getUserProfileAPI(auth.accessToken));
        console.log(users);
    },[])
    return ( 
        <article>
            <h2>Users list</h2>
            {users?.length?
            (
                <ul>{users.map((user,i)=> <li key={i}>{user?.fullName}</li>)}</ul>

            ): <p>No users to display</p>
            }
        </article>
     );
}
 
export default Users;