import React from 'react';
import { NavBar, Icon } from 'antd-mobile';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import styles from './index.module.scss';
import classNames from 'classnames';
class NavHeader extends React.Component {
	static propTypes = {
		children: PropTypes.string.isRequired,
		rightContent: PropTypes.array,
	};
	render() {
		// console.log(this.props);
		return (
			<div className={classNames(styles['nav-header'], this.props.className)}>
				<NavBar
					className="navbar"
					mode="dark"
					icon={<Icon type="left" />}
					onLeftClick={() => this.props.history.go(-1)}
					rightContent={this.props.rightContent}
					style={this.props.style}
				>
					{this.props.children}
				</NavBar>
			</div>
		);
	}
}
export default withRouter(NavHeader);
