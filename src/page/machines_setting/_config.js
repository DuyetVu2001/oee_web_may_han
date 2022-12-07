import {
    AimOutlined,
    ClusterOutlined,
} from '@ant-design/icons';
import loadable from "helper/router/loadable";

const PAGE_ROUTER = {
    HOME_SETTING : "",
    DEVICE : "Device"
}

const homeSetting = loadable(()=>import('./machine'))
const device = loadable(()=>import('./device'))

export const ROUTER_MAP = [
    {
        path: PAGE_ROUTER.HOME_SETTING,
        Com: homeSetting,
        name: 'Quản lý máy',
        Icon: ClusterOutlined 
    },
    {
        path: PAGE_ROUTER.DEVICE,
        Com: device,
        name: 'Thiết bị',
        Icon: AimOutlined 
    },
];