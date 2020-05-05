import React from 'react';
import styles from './index.module.scss';
import BASE_URL from 'utils/config'; //导入环境变量
import { withRouter } from 'react-router-dom';

function HouseItem(props) {
	const { v, style, history } = props;
	return (
		<div
			className={styles.house}
			style={style}
			onClick={() => history.push('/detail/' + v.houseCode)}
		>
			<div className="imgWrap">
				<img className="img" src={BASE_URL + v.houseImg} alt="" />
			</div>
			<div className="content">
				<h3 className="title">{v.desc}</h3>
				<div className="desc">{v.desc}</div>
				<div>
					{v.tags.map((items, index) => {
						return (
							<span key={items} className={`tag tag${(index % 3) + 1}`}>
								{items}
							</span>
						);
					})}
				</div>
				<div className="price">
					<span className="priceNum">{v.price}</span> 元/月
				</div>
			</div>
		</div>
	);
}
export default withRouter(HouseItem);
