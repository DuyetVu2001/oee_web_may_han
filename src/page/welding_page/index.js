import { Button, Tabs } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	Route,
	Switch,
	useHistory,
	useLocation,
	useRouteMatch,
} from 'react-router-dom';
import InApp from '../../com/in_app_layout';
import { ROUTER_MAP } from './_config';

const WeldingPage = () => {
	let { path } = useRouteMatch();

	return (
		<InApp>
			<TabsMenu />
			<Switch>
				{ROUTER_MAP.map(({ exact = true, ...route }) => {
					return (
						<Route
						exact={exact}
							// key={`${path}/${route.path}`}
							// path={`${path}/${route.path}`}
							key={`/${route.path}`}
							path={`/${route.path}`}
						>
							<route.Com />
						</Route>
					);
				})}
			</Switch>
		</InApp>
	);
};

export default WeldingPage;

const TabsMenu = React.memo(() => {
	const history = useHistory();
	let { path } = useRouteMatch();
	let { pathname } = useLocation();
	const { t } = useTranslation();

	const selectedKeys = React.useMemo(() => {
		// const listKey = ROUTER_MAP.map((m) => `${path}/${m.path}`);
		const listKey = ROUTER_MAP.map((m) => `/${m.path}`);
		return listKey.find((i) => i.includes(pathname)) || listKey[0];
	}, [path, pathname]);

	const _handleChangeTab = (key) => {
		history.push(key);
	};
	return (
		<Tabs
			defaultActiveKey="1"
			activeKey={selectedKeys}
			onChange={_handleChangeTab}
			size="small"
			tabBarGutter={1}
		>
			{ROUTER_MAP.map((route) => (
				<Tabs.TabPane
					style={{ padding: 0 }}
					// key={`${path}/${route.path}`}
					key={`/${route.path}`}
					tab={
						<Button className="ro-custom" border={false} type="text">
							{t(route.name)}
						</Button>
					}
				/>
			))}
		</Tabs>
	);
});
