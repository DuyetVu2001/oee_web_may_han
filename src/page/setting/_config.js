import {
    AreaChartOutlined,
    ClusterOutlined,
    DeploymentUnitOutlined, ReconciliationOutlined, SlidersOutlined, TeamOutlined ,AimOutlined, FolderOpenOutlined, MinusSquareOutlined
} from '@ant-design/icons';
import loadable from "helper/router/loadable";

const PAGE_ROUTER = {
    // PRODUCT : "",
    MASTER_CEDO : "",
    ERROR_CODE : "error-code",
    NG_CODE : "ng-code",
    ENTERPRISE : 'enterprise',
    WORKING_SHIFT : 'working-shift',
    DEVICE : 'device',
    GROUP_MACHINE : 'group_machine'
    // SPEED : "speed"
}

const Product = loadable(() => import('./product/index'));
const Master_Cedo = loadable(() => import('./master_cedo'))
const Error_Code = loadable(() => import('./error_code'))
const Ng_Code = loadable(() => import('./ng_code'))
const Enterprise = loadable(() => import('./enterprise'))
const Working_Shift = loadable(() => import('./working_shift'))
const Device = loadable(() => import('./device'))
const Group_Machine = loadable(() => import('./group_device'))
const Speed = loadable(() => import('./group_machine_product'))

export const ROUTER_MAP = [
    // {
    //     path: PAGE_ROUTER.PRODUCT,
    //     Com: Product,
    //     name: 'Product',
    //     Icon: ReconciliationOutlined
    // },
    // {
    //     path: PAGE_ROUTER.SPEED,
    //     Com: Speed,
    //     name: 'Speed',
    //     Icon: SlidersOutlined 
    // },
    {
        path: PAGE_ROUTER.MASTER_CEDO,
        Com: Master_Cedo,
        name: 'router_setting.product',
        Icon: ClusterOutlined 
    },
    {
        path: PAGE_ROUTER.ERROR_CODE,
        Com: Error_Code,
        name: 'router_setting.error_code',
        Icon: DeploymentUnitOutlined 
    },
    {
        path: PAGE_ROUTER.NG_CODE,
        Com: Ng_Code,
        name: 'router_setting.ng_code',
        Icon: MinusSquareOutlined
    },
    {
        path: PAGE_ROUTER.ENTERPRISE,
        Com: Enterprise,
        name: 'router_setting.enterprise',
        Icon: TeamOutlined 
    },
    {
        path: PAGE_ROUTER.WORKING_SHIFT,
        Com: Working_Shift,
        name: 'router_setting.working_shift',
        Icon: AreaChartOutlined
    }
    ,
    {
        path: PAGE_ROUTER.DEVICE,
        Com: Device,
        name: 'router_setting.device',
        Icon: AimOutlined 
    }
    ,
    {
        path: PAGE_ROUTER.GROUP_MACHINE,
        Com: Group_Machine,
        name: 'router_setting.group_device',
        Icon: FolderOpenOutlined  
    }
];