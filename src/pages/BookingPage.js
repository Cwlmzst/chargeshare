import React, { useState, useCallback } from 'react';
import { STATION_OPTIONS, HOURLY_RATE, MAX_DURATION } from '../constants/stations';
import './BookingPage.css';

const BookingPage = () => {
  const [formData, setFormData] = useState({
    station: '',
    duration: 1,
    date: new Date().toISOString().split('T')[0]
  });
  const [bookings, setBookings] = useState([
    { id: 1, station: '朝阳门', date: '2025-12-10', duration: 2, status: '进行中', cost: 50 },
    { id: 2, station: '东直门', date: '2025-12-08', duration: 1, status: '已完成', cost: 25 }
  ]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!formData.station) {
      alert('请选择充电站');
      return;
    }

    // 计算费用
    const cost = formData.duration * HOURLY_RATE;

    const newBooking = {
      id: bookings.length + 1,
      station: formData.station,
      date: formData.date,
      duration: formData.duration,
      status: '进行中',
      cost: cost
    };

    setBookings(prev => [newBooking, ...prev]);
    
    // 重置表单
    setFormData({
      station: '',
      duration: 1,
      date: new Date().toISOString().split('T')[0]
    });

    alert('预约成功！');
  }, [formData.station, formData.duration, formData.date, bookings.length]);

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>预约充电</h1>
      </div>

      <div className="page-content">
        <div className="booking-form-section">
          <h2>新建预约</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>选择充电站 *</label>
              <select 
                name="station" 
                value={formData.station}
                onChange={handleInputChange}
                required
              >
                <option value="">-- 选择充电站 --</option>
                {STATION_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>充电时长 (小时) *</label>
              <div className="duration-input">
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    duration: Math.max(1, prev.duration - 1)
                  }))}
                >
                  −
                </button>
                <input 
                  type="number" 
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="1"
                  max={MAX_DURATION}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    duration: Math.min(12, prev.duration + 1)
                  }))}
                >
                  +
                </button>
              </div>
              <p className="form-help">预计费用: ¥{formData.duration * HOURLY_RATE}</p>
            </div>

            <div className="form-group">
              <label>充电日期 *</label>
              <input 
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              确认预约
            </button>
          </form>
        </div>

        <div className="bookings-section">
          <h2>我的预约</h2>
          {bookings.length === 0 ? (
            <p className="no-data">暂无预约</p>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-info">
                    <h3>{booking.station}</h3>
                    <p>日期: {booking.date}</p>
                    <p>时长: {booking.duration} 小时</p>
                    <p>费用: ¥{booking.cost}</p>
                  </div>
                  <div className={`booking-status ${booking.status === '进行中' ? 'active' : 'completed'}`}>
                    {booking.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
