import React, { Component } from 'react';
import styles from './index.module.scss';
import img from './not-found.png';

export default class NoHouse extends Component {
	render() {
		if (this.props.children) {
			return (
				<div className={styles.sticky}>
					<img src={img} alt="" />
					<p>{this.props.children}</p>
				</div>
			);
		}
		return (
			<div className={styles.sticky}>
				<img src={img} alt="" />
				<p>没有找到房源，请您换个搜索条件吧~</p>
			</div>
		);
	}
}
