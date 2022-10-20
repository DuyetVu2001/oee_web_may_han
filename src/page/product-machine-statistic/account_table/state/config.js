import moment from 'moment';

import { handleErr } from "../helper/handle_err_request";
import * as services from "../services";
import { convertColumn } from 'helper/convert_data/data_column';
// INIT STATE
export const initialStateConfig = {
    formAdd: [
    ],
    formEdit: [],
    formFilter: [

    ],
    listColumn: [

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
        // const [
        //     formAdd,
        //     formEdit,
        //     formFilter
        // ] = await Promise.all([
        //     // services.getPostForm(),
        //     // services.getPatchForm(),
        //     services.getFilterForm(),
        // ]);

        // dispatch(set_jsonForm({
        //     formAdd: formAdd.data.data,
        //     formEdit: formEdit.data.data,
        //     formFilter: [
        //        ...formFilter.data.data,
        //         {
        //             name : "start_and_end",
        //             label : 'Thời gian bắt đầu và kết thúc',
        //             type : "range_picker_time"
        //         },
        //     ],
        // }));
        const formFilter = await services.getFilterForm()
        console.log("formFilter", formFilter.data.data);
        dispatch(set_jsonForm({
            formFilter: [
                ...formFilter.data.data,
                {
                    name: "start_and_end",
                    label: 'Thời gian bắt đầu và kết thúc',
                    type: "range_picker_time"
                },
            ]
        }))

    } catch (err) {
        handleErr(err);
    }
}

export const requestDataColumn = async (dispatch) => {
    try {
        const { data } = await services.getListColumn();
        console.log("khanh", data.data);
        const dataConvert = convertColumn(data.data);
        dispatch(set_columnData(dataConvert))
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
