import {
    AimOutlined,
    ClusterOutlined,
} from '@ant-design/icons';
import loadable from "helper/router/loadable";

const PAGE_ROUTER = {
    HOME_SETTING : "",
    // DEVICE : "device",
    // QUEUE : "queue",
    NET_SETTING:"net_setting",

}

const homeSetting = loadable(()=>import('./machine'))
// const device = loadable(()=>import('./device'))
// const queue = loadable(()=>import('./queue'))
const net_setting = loadable(()=>import('./net_setting'))

export const ROUTER_MAP = [
    {
        path: PAGE_ROUTER.HOME_SETTING,
        Com: homeSetting,
        name: 'Cài đặt máy',
        Icon: ClusterOutlined 
    },
    // {
    //     path: PAGE_ROUTER.DEVICE,
    //     Com: device,
    //     name: 'Thiết bị',
    //     Icon: AimOutlined 
    // },
    // {
    //     path: PAGE_ROUTER.QUEUE,
    //     Com: queue,
    //     name: 'Queue',
    //     Icon: AimOutlined 
    // }, 
    {
        path: PAGE_ROUTER.NET_SETTING,
        Com: net_setting,
        name: 'Cài đặt mạng',
        Icon: AimOutlined 
    },
];