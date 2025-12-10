import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MOCK_STATIONS } from '../constants/stations';
import './MapPage.css';

const MapPage = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const AMapRef = useRef(null);
  const [stations, setStations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const renderMarkers = useCallback((AMap, mapInstance, stationsList) => {
    stationsList.forEach((station) => {
      const marker = new AMap.Marker({
        position: [station.lng, station.lat],
        title: station.location,
        icon: station.available ? '🟢' : '🔴',
        anchor: 'center'
      });

      marker.setMap(mapInstance);
      marker.on('click', () => {
        const infoWindow = new AMap.InfoWindow({
          isCustom: true,
          content: `
            <div class="station-info">
              <h3>${station.location}</h3>
              <p>状态: ${station.available ? '可用' : '使用中'}</p>
              <button onclick="alert('预约 ${station.location}')">预约</button>
            </div>
          `,
          offset: [0, -30]
        });
        infoWindow.open(mapInstance, [station.lng, station.lat]);
      });
    });
  }, []);

  const fetchStations = useCallback((AMap, mapInstance) => {
    try {
      // 实际应该从后端获取数据：
      // const response = await fetch('http://localhost:8080/javaweb/stations');
      // const data = await response.json();
      // setStations(data);
      
      // 临时使用模拟数据
      setStations(MOCK_STATIONS);
      renderMarkers(AMap, mapInstance, MOCK_STATIONS);
    } catch (error) {
      console.error('获取充电站数据失败:', error);
      // 加载失败时使用模拟数据
      setStations(MOCK_STATIONS);
      renderMarkers(AMap, mapInstance, MOCK_STATIONS);
    }
  }, [renderMarkers]);

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
        setUserLocation({ lat: latitude, lng: longitude });
        setLocating(false);

        // 移动地图到用户位置
        if (mapRef.current) {
          mapRef.current.setCenter([longitude, latitude]);
          mapRef.current.setZoom(16);

          // 添加用户位置标记
          if (AMapRef.current) {
            const userMarker = new AMapRef.current.Marker({
              position: [longitude, latitude],
              title: '您的位置',
              content: '<div style="background-color: #0066cc; color: white; padding: 5px 10px; border-radius: 50%; text-align: center; font-weight: bold;">📍</div>',
              anchor: 'center'
            });
            userMarker.setMap(mapRef.current);
            console.log('用户位置标记已添加');
          }
          
          // 刷新附近充电站数据
          if (AMapRef.current) {
            fetchStations(AMapRef.current, mapRef.current);
            console.log('已刷新附近充电站数据');
          }
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
  }, []);

  useEffect(() => {
    // 加载高德地图
    const AMapLoader = window.AMapLoader;
    
    AMapLoader.load({
      key: '48101b9e67753cacaf46ba4af28ddcbc', // 您的高德地图 key
      version: '2.0',
      plugins: ['AMap.PlaceSearch', 'AMap.Marker']
    })
      .then((AMap) => {
        AMapRef.current = AMap;
        const mapInstance = new AMap.Map(mapContainer.current, {
          viewMode: '2D',
          zoom: 12,
          center: [116.397428, 39.90923] // 北京坐标
        });
        
        mapRef.current = mapInstance;

        // 从后端获取充电站数据
        fetchStations(AMap, mapInstance);
      })
      .catch((e) => {
        console.error('地图加载失败:', e);
      });
  }, [fetchStations]);

  return (
    <div className="map-page">
      <div className="map-header">
        <h1>充电站地图</h1>
        <button 
          className="locate-btn" 
          onClick={handleLocate} 
          disabled={locating}
          title="定位到您的位置"
        >
          {locating ? '定位中...' : '📍 定位'}
        </button>
        {locationError && <div className="location-error">{locationError}</div>}
        {userLocation && <div className="location-success">已定位: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</div>}
      </div>
      <div ref={mapContainer} className="map-container"></div>
      <div className="stations-info">
        <h3>附近充电站 ({stations.length})</h3>
        <div className="stations-list">
          {stations.map((station) => (
            <div key={station.id} className={`station-item ${station.available ? 'available' : 'unavailable'}`}>
              <div className="station-header">
                <h4>{station.location}</h4>
                <span className="status">{station.available ? '可用' : '使用中'}</span>
              </div>
              <p>距离: 约 {Math.floor(Math.random() * 5 + 1)} km</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
