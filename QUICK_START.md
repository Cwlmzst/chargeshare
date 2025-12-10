# 前后端集成项目 - 快速开始指南

## 项目架构

```
D:\java_proj\
├── javaweb/              # Java 后端项目
│   └── src/
│       ├── ChargingStation.java
│       ├── ChargingStationManager.java
│       ├── User.java
│       ├── Booking.java
│       ├── StationListServlet.java
│       ├── BookingServlet.java
│       ├── UserServlet.java
│       └── [新增 API Servlets...]
│
└── javaweb-client/       # React 前端项目
    ├── src/
    │   ├── pages/
    │   │   ├── MapPage.js          # 地图定位页面
    │   │   ├── BookingPage.js
    │   │   └── ProfilePage.js
    │   ├── services/
    │   │   ├── api.js              # API 客户端
    │   │   └── stationService.js   # 充电站服务层
    │   ├── config/
    │   │   └── api.config.js       # API 配置
    │   ├── constants/
    │   │   └── stations.js         # 模拟数据
    │   └── components/
    └── package.json
```

## 快速开始

### 第一步：启动 React 前端

```bash
# 进入前端目录
cd D:\java_proj\javaweb-client

# 安装依赖（如果还没安装）
npm install

# 启动开发服务器（http://localhost:3000）
npm start
```

### 第二步：配置和启动 Java 后端

1. **添加 Java 源文件** 到 `D:\java_proj\javaweb\src\`：
   - `CorsFilter.java` - CORS 过滤器
   - `JsonUtil.java` - JSON 工具类
   - `StationsApiServlet.java` - 充电站列表 API
   - `StationDetailApiServlet.java` - 单个充电站 API
   - `NearbyStationsApiServlet.java` - 附近充电站 API

2. **更新现有文件**：
   - `ChargingStation.java` - 添加 latitude/longitude
   - `ChargingStationManager.java` - 初始化数据时添加坐标

3. **编译并部署**：
   ```bash
   # 在 IDE 中编译或使用命令行
   cd D:\java_proj\javaweb
   # javac -d bin src/*.java (示例)
   ```

4. **部署到 Tomcat**：
   - 将编译后的 war 文件部署到 Tomcat
   - 确保运行在 `http://localhost:8080/javaweb`

### 第三步：测试集成

#### 方式 1：使用模拟数据（开发模式）

编辑 `src/config/api.config.js`：
```javascript
useMockData: true  // 启用模拟数据
```

前端会直接使用本地的模拟充电站数据，无需后端。

#### 方式 2：连接真实后端

编辑 `src/config/api.config.js`：
```javascript
useMockData: false  // 禁用模拟数据，使用真实 API
```

前端会调用 `http://localhost:8080/javaweb/api/stations` 等接口。

## 核心功能

### 1. 地图定位（MapPage.js）

**功能**：
- ✅ 显示充电站列表
- ✅ 点击按钮获取用户位置
- ✅ 地图自动定位到用户位置
- ✅ 自动刷新附近充电站

**API 调用**：
```javascript
// 获取所有充电站
const stations = await stationService.getAllStations();

// 获取附近充电站
const nearby = await stationService.getNearbyStations(lat, lng, radius);
```

### 2. 预约功能（BookingPage.js）

**API 端点**：
- `POST /api/bookings` - 创建预约
- `GET /api/bookings` - 获取所有预约
- `PUT /api/bookings/{id}` - 更新预约
- `POST /api/bookings/{id}/cancel` - 取消预约

### 3. 用户信息（ProfilePage.js）

**API 端点**：
- `GET /api/users/profile` - 获取用户信息
- `PUT /api/users/profile` - 更新用户信息
- `POST /api/users/recharge` - 充值

## API 文档

### 充电站接口

#### 1. 获取所有充电站
```
GET /api/stations

响应示例：
[
  {
    "id": 1,
    "stationId": 1,
    "location": "朝阳门",
    "available": true,
    "price": 5.0,
    "maxDuration": 8,
    "lat": 39.9173,
    "lng": 116.4152
  },
  ...
]
```

#### 2. 获取单个充电站
```
GET /api/stations/1

响应示例：
{
  "id": 1,
  "stationId": 1,
  "location": "朝阳门",
  "available": true,
  "price": 5.0,
  "maxDuration": 8,
  "lat": 39.9173,
  "lng": 116.4152
}
```

