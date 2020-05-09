import React, { Suspense } from 'react';
//路由配置
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';
import Home from './pages/Home';
//懒加载 异步导入
const Map = React.lazy(() => import('./pages/Map'));
const City = React.lazy(() => import('./pages/City'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Detail = React.lazy(() => import('./pages/Detail'));
const Login = React.lazy(() => import('./pages/Login'));
const Rent = React.lazy(() => import('./pages/Rent'));
const Add = React.lazy(() => import('pages/Rent/Add'));
const Search = React.lazy(() => import('pages/Rent/Search'));
const PrivateRoute = React.lazy(() => import('common/PraviteRoute'));

class App extends React.Component {
	render() {
		return (
			<Router>
				<div className="app">
					{/* 路由重定向 */}
					<Suspense fallback={<div>loading...</div>}>
						<Switch>
							<Redirect from="/" to="/home" exact></Redirect>
							<Route path="/home" component={Home}></Route>
							<Route path="/map" component={Map}></Route>
							<Route path="/city" component={City}></Route>
							<Route path="/detail/:id" component={Detail}></Route>
							<Route path="/login" component={Login}></Route>
							<PrivateRoute path="/rent" exact component={Rent}></PrivateRoute>
							<PrivateRoute path="/rent/add" component={Add}></PrivateRoute>
							<PrivateRoute
								path="/rent/search"
								component={Search}
							></PrivateRoute>
							<Route component={NotFound}></Route>
						</Switch>
					</Suspense>
				</div>
			</Router>
		);
	}
}

export default App;
