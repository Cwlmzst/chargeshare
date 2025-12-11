// 充电站常量数据 - 南京地区充电站
export const MOCK_STATIONS = [
  { id: 1, stationId: 1, name: '南京鼓楼充电站', location: '南京鼓楼充电站', lat: 32.05840000, lng: 118.77750000, latitude: 32.05840000, longitude: 118.77750000, availableSockets: 6, totalSockets: 10, powerOutput: 7.00, pricePerHour: 5.50, status: 'ACTIVE', address: '南京市鼓楼区中山路1号', description: '市中心充电站，24小时服务' },
  { id: 2, stationId: 2, name: '南京玄武充电站', location: '南京玄武充电站', lat: 32.05000000, lng: 118.80000000, latitude: 32.05000000, longitude: 118.80000000, availableSockets: 8, totalSockets: 8, powerOutput: 3.50, pricePerHour: 3.50, status: 'ACTIVE', address: '南京市玄武区玄武巷1号', description: '玄武湖公园附近，快充服务' },
  { id: 3, stationId: 3, name: '南京江宁充电站', location: '南京江宁充电站', lat: 31.95390000, lng: 118.87200000, latitude: 31.95390000, longitude: 118.87200000, availableSockets: 4, totalSockets: 12, powerOutput: 10.00, pricePerHour: 5.00, status: 'ACTIVE', address: '南京市江宁区双龙大道1号', description: '江宁区主要充电站，快充服务' },
  { id: 4, stationId: 4, name: '南京建邺充电站', location: '南京建邺充电站', lat: 32.00430000, lng: 118.73270000, latitude: 32.00430000, longitude: 118.73270000, availableSockets: 2, totalSockets: 6, powerOutput: 11.00, pricePerHour: 6.50, status: 'ACTIVE', address: '南京市建邺区江东中路1号', description: '建邺区超级充电站' },
  { id: 5, stationId: 5, name: '南京浦口充电站', location: '南京浦口充电站', lat: 32.07000000, lng: 118.62000000, latitude: 32.07000000, longitude: 118.62000000, availableSockets: 4, totalSockets: 4, powerOutput: 7.00, pricePerHour: 4.50, status: 'ACTIVE', address: '南京市浦口区文德路1号', description: '浦口区充电站，24小时服务' },
  { id: 6, stationId: 6, name: '南京雨花台充电站', location: '南京雨花台充电站', lat: 31.99160000, lng: 118.77000000, latitude: 31.99160000, longitude: 118.77000000, availableSockets: 5, totalSockets: 8, powerOutput: 7.50, pricePerHour: 5.20, status: 'ACTIVE', address: '南京市雨花台区软件大道1号', description: '软件谷附近，上班族便利' },
  { id: 7, stationId: 7, name: '南京栖霞充电站', location: '南京栖霞充电站', lat: 32.12000000, lng: 118.88000000, latitude: 32.12000000, longitude: 118.88000000, availableSockets: 3, totalSockets: 6, powerOutput: 3.50, pricePerHour: 3.20, status: 'ACTIVE', address: '南京市栖霞区仙林大学城', description: '大学城充电站，学生优惠' },
  { id: 8, stationId: 8, name: '南京秦淮充电站', location: '南京秦淮充电站', lat: 32.02000000, lng: 118.79000000, latitude: 32.02000000, longitude: 118.79000000, availableSockets: 1, totalSockets: 5, powerOutput: 5.00, pricePerHour: 4.80, status: 'ACTIVE', address: '南京市秦淮区夫子庙附近', description: '旅游区充电站，景点附近' }
];

export const STATION_OPTIONS = [
  { value: '南京鼓楼充电站', label: '南京鼓楼充电站 - ¥5.50/小时' },
  { value: '南京玄武充电站', label: '南京玄武充电站 - ¥3.50/小时' },
  { value: '南京江宁充电站', label: '南京江宁充电站 - ¥5.00/小时' },
  { value: '南京建邺充电站', label: '南京建邺充电站 - ¥6.50/小时' },
  { value: '南京浦口充电站', label: '南京浦口充电站 - ¥4.50/小时' }
];

export const HOURLY_RATE = 5.50; // 默认每小时费用（元）
export const MAX_DURATION = 12; // 最大充电时长