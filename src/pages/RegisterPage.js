import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Reuse the same styles as login page

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!name.trim()) {
      setError('姓名是必填项');
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError('邮箱是必填项');
      setLoading(false);
      return;
    }

    // Basic email validation
    if (!email.includes('@') || !email.includes('.')) {
      setError('请输入有效的邮箱地址');
      setLoading(false);
      return;
    }

    if (!password) {
      setError('密码是必填项');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少6位');
      setLoading(false);
      return;
    }

    try {
      // Call backend API to register user
      const response = await fetch('http://localhost:8080/javaweb/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}`
      });

      const data = await response.json();

      if (data.success) {
        // Registration successful, redirect to login page
        alert('注册成功！请使用您的邮箱和密码登录。');
        navigate('/login');
      } else {
        setError(data.message || '注册失败，请稍后重试');
      }
    } catch (err) {
      setError('网络错误，请检查您的连接并重试');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1>⚡ 充电站系统</h1>
          <p className="subtitle">用户注册</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="name">姓名:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入您的姓名"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">邮箱:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入您的邮箱"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">手机号 (可选):</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入您的手机号"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">密码:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码（至少6位）"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">确认密码:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请再次输入密码"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <div className="info-box">
            <p>已有账户？<button type="button" onClick={() => navigate('/login')} className="link-button">立即登录</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;