// 模拟用户数据
const MOCK_USERS = [
  { 
    id: 1, 
    name: '张三', 
    email: 'zhangsan@example.com', 
    phone: '13800138001', 
    password: '123456',
    balance: 100.00,
    registeredDate: '2025-01-01'
  },
  { 
    id: 2, 
    name: '李四', 
    email: 'lisi@example.com', 
    phone: '13800138002', 
    password: '123456',
    balance: 150.00,
    registeredDate: '2025-01-02'
  },
  { 
    id: 3, 
    name: '王五', 
    email: 'wangwu@example.com', 
    phone: '13800138003', 
    password: '123456',
    balance: 75.00,
    registeredDate: '2025-01-03'
  }
];

/**
 * 用户登录
 * @param {string} identifier - 用户ID或手机号
 * @param {string} password - 用户密码
 * @returns {Promise} 登录结果
 */
export const login = async (identifier, password) => {
  try {
    // 先尝试使用模拟数据进行登录
    const user = MOCK_USERS.find(u => 
      (u.email === identifier || u.phone === identifier || u.id.toString() === identifier) 
      && u.password === password
    );
    
    if (user) {
      // 移除密码字段
      const { password, ...userInfo } = user;
      
      // Store user info in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      localStorage.setItem('isLoggedIn', 'true');
      
      return {
        success: true,
        user: userInfo,
        message: '登录成功'
      };
    }
    
    // 如果模拟数据登录失败，尝试调用真实API
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
 * 设置当前用户信息
 * @param {Object} user - 用户信息
 */
export const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

/**
 * 检查用户是否已登录
 */
export const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

// 导出默认对象
const authService = {
  login,
  logout,
  getCurrentUser,
  setCurrentUser,
  isLoggedIn
};

export default authService;