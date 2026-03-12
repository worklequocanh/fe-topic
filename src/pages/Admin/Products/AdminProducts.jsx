import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  MoreVertical,
  Filter,
  Package,
  Check,
  X,
  Image as ImageIcon
} from 'lucide-react';
import './AdminProducts.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    originalPrice: '',
    category: 'ceramics',
    artisan: '',
    description: '',
    image: '',
    images: '', // comma separated string or first item
    stock: 10,
    rating: 5,
    reviews: 0,
    tags: ''
  });

  const categories = [
    { id: 'ceramics', name: 'Gốm sứ' },
    { id: 'paintings', name: 'Tranh vẽ' },
    { id: 'woodwork', name: 'Đồ gỗ' },
    { id: 'jewelry', name: 'Trang sức' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const prods = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(prods);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        alert('Lỗi khi xóa sản phẩm: ' + error.message);
      }
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category || 'ceramics',
        artisan: product.artisan || '',
        description: product.description || '',
        image: product.image || '',
        images: Array.isArray(product.images) ? product.images.join(', ') : product.image || '',
        stock: product.stock || 0,
        rating: product.rating || 5,
        reviews: product.reviews || 0,
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', slug: '', price: '', originalPrice: '',
        category: 'ceramics', artisan: '', description: '',
        image: '', images: '', stock: 10, rating: 5, reviews: 0, tags: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Process tags and images strings to arrays
    const processedData = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      stock: Number(formData.stock),
      rating: Number(formData.rating),
      reviews: Number(formData.reviews),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      images: formData.images.split(',').map(img => img.trim()).filter(img => img !== ''),
      updatedAt: serverTimestamp()
    };

    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), processedData);
      } else {
        processedData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'products'), processedData);
      }
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.artisan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm, nghệ nhân..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-add-product" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Thêm sản phẩm
        </button>
      </div>

      <div className="admin-card no-padding overflow-hidden">
        {loading && products.length === 0 ? (
          <div className="loading-state">Đang tải dữ liệu...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Nghệ nhân</th>
                <th>Giá</th>
                <th>Kho</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="product-info-cell">
                      <div className="product-thumb">
                        {product.image ? (
                          <img src={product.image} alt={product.name} />
                        ) : (
                          <ImageIcon size={20} color="#ccc" />
                        )}
                      </div>
                      <div>
                        <p className="product-name">{product.name}</p>
                        <p className="product-slug">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${product.category}`}>
                      {categories.find(c => c.id === product.category)?.name || product.category}
                    </span>
                  </td>
                  <td>{product.artisan}</td>
                  <td>
                    <div className="price-cell">
                      <p className="current-price">{product.price?.toLocaleString()}đ</p>
                      {product.originalPrice > product.price && (
                        <p className="old-price">{product.originalPrice?.toLocaleString()}đ</p>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={product.stock <= 5 ? 'text-danger' : ''}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleOpenModal(product)} title="Sửa">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon text-danger" onClick={() => handleDelete(product.id)} title="Xóa">
                        <Trash2 size={16} />
                      </button>
                      <a href={`/products/${product.slug}`} target="_blank" rel="noreferrer" className="btn-icon" title="Xem trên web">
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="modal-header">
              <h3>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <button className="close-btn" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Tên sản phẩm *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Slug (URL) *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Danh mục</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Giá hiện tại (đ) *</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Giá gốc (đ)</label>
                  <input 
                    type="number" 
                    value={formData.originalPrice}
                    onChange={e => setFormData({...formData, originalPrice: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Nghệ nhân</label>
                  <input 
                    type="text" 
                    value={formData.artisan}
                    onChange={e => setFormData({...formData, artisan: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Tồn kho</label>
                  <input 
                    type="number" 
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Mô tả ngắn</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Ảnh chính (URL)</label>
                  <input 
                    type="text" 
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Danh sách ảnh (URL, cách nhau bằng dấu phẩy)</label>
                  <textarea 
                    rows={2}
                    value={formData.images}
                    onChange={e => setFormData({...formData, images: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Tags (cách nhau bằng dấu phẩy)</label>
                  <input 
                    type="text" 
                    value={formData.tags}
                    onChange={e => setFormData({...formData, tags: e.target.value})}
                    placeholder="ví dụ: gốm sứ, thủ công, cao cấp"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={handleCloseModal}>Hủy</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Đang lưu...' : (editingProduct ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
