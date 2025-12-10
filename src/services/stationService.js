/**
 * 充电站服务 - 支持模拟数据和真实API的切换
 */

import { API } from './api';
import { MOCK_STATIONS } from '../constants/stations';
import { API_CONFIG } from '../config/api.config';

/**
 * 获取所有充电站
 * @returns {Promise} 充电站列表
 */
export const getAllStations = async () => {
  try {
    // 如果配置使用模拟数据，直接返回
    if (API_CONFIG.useMockData) {
      console.log('使用模拟数据');
      return Promise.resolve(MOCK_STATIONS);
    }

    // 调用真实API
    console.log('调用真实API获取充电站列表');
    const response = await API.stations.getAll();
    return response.data;
  } catch (error) {
    console.error('获取充电站列表失败:', error);
    // 失败时降级使用模拟数据
    console.log('API调用失败，降级使用模拟数据');
    return MOCK_STATIONS;
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
      return Promise.resolve(station);
    }

    const response = await API.stations.getById(id);
    return response.data;
  } catch (error) {
    console.error(`获取充电站 ${id} 失败:`, error);
    const station = MOCK_STATIONS.find(s => s.id === id || s.stationId === id);
    return station;
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
      // 简单的距离计算（勾股定理近似）
      const nearbyStations = MOCK_STATIONS.filter(station => {
        const latDiff = Math.abs(station.lat - latitude);
        const lngDiff = Math.abs(station.lng - longitude);
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111000; // 粗略转换为米
        return distance <= radius;
      });
      return Promise.resolve(nearbyStations);
    }

    const response = await API.stations.getNearby(latitude, longitude, radius);
    return response.data;
  } catch (error) {
    console.error('获取附近充电站失败:', error);
    // 降级处理
    const nearbyStations = MOCK_STATIONS.filter(station => {
      const latDiff = Math.abs(station.lat - latitude);
      const lngDiff = Math.abs(station.lng - longitude);
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111000;
      return distance <= radius;
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
        return Promise.resolve(
          MOCK_STATIONS.filter(s => 
            s.location.includes(params.keyword)
          )
        );
      }
      return Promise.resolve(MOCK_STATIONS);
    }

    const response = await API.stations.search(params);
    return response.data;
  } catch (error) {
    console.error('搜索充电站失败:', error);
    if (params.keyword) {
      return MOCK_STATIONS.filter(s => 
        s.location.includes(params.keyword)
      );
    }
    return MOCK_STATIONS;
  }
};

export default {
  getAllStations,
  getStationById,
  getNearbyStations,
  searchStations
};
