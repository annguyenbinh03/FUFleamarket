import { Link } from 'react-router-dom';

function UploadProductButton() {
  return (
    <Link to="/upload-product">
      <button className="btn mx-2 text-white fs-5 upPostBtn">
        Đăng tin  
        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
      </button>
    </Link>
  );
}

export default UploadProductButton;
