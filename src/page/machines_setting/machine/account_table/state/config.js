import { handleErr } from '../helper/handle_err_request';
import * as services from '../services';
// INIT STATE

const WIRE_TYPE = [
	{
		id:'0.8mm',
		name:'0.8 mm'
	},
	{
		id:'1.0mm',
		name:'1.0 mm'
	},
	{
		id:'1.2mm',
		name:'1.2 mm'
	},
	{
		id:'1.4mm',
		name:'1.4 mm'
	},
	{
		id:'1.6mm',
		name:'1.6 mm'
	}
]

export const initialStateConfig = {
	formAdd: [
	],
	formEdit: [
		// {
		// 	name: "id",
		// 	label: "DevicedId",
		// 	// rules: [{ required: true }],
		// 	disabled:true

		// },
		{
			name: "name",
			label: "Tên mới",
			// rules: [{ required: true }],
			// disabled:true
		},
		{
			name: "wire_diameter",
			label: "Cỡ dây",
			rules: [{ required: true }],
			type: 'select',
			data:[
				{
					id:'0.8mm',
					name:'0.8 mm'
				},
				{
					id:'1.0mm',
					name:'1.0 mm'
				},
				{
					id:'1.2mm',
					name:'1.2 mm'
				},
				{
					id:'1.4mm',
					name:'1.4 mm'
				},
				{
					id:'1.6mm',
					name:'1.6 mm'
				}
			],
		},
		{
			name: "allowReading",
			label: "Trạng thái",
			rules: [{ required: true }],
			type: 'select',
			data:[
				{
					id:'1',
					name:"On"
				},
				{
					id:'0',
					name:"Off"
				}
			],
		},
	],
	formFilter: [],
	listColumn: [
		{
			title: "Mã máy",
			key: "id",
			dataIndex: 'id',
		},
		{
			title: "Tên máy",
			key: "name",
			dataIndex: 'name',
		},
		{
			title: "Loại dây",
			key: "wire_diameter",
			dataIndex: 'wire_diameter',
		},
		{
			title: "Status",
			key: "allowReading",
			dataIndex: 'allowReading',
			render: (text, record) => (text === '0' ? "Off" : "On")
		},
	],
	loading: false,
};
// TYPE
const type = {
	set_jsonForm: 'set_jsonForm',
	set_columnData: 'set_columnData',
};
// ACTION
const set_jsonForm = (data) => ({ type: type.set_jsonForm, data });
const set_columnData = (data) => ({ type: type.set_columnData, data });
// action request
export const requestFormData = async (dispatch) => {
	try {
		const [
			formAdd,
			formEdit,
			// formFilter
		] = await Promise.all([
			// services.getPostForm(),
			services.getPatchForm(),
			// services.getFilterForm(),
		]);

		dispatch(
			set_jsonForm({
				formAdd: formAdd.data.data,
				formEdit: formEdit.data.data || [],
				// formFilter: formFilter.data.data,
			})
		);
	} catch (err) {
		handleErr(err);
	}
};

export const requestDataColumn = async (dispatch) => {
    // "title": "T\u00ean",
    // "key": "name",
    // "dataIndex": "name",
    // "active": true

    // "title": "Mã máy",
    // "key": "id",
    // "filter": true

	try {
        const { data } = await services.getListColumn();

        const mappingKey = data?.data?.map(item => ({
            ...item,
            key: item.key,
            dataIndex: item.key,
        }))

		dispatch(set_columnData(mappingKey || []));
	} catch (err) {}
};

export const requestUpdateColumn = async (dispatch, dataUpdate) => {
	try {
		await services.updateListColumn(dataUpdate);
		requestDataColumn(dispatch);
	} catch (err) {}
};
// REDUCER
export const reducerConfig = (state, action) => {
	switch (action.type) {
		case 'set_jsonForm':
			return {
				...state,
				loading: false,
				formAdd: action.data.formAdd,
				formEdit: action.data.formEdit,
				formFilter: action.data.formFilter,
			};
		case 'set_columnData':
			return {
				...state,
				loading: false,
				listColumn: action.data,
			};
		default:
			return state;
	}
};
