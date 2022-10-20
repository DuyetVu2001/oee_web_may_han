import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Skeleton } from 'antd';
import _ from 'lodash';
import {
	Route,
	Redirect,
	BrowserRouter as Router,
	Switch,
} from 'react-router-dom';

// REDUX
import {
	public_route,
	private_route_admin,
	private_route_employee,
	private_route_manager,
	private_route_super_admin,
	private_route_agent,
} from './_config/route';
// STYLES
import 'antd/dist/antd.css';
import './styled/index.css';
//
import reportWebVitals from './reportWebVitals';
import store, { persistor } from './store';
import PrivateRoute from './helper/router/private_route';
import AppLayout from './com/app_layout';
import './i18next';
import { ROLE } from '_config/constant';

const mapRole2Route = {
	[ROLE.SUPER_ADMIN]: private_route_super_admin,
	[ROLE.AGENT]: private_route_agent,
	[ROLE.ADMIN]: private_route_admin,
	[ROLE.MANAGER]: private_route_manager,
	[ROLE.EMPLOYEE]: private_route_employee,
};

export const UseRouter = () => {
	// const role = useSelector((state) => _.get(state, 'app.userrole', ''));
	// const route = useMemo(() => {
	// 	return mapRole2Route[role] ? mapRole2Route[role] : private_route_employee;
	// }, [role]);

	// return route;

	return public_route;
};

const IpAppRouter = () => {
	const route = UseRouter();

	return route.map(({ exact = true, ...route }) => (
		<PrivateRoute
			role={route.role}
			key={route.path}
			exact={exact}
			path={route.path}
		>
			<route.Com />
		</PrivateRoute>
	));
};

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={<Skeleton />} persistor={persistor}>
				{/* <AppLayout> */}
				<Router>
					<Switch>
						{public_route.map((route) => (
							<Route key={route.path} exact path={route.path}>
								<route.Com />
							</Route>
						))}
						{/* {private_route.map(({exact = true,...route}) => (
                <PrivateRoute role={route.role} key={route.path} exact={exact} path={route.path}>
                  <route.Com />
                </PrivateRoute>
              ))} */}
						<IpAppRouter />
						{/* <CheckRole /> */}
						<Redirect to="/404" />
					</Switch>
				</Router>
				{/* </AppLayout> */}
			</PersistGate>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
