import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { 
  Search, 
  Trash2, 
  Mail, 
  User, 
  Clock, 
  CheckCircle, 
  X,
  MessageSquare,
  Eye,
  Filter
} from 'lucide-react';
import './AdminMessages.css';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedMessages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) {
      try {
        await deleteDoc(doc(db, 'contacts', id));
        setMessages(messages.filter(m => m.id !== id));
      } catch (error) {
        alert("Lỗi khi xóa: " + error.message);
      }
    }
  };

  const markAsRead = async (message) => {
    if (message.status === 'read') return;
    try {
      await updateDoc(doc(db, 'contacts', message.id), {
        status: 'read'
      });
      setMessages(messages.map(m => m.id === message.id ? { ...m, status: 'read' } : m));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleOpenDetail = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
    markAsRead(message);
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'unread' && m.status !== 'read') ||
                         (statusFilter === 'read' && m.status === 'read');
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleString('vi-VN');
  };

  return (
    <div className="admin-messages">
      <div className="admin-page-header">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo tên, email, chủ đề..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả tin nhắn</option>
            <option value="unread">Chưa đọc</option>
            <option value="read">Đã đọc</option>
          </select>
        </div>
      </div>

      <div className="admin-card no-padding overflow-hidden">
        {loading && messages.length === 0 ? (
          <div className="loading-state">Đang tải tin nhắn...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Chủ đề</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map(msg => (
                <tr key={msg.id} className={msg.status !== 'read' ? 'unread-row' : ''}>
                  <td>
                    <div className="customer-cell">
                      <p className="font-semibold">{msg.name}</p>
                      <p className="text-xs text-gray">{msg.email}</p>
                    </div>
                  </td>
                  <td className="subject-cell">{msg.subject || 'Liên hệ mới'}</td>
                  <td>{formatDate(msg.createdAt)}</td>
                  <td>
                    {msg.status === 'read' ? (
                      <span className="status-label read"><CheckCircle size={14} /> Đã xem</span>
                    ) : (
                      <span className="status-label unread"><MessageSquare size={14} /> Mới</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleOpenDetail(msg)} title="Xem chi tiết">
                        <Eye size={16} />
                      </button>
                      <button className="btn-icon text-danger" onClick={() => handleDelete(msg.id)} title="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && selectedMessage && (
        <div className="admin-modal-overlay">
          <div className="admin-modal message-detail-modal">
            <div className="modal-header">
              <h3>Chi tiết tin nhắn</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-content-msg">
              <div className="msg-header-info">
                <div className="msg-info-item">
                  <User size={18} />
                  <div>
                    <p className="label">Người gửi</p>
                    <p className="value">{selectedMessage.name}</p>
                  </div>
                </div>
                <div className="msg-info-item">
                  <Mail size={18} />
                  <div>
                    <p className="label">Email</p>
                    <p className="value">{selectedMessage.email}</p>
                  </div>
                </div>
                <div className="msg-info-item">
                  <Clock size={18} />
                  <div>
                    <p className="label">Thời gian</p>
                    <p className="value">{formatDate(selectedMessage.createdAt)}</p>
                  </div>
                </div>
              </div>
              <div className="msg-body">
                <p className="msg-subject-label">Chủ đề: {selectedMessage.subject || 'N/A'}</p>
                <div className="msg-text">
                  {selectedMessage.message}
                </div>
              </div>
              <div className="modal-footer">
                <a href={`mailto:${selectedMessage.email}`} className="btn-primary">
                  <Mail size={16} style={{marginRight: '8px'}} /> Trả lời qua Email
                </a>
                <button className="btn-outline" onClick={() => setShowModal(false)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
