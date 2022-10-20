import { DeleteOutlined, FilterOutlined, PlusOutlined, ReloadOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Button, Pagination } from "antd";
import React, { useEffect, useState } from "react";

import AddNewForm from './com/add_new_modal';
import ColumnForm from './com/column_modal';
import ModalFormDetail from './com/detail_modal';
import FilterForm from './com/filter_modal';
import DeleteModal from './com/delete_modal';

// 
import { TITLE_TABLE } from './const';
// local com
import { CardCustom, TableCustom } from "./helper/styled_component";
import { initialStateConfig, reducerConfig, requestDataColumn, requestFormData, requestUpdateColumn } from "./state/config";
import { initialStateTable, reducerTable, requestAddNew, requestDel, requestEdit, requestTable } from "./state/table";

const TableFunction = () => {
    // state
    const [configState, dispatchConfig] = React.useReducer(reducerConfig, initialStateConfig);
    const [tableState, dispatchTable] = React.useReducer(reducerTable, initialStateTable);
    const { loading, dataTable, pageInfo, filter } = tableState;
    console.log('tableStatetableState', tableState)

    const [selectedRow, setSelectRow] = useState([]);
    // modal
    const [showFilter, setShowFilter] = useState(false);
    const [showAddNew, setShowAddNew] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showColumn, setShowColumn] = useState(false);
    // effect
    useEffect(() => {
        _requestDataTable();
        // requestDataColumn(dispatchConfig)
        requestFormData(dispatchConfig)
    }, []);

    // change Pagination
    const _handleChangePage = (current, number_of_page) => {
        requestTable(dispatchTable, filter, { current, number_of_page })
    };
    // handle reset 
    const _handleReset = () => requestTable(dispatchTable, {}, pageInfo)

    // handle CRUD
    const _requestDataTable = () => requestTable(dispatchTable, filter, pageInfo)
    const _handleFilter = (body) => requestTable(dispatchTable, body, { ...pageInfo, current: 1 })

    const _handleDel = (body) => requestDel(body, () => _requestDataTable())
    const _handleAddNew = (body) => requestAddNew(body, () => _requestDataTable())
    const _handleUpdate = (body) => requestEdit(body, () => _requestDataTable())

    // change config
    const _onSaveColumn = (body) => requestUpdateColumn(dispatchConfig, body)

    return (
        <div style={{}}>
            <CardCustom
                title={TITLE_TABLE}
                extra={<Extra
                    loading={loading} showDel={selectedRow && selectedRow[0]}
                    listColumn={configState.listColumn}

                    _onReload={_handleReset}
                    _handleDel={() => setShowDelete({ data: selectedRow })}
                    _onFilter={() => setShowFilter(filter)}
                    _onClickAdd={() => setShowAddNew(true)}
                    _onClickColumnShow={() => setShowColumn(true)}
                />}
            >
                <TableCustom
                    dataSource={dataTable} 
                    columns={configState.listColumn.filter(i => i.active)} 
                    loading={loading}
                    scroll={{ y: 'calc(100vh - 190px)' }} pagination={false}

                    rowSelection={{ type: 'checkbox', onChange: setSelectRow, selectedRowKeys: selectedRow }}
                    onRow={(r) => ({ onClick: () => setShowDetail({ data: r }) })}
                />
                <Pagination
                    showSizeChanger
                    pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
                    style={{ marginTop: 10, float: 'right' }}
                    current={pageInfo.current}
                    pageSize={Number(pageInfo.number_of_page || 15)}
                    total={pageInfo.total}
                    showQuickJumper
                    onChange={_handleChangePage}
                />
            </CardCustom>
            <AddNewForm
                visible={showAddNew} jsonFormInput={configState.formAdd}
                _onClose={() => setShowAddNew(false)}
                _onSubmit={_handleAddNew}
            />
            <ModalFormDetail
                visible={showDetail} jsonFormInput={configState.formEdit}
                _onClose={() => setShowDetail(false)}
                _onSubmit={_handleUpdate}
            />
            <FilterForm
                visible={showFilter} jsonFormInput={configState.formFilter}
                _onClose={() => setShowFilter(false)}
                _onSubmit={_handleFilter}
            />
            <DeleteModal
                visible={showDelete} jsonFormInput={configState.formDelete}
                _onClose={() => setShowDelete(false)}
                _onSubmit={_handleDel}
            />
            <ColumnForm
                visible={showColumn} jsonFormInput={configState.listColumn}
                _onClose={() => setShowColumn(false)}
                _onSubmit={_onSaveColumn}
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
    _onClickColumnShow = () => { },
}) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 7, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex' }}>
                    {!showDel ? null : <Button loading={loading} onClick={_handleDel} className="ro-custom" type="text" icon={<DeleteOutlined />} >Xoá item đã chọn</Button>}
                    <Button loading={loading} onClick={() => _onReload()} className="ro-custom" type="text" icon={<ReloadOutlined />} >Làm mới</Button>
                    <Button loading={loading} onClick={_onClickAdd} className="ro-custom" type="text" icon={<PlusOutlined />} >Thêm mới</Button>
                    <Button loading={loading} onClick={_onFilter} className="ro-custom" type="text" icon={<FilterOutlined />} >Bộ lọc</Button>
                    {/* <Button loading={loading} onClick={_onClickColumnShow} className="ro-custom" type="text" icon={<UnorderedListOutlined />} >Hiển thị</Button> */}
                </div>
            </div>
        </div>
    )
}

export default TableFunction;
