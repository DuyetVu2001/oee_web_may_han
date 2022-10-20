import { openNotificationWithIcon } from '../helper/notification_antd';
import { handleErr } from "../helper/handle_err_request";
import * as services from "../services";
// INIT STATE
export const initialStateTable = {
    loading: false,
    dataTable: [],
    filter: {},
    pageInfo: {
        current: 1,
        number_of_page: 15,
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
            console.log('deee set loading')
            return {
                ...state,
                loading: true
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

export const requestAddNew = async (body, cb, _onClose = () => { }) => {
    try {
        const { data } = await services.post(body);
        openNotificationWithIcon('success', data?.msg)
        cb()
        _onClose()
        return true;
    } catch (err) {
        handleErr(err, 'show')
        return false;
    }
}

export const requestEdit = async (body, cb, _onClose = () => { }) => {
    try {
        const { data } = await services.patch(body);
        openNotificationWithIcon('success', data?.msg)
        cb()
        _onClose()
        return true;
    } catch (err) {
        handleErr(err, 'show')
        return false;
    }
}
export const requestDel = async (body, cb) => {
    try {
        const { data } = await services.deleteMany(body);
        openNotificationWithIcon('success', data?.msg)
        cb()
        return true;
    } catch (err) {
        handleErr(err, 'show')
        return false;
    }
}
export const requestTable = async (dispatch, filter, pageInfo) => {
    try {
        dispatch(request_load());
        dispatch(set_filter(filter));

        const pageQuery = {
            current: pageInfo.current,
            number_of_page: pageInfo.number_of_page,
        };
        const query = {
            ...pageQuery,
            ...filter,
        };
        const { data } = await services.get(query);
        //console.log("hung nè",data);
        let dataTableConvert = [];
        if (data.data) {
            dispatch(set_pageInfo({ ...pageInfo, ...data.page_info }));
            dataTableConvert = data.data.map(i => {
                i.key = i.id
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
