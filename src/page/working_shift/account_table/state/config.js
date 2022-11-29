import _ from 'lodash';
import { handleErr } from "../helper/handle_err_request";
import * as services from "../services";
// INIT STATE
export const initialStateConfig = {
    formAdd: [
        {
            name: 'name',
            label: "Ca làm việc",
            rules: [
                {
                    required: true,
                },
            ]
        },
        {
            type: 'select',
            name: 'time_zone',
            label: 'TimeZone',
            rules: [
                {
                    required: true,
                },
            ]
        },
        {
            type: 'start_time',
            name: 'start_time',
            label: 'Thời gian bắt đầu',
            rules: [
                {
                    required: true,
                },
            ]
        },
        {
            type: 'end_time',
            name: 'end_time',
            label: 'Thời gian kết thúc',
            rules: [
                {
                    required: true,
                },
            ]
        },
        {
            type: 'select',
            isMul: true,
            name: 'machines',
            label: 'Máy',
            data: [],
            // rules: [
            //     {
            //         required: true,
            //     },
            // ]
        },
        {
            type: 'datesTime',
            name: 'dates',
            label: 'Ngày hoạt động',
            data: [
                {
                    value: 'Monday',
                    label: 'Monday'
                },
                {
                    value: 'Tuesday',
                    label: 'Tuesday'
                },
                {
                    value: 'Wednesday',
                    label: 'Wednesday'
                },
                {
                    value: 'Thursday',
                    label: 'Thursday'
                },
                {
                    value: 'Friday',
                    label: 'Friday'
                },
                {
                    value: 'Saturday',
                    label: 'Saturday'
                },
                {
                    value: 'Sunday',
                    label: 'Sunday'
                }
            ], rules: [
                {
                    required: true,
                },
            ]
        }
    ],
    formEdit: [
        {
            name: 'name',
            label: "Ca làm việc",
            // disabled: true,
            rules: [
                {
                    required: true,
                },
            ]
        },
        {
            type: 'select',
            name: 'time_zone',
            label: 'TimeZone',
            rules: [
                {
                    required: true,
                },
            ]
        },
        {
            type: 'start_time',
            name: 'start_time',
            label: 'Thời gian bắt đầu',
            rules: [
                {
                    required: true,
                },
            ]
        },
        {
            type: 'end_time',
            name: 'end_time',
            label: 'Thời gian kết thúc',
            rules: [
                {
                    required: true,
                },
            ]
        },
        {
            type: 'select',
            name: 'machines',
            isMul: true,
            label: 'Máy',
            data: [],
            // rules: [
            //     {
            //         required: true,
            //     },
            // ]
        },
        {
            type: 'datesTime',
            name: 'dates',
            label: 'Ngày hoạt động',
            data: [
                {
                    value: 'Monday',
                    label: 'Monday'
                },
                {
                    value: 'Tuesday',
                    label: 'Tuesday'
                },
                {
                    value: 'Wednesday',
                    label: 'Wednesday'
                },
                {
                    value: 'Thursday',
                    label: 'Thursday'
                },
                {
                    value: 'Friday',
                    label: 'Friday'
                },
                {
                    value: 'Saturday',
                    label: 'Saturday'
                },
                {
                    value: 'Sunday',
                    label: 'Sunday'
                }
            ]
        }

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
export const requestFormData_ = async (dispatch) => {
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
export const requestFormData = async (dispatch) => {
    try {
        const formEdit = initialStateConfig.formEdit;
        const formAdd = initialStateConfig.formAdd;
        const { data } = await services.listMachine()
        // const listMachine = data.data.map(({ id }) => id);
        formEdit.map(item => {
            if (item.name === 'machines') {
                item.data = data.data
            }
        });
        formAdd.map(item => {
            if (item.name === 'machines') {
                item.data = data.data
                console.log('sdfasdfasf', data.data)
            }
        });

        dispatch(set_jsonForm({
            formEdit,
            formAdd,
        }));

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
                // formFilter: action.data.formFilter,
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
