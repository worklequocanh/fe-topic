import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-id">404</div>
        <div className="not-found-vase">
          {/* Một biểu tượng đại diện cho đồ thủ công bị vỡ hoặc nhạt nhòa */}
          <div className="vase-shape"></div>
          <div className="vase-crack"></div>
        </div>
        <h1>Tuyệt tác này không tìm thấy...</h1>
        <p>Có vẻ như đường dẫn bạn đang tìm kiếm đã bị thất lạc trong quá trình chế tác hoặc không còn tồn tại.</p>
        
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">
            <Home size={18} /> Quay về trang chủ
          </Link>
          <button onClick={() => window.history.back()} className="btn-outline">
            <ArrowLeft size={18} /> Quay lại trang trước
          </button>
        </div>
      </div>
    </div>
  );
}
