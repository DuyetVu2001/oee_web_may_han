import {
    AimOutlined,
    ClusterOutlined,
} from '@ant-design/icons';
import loadable from "helper/router/loadable";

const PAGE_ROUTER = {
    HOME_SETTING : "",
    NET_SETTING:"cai-dat-mang",
}

const homeSetting = loadable(()=>import('./machine'))
const net_setting = loadable(()=>import('./net_setting'))

export const ROUTER_MAP = [
    {
        path: PAGE_ROUTER.HOME_SETTING,
        Com: homeSetting,
        // exact:true,
        name: 'Cài đặt máy',
        Icon: ClusterOutlined 
    },
    {
        path: PAGE_ROUTER.NET_SETTING,
        Com: net_setting,
        // exact:true,
        name: 'Cài đặt mạng',
        Icon: AimOutlined 
    },
];