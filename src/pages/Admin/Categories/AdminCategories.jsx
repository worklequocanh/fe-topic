import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Image as ImageIcon,
  FolderOpen
} from 'lucide-react';
import './AdminCategories.css';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    productCount: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const fetchedCategories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter out duplicates based on slug (sometimes seeding creates duplicates)
      const uniqueCategories = Array.from(new Map(fetchedCategories.map(item => [item.slug, item])).values());
      
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        image: category.image || '',
        productCount: category.productCount || 0
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '', slug: '', image: '', productCount: 0
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const slug = formData.slug || formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const dataToSave = { ...formData, slug, updatedAt: serverTimestamp() };

      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), dataToSave);
      } else {
        await addDoc(collection(db, 'categories'), {
          ...dataToSave,
          createdAt: serverTimestamp()
        });
      }
      fetchCategories();
      setShowModal(false);
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await deleteDoc(doc(db, 'categories', id));
        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        alert("Lỗi khi xóa: " + error.message);
      }
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-categories">
      <div className="admin-page-header">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm danh mục..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-add-product" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Thêm danh mục
        </button>
      </div>

      <div className="categories-grid-admin">
        {loading && categories.length === 0 ? (
          <div className="loading-state">Đang tải dữ liệu danh mục...</div>
        ) : (
          filteredCategories.map(cat => (
            <div key={cat.id} className="admin-card category-card-admin">
              <div className="category-image-preview">
                {cat.image ? <img src={cat.image || null} alt={cat.name} /> : <div className="no-img-placeholder"><ImageIcon size={40} /></div>}
              </div>
              <div className="category-details-admin">
                <div className="cat-info-top">
                  <h3>{cat.name}</h3>
                  <div className="cat-actions-admin">
                    <button className="btn-icon" onClick={() => handleOpenModal(cat)}><Edit2 size={16} /></button>
                    <button className="btn-icon text-danger" onClick={() => handleDelete(cat.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
                <p className="cat-slug-admin">Slug: {cat.slug}</p>
                <div className="cat-stats-admin">
                  <span><FolderOpen size={14} /> {cat.productCount || 0} sản phẩm</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="modal-header">
              <h3>{editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Tên danh mục *</label>
                  <input 
                    type="text" required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Vd: Gốm Sứ Cao Cấp"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Slug (Để trống sẽ tự tạo)</label>
                  <input 
                    type="text" 
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                    placeholder="Vd: gom-su-cao-cap"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Ảnh đại diện (URL)</label>
                  <input 
                    type="text" 
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    placeholder="Link ảnh danh mục"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Số lượng sản phẩm mặc định</label>
                  <input 
                    type="number" 
                    value={formData.productCount}
                    onChange={e => setFormData({...formData, productCount: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Đang lưu...' : (editingCategory ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
