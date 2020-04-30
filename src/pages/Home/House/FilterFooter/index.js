import React from 'react';
import styles from './index.module.scss';
import { Flex } from 'antd-mobile';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class FilterFooter extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		cancelBtn: PropTypes.string,
	};
	static defaultProps = {
		cancelBtn: '取消',
	};
	render() {
		return (
			<Flex
				className={classNames(styles['filter-footer'], this.props.className)}
			>
				{/* 取消按钮 */}
				<span className="btn cancel" onClick={this.props.handleHide}>
					{this.props.cancelBtn}
				</span>
				{/* 确定按钮 */}
				<span className="btn ok" onClick={this.props.handleConfirm}>
					确定
				</span>
			</Flex>
		);
	}
}
export default FilterFooter;
