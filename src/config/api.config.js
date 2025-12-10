// API 配置文件
// 支持在开发和生产环境中切换后端地址

const isDevelopment = process.env.NODE_ENV === 'development';

// 后端服务地址配置
export const API_CONFIG = {
  // 开发环境：本地Java后端
  // 生产环境：实际部署的服务器地址
  baseURL: isDevelopment 
    ? 'http://localhost:8080/javaweb' 
    : 'http://your-production-server:8080/javaweb',
  
  // API 超时时间（毫秒）
  timeout: 10000,
  
  // 是否使用模拟数据（用于测试）
  useMockData: false  // 改为 true 时使用本地模拟数据
};

// API 端点定义
export const API_ENDPOINTS = {
  // 充电站相关
  STATIONS: {
    LIST: '/api/stations',           // 获取所有充电站
    DETAIL: (id) => `/api/stations/${id}`,  // 获取充电站详情
    SEARCH: '/api/stations/search',  // 搜索充电站
    NEARBY: '/api/stations/nearby'   // 获取附近充电站
  },
  
  // 预约相关
  BOOKINGS: {
    CREATE: '/api/bookings',         // 创建预约
    LIST: '/api/bookings',           // 获取所有预约
    DETAIL: (id) => `/api/bookings/${id}`,  // 获取预约详情
    UPDATE: (id) => `/api/bookings/${id}`,  // 更新预约
    CANCEL: (id) => `/api/bookings/${id}/cancel`  // 取消预约
  },
  
  // 用户相关
  USERS: {
    PROFILE: '/api/users/profile',   // 获取用户信息
    UPDATE_PROFILE: '/api/users/profile',  // 更新用户信息
    RECHARGE: '/api/users/recharge'  // 充值
  }
};

export default API_CONFIG;
