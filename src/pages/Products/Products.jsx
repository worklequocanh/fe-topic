import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Search, SlidersHorizontal, ChevronDown, Filter, X } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/categories'),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    const search = searchParams.get('search');
    if (cat) setSelectedCategory(cat);
    if (search) setSearchQuery(search);
  }, [searchParams]);

  // Filter & sort logic
  let filteredProducts = [...products];

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.artist.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (priceRange !== 'all') {
    const ranges = {
      'under-2m': [0, 2000000],
      '2m-5m': [2000000, 5000000],
      '5m-10m': [5000000, 10000000],
      'above-10m': [10000000, Infinity],
    };
    const [min, max] = ranges[priceRange] || [0, Infinity];
    filteredProducts = filteredProducts.filter(p => p.price >= min && p.price < max);
  }

  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
    setSearchParams(prev => {
      if (slug) {
        prev.set('category', slug);
      } else {
        prev.delete('category');
      }
      return prev;
    });

    // jQuery fade animation
    $('.product-grid').css('opacity', 0);
    setTimeout(() => {
      $('.product-grid').animate({ opacity: 1 }, 400);
    }, 100);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchParams(prev => {
      if (searchQuery.trim()) {
        prev.set('search', searchQuery);
      } else {
        prev.delete('search');
      }
      return prev;
    });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSortBy('default');
    setPriceRange('all');
    setCurrentPage(1);
    setSearchParams({});
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
    if (!filterOpen) {
      $('#filter-sidebar').slideDown(300);
    } else {
      $('#filter-sidebar').slideUp(300);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sand border-t-terracotta rounded-full animate-spin mx-auto mb-4" />
          <p className="text-taupe">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="bg-warm-beige py-8 md:py-12">
        <div className="container-custom">
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal text-center">
            Sản Phẩm
          </h1>
          <p className="text-taupe text-center mt-2 text-sm md:text-base">
            Khám phá bộ sưu tập nghệ thuật thủ công cao cấp
          </p>
        </div>
      </div>

      <div className="container-custom section-padding">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Filter sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            {/* Mobile filter toggle */}
            <button
              onClick={toggleFilter}
              className="lg:hidden w-full flex items-center justify-between bg-white border border-sand rounded-md px-4 py-3 mb-4 text-sm font-medium text-charcoal"
            >
              <span className="flex items-center gap-2"><Filter size={16} /> Bộ lọc</span>
              <span className="text-taupe">{filterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
            </button>

            <div
              id="filter-sidebar"
              className="bg-white rounded-2xl border border-sand/50 p-6 space-y-8 shadow-sm"
              style={{ display: window.innerWidth >= 1024 ? 'block' : filterOpen ? 'block' : 'none' }}
            >
              {/* Search */}
              <div>
                <h3 className="font-heading text-sm font-semibold text-charcoal mb-3 uppercase tracking-wider">
                  Tìm kiếm
                </h3>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe/60" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tên sản phẩm..."
                      className="w-full pl-10 pr-3 py-2.5 border border-sand rounded-xl text-sm bg-cream focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all"
                    />
                  </div>
                </form>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-heading text-sm font-semibold text-charcoal mb-3 uppercase tracking-wider">
                  Danh mục
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      !selectedCategory ? 'bg-terracotta/10 text-terracotta font-medium' : 'text-taupe hover:text-charcoal hover:bg-warm-beige'
                    }`}
                  >
                    Tất cả ({products.length})
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.slug}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                        selectedCategory === cat.slug ? 'bg-terracotta text-white font-medium shadow-sm' : 'text-taupe hover:text-charcoal hover:bg-warm-beige'
                      }`}
                    >
                      {cat.name} ({cat.productCount})
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <h3 className="font-heading text-sm font-semibold text-charcoal mb-3 uppercase tracking-wider">
                  Khoảng giá
                </h3>
                <div className="space-y-1">
                  {[
                    { value: 'all', label: 'Tất cả' },
                    { value: 'under-2m', label: 'Dưới 2.000.000đ' },
                    { value: '2m-5m', label: '2.000.000đ - 5.000.000đ' },
                    { value: '5m-10m', label: '5.000.000đ - 10.000.000đ' },
                    { value: 'above-10m', label: 'Trên 10.000.000đ' },
                  ].map(range => (
                    <button
                      key={range.value}
                      onClick={() => { setPriceRange(range.value); setCurrentPage(1); }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                        priceRange === range.value ? 'bg-terracotta text-white font-medium shadow-sm' : 'text-taupe hover:text-charcoal hover:bg-warm-beige'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              <button
                onClick={clearFilters}
                className="w-full text-center text-sm text-terracotta hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Products area */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-sand/50">
              <p className="text-sm text-taupe">
                Hiển thị <strong className="text-charcoal">{filteredProducts.length}</strong> sản phẩm
              </p>
              <div className="flex items-center gap-3">
                <label className="text-sm text-taupe hidden sm:inline">Sắp xếp:</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 border border-sand rounded-xl text-sm bg-white text-charcoal focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 cursor-pointer shadow-sm transition-all"
                  >
                    <option value="default">Mặc định</option>
                    <option value="price-asc">Giá: Thấp → Cao</option>
                    <option value="price-desc">Giá: Cao → Thấp</option>
                    <option value="name">Tên A-Z</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Product grid */}
            {paginatedProducts.length > 0 ? (
              <div className="product-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <PackageSearch size={48} className="mx-auto mb-4 text-taupe" />
                <p className="text-lg font-heading font-semibold text-charcoal mb-2">
                  Không tìm thấy sản phẩm
                </p>
                <p className="text-taupe text-sm mb-4">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
                <button onClick={clearFilters} className="btn-outline !text-sm !py-2 !px-4">
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); $('html, body').animate({ scrollTop: 0 }, 300); }}
                  disabled={currentPage === 1}
                  className="px-3 py-2 flex items-center gap-1 border border-sand rounded text-sm text-charcoal hover:bg-warm-beige disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} /> Trước
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => { setCurrentPage(i + 1); $('html, body').animate({ scrollTop: 0 }, 300); }}
                    className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                      currentPage === i + 1
                        ? 'bg-terracotta text-white'
                        : 'border border-sand text-charcoal hover:bg-warm-beige'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); $('html, body').animate({ scrollTop: 0 }, 300); }}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 flex items-center gap-1 border border-sand rounded text-sm text-charcoal hover:bg-warm-beige disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Sau <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
