import React, { Component } from 'react';
import styles from './index.module.scss';

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
	render() {
		const data = HOUSE_PACKAGE.filter((v) => this.props.list.includes(v.name));
		// console.log(data);
		return (
			<ul className={styles['house-package']}>
				{data.map((v) => (
					<li className="item" key={v.id}>
						<p>
							<i className={`iconfont icon ${v.icon}`}></i>
						</p>
						{v.name}
					</li>
				))}
			</ul>
		);
	}
}
