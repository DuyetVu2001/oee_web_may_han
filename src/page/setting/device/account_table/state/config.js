import _ from 'lodash';
import { Badge, Typography } from 'antd';
import { handleErr } from "../helper/handle_err_request";
import * as services from "../services";
// INIT STATE
export const initialStateConfig = {
    formAdd: [

    ],
    formEdit: [

    ],
    formFilter: [],
    listColumn: [],
    _listColumn: [

        {
            active: true,
            dataIndex: "machine_name",
            key: "machine_name",
            title: "Machine",
        },
        {
            active: true,
            dataIndex: "status",
            key: "status",
            title: "status",
            render: val => val ? 'active' : 'inactive'
        },
        {
            active: true,
            dataIndex: "BuildDateTime",
            key: "BuildDateTime",
            title: "BuildDateTime",
        },
        {
            active: true,
            dataIndex: "IPAddress",
            key: "IPAddress",
            title: "IPAddress",
        },
        {
            active: true,
            dataIndex: "Version",
            key: "Version",
            title: "Version",
        },
        {
            active: true,
            dataIndex: "WifiPower",
            key: "WifiPower",
            title: "WifiPower",
        },
        // {
        //     active: true,
        //     dataIndex: "area_id",
        //     key: "area_id",
        //     title: "area_id",
        // },
        {
            active: true,
            dataIndex: "area_name",
            key: "area_name",
            title: "Area",
        },
        {
            active: true,
            dataIndex: "connected_at",
            key: "connected_at",
            title: "connected_at",
        },
        // {
        //     active: true,
        //     dataIndex: "device_id",
        //     key: "device_id",
        //     title: "device_id",
        // },
        {
            active: true,
            dataIndex: "disconnected_at",
            key: "disconnected_at",
            title: "disconnected_at",
        },
        // {
        //     active: true,
        //     dataIndex: "enterprise_id",
        //     key: "enterprise_id",
        //     title: "enterprise_id",
        // },
        // {
        //     active: true,
        //     dataIndex: "id",
        //     key: "id",
        //     title: "id",
        // },
        // {
        //     active: true,
        //     dataIndex: "line_id",
        //     key: "line_id",
        //     title: "line_id",
        // },
        {
            active: true,
            dataIndex: "line_name",
            key: "line_name",
            title: "Line",
        },
        // {
        //     active: true,
        //     dataIndex: "machine_id",
        //     key: "machine_id",
        //     title: "machine_id",
        // },
        //         BuildDateTime: "2022-05-10T09:38:22"
        // IPAddress: "192.168.1.166"
        // Version: "10.1.0(oeeim)"
        // WifiPower: "17.0"
        // area_id: "2"
        // area_name: "E2_AREA_01"
        // connected_at: "1659270236"
        // device_id: "DVES_D63044"
        // disconnected_at: "1659160139"
        // enterprise_id: "1"
        // id: 1
        // line_id: "2"
        // line_name: "E2_LINE_01"
        // machine_id: "1"
        // machine_name: "E1_M1"
        // status: "1"

    ],
    loading: false,
};
// TYPE
const type = {
    'set_jsonForm': 'set_jsonForm',
    'set_columnData': 'set_columnData',
}
// ACTION
const set_jsonForm = (data) => ({ type: type.set_jsonForm, data })
const set_columnData = (data) => ({ type: type.set_columnData, data })
// action request
export const requestFormData = async (dispatch) => {
    try {
        const [
            formAdd,
            formEdit,
            formFilter
        ] = await Promise.all([
            services.getPostForm().catch(e => ({})),
            services.getPatchForm().catch(e => ({})),
            services.getFilterForm().catch(e => ({})),
        ]);

        dispatch(set_jsonForm({
            formAdd: _.get(formAdd, 'data.data', []),
            formEdit: _.get(formEdit, 'data.data', []),
            formFilter: _.get(formFilter, 'data.data', []),
        }));

    } catch (err) {
        handleErr(err);
    }

}

export const requestDataColumn = async (dispatch) => {
    try {
        const { data } = await services.getListColumn();
        dispatch(set_columnData(data))
    } catch (err) {

    }
}
export const requestUpdateColumn = async (dispatch, dataUpdate) => {
    try {
        await services.updateListColumn(dataUpdate);
        requestDataColumn(dispatch)
    } catch (err) {

    }
}
// REDUCER
export const reducerConfig = (state, action) => {
    switch (action.type) {
        case 'set_jsonForm':
            return {
                ...state, loading: false,
                formAdd: action.data.formAdd,
                formEdit: action.data.formEdit,
                formFilter: action.data.formFilter,
            };
        case 'set_columnData':
            return {
                ...state, loading: false,
                listColumn: [
                    ...action.data,
                    {
                        active: true,
                        dataIndex: "status",
                        title: "Status",
                        render: val => val == '1' ? <Badge status="success" size="large" text={<Typography.Text type='success'> Online</Typography.Text>} /> : <Badge size="large" status="error" text={<Typography.Text type='danger'> Offline</Typography.Text>} />
                    },
                    {
                        active: true,
                        dataIndex: "IPAddress",
                        title: "IPAddress",
                        render: val => val ? <a href={`http://${val}`} target='_blank'>{val}</a> : '_'
                    },

                ],
            };
        default:
            return state;
    }
};

