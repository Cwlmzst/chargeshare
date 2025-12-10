import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './LoginPage.css';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Demo credentials display
  const demoAccounts = [
    { identifier: '1', password: '123456', name: 'John Doe' },
    { identifier: '13800138002', password: '123456', name: 'Jane Smith' },
    { identifier: '3', password: '123456', name: 'Bob Johnson' }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.login(identifier, password);
      if (result.success) {
        console.log('登录成功:', result.user);
        // Redirect to map page
        navigate('/');
      }
    } catch (err) {
      setError(err.message || '登录失败。请检查您的用户ID/手机号和密码。');
      console.error('登录错误:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoIdentifier, demoPassword) => {
    setIdentifier(demoIdentifier);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1>⚡ 充电站系统</h1>
          <p className="subtitle">用户登录</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="identifier">用户ID/手机号:</label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="请输入用户ID或手机号"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">密码:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="demo-section">
            <p className="demo-title">演示账户:</p>
            <div className="demo-accounts">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  type="button"
                  className="demo-btn"
                  onClick={() => handleDemoLogin(account.identifier, account.password)}
                  title={`以 ${account.name} 身份登录`}
                >
                  <span className="demo-name">{account.name}</span>
                  <span className="demo-identifier">ID/手机: {account.identifier}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="info-box">
            <p>👉 点击上方演示账户，或手动输入凭据</p>
            <p>🔑 演示账户默认密码: <strong>123456</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;