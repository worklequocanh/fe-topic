import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  User,
  Image as ImageIcon,
  Award,
  BookOpen
} from 'lucide-react';
import './AdminArtisans.css';

export default function AdminArtisans() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingArtisan, setEditingArtisan] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    avatar: '',
    experience: '',
    specialty: '',
    quote: ''
  });

  useEffect(() => {
    fetchArtisans();
  }, []);

  const fetchArtisans = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'artists'));
      const fetchedArtisans = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArtisans(fetchedArtisans);
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (artisan = null) => {
    if (artisan) {
      setEditingArtisan(artisan);
      setFormData({
        name: artisan.name || '',
        role: artisan.role || '',
        bio: artisan.bio || '',
        avatar: artisan.avatar || '',
        experience: artisan.experience || '',
        specialty: artisan.specialty || '',
        quote: artisan.quote || ''
      });
    } else {
      setEditingArtisan(null);
      setFormData({
        name: '', role: '', bio: '', avatar: '', experience: '', specialty: '', quote: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingArtisan) {
        await updateDoc(doc(db, 'artists', editingArtisan.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'artists'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      fetchArtisans();
      setShowModal(false);
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nghệ nhân này?')) {
      try {
        await deleteDoc(doc(db, 'artists', id));
        setArtisans(artisans.filter(a => a.id !== id));
      } catch (error) {
        alert("Lỗi khi xóa: " + error.message);
      }
    }
  };

  const filteredArtisans = artisans.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.specialty && a.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-artisans">
      <div className="admin-page-header">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm nghệ nhân, chuyên môn..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-add-product" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Thêm nghệ nhân
        </button>
      </div>

      <div className="artisans-grid">
        {loading && artisans.length === 0 ? (
          <div className="loading-state">Đang tải dữ liệu nghệ nhân...</div>
        ) : (
          filteredArtisans.map(artisan => (
            <div key={artisan.id} className="admin-card artisan-card-admin">
              <div className="artisan-card-header">
                <div className="artisan-image-thumb">
                  {artisan.avatar ? <img src={artisan.avatar} alt={artisan.name} /> : <User size={24} />}
                </div>
                <div className="artisan-actions-quick">
                  <button className="btn-icon" onClick={() => handleOpenModal(artisan)}><Edit2 size={16} /></button>
                  <button className="btn-icon text-danger" onClick={() => handleDelete(artisan.id)}><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="artisan-card-body">
                <h3 className="artisan-name">{artisan.name}</h3>
                <p className="artisan-role">{artisan.role || 'Nghệ nhân'}</p>
                <div className="artisan-meta-admin">
                  <span><Award size={14} /> {artisan.experience || 'N/A'}</span>
                  <span><BookOpen size={14} /> {artisan.specialty || 'N/A'}</span>
                </div>
                <p className="artisan-desc-admin">{artisan.bio?.substring(0, 100)}...</p>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="modal-header">
              <h3>{editingArtisan ? 'Chỉnh sửa nghệ nhân' : 'Thêm nghệ nhân mới'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Họ tên nghệ nhân *</label>
                  <input 
                    type="text" required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Chức danh/Vai trò *</label>
                  <input 
                    type="text" required 
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    placeholder="Vd: Nghệ nhân Ưu tú"
                  />
                </div>
                <div className="form-group">
                  <label>Kinh nghiệm</label>
                  <input 
                    type="text" 
                    value={formData.experience}
                    onChange={e => setFormData({...formData, experience: e.target.value})}
                    placeholder="Vd: 40 năm"
                  />
                </div>
                <div className="form-group">
                  <label>Chuyên môn chính</label>
                  <input 
                    type="text" 
                    value={formData.specialty}
                    onChange={e => setFormData({...formData, specialty: e.target.value})}
                    placeholder="Vd: Gốm sứ Bát Tràng"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Ảnh đại diện (URL)</label>
                  <input 
                    type="text" 
                    value={formData.avatar}
                    onChange={e => setFormData({...formData, avatar: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Câu nói tâm đắc (Quote)</label>
                  <input 
                    type="text" 
                    value={formData.quote}
                    onChange={e => setFormData({...formData, quote: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Mô tả chi tiết / Câu chuyện</label>
                  <textarea 
                    rows={5}
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Đang lưu...' : (editingArtisan ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