#### 3. 获取附近充电站
```
GET /api/stations/nearby?latitude=39.9173&longitude=116.4152&radius=5000

参数：
- latitude: 用户纬度（必需）
- longitude: 用户经度（必需）
- radius: 搜索半径，单位米（可选，默认 5000）

响应示例：
[
  {
    "id": 1,
    "location": "朝阳门",
    "available": true,
    "lat": 39.9173,
    "lng": 116.4152,
    "distance": 2350  // 距离用户的距离（米）
  },
  ...
]
```

## 测试步骤

### 1. 测试前端

```bash
# 在前端项目目录
cd D:\java_proj\javaweb-client

# 检查编译
npm run build

# 运行测试（如果有）
npm test
```

### 2. 测试后端 API（使用 curl）

```bash
# 测试 CORS 预检
curl -X OPTIONS http://localhost:8080/javaweb/api/stations -H "Access-Control-Request-Method: GET"

# 获取所有充电站
curl http://localhost:8080/javaweb/api/stations

# 获取单个充电站
curl http://localhost:8080/javaweb/api/stations/1

# 获取附近充电站
curl "http://localhost:8080/javaweb/api/stations/nearby?latitude=39.9173&longitude=116.4152&radius=5000"
```

### 3. 在浏览器中测试

1. 打开 http://localhost:3000
2. 进入"地图"页面
3. 点击"📍 定位"按钮获取位置
4. 观察地图和充电站列表是否更新

## 常见问题解决

### 问题 1：CORS 错误
**错误信息**：`Access to XMLHttpRequest has been blocked by CORS policy`

**解决方案**：
1. 确认后端已添加 `CorsFilter.java`
2. 检查过滤器配置是否正确
3. 确认后端返回了正确的 CORS 头：
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   ```

### 问题 2：后端连接失败
**错误信息**：`Network Error` 或 `Cannot reach server`

**解决方案**：
1. 检查 Java 应用是否正在运行
2. 验证 URL 是否正确：`http://localhost:8080/javaweb`
3. 检查防火墙设置
4. 在浏览器中手动访问 `http://localhost:8080/javaweb/api/stations` 测试

### 问题 3：坐标不显示
**错误信息**：地图上没有看到充电站标记或用户位置

**解决方案**：
1. 检查浏览器控制台是否有 JavaScript 错误
2. 验证坐标是否在地图范围内（北京：39.5-40.0, 116.0-116.6）
3. 确认高德地图 API Key 是否有效

### 问题 4：定位超时
**错误信息**：`获取位置超时`

**解决方案**：
1. 确保设备定位服务已启用
2. 移到室外重试（GPS 信号更好）
3. 允许浏览器访问位置信息
4. 检查网络连接

## 开发技巧

### 快速切换模式

**使用模拟数据开发**（推荐）：
```javascript
// src/config/api.config.js
useMockData: true
```

**使用真实 API 测试**：
```javascript
// src/config/api.config.js
useMockData: false
```

### 调试 API 请求

在 `src/services/stationService.js` 中已添加日志：
```javascript
console.log('调用真实API获取充电站列表');
console.log('API调用失败，降级使用模拟数据');
```

在浏览器开发者工具（F12）的 Console 标签页中查看这些日志。

### 检查网络请求

1. 打开浏览器开发者工具（F12）
2. 转到 Network 标签页
3. 进行操作（点击定位、加载地图等）
4. 查看 API 请求和响应

## 部署到生产环境

### 前端部署

```bash
# 构建生产版本
npm run build

# 输出到 build/ 目录
# 可以部署到 Nginx、Apache 或任何静态文件服务器
```

### 后端部署

1. 编译 Java 项目
2. 创建 WAR 文件
3. 部署到 Tomcat/Jetty
4. 配置应用服务器和数据库连接

### 更新 API 地址

编辑 `src/config/api.config.js`：
```javascript
baseURL: isDevelopment 
  ? 'http://localhost:8080/javaweb' 
  : 'https://your-production-domain.com/javaweb'  // 改为生产地址
```

## 下一步任务

- [ ] 实现数据库持久化
- [ ] 添加用户认证（登录/注册）
- [ ] 优化地图性能（聚类标记）
- [ ] 添加搜索和过滤功能
- [ ] 实现预约流程
- [ ] 添加支付功能
- [ ] 性能优化和缓存
- [ ] 单元测试和集成测试

## 参考资源

- [高德地图 API 文档](https://lbs.amap.com/api)
- [React 官方文档](https://react.dev)
- [Servlet API 文档](https://tomcat.apache.org)
- [Axios 文档](https://axios-http.com)

## 支持

如有问题，请检查：
1. 浏览器控制台（F12 → Console）
2. 网络请求（F12 → Network）
3. 后端日志
4. 防火墙和代理设置
