
import {
    DesktopOutlined,
    HomeOutlined,
    BarChartOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined,
    MonitorOutlined,
    InfoCircleOutlined,
    FundProjectionScreenOutlined,
    SendOutlined,
    BellOutlined,
    SnippetsOutlined
} from '@ant-design/icons';

import loadable from '../helper/router/loadable';
import GrafanaArea from 'page/tv_link/cedo_area';
import GrafanaMachine from 'page/tv_link/cedo_machine';
import GrafanaOperate from 'page/tv_link/cedo_operate';
import GrafanaPower from 'page/tv_link/cedo_power';
import WeldingPage from 'page/welding_page';

// COMPONENT
// public
const Login = loadable(() => import('../page/login'));
// private
const Home = loadable(() => import('../page/home'))
const Monitor = loadable(() => import('../page/monitor'));
const AboutUs = loadable(() => import('../page/about_us'));
const Statistic_Page = loadable(() => import('../page/statistic_page'));
// const Product_Statistic = loadable(() => import('../page/product-statistic'))
// const MachineAnalytic = loadable(() => import('../page/machine-analytic'))
const Setting = loadable(() => import('../page/setting'))
const Account = loadable(() => import('../page/account'))
// const Plan = loadable(() => import('../page/plan_page'));
const ProfilePage = loadable(() => import('../page/ProfilePage'))
const TVLink = loadable(() => import('../page/tv_link'))
const Send_Email = loadable(() => import('../page/send_email'))
const Report = loadable(() => import('../page/report'))
const ChangeMold = loadable(() => import('../page/change_mold_realtime'))
// super admin
const HomeAdmin = loadable(() => import('../page/home_admin'))
// agent
const Enterprise = loadable(() => import('../page/enterprise'))
const HomeAgent = loadable(() => import('../page/home_agent'))


// route

// const { t, i18n } = useTranslation();

export const ROUTES = {
    // unAuth
    LOGIN: "login",
    // auth
		HOME: "",
		WELDING: "welding",
    PLAN: 'plan',
    STATISTIC: 'statistic',
    MACHINE_ANALYTIC: 'machine-analytic',
    PRODUCT_STATISTIC: 'statistics',
    SETTING: 'setting',
    ACCOUNT: 'account',
    PROFILE: 'profile',
    ABOUT_US: 'about-us',
    TV_LINK: 'tv-link',
    SEND_EMAIL: 'send-email',
    AREA: 'tv-link/area',
    MACHINE: 'tv-link/machine',
    OPERATE: 'tv-link/operate',
    POWER: 'tv-link/power',
    change_mold_realtime: 'change-mold-realtime',
    Monitor: 'monitor',
};

export const private_route_admin = [
    {
        role: [3, 4],
        path: `/${ROUTES.HOME}`,
        Com: Home,
        name: "home",
        Icon: <HomeOutlined />,
	},
    {
        role: [3, 4],
        path: `/${ROUTES.WELDING}`,
        Com: WeldingPage,
        exact: false,
        name: 'welding',
        Icon: <HomeOutlined />,
    },
    {
        role: [3, 4, 5],
        path: `/${ROUTES.Monitor}`,
        Com: Monitor,
        exact: false,
        name: "monitor",
        Icon: <FundProjectionScreenOutlined />
    },
    {
        role: [3, 4],
        path: `/${ROUTES.STATISTIC}`,
        exact: false,
        Com: Statistic_Page,
        name: "statistic",
        Icon: <BarChartOutlined />
    },
    {
        role: [3, 4],
        path: `/report`,
        Com: Report,
        name: "report",
        // hidden: true,
        Icon: <SnippetsOutlined />
    },
    {
        role: [3, 4],
        path: `/${ROUTES.SETTING}`,
        Com: Setting,
        exact: false,
        name: "setting",
        Icon: <SettingOutlined />
    },
    {
        role: [3, 4],
        path: `/${ROUTES.TV_LINK}`,
        Com: TVLink,
        exact: false,
        name: "tv_link",
        Icon: <DesktopOutlined />
    },
    {
        role: [3, 4],
        path: `/${ROUTES.SEND_EMAIL}`,
        Com: Send_Email,
        exact: false,
        name: "send_email",
        Icon: <SendOutlined />
        // Icon: <i className="fa-solid fa-paper-plane"></i>
    },
    {
        role: [3],
        path: `/${ROUTES.ACCOUNT}`,
        Com: Account,
        exact: false,
        name: "account_manager",
        Icon: <TeamOutlined />
    },
    {
        role: [3, 4, 5],
        path: `/${ROUTES.PROFILE}`,
        Com: ProfilePage,
        hidden: true,
        // exact: false,
        name: "account",
        Icon: <UserOutlined />
    },
    {
        role: [3, 4, 5],
        path: `/${ROUTES.ABOUT_US}`,
        Com: AboutUs,
        hidden: true,
        name: "about",
        Icon: <InfoCircleOutlined />
    },
];


