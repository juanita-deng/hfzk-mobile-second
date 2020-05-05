import React from 'react';
import styles from './index.module.scss';
import FilterFooter from '../FilterFooter';
import classNames from 'classnames';
import { Spring } from 'react-spring/renderprops';

class FilterMore extends React.Component {
	state = {
		selectedValue: this.props.defaultValue, //选中项
	};
	render() {
		const {
			handleHide,
			characteristic = [],
			floor = [],
			oriented = [],
			roomType = [],
			handleConfirm,
			openType,
		} = this.props;
		return (
			<div className={styles['filter-more']}>
				{/* 遮罩层 */}
				<Spring
					from={{ opacity: 0 }}
					config={{ duration: 2000 }}
					to={{ opacity: openType === 'more' ? 1 : 0 }}
				>
					{(props) => {
						if (props.opacity === 0) {
							return null;
						}
						return <div className="mask" style={props} onClick={handleHide} />;
					}}
				</Spring>
				{/* 条件内容 */}
				<Spring
					from={{ transform: 'translateX(100%)' }}
					to={{
						transform:
							openType === 'more' ? 'translateX(0%)' : 'translateX(100%)',
					}}
				>
					{(props) => {
						return (
							<>
								<div className="tags" style={props}>
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
									style={props}
								></FilterFooter>
							</>
						);
					}}
				</Spring>
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
export default FilterMore;
