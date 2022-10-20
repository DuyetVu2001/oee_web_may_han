import _ from 'lodash';
import { handleErr } from "../helper/handle_err_request";
import * as services from "../services";
import axios from 'axios';
import { apiClient } from 'helper/request/api_client';
import moment from 'moment';
// INIT STATE
export const initialStateConfig = {
    formAdd: [
    ],
    formEdit: [

    ],
    formFilter: [],
    listColumn: [],
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
        const { data } = await apiClient.get('/notification/filter')
        console.log("dataaaadfdfaa" , data[0].data);
        if (data[0].data) {
            const dataFilter = data[0].data
            const formAdd = [
                {
                    name: 'email',
                    label: 'Email',
                    type: 'TextArea',
                    rules: [
                        {
                            required: true,
                        },
                    ],
                },
                {
                    name: 'machine_id',
                    type: 'select',
                    label: 'Device',
                    placeholder: 'Choose',
                    data: dataFilter,
                    rules: [
                        {
                            required: true,
                            message: 'Please input your device!'
                        },
                    ],
                    isMul: true
                },
                {
                    name: 'condition',
                    label: 'Time sent mail daily',
                    // disabled: true,
                    // default: moment().set("hour", 8).set("minute", 0),
                    type: 'select',
                    data: _24h,
                },
            ]
            dispatch(set_jsonForm({
                formAdd: formAdd,
                formEdit: [...formAdd,
                {
                    name: 'active',
                    label: 'Active',
                    type: 'select',
                    data: [{
                        name: 'Active',
                        id: true
                    }, {
                        name: 'Inactive',
                        id: false
                    }]
                }]
            }))
        }
        // dispatch(set_jsonForm({
        //     formAdd: _.get(formAdd, 'data.data', []),
        //     formEdit: _.get(formEdit, 'data.data', []),
        //     formFilter: _.get(formFilter, 'data.data', []),
        // }));

    } catch (err) {
        handleErr(err);
    }

}

const _24h = new Array(24).fill(0).map((_, index) => ({
    id: index + 1,
    name: index + 1 + ':00'
}))

export const requestDataColumn = async (dispatch) => {
    try {
        const { data } = await services.getListColumn();
        console.log('datasdfsf', data)
        dispatch(set_columnData(data.data))
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
                listColumn: action.data,
            };
        default:
            return state;
    }
};
