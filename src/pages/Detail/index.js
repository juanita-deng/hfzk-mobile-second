import React, { Component } from 'react';
import styles from './index.module.scss';
import NavHeader from 'common/navHeader';
import http from 'utils/http';
import { Carousel, Flex } from 'antd-mobile';
import BASE_URL from 'utils/config';
import HousePackage from 'common/HousePackage';
import HouseItem from 'common/houseItem';

const BMap = window.BMap;
// 猜你喜欢
const recommendHouses = [
	{
		id: 1,
		houseImg: '/img/news/1.png',
		desc: '72.32㎡/南 北/低楼层',
		title: '安贞西里 3室1厅',
		price: 4500,
		tags: ['随时看房'],
	},
	{
		id: 2,
		houseImg: '/img/news/2.png',
		desc: '83㎡/南/高楼层',
		title: '天居园 2室1厅',
		price: 7200,
		tags: ['近地铁'],
	},
	{
		id: 3,
		houseImg: '/img/news/3.png',
		desc: '52㎡/西南/低楼层',
		title: '角门甲4号院 1室1厅',
		price: 4300,
		tags: ['集中供暖'],
	},
];
export default class Detail extends Component {
	state = {
		info: '', //房源信息
	};
	render() {
		if (!this.state.info) {
			return null;
		}
		const {
			community,
			houseImg,
			title,
			tags,
			price,
			roomType,
			size,
			floor,
			oriented,
			supporting,
			description,
		} = this.state.info;
		return (
			<div className={styles.detail}>
				{/* 导航栏组件 */}
				<NavHeader
					className="navHeader"
					rightContent={[<i key="share" className="iconfont icon-share" />]}
				>
					{community}
				</NavHeader>
				{/* 轮播图渲染 */}
				<Carousel className="slides" autoplay infinite>
					{houseImg.map((v) => (
						<img
							key={v}
							src={BASE_URL + v}
							alt=""
							style={{ width: '100%', verticalAlign: 'top' }}
							onLoad={() => {
								window.dispatchEvent(new Event('resize'));
								this.setState({ imgHeight: 'auto' });
							}}
						/>
					))}
				</Carousel>
				{/* 房屋信息渲染 */}
				<div className="info">
					<h3 className="infoTitle">{title}</h3>
					<Flex className="tags">
						<Flex.Item>{this.renderTags(tags)}</Flex.Item>
					</Flex>

					<Flex className="infoPrice">
						<Flex.Item className="infoPriceItem">
							<div>
								{price}
								<span className="month">/月</span>
							</div>
							<div>租金</div>
						</Flex.Item>
						<Flex.Item className="infoPriceItem">
							<div>{roomType}</div>
							<div>房型</div>
						</Flex.Item>
						<Flex.Item className="infoPriceItem">
							<div>{size}平米</div>
							<div>面积</div>
						</Flex.Item>
					</Flex>

					<Flex className="infoBasic" align="start">
						<Flex.Item>
							<div>
								<span className="title">装修：</span>
								精装
							</div>
							<div>
								<span className="title">楼层：</span>
								{floor}
							</div>
						</Flex.Item>
						<Flex.Item>
							<div>
								<span className="title">朝向：</span>
								{oriented.join('、')}
							</div>
							<div>
								<span className="title">类型：</span>普通住宅
							</div>
						</Flex.Item>
					</Flex>
				</div>
				{/* 地图位置 */}
				<div className="map">
					<div className="mapTitle">
						小区：
						<span>{community}</span>
					</div>
					<div className="mapContainer" id="map">
						地图
					</div>
				</div>
				{/* 房屋配套 */}
				<div className="about">
					<div className="houseTitle">房屋配套</div>
					{supporting.length === 0 ? (
						<div className="titleEmpty">暂无数据</div>
					) : (
						<HousePackage list={supporting} />
					)}
				</div>
				{/* 房屋概况 */}
				<div className="set">
					<div className="houseTitle">房源概况</div>
					<div>
						<div className="contact">
							<div className="user">
								<img src={BASE_URL + '/img/avatar.png'} alt="头像" />
								<div className="useInfo">
									<div>王女士</div>
									<div className="userAuth">
										<i className="iconfont icon-auth" />
										已认证房主
									</div>
								</div>
							</div>
							<span className="userMsg">发消息</span>
						</div>

						<div className="descText">{description || '暂无房屋描述'}</div>
					</div>
				</div>
				{/* 猜你喜欢 */}
				<div className="recommend">
					<div className="houseTitle">猜你喜欢</div>
					<div className="items">
						{recommendHouses.map((v) => (
							<HouseItem v={v} key={v.id} />
						))}
					</div>
				</div>
				{/* 底部收藏按钮 */}
				<Flex className="fixedBottom">
					<Flex.Item onClick={this.handleFavorite}>
						<img
							src={BASE_URL + '/img/star.png'}
							className="favoriteImg"
							alt="收藏"
						/>
						<span className="favorite">已收藏</span>
					</Flex.Item>
					<Flex.Item>在线咨询</Flex.Item>
					<Flex.Item>
						<a href="tel:400-618-4000" className="telephone">
							电话预约
						</a>
					</Flex.Item>
				</Flex>
			</div>
		);
	}
	async componentDidMount() {
		const id = this.props.match.params.id;
		const { status, body } = await http.get(`houses/${id}`);
		if (status === 200) {
			this.setState({
				info: body,
			});
		}
		console.log(this.state.info);
		const { community, coord } = body;
		this.renderMap(community, coord);
	}
	renderTags(tags) {
		// console.log(tags);
		return tags.map((v, index) => {
			return (
				<span key={v} className={`tag tag${(index % 3) + 1}`}>
					{v}
				</span>
			);
		});
	}
	//渲染地图
	renderMap(community, coord) {
		// console.log(community, coord);
		//创建地图实例
		var map = new BMap.Map('map');
		//指定中心点
		var point = new BMap.Point(coord.longitude, coord.latitude);
		map.centerAndZoom(point, 17);
		//创建覆盖物
		const label = new BMap.Label(
			`<span>${community}</span>
      <div class="mapArrow"></div>`,
			{
				position: point,
				offset: new BMap.Size(0, -36),
			}
		);
		//给覆盖物设置样式
		label.setStyle({
			position: 'absolute',
			zIndex: -7982820,
			backgroundColor: 'rgb(238, 93, 91)',
			color: 'rgb(255, 255, 255)',
			height: 25,
			padding: '5px 10px',
			lineHeight: '14px',
			borderRadius: 3,
			boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
			whiteSpace: 'nowrap',
			fontSize: 12,
			userSelect: 'none',
		});
		//添加覆盖物
		map.addOverlay(label);
	}
	//底部收藏
	handleFavorite() {
		console.log('喜欢');
	}
}
