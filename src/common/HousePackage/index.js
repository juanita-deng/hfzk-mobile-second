import React, { Component } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';

// 所有房屋配置项
const HOUSE_PACKAGE = [
	{
		id: 1,
		name: '衣柜',
		icon: 'icon-wardrobe',
	},
	{
		id: 2,
		name: '洗衣机',
		icon: 'icon-wash',
	},
	{
		id: 3,
		name: '空调',
		icon: 'icon-air',
	},
	{
		id: 4,
		name: '天然气',
		icon: 'icon-gas',
	},
	{
		id: 5,
		name: '冰箱',
		icon: 'icon-ref',
	},
	{
		id: 6,
		name: '暖气',
		icon: 'icon-Heat',
	},
	{
		id: 7,
		name: '电视',
		icon: 'icon-vid',
	},
	{
		id: 8,
		name: '热水器',
		icon: 'icon-heater',
	},
	{
		id: 9,
		name: '宽带',
		icon: 'icon-broadband',
	},
	{
		id: 10,
		name: '沙发',
		icon: 'icon-sofa',
	},
];

export default class HousePackage extends Component {
	state = {
		active: [],
	};
	render() {
		// console.log(this.props);
		const { list, onSelect } = this.props;
		let data = [];
		if (list) {
			data = HOUSE_PACKAGE.filter((v) => this.props.list.includes(v.name));
		} else {
			data = HOUSE_PACKAGE;
		}

		// console.log(data);
		return (
			<ul className={styles['house-package']}>
				{data.map((v) => (
					<li
						onClick={onSelect && this.handleClick.bind(this, v.name)}
						className={classNames('item', {
							active: this.state.active.includes(v.name),
						})}
						key={v.id}
					>
						<p>
							<i className={`iconfont icon ${v.icon}`}></i>
						</p>
						{v.name}
					</li>
				))}
			</ul>
		);
	}
	handleClick = (name) => {
		// console.log(name);
		const { active } = this.state;
		let arr = Array.from(active);
		if (arr.includes(name)) {
			arr = arr.filter((v) => v !== name);
		} else {
			arr.push(name);
		}
		this.setState({
			active: arr,
		});
		//将筛选好的最新结果传给父组件
		this.props.onSelect(arr);
	};
}
