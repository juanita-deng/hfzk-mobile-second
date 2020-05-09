import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { hasToken } from 'utils/token';

export default function PrivateRoute({ component: Component, ...rest }) {
	// console.log(Component, rest);
	return (
		<Route
			{...rest}
			render={(props) =>
				hasToken() ? (
					<Component {...props}></Component>
				) : (
					<Redirect
						to={{ pathname: '/login', state: { from: props.location } }}
					></Redirect>
				)
			}
		></Route>
	);
}
