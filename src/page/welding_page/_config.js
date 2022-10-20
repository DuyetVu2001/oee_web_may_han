import { ClusterOutlined } from '@ant-design/icons';
import loadable from 'helper/router/loadable';

const PAGE_ROUTER = {
	CARDS: '',
	CHARTS: 'charts',
	MACHINES: 'machines',
};

const Cards = loadable(() => import('./cards'));
const Charts = loadable(() => import('./charts'));
const Machines = loadable(() => import('./machines'));

export const ROUTER_MAP = [
	{
		path: PAGE_ROUTER.CARDS,
		Com: Cards,
		name: 'welding.cards',
		Icon: ClusterOutlined,
	},
	{
		path: PAGE_ROUTER.CHARTS,
		Com: Charts,
		name: 'welding.charts',
		Icon: ClusterOutlined,
	},
	{
		path: PAGE_ROUTER.MACHINES,
		Com: Machines,
		name: 'welding.machines',
		Icon: ClusterOutlined,
	},
];
