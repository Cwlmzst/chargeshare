import { API } from './api';

/**
 * 用户登录
 * @param {string} identifier - 用户ID或手机号
 * @param {string} password - 用户密码
 * @returns {Promise} 登录结果
 */
export const login = async (identifier, password) => {
  try {
    const response = await fetch('http://localhost:8080/javaweb/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: `identifier=${encodeURIComponent(identifier)}&password=${encodeURIComponent(password)}`
    });

    const data = await response.json();
    
    if (data.success) {
      // Store user info in localStorage
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('isLoggedIn', 'true');
      return data;
    } else {
      throw new Error(data.message || '登录失败');
    }
  } catch (error) {
    console.error('登录错误:', error);
    throw error;
  }
};

/**
 * 用户登出
 */
export const logout = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isLoggedIn');
};

/**
 * 获取当前登录用户信息
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

/**
 * 检查用户是否已登录
 */
export const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export default {
  login,
  logout,
  getCurrentUser,
  isLoggedIn
};