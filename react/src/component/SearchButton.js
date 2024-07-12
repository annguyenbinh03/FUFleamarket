import React, { useState } from "react";
import { Link, useNavigate  } from "react-router-dom"; 

function SearchButton() {
  const [searchProductName, setSearchProductName] = useState('');
  const [topSearchResults, setTopSearchResults] = useState([]);
  const navigate = useNavigate();

  const fetchTopSearch = (value) => {
    if(value){
      fetch('https://fufleamarketapi.azurewebsites.net/api/product/listproduct')
      .then(response => response.json())
      .then((json)=>{
        const results = json.filter((product)=>{
          return product && product.productName && product.productName.toLowerCase().includes(value)
        });
        setTopSearchResults(results);
      })
    }else{
      setTopSearchResults([]);
    }
    
  };

  const handleInputChange = (value) =>{
    fetchTopSearch(value);
    setSearchProductName(value);
  }
  const handleChooseTopSearch = (e,productId) => {
    e.preventDefault();
    if(productId){
      e.stopPropagation();        
      setSearchProductName('');      
      setTopSearchResults([]);
      navigate(`/detail/${productId}`);
    }
   };

  const handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();                           
    navigate(`/search-product?ProductName=${searchProductName}`);
   };

  return (
    <form className="search-bar position-relative"  onSubmit={handleSubmit}> 
      <div className="input-group text-white">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Tìm kiếm sản phẩm"  
          value={searchProductName}
          onChange={(e)=>handleInputChange(e.target.value)}
          
        />
        <Link to={`/search-product?ProductName=${searchProductName}`} className="btn btn-warning btn-outline-secondary border-0 "> {/* Sử dụng Link */}
          <i className="fa fa-search" aria-hidden="true"></i>
        </Link>
      </div>
      <div className="position-absolute text-danger result-search-list me-5" >
         {topSearchResults?.map((product)=>(
            <div key={product?.productId} className="top-search-items">
              <button className="text-black w-100 d-block" onClick={(e)=>handleChooseTopSearch(e,product?.productId)} >
              {product?.productName}
              </button>
            </div>
         ))}
      </div>
    </form>
  );
}

export default SearchButton;