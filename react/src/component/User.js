import { useEffect, useState } from "react";
import { getAllUserAPI } from "../api/user";

const Users = () => {
    const [users,setUsers] = useState();

    useEffect(()=>{
        setUsers(getAllUserAPI());
    },[])
    return ( 
        <article>
            <h2>Users list</h2>
            {users?.length?
            (
                <ul>{users.map((user,i)=> <li key={i}>{user?.username}</li>)}</ul>

            ): <p>No users to display</p>
            }
        </article>
     );
}
 
export default Users;