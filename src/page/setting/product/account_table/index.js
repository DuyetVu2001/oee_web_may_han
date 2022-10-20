import React, { useState, useEffect } from "react";
import {
    Pagination, Input, Button, Upload, Checkbox,
    Image, Popover, List
} from "antd";
import {
    PlusOutlined, DeleteOutlined, FilterOutlined, ReloadOutlined,
    UploadOutlined, UnorderedListOutlined, DownloadOutlined
} from "@ant-design/icons";

// local com
import { CardCustom, TableCustom } from "./helper/styled_component";

import AddNewForm from './com/add_new_modal';
import ModalFormDetail from './com/detail_modal';
import FilterForm from './com/filter_modal';
import ColumnForm from './com/column_modal';
// 
import { columnInitTable, TITLE_TABLE } from './const';
import {
    reducerTable, initialStateTable, requestTable,
    requestAddNew, requestEdit, requestDel, set_filter
} from "./state/table";
import {
    requestFormData, reducerConfig, initialStateConfig,
    requestUpdateColumn, requestDataColumn
} from "./state/config";
import { addProduct, delProduct, getProduct, updateProduct } from "./services";
import { openNotificationWithIcon } from "helper/request/notification_antd";
import { ENDPOINT } from "_config/end_point";
import { useTranslation } from "react-i18next";
import { SERVER_URL } from "_config/storage_key";

const TableFunction = (props) => {

    const { t } = useTranslation();
    // state
    const [configState, dispatchConfig] = React.useReducer(reducerConfig, initialStateConfig);
    const [tableState, dispatchTable] = React.useReducer(reducerTable, initialStateTable);
    const { loading, dataTable, pageInfo, filter } = tableState;

    const [selectedRow, setSelectRow] = useState([]);
    // modal
    const [showFilter, setShowFilter] = useState(false);
    const [showAddNew, setShowAddNew] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showColumn, setShowColumn] = useState(false);
    // effect
    useEffect(() => {
        _requestDataTable();
        requestDataColumn(dispatchConfig)
        requestFormData(dispatchConfig)
    }, []);

    const lang = "setting_product"

    // change Pagination
    const _handleChangePage = (skip, limit) => {
        console.log({ skip, limit });
        requestTable(dispatchTable, filter, { skip: skip, limit })
    };
    // handle reset 
    const _handleReset = () => _requestDataTable()

    // handle CRUD
    const _requestDataTable = () => requestTable(dispatchTable, filter, pageInfo)

    const _handleFilter = (body) => requestTable(dispatchTable, body, { ...pageInfo, current: 1 })

    const _handleDel = (body) => requestDel({ id: selectedRow }, () => _requestDataTable())


    const _handleAddNew = (body) => requestAddNew(body, () => _requestDataTable(), () => setShowAddNew(false))

    const _handleUpdate = (body) => requestEdit(body, () => _requestDataTable(), () => setShowDetail(false))


    // change config
    const _onSaveColumn = (body) => requestUpdateColumn(dispatchConfig, body)

    return (
        <div style={{}}>
            <CardCustom
                title={t(`${lang}.title`)}
                extra={<Extra
                    loading={loading} showDel={selectedRow && selectedRow[0]}
                    listColumn={configState.listColumn}

                    _onReload={_handleReset}
                    _handleDel={selectedRow.length > 0 ? _handleDel : () => { }}
                    _onFilter={() => setShowFilter(filter)}
                    _onClickAdd={() => setShowAddNew(true)}
                // _onClickColumnShow={() => setShowColumn(true)}
                />}
            >
                <TableCustom
                    dataSource={dataTable}
                    columns={configState.listColumn.filter(i => i.active)}
                    // columns={columnInitTable}
                    loading={loading}
                    scroll={{ y: 'calc(100vh - 200px)' }} pagination={false}
                    rowSelection={{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            // console.log(selectedRowKeys, selectedRows);
                            setSelectRow(selectedRowKeys)
                        }
                    }}
                    onRow={(r) => ({ onClick: () => setShowDetail({ data: r, type: "EDIT" }) })}
                />
                <Pagination
                    showSizeChanger
                    pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
                    style={{ marginTop: 10, float: 'right' }}
                    current={pageInfo.skip}
                    pageSize={Number(pageInfo.limit || 15)}
                    total={pageInfo.total}
                    showQuickJumper
                    onChange={_handleChangePage}
                />
            </CardCustom>
            {/* modal */}
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
            {/* <ColumnForm
                visible={showColumn} jsonFormInput={configState.listColumn}
                _onClose={() => setShowColumn(false)}
                _onSubmit={_onSaveColumn}
            /> */}
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
    return (
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 7, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex' }}>
                    <Button
                        className="ro-custom"
                        border={false}
                        type="text"
                        onClick={async () => {
                            // BASE_URL.DOWNLOAD
                            
                            const urlServer = ENDPOINT.BASE
                            const link = document.createElement('a');
                            link.href = `${urlServer}/production/export`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }} icon={<DownloadOutlined />} >
                        Export
                    </Button>
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