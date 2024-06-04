import { Link } from 'react-router-dom';

function MyPostButton() {
  return (
    <button className="btn fs-5 text-white">
      <Link to="/my_posts" className="text-decoration-none" style={{ color: 'white' }}>
        <i className="fa fa-list-alt" aria-hidden="true"></i>
            Quản lý tin
      </Link>
    </button>
  );
}

export default MyPostButton;