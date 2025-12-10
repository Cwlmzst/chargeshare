import axios from 'axios';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/javaweb',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API 端点
export const API = {
  // 充电站相关
  stations: {
    getAll: () => apiClient.get('/stations'),
    getById: (id) => apiClient.get(`/stations/${id}`),
    search: (params) => apiClient.get('/stations/search', { params })
  },
  
  // 预约相关
  bookings: {
    create: (data) => apiClient.post('/bookings', data),
    getAll: () => apiClient.get('/bookings'),
    getById: (id) => apiClient.get(`/bookings/${id}`),
    update: (id, data) => apiClient.put(`/bookings/${id}`, data),
    delete: (id) => apiClient.delete(`/bookings/${id}`)
  },
  
  // 用户相关
  users: {
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (data) => apiClient.put('/users/profile', data),
    recharge: (amount) => apiClient.post('/users/recharge', { amount })
  }
};

export default apiClient;