export const private_route_employee = [
    {
        role: [3, 4, 5],
        path: `/${ROUTES.Monitor}`,
        Com: Monitor,
        exact: false,
        name: "monitor",
        Icon: <FundProjectionScreenOutlined />
    },
    {
        role: [3, 4, 5],
        path: `/${ROUTES.PROFILE}`,
        Com: ProfilePage,
        hidden: true,
        // exact: false,
        name: "account",
        Icon: <UserOutlined />
    },
    {
        role: [3, 4, 5],
        path: `/${ROUTES.ABOUT_US}`,
        Com: AboutUs,
        hidden: true,
        name: "about",
        Icon: <InfoCircleOutlined />
    },
];

export const private_route_manager = [
    {
        role: [3, 4],
        path: `/${ROUTES.HOME}`,
        Com: Home,
        name: "home",
        Icon: <HomeOutlined />,
    },
    {
        role: [3, 4, 5],
        path: `/${ROUTES.Monitor}`,
        Com: Monitor,
        exact: false,
        name: "monitor",
        Icon: <FundProjectionScreenOutlined />
    },
    {
        role: [3, 4],
        path: `/${ROUTES.STATISTIC}`,
        exact: false,
        Com: Statistic_Page,
        name: "statistic",
        Icon: <BarChartOutlined />
    },
    {
        role: [3, 4],
        path: `/report`,
        Com: Report,
        name: "report",
        // hidden: true,
        Icon: <SnippetsOutlined />
    },
    {
        role: [3, 4],
        path: `/${ROUTES.SETTING}`,
        Com: Setting,
        exact: false,
        name: "setting",
        Icon: <SettingOutlined />
    },
    {
        role: [3, 4],
        path: `/${ROUTES.TV_LINK}`,
        Com: TVLink,
        exact: false,
        name: "tv_link",
        Icon: <DesktopOutlined />
    },
    {
        role: [3, 4],
        path: `/${ROUTES.SEND_EMAIL}`,
        Com: Send_Email,
        exact: false,
        name: "send_email",
        Icon: <SendOutlined />
        // Icon: <i className="fa-solid fa-paper-plane"></i>
    },
    {
        role: [3, 4, 5],
        path: `/${ROUTES.PROFILE}`,
        Com: ProfilePage,
        hidden: true,
        // exact: false,
        name: "account",
        Icon: <UserOutlined />
    },
    {
        role: [3, 4, 5],
        path: `/${ROUTES.ABOUT_US}`,
        Com: AboutUs,
        hidden: true,
        name: "about",
        Icon: <InfoCircleOutlined />
    },
];

export const private_route_super_admin = [
    {
        path: `/${ROUTES.HOME}`,
        Com: HomeAdmin,
        exact: true,
        name: "home",
        Icon: <HomeOutlined />
    },
    {
        path: `/enterprise`,
        Com: Enterprise,
        exact: true,
        name: "enterprise",
        Icon: <InfoCircleOutlined />
    },
    {
        role: [3, 4, 5],
        path: `/${ROUTES.ABOUT_US}`,
        Com: AboutUs,
        hidden: true,
        name: "about",
        Icon: <InfoCircleOutlined />
    },
];

export const private_route_agent = [
    {
        role: [2],
        path: `/${ROUTES.HOME}`,
        Com: HomeAgent,
        exact: false,
        name: "account_manager",
        Icon: <TeamOutlined />
    },
    {
        role: [3, 4, 5],
        path: `/${ROUTES.PROFILE}`,
        Com: ProfilePage,
        hidden: true,
        // exact: false,
        name: "account",
        Icon: <UserOutlined />
    },
    {
        role: [3, 4, 5],
        path: `/${ROUTES.ABOUT_US}`,
        Com: AboutUs,
        hidden: true,
        name: "about",
        Icon: <InfoCircleOutlined />
    },
];

export const public_route = [
    {
        role: [3, 4],
        path: `/${ROUTES.WELDING}`,
        Com: WeldingPage,
        exact: false,
        name: 'welding',
        Icon: <HomeOutlined />,
    },
    // {
    //     path: `/${ROUTES.LOGIN}`,
    //     Com: Login,
    // },
    // {
    //     path: `/${ROUTES.TV_LINK}`,
    //     Com: TVLink,
    // },
    // {
    //     path: `/${ROUTES.AREA}`,
    //     Com: GrafanaArea,
    // },
    // {
    //     path: `/${ROUTES.MACHINE}`,
    //     Com: GrafanaMachine,
    // },
    // {
    //     path: `/${ROUTES.OPERATE}`,
    //     Com: GrafanaOperate,
    // },
    // {
    //     path: `/${ROUTES.POWER}`,
    //     Com: GrafanaPower,
    // },
    // {
    //     path: `/${ROUTES.change_mold_realtime}`,
    //     Com: ChangeMold,
    // },
    // {
    //     path: `/404`,
    //     Com: () => <div>2223</div>,
    // }
];


export const map_link = {
    application: 'welcome',

    employees: ROUTES.ACCOUNT,

    sales: 'sales',

    purchase: 'purchase',

    outsource: 'outsource',

    inventory: 'inventory',

    plm: 'plm',

    manufacture: 'manufacture',

    quality: 'quality',

    realtime: 'realtime',

    maintenance: 'maintenance',

    setting: 'setting',

    task: 'task'
}
