import React from 'react';
import styles from './index.module.scss';
import { Flex } from 'antd-mobile';
import classNames from 'classnames';

const titleList = [
	{ title: '区域', type: 'area' },
	{ title: '方式', type: 'mode' },
	{ title: '租金', type: 'price' },
	{ title: '筛选', type: 'more' },
];
class Filter extends React.Component {
	render() {
		return (
			<Flex align="center" className={styles['filter-title']}>
				{titleList.map((v) => (
					<Flex.Item key={v.type}>
						{/* 选中类名： selected 动态渲染*/}
						<span
							className={classNames('dropdown', {
								selected: this.props.titleSeleced[v.type],
							})}
						>
							<span onClick={() => this.props.handleChange(v.type)}>
								{v.title}
							</span>
							<i className="iconfont icon-arrow" />
						</span>
					</Flex.Item>
				))}
			</Flex>
		);
	}
}
export default Filter;
