import React from 'react';
import styles from './index.module.scss';
import { Flex } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class SearchHeader extends React.Component {
	static propTypes = {
		cityName: PropTypes.string.isRequired,
		className: PropTypes.string,
	};
	render() {
		// console.log(this.props);
		return (
			<div
				className={classNames(styles['search-header'], this.props.className)}
			>
				<Flex className="search-box">
					<Flex className="search-form">
						<div
							className="location"
							onClick={() => this.props.history.push('/city')}
						>
							<span className="name">{this.props.cityName}</span>
							<i className="iconfont icon-arrow"> </i>
						</div>
						<div className="search-input">
							<i className="iconfont icon-seach" />
							<span className="text">请输入小区地址</span>
						</div>
					</Flex>
					{/* 地图小图标 */}
					<i
						className="iconfont icon-map"
						onClick={() => this.props.history.push('/map')}
					/>
				</Flex>
			</div>
		);
	}
}
export default withRouter(SearchHeader);
