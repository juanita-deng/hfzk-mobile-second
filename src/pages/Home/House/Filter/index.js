import React from 'react';
import styles from './index.module.scss';
import FilterTitle from '../FilterTitle';
import FilterPicker from '../FilterPicker';
import FilterMore from '../FilterMore';
import { getCurrentCity } from 'utils/city';
import http from 'utils/http';

class Filter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//用于控制FilterTitle组件的高亮
			titleSeleced: {
				area: false,
				mode: false,
				price: false,
				more: false,
			},
			openType: '', //用于控制area/mode/price/more的值,从而控制Picker组件的显隐
			filterData: {}, //用于渲染筛选的所有数据
			//用于存储用户筛选条件的数据
			selectedValue: {
				area: ['area', 'null'], //默认值
				mode: ['null'],
				price: ['null'],
				more: [],
			},
		};
	}
	//发请求获取当前筛选条件的数据
	async componentDidMount() {
		const city = await getCurrentCity();
		const res = await http.get('/houses/condition', {
			params: {
				id: city.value,
			},
		});
		const { status, body } = res;
		if (status === 200) {
			this.setState({
				filterData: body,
			});
		}
	}
	render() {
		const { openType } = this.state;
		return (
			<div className={styles.filter}>
				{openType === 'area' || openType === 'price' || openType === 'mode' ? (
					<div className="mask" onClick={this.handleHide} />
				) : null}
				<div className="content">
					{/* filter组件的内容 */}
					{/* 筛选标题 */}
					<FilterTitle
						titleSeleced={this.state.titleSeleced}
						handleChange={this.handleChange.bind(this)}
					></FilterTitle>
					{/* 条件筛选 */}
					{this.renderFilterPicker()}
					{/* 筛选更多 */}
					{this.renderFilterMore()}
				</div>
			</div>
		);
	}
	//渲染更多FilterMore组件
	renderFilterMore() {
		const {
			openType,
			selectedValue,
			filterData: { characteristic, floor, oriented, roomType },
		} = this.state;
		const defaultValue = selectedValue[openType];
		if (openType === 'more') {
			return (
				<FilterMore
					handleHide={this.handleHide}
					{...{ characteristic, floor, oriented, roomType }}
					handleConfirm={this.handleConfirm}
					/* 数据回显 */
					defaultValue={defaultValue}
				></FilterMore>
			);
		}
	}
	//渲染组件FilterPicker
	renderFilterPicker() {
		const { openType } = this.state;
		if (openType === 'more' || openType === '') {
			return null;
		}
		//渲染数据
		let data, cols;
		const { filterData, selectedValue } = this.state;
		let defaultValue = selectedValue[openType];
		if (openType === 'mode') {
			data = filterData.rentType;
			cols = 1;
		} else if (openType === 'price') {
			data = filterData.price;
			cols = 1;
		} else if (openType === 'area') {
			data = [filterData.area, filterData.subway];
			cols = 3;
		}
		return (
			<FilterPicker
				handleHide={this.handleHide}
				data={data}
				cols={cols}
				handleConfirm={this.handleConfirm}
				defaultValue={defaultValue}
				/* 方法二:解决来回切换标题,数据不能回显的问题 */
				key={defaultValue}
			></FilterPicker>
		);
	}
	//判断type和是否有value
	setTypeValue(type, value, newtitleSeleced) {
		value = value.toString();
		if (type === 'area' && value !== 'area,null') {
			newtitleSeleced[type] = true;
		} else if (type === 'mode' && value !== 'null') {
			newtitleSeleced[type] = true;
		} else if (type === 'price' && value !== 'null') {
			newtitleSeleced[type] = true;
		} else if (type === 'more' && value !== '') {
			newtitleSeleced[type] = true;
		} else {
			newtitleSeleced[type] = false;
		}
	}
	//处理Tilter组件高亮类名和Picker组件的显示
	handleChange(type) {
		document.body.style.overflow = 'hidden';
		// console.log(type);//接收子组件FilterTitle传递的值
		/* 
			1.点谁谁高亮(排他)
			2.如果筛选条件里是默认值,不高亮,不是默认值就高亮
		*/
		const { titleSeleced, selectedValue } = this.state;
		const newtitleSeleced = { ...titleSeleced };
		Object.keys(titleSeleced).forEach((v) => {
			if (v === type) {
				newtitleSeleced[v] = true;
			} else {
				//判断type和是否有value
				this.setTypeValue(v, selectedValue[v], newtitleSeleced);
			}
		});
		this.setState({
			titleSeleced: newtitleSeleced, //控制FilterTitle高亮类名
			openType: type, //控制FilterPicker的显示
		});
	}
	//取消按钮的逻辑
	handleHide = () => {
		document.body.style.overflow = '';
		const { openType, selectedValue, titleSeleced } = this.state;
		const newSelectedValue = { ...selectedValue };
		const newTitleSeleced = { ...titleSeleced };
		this.setTypeValue(openType, newSelectedValue[openType], newTitleSeleced);
		this.setState({
			openType: '', //控制FilterPicker组件的隐藏
			titleSeleced: newTitleSeleced, //控制高亮
		});
	};
	//点击确定按钮的逻辑
	handleConfirm = (val) => {
		window.scrollTo(0, 0);
		document.body.style.overflow = '';

		// console.log(val); //获取子组件传递过来的值
		const { openType, selectedValue, titleSeleced } = this.state;
		const newSelectedValue = { ...selectedValue };
		const newTitleSeleced = { ...titleSeleced };
		newSelectedValue[openType] = val;
		this.setTypeValue(openType, val, newTitleSeleced);
		this.setState({
			selectedValue: newSelectedValue, //获取到筛选项的内容
			openType: '', //控制组件的隐藏
			titleSeleced: newTitleSeleced, //控制高亮
		});
		//将处理好的数据传给父组件
		this.props.onFilter(newSelectedValue);
	};
}
export default Filter;
