import { useContext, useState } from "react";
import AuthContext from "../context/AuthProvider";


const WaitingRoom = ({ joinChatRoom ,receiverId }) => {
 

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
       
      }}
    >
      <div className="row px-5 py-5">
        <div className="col-lg-12">
            <input className="form-control"
              placeholder="Reciver"
            //  onChange={(e) => setReceiverId(e.target.value)}
            />
        </div>
        <div className="col-lg-12">
          <hr />
          <button className="btn btn-success" type="submit">Join</button>
        </div>
      </div>
    </form>
  );
};

export default WaitingRoom;
