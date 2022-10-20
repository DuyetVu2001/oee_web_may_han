import {
    ClusterOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';
import loadable from "helper/router/loadable";

const PAGE_ROUTER = {
    MAIN : "",
    STAFF : "staff",
    GROUP : 'group_staff'
}

const Acc = loadable(() => import('./account_table'));
const Staff = loadable(() => import('./staff_table'))
const Group = loadable(() => import('./group_table'))

export const ROUTER_MAP = [
    {
        path: PAGE_ROUTER.MAIN,
        Com: Acc,
        name: 'account.account',
        Icon: UsergroupAddOutlined
    },
    {
        path: PAGE_ROUTER.STAFF,
        Com: Staff,
        name: 'account.staff',
        Icon: ClusterOutlined 
    },
    {
        path: PAGE_ROUTER.GROUP,
        Com: Group,
        name: 'account.group',
        Icon: ClusterOutlined 
    },
];