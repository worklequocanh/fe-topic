import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { 
  Layout, 
  Image as ImageIcon, 
  Star, 
  Save,
  Check
} from 'lucide-react';
import './AdminHomeCMS.css';

export default function AdminHomeCMS() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bannersSnap, prodsSnap] = await Promise.all([
        getDocs(collection(db, 'banners')),
        getDocs(collection(db, 'products'))
      ]);
      
      const bList = bannersSnap.docs.map(d => ({id: d.id, ...d.data()}));
      const pList = prodsSnap.docs.map(d => ({id: d.id, ...d.data()}));
      
      setBanners(bList);
      setAllProducts(pList);
    } catch (error) {
      console.error("Error fetching CMS data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (product) => {
    const isFeatured = !product.featured;
    try {
      // Update local state by changing 'featured' property in allProducts
      setAllProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, featured: isFeatured } : p
      ));
      
      // Update Firebase
      await setDoc(doc(db, 'products', product.id), { featured: isFeatured }, { merge: true });
    } catch (error) {
      console.error("Error updating featured status:", error);
    }
  };

  if (loading) return <div className="loading-state">Đang tải cấu hình trang chủ...</div>;

  return (
    <div className="admin-cms">
      <div className="admin-page-header">
        <h2 className="page-title">Quản Lý Trang Chủ</h2>
      </div>

      <div className="cms-sections">
        {/* Banner Section */}
        <section className="cms-section">
          <div className="section-header-admin">
            <h3><ImageIcon size={20} /> Quản lý Banner Slide</h3>
            <p className="subtitle">Chỉnh sửa nội dung trình chiếu nổi bật đầu trang chủ.</p>
          </div>
          <div className="banners-list-admin">
            {banners.map((banner) => (
              <div key={banner.id} className="admin-card banner-edit-card">
                <div className="banner-preview-small">
                  <img src={banner.image} alt={banner.title} />
                </div>
                <div className="banner-form-inputs">
                  <input 
                    type="text" 
                    placeholder="Tiêu đề chính" 
                    defaultValue={banner.title} 
                    className="input-flush"
                  />
                  <input 
                    type="text" 
                    placeholder="Mô tả phụ" 
                    defaultValue={banner.subtitle}
                    className="input-flush subtitle"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products Selection */}
        <section className="cms-section">
          <div className="section-header-admin">
            <h3><Star size={20} /> Sản phẩm nổi bật (Trang chủ)</h3>
            <p className="subtitle">Chọn các sản phẩm sẽ xuất hiện trong phần "Sản phẩm nổi bật".</p>
          </div>
          <div className="featured-selector-grid">
            {allProducts.map(product => (
              <div 
                key={product.id} 
                className={`product-select-card ${product.featured ? 'active' : ''}`}
                onClick={() => handleToggleFeatured(product)}
              >
                <div className="prod-select-thumb">
                  <img src={product.image} alt={product.name} />
                  {product.featured && <div className="featured-check"><Check size={12} /></div>}
                </div>
                <p className="prod-select-name">{product.name}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="admin-floating-actions">
        <button className="btn-primary" onClick={() => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        }}>
          <Save size={18} /> Lưu toàn bộ cấu hình
        </button>
      </div>
      
      {showSuccess && (
        <div className="success-toast">Cấu hình trang chủ đã được lưu!</div>
      )}
    </div>
  );
}
