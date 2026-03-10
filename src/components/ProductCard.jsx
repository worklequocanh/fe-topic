import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Star } from 'lucide-react';

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
    <div className="card-hover bg-white rounded-lg overflow-hidden shadow-sm border border-sand/30 group">
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="block relative img-zoom">
        {discount > 0 && (
          <span className="badge-sale">-{discount}%</span>
        )}
        <div className="aspect-[4/5] bg-warm-beige">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="inline-flex items-center gap-2 bg-white text-charcoal px-6 py-2 rounded-md text-sm font-medium hover:bg-terracotta hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg"
          >
            <ShoppingCart size={14} />
            Thêm vào giỏ
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-[11px] text-taupe uppercase tracking-wider mb-1">{product.artist}</p>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-heading text-base font-semibold text-charcoal mb-2 line-clamp-2 hover:text-terracotta transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="star-rating flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}
              />
            ))}
          </div>
          <span className="text-[11px] text-taupe">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="price-current">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="price-old">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
