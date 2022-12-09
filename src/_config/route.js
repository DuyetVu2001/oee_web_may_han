import {
	FieldTimeOutlined,
	FolderOutlined,
	FundProjectionScreenOutlined,
	HomeOutlined,
	PlayCircleOutlined,
	SettingOutlined,
} from '@ant-design/icons';
import loadable from '../helper/router/loadable';

const HomePage = loadable(() => import('page/home'));
const MonitorPage = loadable(() => import('page/monitor'));
const MachineSetting = loadable(()=>import('../page/machines_setting'));


const Login = loadable(() => import('../page/login'));

export const ROUTES = {
	HOME: '',
	MONITOR: 'monitor',
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
	// {
	// 	role: [3, 4],
	// 	path: `/${ROUTES.MONITOR}`,
	// 	Com: MonitorPage,
	// 	exact: true,
	// 	name: 'monitor',
	// 	Icon: <FundProjectionScreenOutlined />,
	// },
	{
		role: [3, 4],
		path: `/${ROUTES.SETTING}`,
		Com: MachineSetting,
		exact: false,
		name: 'setting',
		Icon: <SettingOutlined />,
	},
];

export const public_route = [
	// {
	//     path: `/${ROUTES.LOGIN}`,
	//     Com: Login,
	// },
];
