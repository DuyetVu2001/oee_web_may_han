import GrafanaArea from './cedo_area'
import GrafanaMachine from './cedo_machine'
import GrafanaOperate from './cedo_operate'
import GrafanaPower from './cedo_power'

const PAGE_ROUTER = {
    AREA : 'area',
    MACHINE : 'machine' ,
    OPERATE : 'operate',
    POWER : 'power'
}

export const ROUTER_MAP = [
    {
        path: PAGE_ROUTER.AREA,
        Com: GrafanaArea,
    },
    {
        path: PAGE_ROUTER.MACHINE,
        Com: GrafanaMachine,
    },
    {
        path: PAGE_ROUTER.OPERATE,
        Com: GrafanaOperate,
    },
    {
        path: PAGE_ROUTER.POWER,
        Com: GrafanaPower,
    }
]