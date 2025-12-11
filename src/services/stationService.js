/**
 * 充电站服务 - 支持模拟数据和真实API的切换
 */

import { API } from './api';
import { MOCK_STATIONS } from '../constants/stations';
import { API_CONFIG } from '../config/api.config';

// 计算两点之间的距离（米）- Haversine公式
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // 地球半径（米）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * 获取所有充电站
 * @returns {Promise} 充电站列表
 */
export const getAllStations = async () => {
  try {
    // 如果配置使用模拟数据，直接返回
    if (API_CONFIG.useMockData) {
      console.log('使用模拟数据');
      // 转换模拟数据以匹配新格式
      const transformedStations = MOCK_STATIONS.map(station => ({
        id: station.id,
        stationId: station.stationId,
        name: station.location,
        location: station.location,
        lat: station.lat,
        lng: station.lng,
        latitude: station.lat,
        longitude: station.lng,
        availableSockets: station.available ? 1 : 0,
        totalSockets: 1,
        powerOutput: 7.0,
        pricePerHour: station.price,
        price: station.price,
        status: station.available ? 'ACTIVE' : 'INACTIVE',
        address: '北京市',
        description: '模拟充电站'
      }));
      return Promise.resolve(transformedStations);
    }

    // 调用真实API
    console.log('调用真实API获取充电站列表');
    const response = await API.stations.getAll();
    
    // 转换数据格式以保持一致性
    const transformedStations = response.data.map(station => ({
      ...station,
      location: station.name, // 为向后兼容保留location字段
      latitude: station.lat,  // 为向后兼容保留latitude字段
      longitude: station.lng  // 为向后兼容保留longitude字段
    }));
    
    return transformedStations;
  } catch (error) {
    console.error('获取充电站列表失败:', error);
    // 失败时降级使用模拟数据
    console.log('API调用失败，降级使用模拟数据');
    // 转换模拟数据以匹配新格式
    const transformedStations = MOCK_STATIONS.map(station => ({
      id: station.id,
      stationId: station.stationId,
      name: station.location,
      location: station.location,
      lat: station.lat,
      lng: station.lng,
      latitude: station.lat,
      longitude: station.lng,
      availableSockets: station.available ? 1 : 0,
      totalSockets: 1,
      powerOutput: 7.0,
      pricePerHour: station.price,
      price: station.price,
      status: station.available ? 'ACTIVE' : 'INACTIVE',
      address: '北京市',
      description: '模拟充电站'
    }));
    return transformedStations;
  }
};

/**
 * 获取单个充电站详情
 * @param {number} id - 充电站ID
 * @returns {Promise} 充电站详情
 */
export const getStationById = async (id) => {
  try {
    if (API_CONFIG.useMockData) {
      const station = MOCK_STATIONS.find(s => s.id === id || s.stationId === id);
      if (station) {
        // 转换模拟数据以匹配新格式
        const transformedStation = {
          id: station.id,
          stationId: station.stationId,
          name: station.location,
          location: station.location,
          lat: station.lat,
          lng: station.lng,
          latitude: station.lat,
          longitude: station.lng,
          availableSockets: station.available ? 1 : 0,
          totalSockets: 1,
          powerOutput: 7.0,
          pricePerHour: station.price,
          price: station.price,
          status: station.available ? 'ACTIVE' : 'INACTIVE',
          address: '北京市',
          description: '模拟充电站'
        };
        return Promise.resolve(transformedStation);
      }
      return Promise.resolve(null);
    }

    const response = await API.stations.getById(id);
    
    // 转换数据格式以保持一致性
    const transformedStation = {
      ...response.data,
      location: response.data.name, // 为向后兼容保留location字段
      latitude: response.data.lat,  // 为向后兼容保留latitude字段
      longitude: response.data.lng  // 为向后兼容保留longitude字段
    };
    
    return transformedStation;
  } catch (error) {
    console.error(`获取充电站 ${id} 失败:`, error);
    const station = MOCK_STATIONS.find(s => s.id === id || s.stationId === id);
    if (station) {
      // 转换模拟数据以匹配新格式
      const transformedStation = {
        id: station.id,
        stationId: station.stationId,
        name: station.location,
        location: station.location,
        lat: station.lat,
        lng: station.lng,
        latitude: station.lat,
        longitude: station.lng,
        availableSockets: station.available ? 1 : 0,
        totalSockets: 1,
        powerOutput: 7.0,
        pricePerHour: station.price,
        price: station.price,
        status: station.available ? 'ACTIVE' : 'INACTIVE',
        address: '北京市',
        description: '模拟充电站'
      };
      return transformedStation;
    }
    return null;
  }
};

/**
 * 获取附近的充电站
 * @param {number} latitude - 纬度
 * @param {number} longitude - 经度
 * @param {number} radius - 搜索半径（米），默认5000米
 * @returns {Promise} 附近充电站列表
 */
