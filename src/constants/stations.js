// 充电站常量数据
export const MOCK_STATIONS = [
  { id: 1, stationId: 1, location: '朝阳门', lat: 39.9173, lng: 116.4152, available: true, price: 5.0, maxDuration: 8 },
  { id: 2, stationId: 2, location: '东直门', lat: 39.9496, lng: 116.4352, available: true, price: 7.0, maxDuration: 12 },
  { id: 3, stationId: 3, location: '建国门', lat: 39.9110, lng: 116.4197, available: false, price: 4.5, maxDuration: 6 },
  { id: 4, stationId: 4, location: '天安门广场', lat: 39.9075, lng: 116.3972, available: true, price: 6.0, maxDuration: 10 },
  { id: 5, stationId: 5, location: '故宫', lat: 39.9246, lng: 116.3967, available: false, price: 5.5, maxDuration: 8 }
];

export const STATION_OPTIONS = [
  { value: '朝阳门', label: '朝阳门 - $0.25/分钟' },
  { value: '东直门', label: '东直门 - $0.25/分钟' },
  { value: '建国门', label: '建国门 - $0.25/分钟' },
  { value: '天安门广场', label: '天安门广场 - $0.25/分钟' },
  { value: '故宫', label: '故宫 - $0.25/分钟' }
];

export const HOURLY_RATE = 25; // 每小时费用（元）
export const MAX_DURATION = 12; // 最大充电时长
