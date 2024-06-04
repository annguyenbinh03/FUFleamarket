// Sidebar.js
import React from "react";

function Sidebar({ selectedCategoryName }) {
  return (
    <div className="col-lg-3 col-md-5">
      <div className="sidebar px-2">
        <div className="sidebar__item">
          <h4>{selectedCategoryName}</h4>
        </div>
        <div className="sidebar__item">
          <h4>Giá</h4>
          <div className="price-range">
            <input type="number" id="minamount" placeholder="Tối thiểu" />
            <div className="dash">-</div>
            <input type="number" id="maxamount" placeholder="Tối đa" />
            <button className="btn-search">
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
