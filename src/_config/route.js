import {
	FolderOutlined,
	FundProjectionScreenOutlined,
	HomeOutlined,
	SettingOutlined,
} from '@ant-design/icons';
import loadable from '../helper/router/loadable';

import WeldingPage from 'page/welding_page';
const HomePage = loadable(() => import('page/home'));
const MonitorPage = loadable(() => import('page/monitor'));
const ConfigPage = loadable(() => import('page/machines-config'));
const MachineSetting = loadable(()=>import('page/machines_setting'));

const Login = loadable(() => import('../page/login'));

export const ROUTES = {
	HOME: '',
	MONITOR: 'monitor',
	CONFIG: 'config',
	LOGIN: 'login',
	SETTING: 'setting',

};

export const private_route_admin = [
	{
		role: [3, 4],
		path: `/${ROUTES.HOME}`,
		Com: HomePage,
		exact: true,
		name: 'home',
		Icon: <HomeOutlined />,
	},
	{
		role: [3, 4],
		path: `/${ROUTES.MONITOR}`,
		Com: MonitorPage,
		exact: true,
		name: 'monitor',
		Icon: <FundProjectionScreenOutlined />,
	},
	{
		role: [3, 4],
		path: `/${ROUTES.CONFIG}`,
		Com: ConfigPage,
		exact: true,
		name: 'config',
		Icon: <SettingOutlined />,
	},
	{
		role: [3, 4],
		path: `/${ROUTES.SETTING}`,
		Com: MachineSetting,
		exact: true,
		name: 'setting',
		Icon: <FolderOutlined />,
	},
];

export const public_route = [
	// {
	//     path: `/${ROUTES.LOGIN}`,
	//     Com: Login,
	// },
];
