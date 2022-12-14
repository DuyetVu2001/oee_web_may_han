import React, { useEffect, useState } from 'react';

// local com
import { CardCustom, TableCustom } from './helper/styled_component';

import ModalFormDetail from './com/detail_modal';
import AddNewForm from './com/add_new_modal'
//
import { useTranslation } from 'react-i18next';
import {
	initialStateConfig,
	reducerConfig,
	requestDataColumn,
	requestFormData,
} from './state/config';
import {
	initialStateTable,
	reducerTable,
	requestAddNew,
	requestEdit,
	requestTable,
} from './state/table';
import { Button, Pagination, Tooltip } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { columnInitTable } from './const';

const TableFunction = () => {
	// state
	const [showAddNew, setShowAddNew] = useState(false);
	const [configState, dispatchConfig] = React.useReducer(
		reducerConfig,
		initialStateConfig
	);
	const [tableState, dispatchTable] = React.useReducer(
		reducerTable,
		initialStateTable
	);
	const { loading, dataTable, pageInfo, filter } = tableState;

	const [showDetail, setShowDetail] = useState(false);
	
	//handle reset 
	const _handleReset = () => _requestDataTable()
	const _handleAddNew = (body) => requestAddNew(body, () => _requestDataTable() , () => setShowAddNew(false))
	
	const { t } = useTranslation();

	const lang = 'welding_title';

	// effect
	useEffect(() => {
		_requestDataTable();
		// requestDataColumn(dispatchConfig);
		// requestFormData(dispatchConfig);
	}, []);

	// handle CRUD
	const _requestDataTable = () => requestTable(dispatchTable, filter, pageInfo);

	const _handleUpdate = (body) =>
		requestEdit(
			{body:{...body,deviceId: body.id}, },
			() => _requestDataTable(),
			() => setShowDetail(false)
		);
			// change Pagination
	const _handleChangePage = (page, number_of_page) => {
		requestTable(dispatchTable, filter, { page, number_of_page })
	};
	
	return (
		<div style={{}}>
			<CardCustom
				// title={t(`${lang}.machines`)}
				extra={<Extra
                    // loading={loading} showDel={selectedRow && selectedRow[0]}
                    listColumn={configState.listColumn}

                    _onReload={_handleReset}
                    // _handleDel={selectedRow.length>0 ? _handleDel : () => {}}
                    // _onFilter={() => setShowFilter(filter)}
                    _onClickAdd={() => setShowAddNew(true)}
                // _onClickColumnShow={() => setShowColumn(true)}
                />}
				// extra={
				// 	<Tooltip title="Reload" placement="bottom">
				// 		<Button
				// 			onClick={_requestDataTable}
				// 			loading={loading}
				// 			shape="round"
				// 			icon={<ReloadOutlined />}
				// 		/>
				// 	</Tooltip>
				// }
			>
				<TableCustom
					dataSource={dataTable}
					// columns={configState?.listColumn}
					columns={columnInitTable}
					loading={loading}
					scroll={{ y: 'calc(100vh - 200px)' }}
					pagination={false}
					onRow={(r) => ({
						onClick: () => setShowDetail({ data: r, type: 'EDIT' }),
					})}
				/>
				<Pagination
                    showSizeChanger
                    pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
                    style={{ marginTop: 10, float: 'right' }}
                    current={pageInfo.page}
                    pageSize={Number(pageInfo.number_of_page || 15)}
                    total={pageInfo.total}
                    showQuickJumper
                    onChange={_handleChangePage}
                />
			</CardCustom>

			{/* modal */}
			<AddNewForm
				visible={showAddNew}
				jsonFormInput={configState.formAdd}
				_onClose={() => setShowAddNew(false)}
				_onSubmit={_handleAddNew}
			/>
			<ModalFormDetail
				visible={showDetail}
				jsonFormInput={configState.formEdit}
				_onClose={() => setShowDetail(false)}
				_onSubmit={_handleUpdate}
			/>
		</div>
	);
};
const Extra = ({
    loading = false,
    showDel = false,

    _handleDel = () => { },
    _onClickAdd = () => { },
    _onFilter = () => { },
    _onReload = () => { },
    // _onClickColumnShow = () => { },
}) => {

    const { t } = useTranslation();

    const lang = "email"

    return (
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 7, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex' }}>
                    {/* <Button loading={loading} onClick={() => _onReload()} className="ro-custom" type="text" icon={<ReloadOutlined />} >{t(`${lang}.reset`)}</Button> */}
                    {/* <Button loading={loading} onClick={_onClickAdd} className="ro-custom" type="text" icon={<PlusOutlined />} >{t(`${lang}.add`)}</Button> */}
                  
                </div>
            </div>
        </div>
    )
}

export default TableFunction;
