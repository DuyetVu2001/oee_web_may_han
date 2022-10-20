import { apiClient } from "helper/request/api_client";
import { t } from "i18next";
import { handleErr } from "../helper/handle_err_request";
import * as services from "../services";
// INIT STATE
export const initialStateConfig = {
    formAdd: [
        {
            label: "Tên đăng nhập",
            name: "username",
            rules: [{ required: true }],
        },
        {
            label: "Password",
            name: "password",
            type: 'password',
            rules: [{ required: true }],
        },
        {
            label: "Name",
            name: "name",
            rules: [{ required: true }],
        },
        {
            label: "Email",
            name: "email",
            rules: [{ required: true }],
        },
        {
            label: "Phone",
            name: "phone",
            rules: [{ required: true }],
        },
        {
            label: "Enteprise",
            name: "enterprise_id",
            rules: [{ required: true }],
            type: 'select',
            data: []
        },
    ],
    formEdit: [
        {
            label: "Tên đăng nhập",
            name: "username",
        },
        {
            label: "Password",
            name: "password",
            type: 'password',
        },
        {
            label: "Name",
            name: "name",
        },
        {
            label: "Email",
            name: "email",
        },
        {
            label: "Phone",
            name: "phone",
        },
        {
            label: "Enteprise",
            name: "enterprise_id",
            type: 'select',
            data: []
        },
    ],
    formFilter: [
        {
            label: "User name",
            name: "username",
        },
        {
            label: "Name",
            name: "name",
        },
        {
            label: "Email",
            name: "email",
        }
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
            dataIndex: "username",
            key: "username",
            title: "Username",
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
            dataIndex: "superadmin_id",
            key: "superadmin_id",
            title: "Người tạo",
        },
        // {
        //     active: 1,
        //     dataIndex: "template",
        //     key: "template",
        //     title: "template",
        // },
        {
            active: 1,
            dataIndex: "url",
            key: "urle",
            title: "Url",
        },
        {
            active: 1,
            dataIndex: "active",
            key: "active",
            title: "Active",
            render: val => val + ''
        },
    ],
    formDelete: [
        {
            label: "Admin password",
            name: "admin_password",
            type: 'password',
        }
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
        const { data } = await apiClient.get('enterprise/all')

        const formAddCustom = initialStateConfig.formAdd.map(i => {
            if (i.name == 'enterprise_id') {
                i.data = data.data;
            }
            return i;
        })
        const formEditCustom = initialStateConfig.formEdit.map(i => {
            if (i.name == 'enterprise_id') {
                i.data = data.data;
            }
            return i;
        })
        console.log('formAddCustomformAddCustom', formAddCustom)
        dispatch(set_jsonForm({
            formAdd: formAddCustom,
            formEdit: formEditCustom,
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
                // formFilter: action.data.formFilter,
                // formDelete: action.data.formDelete,
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
