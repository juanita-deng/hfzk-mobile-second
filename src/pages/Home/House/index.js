import React from 'react';
import styles from './index.module.scss';
import { Flex, Toast } from 'antd-mobile';
import SearchHeader from 'common/SearchHeader';
import Filter from './Filter/index';
import { getCurrentCity } from 'utils/city';
import http from 'utils/http';
import HouseItem from 'common/houseItem';
import Sticky from 'common/sticky'; //导入吸顶组件
import NoHouse from 'common/NoHouse'; //导入没有更多数据显示的页面
import {
	AutoSizer,
	List,
	WindowScroller,
	InfiniteLoader,
} from 'react-virtualized';

class House extends React.Component {
	state = {
		filter: {}, //filter组件传递过来的处理过的数据
		list: [], //房屋列表
		count: -1, //房屋数据总条数
	};
	render() {
		return (
			<div className={styles.house}>
				<Flex className="house-title">
					<span
						className="iconfont icon-back"
						onClick={() => this.props.history.go(-1)}
					></span>
					<SearchHeader cityName="北京" className="house-header"></SearchHeader>
				</Flex>
				{/* 筛选组件 */}
				<Sticky>
					<Filter onFilter={this.onFilter}></Filter>
				</Sticky>
				{/* 房屋列表 */}
				{this.renderList()}
			</div>
		);
	}
	//渲染房屋列表信息
	renderList() {
		const { count } = this.state;
		if (count === 0) {
			return <NoHouse></NoHouse>;
		} else if (count > 0) {
			return (
				<InfiniteLoader
					/* 用于判断某一行是否有数据,返回一个布尔值 */
					isRowLoaded={this.isRowLoaded}
					/* 一个函数,用于加载更多数据,需要发送Ajax请求去获取数据 */
					loadMoreRows={this.loadMoreRows}
					/* 渲染的总条数,这个函数每次会批量加载,加载完了总条数就不在加载 */
					rowCount={count}
					/* 一次加载的最小条数,默认10条 */
					minimumBatchSize={20}
				>
					{({ onRowsRendered, registerChild }) => (
						<WindowScroller>
							{({ height, isScrolling, onChildScroll, scrollTop }) => (
								<AutoSizer>
									{({ width }) => (
										<List
											width={width}
											height={height}
											rowCount={count}
											rowHeight={120}
											rowRenderer={this.rowRenderer.bind(this)}
											//指定是否在滚动,必须有,否则滚不动
											isScrolling={isScrolling}
											//滚动时调用的函数
											onScroll={onChildScroll}
											//距离顶部的距离(必须要有)
											scrollTop={scrollTop}
											/* 当用户滚动时,可以通知组件加载 */
											onRowsRendered={onRowsRendered}
											ref={registerChild}
											autoHeight
										/>
									)}
								</AutoSizer>
							)}
						</WindowScroller>
					)}
				</InfiniteLoader>
			);
		} else {
			return null;
		}
	}
	//用于提供加载更多函数的逻辑
	loadMoreRows = ({ startIndex, stopIndex }) => {
		console.log('加载', startIndex, stopIndex);
		return new Promise(async (resolve, reject) => {
			//异步的操作,需要发送请求,获取数据
			await this.getHouseList(startIndex + 1, stopIndex + 1);
			resolve();
		});
	};
	isRowLoaded = ({ index }) => {
		// 用于判断某一行是否有数据,
		// index:返回的那个看不见的下标
		return !!this.state.list[index];
	};
	//渲染每个item数据
	rowRenderer = ({ key, index, style }) => {
		const item = this.state.list[index];
		if (item) {
			return <HouseItem v={item} key={key} style={style}></HouseItem>;
		} else {
			return (
				<div key={key} style={style} className="placeholder">
					<p>拼命加载中</p>
				</div>
			);
		}
	};
	componentDidMount() {
		this.getHouseList();
	}
	//获取房屋数据
	async getHouseList(start = 1, end = 30) {
		Toast.loading('拼命加载中');
		document.body.overflow = 'hidden';
		const city = await getCurrentCity();
		const res = await http.get('/houses', {
			params: {
				cityId: city.value,
				...this.state.filter,
				start,
				end,
			},
		});
		const { count, list } = res.body;
		if (res.status === 200) {
			this.setState({
				list: [...this.state.list, ...list],
				count,
			});
		}
		Toast.hide();
		document.body.overflow = '';
		if (start === 1) {
			Toast.info(`总共加载了${count}条数据`);
		}
	}
	//点击确定按钮接收子组件传递过来的方法
	onFilter = (val) => {
		const params = this.parseParams(val);
		this.setState(
			{
				filter: params,
				//如果不清空的话数据点击确定不会变化
				list: [],
			},
			() => {
				this.getHouseList();
			}
		);
	};
	//参数处理
	parseParams(val) {
		const params = {};
		params.price = val.price[0];
		params.rentType = val.mode[0];
		params.more = val.more.join();
		const area = val.area;
		if (area.length === 3 && area[2] !== null) {
			//area[0]为area/subway
			params[area[0]] = area[2];
		} else {
			params[area[0]] = area[1];
		}
		return params;
		// console.log(params);
	}
}
export default House;
