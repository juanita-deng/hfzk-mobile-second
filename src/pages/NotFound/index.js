import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
class NotFound extends React.Component {
	render() {
		return (
			<div className="notfound">
				你查看的页面不存在返回 <Link to="/home">首页</Link>
			</div>
		);
	}
}
export default NotFound;
