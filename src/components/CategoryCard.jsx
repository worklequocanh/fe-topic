import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="card-hover group block bg-white rounded-lg overflow-hidden shadow-sm border border-sand/30"
    >
      <div className="img-zoom aspect-square">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3 md:p-4 text-center">
        <h3 className="font-heading text-sm md:text-base font-semibold text-charcoal group-hover:text-terracotta transition-colors">
          {category.name}
        </h3>
        <p className="text-[11px] text-taupe mt-1">{category.productCount} sản phẩm</p>
      </div>
    </Link>
  );
}
