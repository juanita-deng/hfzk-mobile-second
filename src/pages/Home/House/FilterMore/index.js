import React from 'react';
import styles from './index.module.scss';
import FilterFooter from '../FilterFooter';
import classNames from 'classnames';

class Filter extends React.Component {
	state = {
		selectedValue: this.props.defaultValue, //选中项
	};
	render() {
		const {
			handleHide,
			characteristic,
			floor,
			oriented,
			roomType,
			handleConfirm,
		} = this.props;
		return (
			<div className={styles['filter-more']}>
				{/* 遮罩层 */}
				<div className="mask" onClick={handleHide} />
				{/* 条件内容 */}
				<div className="tags">
					<dl className="dl">
						<dt className="dt">户型</dt>
						<dd className="dd">{this.renderSpan(roomType)}</dd>

						<dt className="dt">朝向</dt>
						<dd className="dd">{this.renderSpan(oriented)}</dd>

						<dt className="dt">楼层</dt>
						<dd className="dd">{this.renderSpan(floor)}</dd>

						<dt className="dt">房屋亮点</dt>
						<dd className="dd">{this.renderSpan(characteristic)}</dd>
					</dl>
				</div>
				{/* 底部组件 */}
				<FilterFooter
					className="footer"
					handleHide={() => this.setState({ selectedValue: [] })}
					handleConfirm={() => handleConfirm(this.state.selectedValue)}
					cancelBtn="移除"
				></FilterFooter>
			</div>
		);
	}
	//渲染筛选项
	renderSpan(span) {
		return span.map((v) => (
			<span
				key={v.value}
				className={classNames('tag', {
					'tag-active': this.state.selectedValue.includes(v.value),
				})}
				onClick={this.getValue.bind(this, v.value)}
			>
				{v.label}
			</span>
		));
	}
	//获取筛选的内容
	getValue(val) {
		const { selectedValue } = this.state;
		let arr = Array.from(selectedValue);
		if (arr.includes(val)) {
			arr = arr.filter((v) => v !== val);
		} else {
			arr.push(val);
		}
		this.setState({
			selectedValue: arr,
		});
	}
}
export default Filter;
