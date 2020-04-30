import React from 'react';
import styles from './index.module.scss';
import { PickerView } from 'antd-mobile';
import FilterFooter from '../FilterFooter';

class FilterPicker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.defaultValue, //用于存储用户筛选的条件
		};
	}
	//方法一:解决来回切换数据不能回显的bug
	// componentDidUpdate(prevProps) {
	// 	// console.log(prevProps);
	// 	if (prevProps.defaultValue !== this.props.defaultValue) {
	// 		this.setState({
	// 			value: this.props.defaultValue,
	// 		});
	// 	}
	// }
	render() {
		const { data, cols, handleHide, handleConfirm } = this.props;
		return (
			<div className={styles['filter-picker']}>
				{/* 三级联动 */}
				<PickerView
					data={data}
					cols={cols}
					value={this.state.value}
					onChange={this.handleChange}
				/>
				{/* 底部 */}
				<FilterFooter
					handleHide={handleHide}
					handleConfirm={() => handleConfirm(this.state.value)}
				></FilterFooter>
			</div>
		);
	}
	//双向绑定筛选的内容
	handleChange = (val) => {
		this.setState({
			value: val,
		});
	};
}
export default FilterPicker;
