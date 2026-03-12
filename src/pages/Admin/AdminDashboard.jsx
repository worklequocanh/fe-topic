export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="admin-card">
        <h3>Chào mừng trở lại, Admin!</h3>
        <p>Chọn một mục từ menu bên trái để bắt đầu quản lý hệ thống.</p>
      </div>
      
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="admin-card" style={{ borderLeft: '4px solid #3498db' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>Đơn hàng mới</p>
          <h2 style={{ margin: '10px 0' }}>12</h2>
          <span style={{ color: '#2ecc71', fontSize: '12px' }}>+20% so với hôm qua</span>
        </div>
        <div className="admin-card" style={{ borderLeft: '4px solid #2ecc71' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>Doanh thu</p>
          <h2 style={{ margin: '10px 0' }}>45.200.000đ</h2>
          <span style={{ color: '#2ecc71', fontSize: '12px' }}>+5% so với tháng trước</span>
        </div>
        <div className="admin-card" style={{ borderLeft: '4px solid #f39c12' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>Sản phẩm</p>
          <h2 style={{ margin: '10px 0' }}>48</h2>
          <span style={{ color: '#666', fontSize: '12px' }}>Tất cả các sản phẩm active</span>
        </div>
      </div>
    </div>
  );
}
