import React from "react";
import { Link } from "react-router-dom"; 

function SearchButton() {
  return (
    <form className="w-40 px-3" action=""> 
      <div className="input-group text-white">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Tìm kiếm"  
        />
        <Link to="/search-product" className="btn btn-outline-secondary bg-white"> {/* Sử dụng Link */}
          <i className="fa fa-search" aria-hidden="true"></i>
        </Link>
      </div>
    </form>
  );
}

export default SearchButton;