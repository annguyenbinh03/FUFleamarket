import { Link } from 'react-router-dom';

function MyPostButton() {
  return (
    <button className="btn fs-5 text-white">
      <Link to="/my-posts" className="text-decoration-none" style={{ color: 'white' }}>
        <i className="fa fa-list-alt pe-2" aria-hidden="true"></i>
            Quản lý tin
      </Link>
    </button>
  );
}

export default MyPostButton;