import React, { Component } from 'react';
import { SearchBar } from 'antd-mobile';
import styles from './index.module.scss';
import http from 'utils/http';
import { getCurrentCity } from 'utils/city';
import _ from 'lodash'; //防抖函数

export default class Search extends Component {
	state = {
		// 搜索框的值
		searchTxt: '',
		tipsList: [],
	};

	// 渲染搜索结果列表
	renderTips = () => {
		const { tipsList } = this.state;
		return tipsList.map((v) => (
			<li
				onClick={() =>
					this.props.history.replace('/rent/add', {
						id: v.community,
						name: v.communityName,
					})
				}
				className="tip"
				key={v.community}
			>
				{v.communityName}
			</li>
		));
	};
	hanleChange = async (value) => {
		// console.log(value);
		this.setState({
			searchTxt: value,
		});

		//实时的发送请求获取信息
		this.getKeyWord(value);
	};
	//防抖功能优化代码
	getKeyWord = _.debounce(async (value) => {
		const city = await getCurrentCity();
		// console.log('要发请求了');
		const { status, body } = await http.get('/area/community', {
			params: {
				id: city.value,
				name: value,
			},
		});
		// console.log(body);
		if (status === 200) {
			this.setState({
				tipsList: body,
			});
		}
	}, 1000);
	render() {
		const { history } = this.props;
		const { searchTxt } = this.state;

		return (
			<div className={styles['rent-search']}>
				{/* 搜索框 */}
				<SearchBar
					placeholder="请输入小区或地址"
					value={searchTxt}
					onChange={this.hanleChange}
					showCancelButton={true}
					onCancel={() => history.replace('/rent/add')}
				/>

				{/* 搜索提示列表 */}
				<ul className="tips">{this.renderTips()}</ul>
			</div>
		);
	}
}
