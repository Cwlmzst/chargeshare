import React, { memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav">
      <div 
        className={`nav-item ${isActive('/') ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <span className="icon">🗺️</span>
        <span className="label">地图</span>
      </div>
      <div 
        className={`nav-item ${isActive('/booking') ? 'active' : ''}`}
        onClick={() => navigate('/booking')}
      >
        <span className="icon">🔋</span>
        <span className="label">预约</span>
      </div>
      <div 
        className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
        onClick={() => navigate('/profile')}
      >
        <span className="icon">👤</span>
        <span className="label">我的</span>
      </div>
    </nav>
  );
});

export default BottomNav;
