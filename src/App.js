import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import './App.css';

// 路由懒加载 - 提高初始加载速度
const MapPage = lazy(() => import('./pages/MapPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// 加载中的占位符
const LoadingFallback = () => <div className="loading">加载中...</div>;

function App() {
  return (
    <Router>
      <div className="app-container">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Suspense>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
