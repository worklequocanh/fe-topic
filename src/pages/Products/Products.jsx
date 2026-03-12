import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import $ from 'jquery';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Filter, X, PackageSearch } from 'lucide-react';
import './Products.css';

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
        const [productsSnap, categoriesSnap] = await Promise.all([
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'categories')),
        ]);
        setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setCategories(categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
      <div className="products-loading">
        <div className="products-spinner" />
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="products-page-header">
        <div className="container">
          <h1 className="products-page-title">Sản Phẩm</h1>
          <p className="products-page-subtitle">Khám phá bộ sưu tập nghệ thuật thủ công cao cấp</p>
        </div>
      </div>

      <div className="container section-padding">
        <div className="products-layout">
          {/* Filter sidebar */}
          <div className="products-sidebar">
            {/* Mobile filter toggle */}
            <button onClick={toggleFilter} className="products-filter-toggle">
              <span className="products-filter-toggle-label">
                <Filter size={16} /> Bộ lọc
              </span>
              <span>{filterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
            </button>

            <div
              id="filter-sidebar"
              className="products-filter-box"
              style={{ display: window.innerWidth >= 1024 ? 'block' : filterOpen ? 'block' : 'none' }}
            >
              {/* Search */}
              <div className="filter-section">
                <h3 className="filter-section-title">Tìm kiếm</h3>
                <form onSubmit={handleSearch} className="filter-search-form">
                  <div className="filter-search-wrap">
                    <Search size={16} className="filter-search-icon" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tên sản phẩm..."
                      className="filter-search-input"
                    />
                  </div>
                </form>
              </div>

              {/* Categories */}
              <div className="filter-section">
                <h3 className="filter-section-title">Danh mục</h3>
                <div className="filter-options">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`filter-option-btn ${!selectedCategory ? 'active' : ''}`}
                  >
                    Tất cả ({products.length})
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.slug}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`filter-option-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
                    >
                      {cat.name} ({cat.productCount})
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="filter-section">
                <h3 className="filter-section-title">Khoảng giá</h3>
                <div className="filter-options">
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
                      className={`filter-option-btn ${priceRange === range.value ? 'active' : ''}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              <button onClick={clearFilters} className="filter-clear-btn">
                Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Products area */}
          <div className="products-main">
            {/* Sort bar */}
            <div className="products-sort-bar">
              <p className="products-count">
                Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
              </p>
              <div className="products-sort-wrap">
                <label className="products-sort-label">Sắp xếp:</label>
                <div className="products-sort-select-wrap">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="products-sort-select"
                  >
                    <option value="default">Mặc định</option>
                    <option value="price-asc">Giá: Thấp → Cao</option>
                    <option value="price-desc">Giá: Cao → Thấp</option>
                    <option value="name">Tên A-Z</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </select>
                  <ChevronDown size={16} className="products-sort-chevron" />
                </div>
              </div>
            </div>

            {/* Product grid */}
            {paginatedProducts.length > 0 ? (
              <div className="product-grid">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="products-empty">
                <PackageSearch size={48} className="products-empty-icon" />
                <p className="products-empty-title">Không tìm thấy sản phẩm</p>
                <p className="products-empty-desc">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <button onClick={clearFilters} className="btn-outline products-empty-btn">
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="products-pagination">
                <button
                  onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); $('html, body').animate({ scrollTop: 0 }, 300); }}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <ChevronLeft size={16} /> Trước
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => { setCurrentPage(i + 1); $('html, body').animate({ scrollTop: 0 }, 300); }}
                    className={`pagination-num-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); $('html, body').animate({ scrollTop: 0 }, 300); }}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
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
