import React, { useState, useCallback } from 'react';
import authService from '../services/authService';
import './ProfilePage.css';

const ProfilePage = () => {
  const currentUser = authService.getCurrentUser();
  
  const [user, setUser] = useState({
    id: currentUser?.id || 1,
    name: currentUser?.name || '张三',
    email: currentUser?.email || 'zhangsan@example.com',
    phone: currentUser?.phone || '13800138000',
    balance: currentUser?.balance || 250,
    registeredDate: currentUser?.registeredDate || '2025-01-01'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user);

  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSave = useCallback(() => {
    setUser(editData);
    setIsEditing(false);
    // 更新本地存储的用户信息
    const updatedUser = { ...authService.getCurrentUser(), ...editData };
    authService.setCurrentUser(updatedUser);
    alert('信息保存成功！');
  }, [editData]);

  const handleCancel = useCallback(() => {
    setEditData(user);
    setIsEditing(false);
  }, [user]);

  const handleRecharge = useCallback(() => {
    const amount = prompt('请输入充值金额 (¥):');
    if (amount && !isNaN(amount) && amount > 0) {
      const rechargeAmount = parseFloat(amount);
      const newBalance = parseFloat(user.balance) + rechargeAmount;
      setUser(prev => ({
        ...prev,
        balance: newBalance
      }));
      
      // 更新本地存储的用户信息
      const updatedUser = { ...authService.getCurrentUser(), balance: newBalance };
      authService.setCurrentUser(updatedUser);
      
      alert(`充值成功！已充值 ¥${rechargeAmount.toFixed(2)}`);
    }
  }, [user.balance]);

  const handleLogout = useCallback(() => {
    if (window.confirm('确定要退出登录吗？')) {
      authService.logout();
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>我的</h1>
      </div>

      <div className="page-content">
        {/* 用户卡片 */}
        <div className="user-card">
          <div className="user-avatar">
            <span>{user.name.charAt(0)}</span>
          </div>
          <div className="user-basic-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        {/* 账户余额 */}
        <div className="balance-card">
          <div className="balance-info">
            <p className="label">账户余额</p>
            <h3 className="amount">¥{parseFloat(user.balance).toFixed(2)}</h3>
          </div>
          <button onClick={handleRecharge} className="recharge-btn">
            充值
          </button>
        </div>

        {/* 用户信息 */}
        <div className="info-section">
          <div className="section-header">
            <h3>个人信息</h3>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                编辑
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="info-list">
              <div className="info-item">
                <span className="label">姓名</span>
                <span className="value">{user.name}</span>
              </div>
              <div className="info-item">
                <span className="label">邮箱</span>
                <span className="value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="label">电话</span>
                <span className="value">{user.phone || '未设置'}</span>
              </div>
              <div className="info-item">
                <span className="label">注册日期</span>
                <span className="value">{user.registeredDate || '未知'}</span>
              </div>
            </div>
          ) : (
            <div className="edit-form">
              <div className="form-group">
                <label>姓名</label>
                <input 
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label>邮箱</label>
                <input 
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label>电话</label>
                <input 
                  type="tel"
                  name="phone"
                  value={editData.phone || ''}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-actions">
                <button onClick={handleSave} className="save-btn">保存</button>
                <button onClick={handleCancel} className="cancel-btn">取消</button>
              </div>
            </div>
          )}
        </div>

        {/* 其他选项 */}
        <div className="menu-section">
          <div className="menu-item">
            <span>📋 充电历史</span>
            <span className="arrow">›</span>
          </div>
          <div className="menu-item">
            <span>⭐ 我的收藏</span>
            <span className="arrow">›</span>
          </div>
          <div className="menu-item">
            <span>🎟️ 优惠券</span>
            <span className="arrow">›</span>
          </div>
          <div className="menu-item">
            <span>⚙️ 设置</span>
            <span className="arrow">›</span>
          </div>
          <div className="menu-item">
            <span>📞 联系客服</span>
            <span className="arrow">›</span>
          </div>
        </div>

        {/* 退出登录 */}
        <button onClick={handleLogout} className="logout-btn">
          退出登录
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;