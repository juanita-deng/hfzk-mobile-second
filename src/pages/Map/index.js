import React from 'react';
import styles from './index.module.scss';
import NavHeader from 'common/navHeader/index';
import { Toast } from 'antd-mobile';
import { getCurrentCity } from 'utils/city';
import BASE_URL from 'utils/config'; //导入环境变量
import axios from 'axios';

const BMap = window.BMap;

class Map extends React.Component {
	state = {
		isShow: false,
		houseList: [],
	};
	render() {
		return (
			<div className={styles.map}>
				<NavHeader>地图找房</NavHeader>
				<div id="container"></div>
				{/* 渲染房屋列表-动态显示 */}
				<div className={`houseList ${this.state.isShow ? 'show' : ''}`}>
					<div className="titleWrap">
						<h1 className="listTitle">房屋列表</h1>
						<a className="titleMore" href="/house/list">
							更多房源
						</a>
					</div>
					<div className="houseItems">
						{this.state.houseList.map((v) => (
							<div className="house" key={v.houseCode}>
								<div className="imgWrap">
									<img className="img" src={BASE_URL + v.houseImg} alt="" />
								</div>
								<div className="content">
									<h3 className="title">{v.desc}</h3>
									<div className="desc">{v.desc}</div>
									<div>
										{v.tags.map((items, index) => {
											return (
												<span
													key={items}
													className={`tag tag${(index % 3) + 1}`}
												>
													{items}
												</span>
											);
										})}
									</div>
									<div className="price">
										<span className="priceNum">{v.price}</span> 元/月
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
	async componentDidMount() {
		//1.获取当前城市定位
		const currentCity = await getCurrentCity();
		// console.log(currentCity);

		//2.创建地图实例
		var map = new BMap.Map('container');
		//修改map的指向
		this.map = map;

		//3.创建地址解析器
		const myGeo = new BMap.Geocoder();

		//添加地图控件
		this.map.addControl(new BMap.NavigationControl());
		this.map.addControl(new BMap.ScaleControl());
		//注册移动事件,隐藏房屋列表 movestart百度提供的移动触发事件
		this.map.addEventListener('movestart', () => {
			this.setState({
				isShow: false,
			});
		});

		//4.调用getpoint方法获取地图的经纬度
		/* 
			getPoint方法:
				参数1:详细的地址信息
				参数2:回调函数,用于获取坐标点
				参数3:地址名称
		*/

		myGeo.getPoint(
			currentCity.label,
			async (point) => {
				//5.初始化地图，设置中心点坐标和地图级别
				map.centerAndZoom(point, 11);

				//发送请求渲染覆盖物
				this.renderOverlays(currentCity);
			},
			currentCity.label
		);
	}
	//渲染覆盖物(功能:只是发送请求获取数据)
	async renderOverlays(currentCity) {
		Toast.loading('拼命加载中...', 0);

		//1.发送Ajax请求,获取当前城市下所有区的信息
		const res = await axios.get('http://localhost:8080/area/map', {
			params: {
				id: currentCity.value,
			},
		});
		// console.log(res);
		const { status, body } = res.data;
		//2.获取覆盖物类型和缩放级别
		const { type, nextZoom } = this.getTypeAndZoom();
		if (status === 200) {
			body.forEach((v) => {
				//3.添加覆盖物,将类型和级别传出去
				this.addOverLays(v, type, nextZoom);
			});
		}
		Toast.hide();
	}
	//添加覆盖物(只进行渲染类型判断)
	addOverLays(v, type, nextZoom) {
		// console.log(v, type, nextZoom);
		if (type === 'circle') {
			this.renderCircle(v, nextZoom); //渲染圆形
		} else {
			this.renderRect(v, nextZoom); //渲染方形
		}
	}
	//渲染圆形结构(市,区,镇房源信息)
	renderCircle(v, nextZoom) {
		// console.log(v, nextZoom);
		//重新获取区域的地理位置
		const point = new BMap.Point(v.coord.longitude, v.coord.latitude);
		//创建文本标注对象
		let label = new BMap.Label(
			`
					<div class="bubble">
						<p class="name">${v.label}</p>
						<p>${v.count}套</p>
					</div>
					`,
			{
				position: point, //设置圆形的位置
				offset: new BMap.Size(-35, -35), //设置偏移值
			}
		);

		//设置文本的样式
		label.setStyle({
			border: 'none',
			padding: 0, //去点小圆点
		});
		//添加到地图上
		this.map.addOverlay(label);

		//给label覆盖物注册点击事件,继续获取下一级的覆盖物
		label.addEventListener('click', () => {
			//放大地图,重设中心点
			this.map.centerAndZoom(point, nextZoom);
			//1.清除其他的label
			setTimeout(() => {
				this.map.clearOverlays();
			}, 0);
			//继续获取下一级覆盖物
			this.renderOverlays(v);
		});
	}
	//渲染方形结构(小区信息)
	renderRect(v, nextZoom) {
		const point = new BMap.Point(v.coord.longitude, v.coord.latitude);
		const label = new BMap.Label(
			`<div class="rect">
			    <span class="housename">${v.label}</span>
		      <span class="housenum">${v.count} 套</span>
		      <i class="arrow"></i>
	     </div>`,
			{
				position: point,
				offset: new BMap.Size(-50, -22),
			}
		);
		label.setStyle({
			border: 'none',
			padding: 0,
		});
		this.map.addOverlay(label);

		//给小区信息注册点击事件,弹出房源信息
		label.addEventListener('click', (e) => {
			Toast.loading('拼命加载中...', 0);
			//2.发送Ajax请求,获取房屋数据信息  注意不能用async
			axios
				.get('http://localhost:8080/houses', {
					params: {
						cityId: v.value,
					},
				})
				.then((res) => {
					this.setState({
						houseList: res.data.body.list,
						//1.显示房源列表  移动时隐藏列表(需要在添加控件时注册移动事件)
						isShow: true,
					});

					Toast.hide();
				});

			//对应的房源信息地图中可视区居中
			const x = window.innerWidth / 2 - e.changedTouches[0].pageX;
			const y = (window.innerHeight - 45 - 330) / 2 - e.changedTouches[0].pageY;
			this.map.panBy(x, y); //panBy百度地图提供移动到可视区指定位置
		});
	}
	//获取覆盖物类型和缩放级别
	getTypeAndZoom() {
		const zoom = this.map.getZoom(); //getZoom()百度提供的获取当前缩放级别的方法
		let nextZoom; //下一次的缩放级别 11/13/15
		let type; //渲染类型的标记
		if (zoom === 11) {
			type = 'circle'; //渲染圆形的结构(区,镇房源信息)
			nextZoom = 13;
		} else if (zoom === 13) {
			type = 'circle';
			nextZoom = 15;
		} else {
			type = 'rect'; //渲染方形的结构(小区信息)
			nextZoom = 15;
		}
		return {
			type,
			nextZoom,
		};
	}
}
export default Map;
