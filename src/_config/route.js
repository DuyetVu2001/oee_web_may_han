import { HomeOutlined } from '@ant-design/icons';

import WeldingPage from 'page/welding_page';
import loadable from '../helper/router/loadable';

const Login = loadable(() => import('../page/login'));

export const ROUTES = {
	WELDING: '',
	LOGIN: 'login',
};

export const private_route_admin = [
	{
		role: [3, 4],
		path: `/${ROUTES.WELDING}`,
		Com: WeldingPage,
		exact: false,
		name: 'welding',
		Icon: <HomeOutlined />,
	},
];

export const public_route = [
	// {
	//     path: `/${ROUTES.LOGIN}`,
	//     Com: Login,
	// },
];
