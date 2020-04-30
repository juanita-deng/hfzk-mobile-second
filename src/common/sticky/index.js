import React, { Component } from 'react';
import styles from './index.module.scss';

export default class Sticky extends Component {
	constructor(props) {
		super(props);
		this.placeholderRef = React.createRef();
		this.contentRef = React.createRef();
	}
	render() {
		return (
			<div className={styles.sticky}>
				{/* 占位元素 */}
				<div className="placeholders" ref={this.placeholderRef}></div>
				{/* 需要置顶的内容 */}
				<div className="content" ref={this.contentRef}>
					{this.props.children}
				</div>
			</div>
		);
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}
	handleScroll = () => {
		const rect = this.placeholderRef.current.getBoundingClientRect();
		if (rect.top <= 0) {
			//需要固定定位
			this.contentRef.current.classList.add('fixed');
			// this.placeholderRef.current.style.height =
			// this.contentRef.current.style.offsetHeight + 'px';
		} else {
			this.contentRef.current.classList.remove('fixed');
			// this.placeholderRef.current.style.height = 0;
		}
	};
}
