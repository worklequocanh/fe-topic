import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Star } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="product-card-link">
        {discount > 0 && (
          <span className="product-card-badge">-{discount}%</span>
        )}
        <div className="product-card-img-wrap">
          <img
            src={product.image || null}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
          />
        </div>
        {/* Quick add overlay */}
        <div className="product-card-overlay">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="product-card-add-btn"
          >
            <ShoppingCart size={14} />
            Thêm vào giỏ
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="product-card-info">
        <p className="product-card-artist">{product.artist}</p>
        <Link to={`/products/${product.slug}`} className="product-card-title-link">
          <h3 className="product-card-title">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="product-card-rating">
          <div className="product-card-stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={`product-card-star ${i < Math.floor(product.rating) ? 'active' : 'inactive'}`}
              />
            ))}
          </div>
          <span className="product-card-review-count">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="product-card-price-wrap">
          <span className="product-card-price-current">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="product-card-price-old">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
