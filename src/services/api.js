import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../config/api.config';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API 端点
export const API = {
  // 充电站相关
  stations: {
    getAll: () => apiClient.get(API_ENDPOINTS.STATIONS.LIST),
    getById: (id) => apiClient.get(API_ENDPOINTS.STATIONS.DETAIL(id)),
    search: (params) => apiClient.get(API_ENDPOINTS.STATIONS.SEARCH, { params }),
    getNearby: (latitude, longitude, radius = 5000) => 
      apiClient.get(API_ENDPOINTS.STATIONS.NEARBY, { params: { latitude, longitude, radius } })
  },
  
  // 预约相关
  bookings: {
    create: (data) => apiClient.post(API_ENDPOINTS.BOOKINGS.CREATE, data),
    getAll: () => apiClient.get(API_ENDPOINTS.BOOKINGS.LIST),
    getById: (id) => apiClient.get(API_ENDPOINTS.BOOKINGS.DETAIL(id)),
    update: (id, data) => apiClient.put(API_ENDPOINTS.BOOKINGS.UPDATE(id), data),
    cancel: (id) => apiClient.post(API_ENDPOINTS.BOOKINGS.CANCEL(id))
  },
  
  // 用户相关
  users: {
    getProfile: () => apiClient.get(API_ENDPOINTS.USERS.PROFILE),
    updateProfile: (data) => apiClient.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, data),
    recharge: (amount) => apiClient.post(API_ENDPOINTS.USERS.RECHARGE, { amount })
  }
};

export default apiClient;
