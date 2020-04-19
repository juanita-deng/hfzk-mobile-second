import React from 'react';
import axios from 'axios';
import { Carousel, Flex, Grid } from 'antd-mobile';
import './index.scss';
import { getCurrentCity } from '../../../utils/city'; //导入封装的工具函数
//导入图片变量
import nav1 from './images/nav-1.png';
import nav2 from './images/nav-2.png';
import nav3 from './images/nav-3.png';
import nav4 from './images/nav-4.png';
//封装导航
const NavList = [
	{ title: '整租', path: '/home/house', img: nav1 },
	{ title: '合租', path: '/home/house', img: nav2 },
	{ title: '地图找房', path: '/map', img: nav3 },
	{ title: '去出租', path: '/rent', img: nav4 },
];
//造假的小组信息,有数据后删除
// const data = Array.from(new Array(4)).map((_val, i) => ({
// 	icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
// 	text: `name${i}`,
// }));

class Index extends React.Component {
	state = {
		data: [],
		imgHeight: (212 / 375) * window.innerWidth,
		groupList: [], //租房小组
		newList: [], //最新资讯
		city: {
			label: '武汉',
			value: '',
		},
	};
	render() {
		return (
			<div className="index">
				{/* 轮播图 */}
				<div className="swiper">
					{this.renderCarsousel()}
					{this.renderSearch()}
				</div>
				{/* 导航 */}
				<div className="nav">{this.renderNav()}</div>
				{/* 渲染租房小组 */}
				<div className="group">{this.renderGroup()}</div>
				{/* 渲染最新资讯 */}
				<div className="news">{this.renderNews()}</div>
			</div>
		);
	}
	async componentDidMount() {
		this.getSwiper();
		// this.getGroup();
		// this.getNews();

		//直接调用工具函数
		const currentCity = await getCurrentCity();
		this.setState(
			{
				city: currentCity,
			},
			() => {
				this.getGroup();
				this.getNews();
			}
		);

		//获取到当前城市信息(IP定位)
		// var myCity = new window.BMap.LocalCity();
		// myCity.get(async (result) => {
		// 	// console.log(result);
		// 	const res = await axios.get('http://localhost:8080/area/info', {
		// 		params: {
		// 			name: result.name,
		// 		},
		// 	});
		// 	// console.log(res);
		// 	const { status, body } = res.data;
		// 	if (status === 200) {
		// 		//请求成功将当前城市存到本地存储供其他页面使用
		// 		localStorage.setItem('currentCity', JSON.stringify(body));

		// 		this.setState(
		// 			{
		// 				city: body,
		// 			},
		// 			() => {
		// 				this.getGroup();
		// 				this.getNews();
		// 			}
		// 		);
		// 		// console.log(this.state.city);
		// 	}
		// });
	}
	//发送请求获取轮播图相应数据
	async getSwiper() {
		const res = await axios.get('http://localhost:8080/home/swiper');
		// console.log(res);
		const { status, body } = res.data;
		if (status === 200) {
			this.setState({
				data: body,
			});
		}
		// console.log(this.state.data);
	}
	//发送请求获取住房小组信息
	async getGroup() {
		const res = await axios.get('http://localhost:8080/home/groups', {
			// params: {
			// 	area: 'AREA|88cff55c-aaa4-e2e0',
			// },
			params: {
				area: this.state.city.value,
			},
		});
		// console.log(res);
		const { status, body } = res.data;
		if (status === 200) {
			this.setState({
				groupList: body,
			});
			// console.log(this.state.groupList);
		}
	}
	//发送请求获取最新资讯
	async getNews() {
		const res = await axios.get('http://localhost:8080/home/news', {
			params: {
				area: this.state.city.value,
			},
		});
		// console.log(res);
		const { status, body } = res.data;
		if (status === 200) {
			this.setState({
				newList: body,
			});
		}
		// console.log(this.state.newList);
	}
	//渲染轮播图
	renderCarsousel() {
		if (this.state.data.length === 0) {
			return null;
		}
		return (
			<Carousel autoplay infinite>
				{this.state.data.map((val) => (
					<a
						key={val.id}
						href="http://www.alipay.com"
						style={{
							display: 'inline-block',
							width: '100%',
							height: this.state.imgHeight,
						}}
					>
						<img
							src={`http://localhost:8080${val.imgSrc}`}
							alt={val.alt}
							style={{ width: '100%', verticalAlign: 'top' }}
							onLoad={() => {
								// fire window resize event to change height
								window.dispatchEvent(new Event('resize'));
								this.setState({ imgHeight: 'auto' });
							}}
						/>
					</a>
				))}
			</Carousel>
		);
	}
	//渲染搜索
	renderSearch() {
		return (
			<Flex className="search-box">
				<Flex className="search-form">
					<div
						className="location"
						onClick={() => this.props.history.push('/city')}
					>
						<span className="name">{this.state.city.label}</span>
						<i className="iconfont icon-arrow"> </i>
					</div>
					<div className="search-input">
						<i className="iconfont icon-seach" />
						<span className="text">请输入小区地址</span>
					</div>
				</Flex>
				{/* 地图小图标 */}
				<i
					className="iconfont icon-map"
					onClick={() => this.props.history.push('/map')}
				/>
			</Flex>
		);
	}
	//渲染导航
	renderNav() {
		return (
			<Flex>
				{NavList.map((v) => (
					<Flex.Item
						key={v.title}
						onClick={() => this.props.history.push(v.path)}
					>
						<img src={v.img} alt="" />
						<p>{v.title}</p>
					</Flex.Item>
				))}
			</Flex>
		);
	}
	//渲染租房小组
	renderGroup() {
		return (
			<>
				{/* 租房小组 */}
				<div className="group">
					{/* 标题 */}
					<div className="group-title">
						<h3 className="group-title">
							租房小组
							<span className="more">更多</span>
						</h3>
					</div>
					{/* 内容-宫格组件 */}
					<div className="group-content">
						<Grid
							data={this.state.groupList}
							hasLine={false}
							columnNum={2}
							square={false}
							renderItem={(el) => (
								<Flex className="group-item" justify="around" key={el.id}>
									<div className="desc">
										<p className="title">{el.title}</p>
										<span className="info">{el.desc}</span>
									</div>
									<img src={'http://localhost:8080' + el.imgSrc} alt="" />
								</Flex>
							)}
						/>
					</div>
				</div>
			</>
		);
	}
	//渲染最新资讯
	renderNews() {
		return (
			<>
				<h3 className="group-title">最新资讯</h3>
				{this.state.newList.map((v) => (
					<div className="news-item" key={v.id}>
						<div className="imgwrap">
							<img
								className="img"
								src={'http://localhost:8080' + v.imgSrc}
								alt=""
							/>
						</div>
						<Flex className="content" direction="column" justify="between">
							<h3 className="title">{v.title}</h3>
							<Flex className="info" justify="between">
								<span>{v.from}</span>
								<span>{v.date}</span>
							</Flex>
						</Flex>
					</div>
				))}
			</>
		);
	}
}
export default Index;
