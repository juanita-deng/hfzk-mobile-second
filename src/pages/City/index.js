import React from 'react';
import { Toast } from 'antd-mobile';
import NavHeader from 'common/navHeader/index';
import axios from 'axios';
import { getCurrentCity, setCity } from '../../utils/city';
import { AutoSizer, List } from 'react-virtualized';
import './index.scss';

//造假数据
// const list = Array.from(new Array(1000)).map(
// 	(v, index) => `我是第${index}条数据`
// );
const TITLE_HEIGHT = 36;
const CITYS_HEIGHT = 50;
const HOT = ['北京', '上海', '广州', '深圳'];

class City extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			arr: [], //城市列表的标题
			obj: {}, //城市列表城市名称
			activeIndex: '', //滚动列表高亮的类
		};
		this.ListRef = React.createRef();
	}
	render() {
		return (
			<div className="city">
				{/* 头部导航条 */}
				<NavHeader>城市选择</NavHeader>
				{/* 左侧城市列表 */}
				<AutoSizer>
					{({ width, height }) => (
						<div>
							{/* 城市列表 */}
							<List
								className="cityList"
								width={width}
								height={height}
								rowCount={this.state.arr.length}
								rowHeight={this.parseHeight.bind(this)}
								rowRenderer={this.rowRenderer.bind(this)}
								onRowsRendered={this.onRowsRendered.bind(this)}
								ref={this.ListRef}
								scrollToAlignment="start"
							/>
						</div>
					)}
				</AutoSizer>
				{/*右侧城市索引列表： */}
				<ul className="city-index">
					{this.state.arr.map((v, index) => (
						<li className="city-index-item" key={v}>
							<span
								className={
									index === this.state.activeIndex ? 'index-active' : ''
								}
								onClick={this.handleClick.bind(this, index)}
							>
								{v === 'hot' ? '热' : v.toUpperCase()}
							</span>
						</li>
					))}
				</ul>
			</div>
		);
	}
	//左边城市列表数据渲染
	rowRenderer({ key, index, style }) {
		const short = this.state.arr[index];
		const citys = this.state.obj[short];
		// console.log(short, citys);
		return (
			<div key={key} style={style} className="city-item">
				<div className="title">{this.hanleTitle(short)}</div>
				{citys.map((v) => (
					<div
						className="name"
						key={v.value}
						onClick={this.switchCity.bind(this, v)}
					>
						{v.label}
					</div>
				))}
			</div>
		);
	}
	//点击左侧城市名称切换城市
	switchCity(city) {
		// console.log(city);
		if (HOT.includes(city.label)) {
			setCity(city);
			this.props.history.go(-1);
		} else {
			Toast.info('该城市没有更多数据', 1);
		}
	}
	//右侧滚动城市列表对应索引高亮(联动)
	onRowsRendered({ startIndex }) {
		if (this.state.activeIndex !== startIndex) {
			this.setState({
				activeIndex: startIndex,
			});
		}
	}
	//点击右侧索引置顶对应城市
	handleClick(index) {
		// console.log(index);
		this.ListRef.current.scrollToRow(index);
	}
	componentDidMount() {
		this.getCurrentList();
	}
	//城市列表高度动态生成
	parseHeight({ index }) {
		// console.log(index);
		const title = this.state.arr[index];
		const citys = this.state.obj[title];
		return TITLE_HEIGHT + CITYS_HEIGHT * citys.length;
	}
	//城市列表标题处理
	hanleTitle(title) {
		// console.log(title);
		if (title === '#') {
			return '当前定位';
		} else if (title === 'hot') {
			return '热门城市';
		} else {
			return title.toUpperCase();
		}
	}
	//获取城市列表信息
	async getCurrentList() {
		const res = await axios.get('http://localhost:8080/area/city?level=' + 1);
		// console.log(res);//获取的数据需要处理
		const { status, body } = res.data;
		if (status === 200) {
			//将数据传出去处理
			this.parseCurrentList(body);
			//解构返回的数据
			const { arr, obj } = this.parseCurrentList(body);
			// console.log(arr, obj);

			//处理热门城市
			const hot = await axios.get('http://localhost:8080/area/hot');
			arr.unshift('hot');
			obj['hot'] = hot.data.body;
			// console.log(obj, arr);

			//处理当前城市
			arr.unshift('#');
			// 方法一:回调函数
			// getCurrentCity((currentCity) => {
			// 	console.log(currentCity);
			// });
			//方法二:promise
			const currentCity = await getCurrentCity();
			// console.log(currentCity);

			obj['#'] = [currentCity];
			// console.log(obj, arr);

			this.setState(
				{
					arr,
					obj,
				},
				() => {
					this.ListRef.current.measureAllRows();
				}
			);
		}
	}
	//处理城市列表的数据格式为:
	parseCurrentList(body) {
		//{a:'安庆',b:'保定','宝鸡','北京',...}
		//['a','b','c',...]
		// console.log(body);
		//1.处理对象
		const obj = {};
		body.forEach((v) => {
			const short = v.short.slice(0, 1);
			if (short in obj) {
				obj[short].push(v);
			} else {
				obj[short] = [v];
			}
		});
		// console.log(obj);
		//2.处理数组
		let arr = Object.keys(obj).sort();
		// console.log(arr);

		//3.返回处理的结果
		return {
			arr,
			obj,
		};
	}
}
export default City;
