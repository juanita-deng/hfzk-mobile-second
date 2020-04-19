import React from 'react';
import './index.scss';
class Map extends React.Component {
	render() {
		return <div id="container"></div>;
	}
	componentDidMount() {
		// 创建地图实例
		var map = new window.BMap.Map('container');
		// 创建点坐标
		var point = new window.BMap.Point(116.404, 39.915);
		// 初始化地图，设置中心点坐标和地图级别
		map.centerAndZoom(point, 15);
	}
}
export default Map;
