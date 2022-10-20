import {
    SendOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import loadable from "helper/router/loadable";
import { useTranslation } from "react-i18next";

const PAGE_ROUTER = {
    Home : "",
    DAILY : "daily",
}

const Noti = loadable(() => import('./errors'));
const Daily = loadable(() => import('./daily'));

export const ROUTER_MAP = [
    {
        path: PAGE_ROUTER.Home,
        Com: Noti,
        name: 'email_setting.error_email',
        Icon: ExclamationCircleOutlined 
    },
    {
        path: PAGE_ROUTER.DAILY,
        Com: Daily,
        name: 'email_setting.daily_email',
        Icon: SendOutlined 
    },
];