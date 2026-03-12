import { Link } from 'react-router-dom';
import './CategoryCard.css';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="category-card"
    >
      <div className="category-card-img-wrap">
        <img
          src={category.image}
          alt={category.name}
          className="category-card-img"
          loading="lazy"
        />
      </div>
      <div className="category-card-content">
        <h3 className="category-card-title">
          {category.name}
        </h3>
        <p className="category-card-count">{category.productCount} sản phẩm</p>
      </div>
    </Link>
  );
}
