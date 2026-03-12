import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Save, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Facebook, 
  Instagram, 
  Youtube,
  Info,
  Check
} from 'lucide-react';
import './AdminSettings.css';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [settings, setSettings] = useState({
    businessName: 'ArtisanVN',
    address: 'Làng gốm Bát Tràng, Gia Lâm, Hà Nội',
    phone: '0987 654 321',
    email: 'contact@artisanvn.vn',
    workingHours: '8:00 - 20:00 (Thứ 2 - Chủ Nhật)',
    mapUrl: '',
    social: {
      facebook: 'https://facebook.com/artisanvn',
      instagram: 'https://instagram.com/artisanvn',
      youtube: 'https://youtube.com/artisanvn'
    },
    footerAbout: 'ArtisanVN là nền tảng kết nối những tâm hồn yêu nghệ thuật thủ công với các bậc thầy nghệ nhân Việt Nam.'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'website');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'website'), {
        ...settings,
        updatedAt: serverTimestamp()
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert("Lỗi khi lưu cấu hình: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-state">Đang tải cấu hình...</div>;

  return (
    <div className="admin-settings">
      <div className="admin-page-header">
        <h2 className="page-title">Cấu Hình Website</h2>
        <button 
          className="btn-primary" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Đang lưu...' : <><Save size={18} /> Lưu thay đổi</>}
        </button>
      </div>

      {showSuccess && (
        <div className="success-banner-modern">
          <Check size={18} /> Cập nhật thông tin website thành công!
        </div>
      )}

      <div className="settings-grid">
        <div className="admin-card">
          <div className="card-header-with-icon">
            <Info size={20} /> <h3>Thông tin chung</h3>
          </div>
          <div className="settings-form-content">
            <div className="form-group">
              <label>Tên thương hiệu</label>
              <input 
                type="text" 
                value={settings.businessName}
                onChange={e => setSettings({...settings, businessName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Giờ làm việc</label>
              <input 
                type="text" 
                value={settings.workingHours}
                onChange={e => setSettings({...settings, workingHours: e.target.value})}
              />
            </div>
            <div className="form-group full-width">
              <label>Mô tả ngắn (Footer)</label>
              <textarea 
                rows={3}
                value={settings.footerAbout}
                onChange={e => setSettings({...settings, footerAbout: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="card-header-with-icon">
            <Globe size={20} /> <h3>Liên hệ & Vị trí</h3>
          </div>
          <div className="settings-form-content">
            <div className="form-group">
              <label><MapPin size={14} /> Địa chỉ văn phòng</label>
              <input 
                type="text" 
                value={settings.address}
                onChange={e => setSettings({...settings, address: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label><Phone size={14} /> Số điện thoại hỗ trợ</label>
              <input 
                type="text" 
                value={settings.phone}
                onChange={e => setSettings({...settings, phone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label><Mail size={14} /> Email liên hệ</label>
              <input 
                type="email" 
                value={settings.email}
                onChange={e => setSettings({...settings, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Google Maps Embed URL</label>
              <input 
                type="text" 
                value={settings.mapUrl}
                onChange={e => setSettings({...settings, mapUrl: e.target.value})}
                placeholder="https://google.com/maps/embed?..."
              />
            </div>
          </div>
        </div>

        <div className="admin-card full-width">
          <div className="card-header-with-icon">
            <Share2 size={20} /> <h3>Mạng xã hội</h3>
          </div>
          <div className="social-inputs-grid">
            <div className="form-group">
              <label><Facebook size={16} color="#1877f2" /> Facebook</label>
              <input 
                type="text" 
                value={settings.social.facebook}
                onChange={e => setSettings({
                  ...settings, 
                  social: {...settings.social, facebook: e.target.value}
                })}
              />
            </div>
            <div className="form-group">
              <label><Instagram size={16} color="#e4405f" /> Instagram</label>
              <input 
                type="text" 
                value={settings.social.instagram}
                onChange={e => setSettings({
                  ...settings, 
                  social: {...settings.social, instagram: e.target.value}
                })}
              />
            </div>
            <div className="form-group">
              <label><Youtube size={16} color="#ff0000" /> Youtube</label>
              <input 
                type="text" 
                value={settings.social.youtube}
                onChange={e => setSettings({
                  ...settings, 
                  social: {...settings.social, youtube: e.target.value}
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dummy Share2 icon as fallback if not in lucide
function Share2({size, className}) {
  return <Globe size={size} className={className} />;
}
