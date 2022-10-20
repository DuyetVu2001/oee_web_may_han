import { get } from "lodash";
import { handleErr } from "../helper/handle_err_request";
import * as services from "../services";
// INIT STATE

// {"address":"Xóm 3, Thôn Đồng Chầm, Xã Tiên Dược, Huyện Sóc Sơn, Thành phố Hà Nội, Việt Nam","company_name":"AIFVINA CO., LTD","email":"infor.aifvina.com","head_title":"AIFVINA","phone":"Phone: (+84)818598088","software_name":"Giám sát hiệu suất tổng thể","web":"https://quanlynhamaythongminh.com"}
const appInfoForm = [
    {
        name: "address_contact",
        label: "Address contact",
    },
    {
        name: "company_name",
        label: "company_name",
    },
    {
        name: "email_contact",
        label: "Email Contact",
    },
    {
        name: "head_title",
        label: "head_title",
    },
    {
        name: "phone_contact",
        label: "Phone contact",
    },
    {
        name: "software_name",
        label: "software_name",
    },
    {
        name: "web",
        label: "web",
    },
]






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
    formFilter: [

    ],
    listColumn: [
        {
            active: 1,
            dataIndex: "id",
            key: "id",
            title: "Id",
        },
        {
            active: 1,
            dataIndex: "name",
            key: "name",
            title: "Name",
        },
        {
            active: 1,
            dataIndex: "email",
            key: "email",
            title: "Email",
        },
        // {
        //     active: 1,
        //     dataIndex: "icon_logo",
        //     key: "icon_logo",
        //     title: "icon_logo",
        //     render: val => <img style={{height: 50, width: 50}} url={val} />
        // },
        // {
        //     active: 1,
        //     dataIndex: "language",
        //     key: "language",
        //     title: "language",
        // },
        {
            active: 1,
            dataIndex: "logo",
            key: "logo",
            title: "Logo",
            render: val => <img style={{ height: 50, width: 50 }} src={val} />
        },
        {
            active: 1,
            dataIndex: "phone",
            key: "phone",
            title: "Phone",
        },
        {
            active: 1,
            dataIndex: "address",
            key: "address",
            title: "Address",
        },

        // {
        //     active: 1,
        //     dataIndex: "template",
        //     key: "template",
        //     title: "template",
        // },

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
        // console.log("check",formFilter);
        const formAddConvert = get(formAdd, 'data.data', []).filter(i => i.name !== 'app_info')
        const formEditConvert = get(formEdit, 'data.data', []).filter(i => i.name !== 'app_info')

        dispatch(set_jsonForm({
            formAdd: [...formAddConvert, ...appInfoForm],
            formEdit: [...formEditConvert, ...appInfoForm],
            formFilter: formFilter.data.data,
        }));

    } catch (err) {
        handleErr(err);
    }

}

export const requestDataColumn = async (dispatch) => {
    try {
        // const { data } = await services.getListColumn();
        // console.log('data', data)
        // dispatch(set_columnData(data))
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
