import React from 'react';
import { Route, Switch } from 'react-router-dom';
//配置嵌套路由
import Index from './Index/index.js';
import House from './House';
import News from './News';
import Profile from './Profile';
import NotFound from '../NotFound';
//tabBar组件
import { TabBar } from 'antd-mobile';
import './index.scss';

//TabBar组件封装
const Tabs = [
	{ title: '首页', path: '/home', icon: 'icon-ind' },
	{ title: '找房', path: '/home/house', icon: 'icon-findHouse' },
	{ title: '资讯', path: '/home/news', icon: 'icon-infom' },
	{ title: '我的', path: '/home/profile', icon: 'icon-my' },
];

class Home extends React.Component {
	constructor(props) {
		console.log(props);

		super(props);
		this.state = {
			//用于控制默认选中的tab栏
			selectedTab: this.props.location.pathname, //不能写死,而是动态获取
			//用于控制tabBar是否需要全屏
			fullScreen: true,
		};
	}
	render() {
		return (
			<div className="home">
				<Switch>
					<Route path="/home" exact component={Index}></Route>
					<Route path="/home/House" component={House}></Route>
					<Route path="/home/news" component={News}></Route>
					<Route path="/home/profile" component={Profile}></Route>
					<Route component={NotFound}></Route>
				</Switch>
				{/* 使用antd-mobile的tabBar组件--配置路由链接 */}
				<div
					style={
						this.state.fullScreen
							? { position: 'fixed', height: '100%', width: '100%', top: 0 }
							: { height: 400 }
					}
				>
					<TabBar
						// 没有选中的文字的颜色
						unselectedTintColor="#949494"
						//选中文字的颜色
						tintColor="rgb(33, 185, 122)"
						//整体TabBar的背景色
						barTintColor="white"
					>
						{Tabs.map((v) => (
							<TabBar.Item
								title={v.title}
								key={v.title}
								icon={<span className={'iconfont ' + v.icon}></span>}
								selectedIcon={<span className={`iconfont ${v.icon}`}></span>}
								selected={this.state.selectedTab === v.path}
								onPress={() => {
									this.setState({
										selectedTab: v.path,
									});
									this.props.history.push(v.path);
								}}
								data-seed="logId"
							></TabBar.Item>
						))}
					</TabBar>
				</div>
			</div>
		);
	}
}
export default Home;
