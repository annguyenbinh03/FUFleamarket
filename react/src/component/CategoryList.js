import React, { useEffect, useState } from "react";
import { getCategoryAPI } from "../api/category";

function CategoryList({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategoryAPI();
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="sidebar__item">
      <h4>Danh mục sản phẩm</h4>
      <ul>
        <li>
          <button className="category-button" onClick={() => onCategorySelect(null)}>Tất cả</button>
        </li>
        {categories.map((category, key) => (
          <li key={key}>
            <button className="category-button" onClick={() => onCategorySelect(category.categoryId)}>
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
