import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_STATIONS } from '../constants/stations';
import stationService from '../services/stationService';
import authService from '../services/authService';
import './MapPage.css';

const MapPage = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const AMapRef = useRef(null);
  const [stations, setStations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

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

  const renderMarkers = useCallback((AMap, mapInstance, stationsList, currentUserLocation = null) => {
    // 验证地图实例是否有效
    if (!mapInstance || !AMap) {
      console.warn('地图实例未初始化，无法渲染标记');
      return;
    }
    
    // 添加日志查看传入的充电站数据
    console.log('renderMarkers 接收到的充电站数据:', stationsList);
    
    // 清除现有标记
    mapInstance.clearMap();
    
    stationsList.forEach((station) => {
      try {
        // 根据新数据结构调整字段名
        const lat = station.lat || station.latitude;
        const lng = station.lng || station.longitude;
        const name = station.name || station.location;
        const availableSockets = station.availableSockets !== undefined ? station.availableSockets : (station.available ? 1 : 0);
        
        const marker = new AMap.Marker({
          position: [lng, lat],
          title: name,
          content: `<div style="color: ${availableSockets > 0 ? '#00aa00' : '#ff0000'}; font-size: 24px;">${availableSockets > 0 ? '●' : '●'}</div>`,
          anchor: 'center'
        });

        marker.setMap(mapInstance);
        marker.on('click', () => {
          // 计算距离（如果有用户位置）
          let distanceText = '';
          const locationToUse = currentUserLocation || userLocation;
          if (locationToUse) {
            const distance = calculateDistance(locationToUse.lat, locationToUse.lng, lat, lng);
            distanceText = `<p>距离: ${(distance / 1000).toFixed(2)} km</p>`;
          }
          
          const infoWindow = new AMap.InfoWindow({
            isCustom: false,
            content: `
              <div class="station-info">
                <h3>${name}</h3>
                <p>地址: ${station.address || '暂无'}</p>
                <p>可用插座: ${availableSockets}/${station.totalSockets || '未知'}</p>
                <p>功率: ${station.powerOutput || '未知'} kW</p>
                <p>价格: ¥${station.pricePerHour || station.price || '未知'}/小时</p>
                ${distanceText}
                <button onclick="alert('预约 ${name}')">预约</button>
              </div>
            `,
            offset: [0, -30]
          });
          infoWindow.open(mapInstance, [lng, lat]);
        });
      } catch (error) {
        console.error(`无法添加标记 ${station.name || station.location}:`, error);
      }
    });
    
    // 如果有用户位置，添加用户位置标记
    const locationToUse = currentUserLocation || userLocation;
    if (locationToUse && AMap) {
      const userMarker = new AMap.Marker({
        position: [locationToUse.lng, locationToUse.lat],
        title: '您的位置',
        content: '<div style="background-color: #0066cc; color: white; padding: 5px 10px; border-radius: 50%; text-align: center; font-weight: bold;">📍</div>',
        anchor: 'center'
      });
      userMarker.setMap(mapInstance);
    }
  }, [userLocation]);

  const fetchStations = useCallback(async (AMap, mapInstance) => {
    if (!mapInstance || !AMap) {
      console.warn('地图或 AMap 实例未准备好');
      return;
    }
    
    try {
      let data;
      if (userLocation) {
        // 如果有用户位置，获取附近的充电站
        data = await stationService.getNearbyStations(userLocation.lat, userLocation.lng, 5000);
        // 如果附近没有充电站，则获取所有充电站
        if (!data || data.length === 0) {
          console.log('附近没有充电站，获取所有充电站');
          data = await stationService.getAllStations();
        }
      } else {
        // 否则获取所有充电站
        data = await stationService.getAllStations();
      }
      
      // 添加日志查看获取到的数据
      console.log('fetchStations 获取到的数据:', data);
      setStations(data);
      renderMarkers(AMap, mapInstance, data);
    } catch (error) {
      console.error('获取充电站数据失败:', error);
      // 加载失败时使用模拟数据
      console.log('使用模拟数据');
      setStations(MOCK_STATIONS);
      renderMarkers(AMap, mapInstance, MOCK_STATIONS);
    }
  }, [renderMarkers, userLocation]);

  const handleLocate = useCallback(() => {
    setLocating(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError('浏览器不支持定位功能');
      setLocating(false);
      return;
    }

    console.log('开始获取位置...');
    
    // 首先尝试快速定位（使用缓存）
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log('位置获取成功:', { latitude, longitude, accuracy });
        const newUserLocation = { lat: latitude, lng: longitude };
        setUserLocation(newUserLocation);
        setLocating(false);

        // 移动地图到用户位置并确保充电站标记正确显示
        if (mapRef.current && AMapRef.current) {
          // 先移动地图
          mapRef.current.setCenter([longitude, latitude]);
          mapRef.current.setZoom(16);
          
          // 获取附近充电站并渲染标记
          stationService.getNearbyStations(latitude, longitude, 5000)
            .then(data => {
              console.log('获取到附近充电站数据:', data);
              setStations(data);
              // 使用新的用户位置直接渲染标记，确保传递正确的参数
              renderMarkers(AMapRef.current, mapRef.current, data, newUserLocation);
              console.log('已刷新附近充电站数据和标记');
            })
            .catch(error => {
              console.error('获取附近充电站失败:', error);
              // 失败时使用模拟数据
              setStations(MOCK_STATIONS);
              renderMarkers(AMapRef.current, mapRef.current, MOCK_STATIONS, newUserLocation);
            });
        }
      },
      (error) => {
        setLocating(false);
        let errorMsg = '获取位置失败';
        console.error('定位错误代码:', error.code, '消息:', error.message);
        
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = '请允许访问您的位置。请检查浏览器权限设置';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = '位置信息不可用。请检查设备定位服务是否启用';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = '获取位置超时。请确保网络连接良好，或移到室外重试';
        }
        setLocationError(errorMsg);
      },
      {
        timeout: 45000,  // 增加到 45 秒
        enableHighAccuracy: true,
        maximumAge: 30000  // 允许使用 30 秒内的缓存位置
      }
    );
  }, [renderMarkers]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  useEffect(() => {
    // Check if user is logged in
    const user = authService.getCurrentUser();
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
    } else {
      setCurrentUser(user);
    }
  }, [navigate]);

  useEffect(() => {
    // 加载高德地图
    const AMapLoader = window.AMapLoader;
    
    if (!AMapLoader) {
      console.error('AMapLoader 未加载');
      return;
    }
    
    AMapLoader.load({
      key: '48101b9e67753cacaf46ba4af28ddcbc', // 您的高德地图 key
      version: '2.0',
      plugins: ['AMap.PlaceSearch', 'AMap.Marker']
    })
      .then((AMap) => {
        console.log('地图加载成功');
        AMapRef.current = AMap;
        
        // 确保容器存在
        if (!mapContainer.current) {
          console.error('地图容器不存在');
          return;
        }
        
        const mapInstance = new AMap.Map(mapContainer.current, {
          viewMode: '2D',
          zoom: 12,
          center: [118.7969, 32.0603] // 南京坐标作为默认中心
        });
        
        mapRef.current = mapInstance;
        console.log('地图实例创建成功');

        // 等待地图完全加载后再添加标记
        mapInstance.on('complete', () => {
          console.log('地图完全加载完成，现在添加标记');
          fetchStations(AMap, mapInstance);
        });
      })
      .catch((e) => {
        console.error('地图加载失败:', e);
      });
  }, [fetchStations]);

  // 当用户位置改变时，重新获取附近的充电站
  useEffect(() => {
    // 只在组件初始化时或者明确需要刷新时执行，避免重复调用
    // 这个effect可能会导致面板消失的问题，所以我们添加一个检查
    if (userLocation && AMapRef.current && mapRef.current) {
      // 添加日志查看用户位置
      console.log('用户位置改变，当前用户位置:', userLocation);
      
      // 添加一个小延迟确保地图完全初始化
      const timer = setTimeout(() => {
        // 直接获取数据并渲染，避免状态更新的延迟问题
        stationService.getNearbyStations(userLocation.lat, userLocation.lng, 5000)
          .then(data => {
            console.log('用户位置变化，获取到附近充电站数据:', data);
            // 如果附近没有充电站，则获取所有充电站
            if (!data || data.length === 0) {
              console.log('附近没有充电站，获取所有充电站');
              return stationService.getAllStations();
            }
            return data;
          })
          .then(data => {
            setStations(data);
            renderMarkers(AMapRef.current, mapRef.current, data);
          })
          .catch(error => {
            console.error('用户位置变化时获取附近充电站失败:', error);
            // 失败时使用模拟数据
            setStations(MOCK_STATIONS);
            renderMarkers(AMapRef.current, mapRef.current, MOCK_STATIONS);
          });
      }, 100);
      
      // 清理函数
      return () => clearTimeout(timer);
    }
  }, [userLocation, renderMarkers]);

  return (
    <div className="map-page">
      <div className="map-header">
        <div className="header-left">
          <h1>充电站地图</h1>
          <button 
            className="locate-btn" 
            onClick={handleLocate} 
            disabled={locating}
            title="定位到您的位置"
          >
            {locating ? '定位中...' : '📍 定位'}
          </button>
        </div>
        {currentUser && (
          <div className="user-info">
            <span className="user-name">欢迎, {currentUser.name}</span>
            <span className="user-balance">余额: ¥{currentUser.balance ? currentUser.balance.toFixed(2) : '0.00'}</span>
            <button className="logout-btn" onClick={handleLogout}>登出</button>
          </div>
        )}
      </div>
      {locationError && <div className="location-error">{locationError}</div>}
      {userLocation && <div className="location-success">已定位: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</div>}
      <div ref={mapContainer} className="map-container"></div>
      {/* 添加一个容器包装stations-info，防止意外消失 */}
      <div className="stations-panel">
        <div className="stations-info">
          <h3>附近充电站 ({stations.length})</h3>
          {stations.length === 0 ? (
            <p className="no-stations-message">附近暂无充电站，显示所有充电站。</p>
          ) : null}
          <div className="stations-list">
            {stations.map((station) => {
              // 添加日志查看每个充电站的详细信息
              console.log('渲染充电站:', station);
              
              // 计算距离
              let distanceText = '距离未知';
              if (userLocation && (station.lat || station.latitude) && (station.lng || station.longitude)) {
                const lat = station.lat || station.latitude;
                const lng = station.lng || station.longitude;
                const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
                distanceText = `约 ${(distance / 1000).toFixed(2)} km`;
              }
              
              const name = station.name || station.location;
              const availableSockets = station.availableSockets !== undefined ? station.availableSockets : (station.available ? 1 : 0);
              
              return (
                <div 
                  key={station.id || station.stationId} 
                  className={`station-item ${availableSockets > 0 ? 'available' : 'unavailable'}`}
                  // 添加 onMouseDown 事件防止默认行为导致的问题
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div className="station-header">
                    <h4>{name}</h4>
                    <span className="status">{availableSockets > 0 ? '可用' : '已满'}</span>
                  </div>
                  <p>地址: {station.address || '暂无'}</p>
                  <p>可用插座: {availableSockets}/{station.totalSockets || '未知'}</p>
                  <p>距离: {distanceText}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;