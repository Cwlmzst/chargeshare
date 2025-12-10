/**
 * 前后端集成检查工具
 * 用于快速诊断和验证项目配置
 */

import { API_CONFIG, API_ENDPOINTS } from '../config/api.config';
import { MOCK_STATIONS } from '../constants/stations';
import apiClient from './api';

/**
 * 检查 API 配置
 */
export const checkApiConfig = () => {
  console.log('========== API 配置检查 ==========');
  console.log('后端基础 URL:', API_CONFIG.baseURL);
  console.log('API 超时:', API_CONFIG.timeout, 'ms');
  console.log('使用模拟数据:', API_CONFIG.useMockData);
  console.log('===================================\n');
  
  return {
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    useMockData: API_CONFIG.useMockData
  };
};

/**
 * 检查模拟数据
 */
export const checkMockData = () => {
  console.log('========== 模拟数据检查 ==========');
  console.log('充电站数量:', MOCK_STATIONS.length);
  
  if (MOCK_STATIONS.length > 0) {
    console.log('第一个充电站:', MOCK_STATIONS[0]);
  } else {
    console.warn('⚠️  模拟数据为空！');
  }
  
  console.log('===================================\n');
  
  return MOCK_STATIONS;
};

/**
 * 测试后端连接
 */
export const testBackendConnection = async () => {
  console.log('========== 后端连接测试 ==========');
  console.log('正在测试:', API_CONFIG.baseURL + API_ENDPOINTS.STATIONS.LIST);
  
  try {
    const response = await apiClient.get(API_ENDPOINTS.STATIONS.LIST);
    console.log('✅ 连接成功！');
    console.log('响应数据:', response.data);
    console.log('===================================\n');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ 连接失败！');
    console.error('错误详情:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    console.log('===================================\n');
    return { success: false, error: error.message };
  }
};

/**
 * 测试 CORS
 */
export const testCors = async () => {
  console.log('========== CORS 测试 ==========');
  
  try {
    const response = await fetch(API_CONFIG.baseURL + API_ENDPOINTS.STATIONS.LIST, {
      method: 'OPTIONS',
      headers: {
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
    };
    
    console.log('✅ CORS 检查完成！');
    console.log('CORS 头信息:', corsHeaders);
    console.log('==============================\n');
    
    return { success: true, headers: corsHeaders };
  } catch (error) {
    console.error('❌ CORS 测试失败！');
    console.error('错误:', error.message);
    console.log('==============================\n');
    return { success: false, error: error.message };
  }
};

/**
 * 测试 API 端点
 */
export const testApiEndpoints = async () => {
  console.log('========== API 端点测试 ==========');
  
  const results = {};
  
  // 测试获取所有充电站
  try {
    console.log('测试:', API_ENDPOINTS.STATIONS.LIST);
    const response = await apiClient.get(API_ENDPOINTS.STATIONS.LIST);
    results.getAll = { success: true, count: response.data?.length };
    console.log('✅ 获取所有充电站:', response.data?.length, '个');
  } catch (error) {
    results.getAll = { success: false, error: error.message };
    console.error('❌ 获取所有充电站:', error.message);
  }
  
  // 测试获取单个充电站
  try {
    console.log('测试:', API_ENDPOINTS.STATIONS.DETAIL(1));
    const response = await apiClient.get(API_ENDPOINTS.STATIONS.DETAIL(1));
    results.getById = { success: true, station: response.data };
    console.log('✅ 获取单个充电站:', response.data?.location);
  } catch (error) {
    results.getById = { success: false, error: error.message };
    console.error('❌ 获取单个充电站:', error.message);
  }
  
  // 测试获取附近充电站
  try {
    console.log('测试:', API_ENDPOINTS.STATIONS.NEARBY, '(lat: 39.9, lng: 116.4)');
    const response = await apiClient.get(API_ENDPOINTS.STATIONS.NEARBY, {
      params: { latitude: 39.9, longitude: 116.4, radius: 5000 }
    });
    results.getNearby = { success: true, count: response.data?.length };
    console.log('✅ 获取附近充电站:', response.data?.length, '个');
  } catch (error) {
    results.getNearby = { success: false, error: error.message };
    console.error('❌ 获取附近充电站:', error.message);
  }
  
  console.log('==================================\n');
  
  return results;
};

/**
 * 完整的诊断报告
 */
export const generateDiagnosticReport = async () => {
  console.clear();
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   前后端集成诊断报告                       ║');
  console.log('╚════════════════════════════════════════════╝\n');
  
  const timestamp = new Date().toLocaleString('zh-CN');
  console.log('生成时间:', timestamp);
  console.log('\n');
  
  // 1. 检查配置
  const configStatus = checkApiConfig();
  
  // 2. 检查模拟数据
  const mockDataStatus = checkMockData();
  
  // 3. 如果禁用模拟数据，测试后端连接
  let backendStatus = null;
  if (!API_CONFIG.useMockData) {
    backendStatus = await testBackendConnection();
  }
  
  // 4. 测试 API 端点
  let endpointStatus = null;
  if (!API_CONFIG.useMockData) {
    endpointStatus = await testApiEndpoints();
  }
  
  // 生成总结
  console.log('╔════════════════════════════════════════════╗');
  console.log('║            诊断总结                        ║');
  console.log('╚════════════════════════════════════════════╝\n');
  
  if (API_CONFIG.useMockData) {
    console.log('📦 当前模式: 使用模拟数据');
    console.log('✅ 模拟数据状态: 正常（', mockDataStatus.length, '个充电站）');
    console.log('\n💡 提示: 如需测试真实 API，请在 config/api.config.js 中设置 useMockData: false\n');
  } else {
    console.log('🌐 当前模式: 使用真实 API');
    console.log('后端 URL:', configStatus.baseURL);
    
    if (backendStatus?.success) {
      console.log('✅ 后端连接: 成功');
    } else {
      console.log('❌ 后端连接: 失败');
      console.log('错误:', backendStatus?.error);
    }
    
    if (endpointStatus) {
      console.log('\nAPI 端点状态:');
      console.log('  - 获取所有充电站:', endpointStatus.getAll.success ? '✅' : '❌');
      console.log('  - 获取单个充电站:', endpointStatus.getById.success ? '✅' : '❌');
      console.log('  - 获取附近充电站:', endpointStatus.getNearby.success ? '✅' : '❌');
    }
  }
  
  console.log('\n');
};

/**
 * 快速测试（在浏览器控制台调用）
 */
export const quickTest = async () => {
  console.log('🔍 开始快速测试...\n');
  
  await generateDiagnosticReport();
};

/**
 * 导出诊断对象供外部使用
 */
export const diagnostics = {
  checkConfig: checkApiConfig,
  checkMockData: checkMockData,
  testConnection: testBackendConnection,
  testCors: testCors,
  testEndpoints: testApiEndpoints,
  generateReport: generateDiagnosticReport,
  quickTest: quickTest
};

export default diagnostics;
