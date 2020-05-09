import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import http from 'utils/http';
import NavHeader from 'common/navHeader';
import HouseItem from 'common/houseItem';
import NoHouse from 'common/NoHouse';
import styles from './index.module.scss';

export default class Rent extends Component {
	state = {
		// 出租房屋列表
		list: [],
		isLoaded: false,
	};

	// 获取已发布房源的列表数据
	async getHouseList() {
		const { status, body } = await http.get('/user/houses');
		if (status === 200) {
			this.setState({
				list: body,
				isLoaded: true, //加载完
			});
		}
	}

	componentDidMount() {
		this.getHouseList();
	}

	renderHouseItem = () => {
		return this.state.list.map((v) => {
			return <HouseItem v={v} key={v}></HouseItem>;
		});
	};

	renderRentList() {
		const { list, isLoaded } = this.state;
		if (!isLoaded) {
			//若没加载完就返回空
			return null;
		}
		if (list.length === 0) {
			return (
				<NoHouse>
					您还没有房源，
					<Link to="/rent/add" className="link">
						去发布房源
					</Link>
					吧~
				</NoHouse>
			);
		}

		return <div className="houses">{this.renderHouseItem()}</div>;
	}

	render() {
		return (
			<div className={styles.rent}>
				<NavHeader
					rightContent={[
						<span onClick={() => this.props.history.push('/rent/add')} key={1}>
							添加
						</span>,
					]}
					className="navHeader"
				>
					房屋管理
				</NavHeader>
				{this.renderRentList()}
			</div>
		);
	}
}
