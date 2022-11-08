import { handleErr } from '../helper/handle_err_request';
import * as services from '../services';
// INIT STATE
export const initialStateConfig = {
	formAdd: [],
	formEdit: [
		{
			label:"Mã máy",
			name:"id"
		},
		{
			label:"Loại dây",
			name:"wire_diameter"
		},
		{
			label:"Status",
			name:"status",
			type:"select",
			data:[
				{
					id:1, name:"1",label:"On"
				},
				{
					id:2, name:"2", label:"Off"
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
			// formAdd,
			formEdit,
			// formFilter
		] = await Promise.all([
			// services.getPostForm(),
			services.getPatchForm(),
			// services.getFilterForm(),
		]);

		dispatch(
			set_jsonForm({
				// formAdd: formAdd.data.data,
				formEdit: formEdit.data?.data || [],
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
