import moment from "moment";
import { handleErr } from "../helper/handle_err_request";
import * as services from "../services";
// INIT STATE
export const initialStateConfig = {
    formAdd: [
        {
            name: "id",
            label: "id",
            rules: [{ required: true }],
        },
        {
            name: "name",
            label: "Name",
            rules: [{ required: true }],
        },
        {
            name: 'type',
            label: "Type",
            rules: [{ required: true }]
        }
    ],
    formEdit: [
        {
            name: "id",
            label: "id",
            rules: [{ required: true }],
        },
        {
            name: "name",
            label: "Name",
            rules: [{ required: true }],
        },
        {
            name: 'type',
            label: "Type",
            rules: [{ required: true }]
        }
    ],
    formFilter: [],
//     id: 1
// machine_id: "M1"
// product_id: 1
// product_name: "Front A125F"
// status: "Processing"
// time_end: null
// time_start: 1655309869
    listColumn: [
        {
            title: "Id",
            key: "id",
            dataIndex: 'id',
        },
        {
            title: "Machine",
            key: "machine_id",
            dataIndex: 'machine_id',
        },
        {
            title: 'Product id',
            key: 'product_id',
            dataIndex: 'product_id'
        },
        {
            title: 'Product Name',
            key: 'product_name',
            dataIndex: 'product_name'
        },
        {
            title: 'status',
            key: 'status',
            dataIndex: 'status'
        },
        {
            title: 'Time start',
            key: 'time_start',
            dataIndex: 'time_start',
            render(i) {
                return moment(i*1000).format("HH:mm:ss DD/MM/YYYY")
            }
        },
        {
            title: 'Time end',
            key: 'time_end',
            dataIndex: 'time_end',
            render(i) {
                return i ? moment(i*1000).format("HH:mm:ss DD/MM/YYYY") : '_'
            }
        },

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
            services.getPostForm(),
            services.getPatchForm(),
            services.getFilterForm(),
        ]);

        dispatch(set_jsonForm({
            formAdd: formAdd.data.data,
            formEdit: formEdit.data.data,
            formFilter: formFilter.data.data,
        }));

    } catch (err) {
        handleErr(err);
    }

}

export const requestDataColumn = async (dispatch) => {
    try {
        const { data } = await services.getListColumn();
        console.log('data', data)
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
                listColumn: action.data,
            };
        default:
            return state;
    }
};
