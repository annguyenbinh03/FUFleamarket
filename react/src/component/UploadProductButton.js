import { Link } from 'react-router-dom';

function UploadProductButton() {
  return (
    <Link to="/upload-product">
      <button className="btn mx-2 text-white fs-5 upPostBtn">
      <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
      {" "}
      <span className="hidden-md"> Đăng tin </span> 
        
      </button>
    </Link>
  );
}

export default UploadProductButton;
