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

// TYPE
const type = {
    'request_load': 'request_load',
    'load_fail': 'load_fail',
    'set_table': 'set_table',
    'set_pageInfo': 'set_pageInfo',
    'set_filter': 'set_filter',
}
// REDUCER
export const reducerTable = (state, action) => {
    switch (action.type) {
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
export const request_load = (data) => ({ type: type.request_load, data })
export const load_fail = (data) => ({ type: type.load_fail, data })
export const set_table = (data) => ({ type: type.set_table, data })
export const set_pageInfo = (data) => ({ type: type.set_pageInfo, data })
export const set_filter = (data) => ({ type: type.set_filter, data })

export const requestAddNew = async (body, cb , _onClose = () => {}) => {
    try {
        await services.post(body);
        cb()
        _onClose()
        openNotificationWithIcon("success", "Thêm mới thành công")
    } catch (err) {
        handleErr(err)
    }
}
export const requestEdit = async (body, cb ,_onClose = () => {}) => {
    try {
        await services.patch(body);
        cb()
        _onClose()
        openNotificationWithIcon("success", "Chỉnh sửa thành công")
    } catch (err) {
        handleErr(err)
    }
}
export const requestDel = async (body, cb) => {
    try {
        const confirm = window.confirm("Xác nhận xoá?")
        if(confirm){          
            await services.deleteMany(body);
            openNotificationWithIcon("success", "Xoá thành công")
            cb()
        }
    } catch (err) {
        handleErr(err)
    }
}
export const requestTable = async (dispatch, filter, pageInfo) => {
    try {
        dispatch(request_load());
        dispatch(set_filter(filter));

        const pageQuery = {
            skip: pageInfo.skip,
            limit: pageInfo.limit,
        };
        const query = {
            ...pageQuery,
            ...filter,
        };
        const { data } = await services.get(query);
        console.log("đaadadada" , data);
        let dataTableConvert = [];
        if (data.data) {
            dispatch(set_pageInfo({ ...pageInfo, ...data.page_info }));
            dataTableConvert = data.data.map((i,index) => {
                i.key = index+1
                return i
            })
        }
        dispatch(set_table(dataTableConvert));
    } catch (err) {
        dispatch(load_fail());
        handleErr(err);
    }


}


// const 