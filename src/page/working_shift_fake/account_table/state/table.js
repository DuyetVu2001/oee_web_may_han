import axios from "axios";
import { apiClient } from "helper/request/api_client";
import { openNotificationWithIcon } from "helper/request/notification_antd";
import { handleErr } from "../helper/handle_err_request";
import * as services from "../services";
// INIT STATE
export const initialStateTable = {
    loading: false,
    dataTable: [],
    filter: {},
    pageInfo: {
        skip: 1,
        limit: 15,
    },
};

const KEY_STORAGE = "FAKE_WORKING_SHIFT"

// TYPE
const type = {
    'add_new': 'add_new',
    'update': 'update',
    'destroy': 'destroy',

    'request_load': 'request_load',
    'load_fail': 'load_fail',
    'set_table': 'set_table',
    'set_pageInfo': 'set_pageInfo',
    'set_filter': 'set_filter',
}
// REDUCER
export const reducerTable = (state, action) => {
    switch (action.type) {
        case 'add_new':
            const newData = {
                ...action.data,
                id: Math.max(0, ...state.dataTable.map(item => item.id)) + 1
            }
            
            const createData = [newData, ...state.dataTable]

            localStorage.setItem(KEY_STORAGE, JSON.stringify(createData));

            console.log(createData);
            
            return {
                ...state,
                dataTable: createData
            };
        case 'update':
            const dataUpdate = action.data
            const updateDataTable = state.dataTable?.map(item => dataUpdate.id == item.id ? dataUpdate : item)

            localStorage.setItem(KEY_STORAGE, JSON.stringify(updateDataTable));
            
            return {
                ...state,
                dataTable: updateDataTable
            };
        case 'destroy':
            const deleteData = state.dataTable?.filter(item => !action.data.id?.includes(item.id))
            localStorage.setItem(KEY_STORAGE, JSON.stringify(deleteData));
            
            return {
                ...state,
                dataTable: deleteData
            };

        case 'request_load':
            return {
                ...state, loading: true
            };

        case 'load_fail':
            return {
                ...state, loading: false
            };
        case 'set_table':
            return {
                ...state, loading: false,
                dataTable: action.data
            };
        case 'set_pageInfo':
            return {
                ...state,
                pageInfo: action.data
            };
        case 'set_filter':
            return {
                ...state,
                filter: action.data
            };
        default:
            return state;
    }
};

// ACTION
export const add_new = (data) => ({ type: type.add_new, data })
export const update = (data) => ({ type: type.update, data })
export const destroy = (data) => ({ type: type.destroy, data })

export const request_load = (data) => ({ type: type.request_load, data })
export const load_fail = (data) => ({ type: type.load_fail, data })
export const set_table = (data) => ({ type: type.set_table, data })
export const set_pageInfo = (data) => ({ type: type.set_pageInfo, data })
export const set_filter = (data) => ({ type: type.set_filter, data })

export const requestAddNew = async (body, dispatch, _onClose = () => { }) => {
    try {
        dispatch(add_new(body));
        _onClose()
        openNotificationWithIcon("success", "Thêm mới thành công")
    } catch (err) {
        handleErr(err)
    }
}
export const requestEdit = async (body, dispatch, _onClose = () => { }) => {
    try {
        dispatch(update(body));
        _onClose()
        openNotificationWithIcon("success", "Chỉnh sửa thành công")
    } catch (err) {
        handleErr(err)
    }
}
export const requestDel = async (body, dispatch) => {
    try {
        const confirm = window.confirm("Xác nhận xoá?")
        if (confirm) {
            // await services.deleteMany(body);
            openNotificationWithIcon("success", "Xoá thành công")
            
            dispatch(destroy(body))
        }
    } catch (err) {
        handleErr(err)
    }
}
export const requestTable = async (dispatch, filter, pageInfo) => {
    try {
        // dispatch(request_load());
        // dispatch(set_filter(filter));

        // const pageQuery = {
        //     skip: pageInfo.skip,
        //     limit: pageInfo.limit,
        // };
        // const query = {
        //     ...pageQuery,
        //     ...filter,
        // };
        // const { data } = await services.get(query);

        // let dataTableConvert = [];
        // if (data.data) {
        //     dispatch(set_pageInfo({ ...pageInfo, ...data.page_info }));
        //     dataTableConvert = data.data.map(i => {
        //         i.key = i.id
        //         return i
        //     })
        // }
        const data = JSON.parse(localStorage.getItem(KEY_STORAGE)) || [];

        console.log(localStorage.getItem(KEY_STORAGE));

        dispatch(set_table(data));
    } catch (err) {
        dispatch(load_fail());
        handleErr(err);
    }


}


// const 