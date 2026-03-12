import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';
import { Lock, User, ShieldCheck, AlertCircle } from 'lucide-react';
import './AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (login(username, password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Tài khoản hoặc mật khẩu không chính xác!');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon">
            <ShieldCheck size={32} />
          </div>
          <h2>Admin Portal</h2>
          <p>Đăng nhập để quản lý ArtisanVN</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <div className="form-group">
            <label><User size={16} /> Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tài khoản"
              required
            />
          </div>

          <div className="form-group">
            <label><Lock size={16} /> Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Đăng Nhập Hệ Thống
          </button>
        </form>

        <div className="login-footer">
          <p>&copy; 2024 ArtisanVN Administration</p>
        </div>
      </div>
    </div>
  );
}
