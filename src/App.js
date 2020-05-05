import React from 'react';
//路由配置
import {
	HashRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';
import Home from './pages/Home';
import Map from './pages/Map';
import City from './pages/City';
import NotFound from './pages/NotFound';
import Detail from './pages/Detail';

class App extends React.Component {
	render() {
		return (
			<Router>
				<div className="app">
					<Switch>
						{/* 路由重定向 */}
						<Redirect from="/" to="/home" exact></Redirect>
						<Route path="/home" component={Home}></Route>
						<Route path="/map" component={Map}></Route>
						<Route path="/city" component={City}></Route>
						<Route path="/detail/:id" component={Detail}></Route>
						<Route component={NotFound}></Route>
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
