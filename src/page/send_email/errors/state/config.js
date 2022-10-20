import _ from 'lodash';
import { handleErr } from "../helper/handle_err_request";
import * as services from "../services";
import axios from 'axios';
import { apiClient } from 'helper/request/api_client';
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
        console.log("dataaaaaa" , data);
        if (data[0].data) {
            const dataFilter = data[0].data;
            const formAdd = [
                {
                    name: 'error_type',
                    label: 'Type',
                    placeholder: 'Choose',
                    data: [
                        {
                            id: 'Machine stopped',
                            name: "Machine stopped"
                        },
                        {
                            id: 'Lost signal',
                            name: "Lost signal"
                        },
                        {
                            id: 'OEE Index low',
                            name: "OEE Index low"
                        }
                    ],
                    rules: [
                        {
                            required: true,
                            message: 'Please input your error type!',
                        },
                    ],
                    type: "select"
                },
                {
                    name: 'condition',
                    label: 'Condition',
                    placeholder: "Choose",
                    type: 'select',
                    data: [
                        {
                            id: 5,
                            name: "5"
                        },
                        {
                            id: 10,
                            name: "10"
                        },
                        {
                            id: 15,
                            name: "15"
                        },
                        {
                            id: 20,
                            name: "20"
                        },
                        {
                            id: 25,
                            name: "25"
                        },
                        {
                            id: 30,
                            name: "30"
                        },
                        {
                            id: 35,
                            name: "35"
                        },
                        {
                            id: 40,
                            name: "40"
                        },
                        {
                            id: 45,
                            name: "45"
                        },
                        {
                            id: 50,
                            name: "50"
                        },
                        {
                            id: 55,
                            name: "55"
                        },
                        {
                            id: 60,
                            name: "60"
                        }
                    ]
                },
                {
                    name: 'machine_id',
                    type: 'select',
                    label: 'Machine',
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
                    name: 'email',
                    label: 'Email',
                    type: 'TextArea',
                    rules: [
                        {
                            required: true,
                        },
                    ],
                },
                // {
                //     name : 'active',
                //     label : 'Active',
                //     type : 'checkbox'
                // }
            ]
            dispatch(set_jsonForm({
                formAdd: formAdd,
                formEdit: [...formAdd, {
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

export const requestDataColumn = async (dispatch) => {
    try {
        const { data } = await services.getListColumn();
        console.log('data', data)
        dispatch(set_columnData(data.data))
    } catch (err) {
        console.log('requestDataColumn', err)
    }
}
export const requestUpdateColumn = async (dispatch, dataUpdate) => {
    try {
        await services.updateListColumn(dataUpdate);
        requestDataColumn(dispatch)
    } catch (err) {
        console.log('requestUpdateColumn', err)

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