export const getNearbyStations = async (latitude, longitude, radius = 5000) => {
  try {
    if (API_CONFIG.useMockData) {
      // 使用真实的距离计算
      const nearbyStations = MOCK_STATIONS.filter(station => {
        const distance = calculateDistance(latitude, longitude, station.lat, station.lng);
        return distance <= radius;
      }).map(station => {
        const distance = calculateDistance(latitude, longitude, station.lat, station.lng);
        return {
          ...station,
          distance: Math.round(distance),
          id: station.id,
          stationId: station.stationId,
          name: station.location,
          location: station.location,
          lat: station.lat,
          lng: station.lng,
          latitude: station.lat,
          longitude: station.lng,
          availableSockets: station.available ? 1 : 0,
          totalSockets: 1,
          powerOutput: 7.0,
          pricePerHour: station.price,
          price: station.price,
          status: station.available ? 'ACTIVE' : 'INACTIVE',
          address: '北京市',
          description: '模拟充电站'
        };
      });
      return Promise.resolve(nearbyStations);
    }

    // 调用真实API获取附近充电站
    const response = await API.stations.getNearby(latitude, longitude, radius);
    
    // 转换数据格式以保持一致性，并添加距离信息
    const transformedStations = response.data.map(station => ({
      ...station,
      location: station.name, // 为向后兼容保留location字段
      latitude: station.lat,  // 为向后兼容保留latitude字段
      longitude: station.lng, // 为向后兼容保留longitude字段
      distance: station.distance // 保留API返回的距离
    }));
    
    return transformedStations;
  } catch (error) {
    console.error('获取附近充电站失败:', error);
    // 降级处理 - 使用模拟数据和真实距离计算
    const nearbyStations = MOCK_STATIONS.filter(station => {
      const distance = calculateDistance(latitude, longitude, station.lat, station.lng);
      return distance <= radius;
    }).map(station => {
      const distance = calculateDistance(latitude, longitude, station.lat, station.lng);
      return {
        ...station,
        distance: Math.round(distance),
        id: station.id,
        stationId: station.stationId,
        name: station.location,
        location: station.location,
        lat: station.lat,
        lng: station.lng,
        latitude: station.lat,
        longitude: station.lng,
        availableSockets: station.available ? 1 : 0,
        totalSockets: 1,
        powerOutput: 7.0,
        pricePerHour: station.price,
        price: station.price,
        status: station.available ? 'ACTIVE' : 'INACTIVE',
        address: '北京市',
        description: '模拟充电站'
      };
    });
    return nearbyStations;
  }
};

/**
 * 搜索充电站
 * @param {object} params - 搜索参数
 * @returns {Promise} 搜索结果
 */
export const searchStations = async (params) => {
  try {
    if (API_CONFIG.useMockData) {
      // 简单的本地搜索
      if (params.keyword) {
        const filteredStations = MOCK_STATIONS.filter(s => 
          s.location.includes(params.keyword)
        ).map(station => ({
          id: station.id,
          stationId: station.stationId,
          name: station.location,
          location: station.location,
          lat: station.lat,
          lng: station.lng,
          latitude: station.lat,
          longitude: station.lng,
          availableSockets: station.available ? 1 : 0,
          totalSockets: 1,
          powerOutput: 7.0,
          pricePerHour: station.price,
          price: station.price,
          status: station.available ? 'ACTIVE' : 'INACTIVE',
          address: '北京市',
          description: '模拟充电站'
        }));
        return Promise.resolve(filteredStations);
      }
      return getAllStations(); // 如果没有关键字，返回所有充电站
    }

    const response = await API.stations.search(params);
    
    // 转换数据格式以保持一致性
    const transformedStations = response.data.map(station => ({
      ...station,
      location: station.name, // 为向后兼容保留location字段
      latitude: station.lat,  // 为向后兼容保留latitude字段
      longitude: station.lng  // 为向后兼容保留longitude字段
    }));
    
    return transformedStations;
  } catch (error) {
    console.error('搜索充电站失败:', error);
    if (params.keyword) {
      const filteredStations = MOCK_STATIONS.filter(s => 
        s.location.includes(params.keyword)
      ).map(station => ({
        id: station.id,
        stationId: station.stationId,
        name: station.location,
        location: station.location,
        lat: station.lat,
        lng: station.lng,
        latitude: station.lat,
        longitude: station.lng,
        availableSockets: station.available ? 1 : 0,
        totalSockets: 1,
        powerOutput: 7.0,
        pricePerHour: station.price,
        price: station.price,
        status: station.available ? 'ACTIVE' : 'INACTIVE',
        address: '北京市',
        description: '模拟充电站'
      }));
      return filteredStations;
    }
    return getAllStations(); // 如果搜索失败，返回所有充电站
  }
};

// 导出默认对象
const stationService = {
  getAllStations,
  getStationById,
  getNearbyStations,
  searchStations
};

export default stationService;