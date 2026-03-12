import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { 
  Star, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Search,
  Filter,
  User,
  Package
} from 'lucide-react';
import './AdminReviews.css';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'reviews'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedReviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'reviews', id), {
        status: newStatus
      });
      setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      try {
        await deleteDoc(doc(db, 'reviews', id));
        setReviews(reviews.filter(r => r.id !== id));
      } catch (error) {
        alert("Lỗi khi xóa: " + error.message);
      }
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      (r.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (r.comment?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (r.productName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        fill={i < rating ? "#f1c40f" : "none"} 
        stroke={i < rating ? "#f1c40f" : "#ccc"} 
      />
    ));
  };

  return (
    <div className="admin-reviews">
      <div className="admin-page-header">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo tên khách, nội dung, sản phẩm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã hiện</option>
            <option value="hidden">Đã ẩn</option>
          </select>
        </div>
      </div>

      <div className="admin-card no-padding overflow-hidden">
        {loading && reviews.length === 0 ? (
          <div className="loading-state">Đang tải danh sách đánh giá...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Đánh giá</th>
                <th>Nội dung</th>
                <th>Ngày</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length > 0 ? filteredReviews.map(review => (
                <tr key={review.id}>
                  <td>
                    <div className="flex-center gap-2">
                       <div className="user-avatar-small">{review.userName?.charAt(0) || 'U'}</div>
                       <span>{review.userName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      <p className="font-semibold">{review.productName || 'N/A'}</p>
                      <p className="text-gray-xs">ID: {review.productId?.substring(0, 8)}</p>
                    </div>
                  </td>
                  <td>
                    <div className="stars-row">{renderStars(review.rating)}</div>
                  </td>
                  <td>
                    <div className="review-comment-cell" title={review.comment}>
                      {review.comment}
                    </div>
                  </td>
                  <td>{new Date(review.date).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={`status-pill ${review.status || 'pending'}`}>
                      {review.status === 'approved' ? 'Đang hiện' : review.status === 'hidden' ? 'Đã ẩn' : 'Chờ duyệt'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {review.status !== 'approved' && (
                        <button className="btn-icon text-success" onClick={() => handleUpdateStatus(review.id, 'approved')} title="Phê duyệt">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {review.status !== 'hidden' && (
                        <button className="btn-icon text-warning" onClick={() => handleUpdateStatus(review.id, 'hidden')} title="Ẩn đánh giá">
                          <XCircle size={16} />
                        </button>
                      )}
                      <button className="btn-icon text-danger" onClick={() => handleDelete(review.id)} title="Xóa vĩnh viễn">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="text-center py-8">Không tìm thấy đánh giá nào</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
