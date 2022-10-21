import React, { useEffect, useState } from 'react';

// local com
import { CardCustom, TableCustom } from './helper/styled_component';

import ModalFormDetail from './com/detail_modal';
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
	requestEdit,
	requestTable,
} from './state/table';
import { Button, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const TableFunction = () => {
	// state
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

	const { t } = useTranslation();

	const lang = 'welding_title';

	// effect
	useEffect(() => {
		_requestDataTable();
		requestDataColumn(dispatchConfig);
		requestFormData(dispatchConfig);
	}, []);

	// handle CRUD
	const _requestDataTable = () => requestTable(dispatchTable, filter, pageInfo);

	const _handleUpdate = (body) =>
		requestEdit(
			body,
			() => _requestDataTable(),
			() => setShowDetail(false)
		);

	return (
		<div style={{}}>
			<CardCustom
				title={t(`${lang}.machines`)}
				extra={
					<Tooltip title="Reload" placement="bottom">
						<Button
							onClick={_requestDataTable}
							loading={loading}
							shape="round"
							icon={<ReloadOutlined />}
						/>
					</Tooltip>
				}
			>
				<TableCustom
					dataSource={dataTable}
					columns={configState?.listColumn}
					// columns={columnInitTable}
					loading={loading}
					scroll={{ y: 'calc(100vh - 200px)' }}
					pagination={false}
					onRow={(r) => ({
						onClick: () => setShowDetail({ data: r, type: 'EDIT' }),
					})}
				/>
			</CardCustom>

			{/* modal */}
			{/* <AddNewForm
				visible={showAddNew}
				jsonFormInput={configState.formAdd}
				_onClose={() => setShowAddNew(false)}
				_onSubmit={_handleAddNew}
			/> */}
			<ModalFormDetail
				visible={showDetail}
				jsonFormInput={configState.formEdit}
				_onClose={() => setShowDetail(false)}
				_onSubmit={_handleUpdate}
			/>
		</div>
	);
};

export default TableFunction;
