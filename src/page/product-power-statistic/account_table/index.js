import React, { useState, useEffect } from "react";
import {
    Pagination, Input, Button, Upload, Checkbox,
    Image, Popover, List, Tooltip
} from "antd";
import {
    PlusOutlined, DeleteOutlined, FilterOutlined, ReloadOutlined,
    UploadOutlined, UnorderedListOutlined, DownloadOutlined, RetweetOutlined, TableOutlined
} from "@ant-design/icons";

// local com
import { CardCustom, TableCustom } from "./helper/styled_component";

import AddNewForm from './com/add_new_modal';
import ModalFormDetail from './com/detail_modal';
import FilterForm from './com/filter_modal';
import ColumnForm from './com/column_modal';
// 
import { columnInitTable, jsonFormInit, TITLE_TABLE } from './const';
import {
    reducerTable, initialStateTable, requestTable,
    requestAddNew, requestEdit, requestDel, set_filter
} from "./state/table";
import {
    requestFormData, reducerConfig, initialStateConfig,
    requestUpdateColumn, requestDataColumn
} from "./state/config";
import axios from "axios";
import { ENDPOINT } from "_config/end_point";
import { convert2StringQuery } from "helper/convert_data/to_string_query";
import moment from "moment";
import { SERVER_URL } from "_config/storage_key";
import { useTranslation } from "react-i18next";

const TableFunction = ({ hideMachine }) => {
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

    // change Pagination
    const _handleChangePage = (current, limit) => {
        console.log("aaaa", { current, limit });
        requestTable(dispatchTable, filter, { current, limit })
    };
    // handle reset 
    const _handleReset = () => requestTable(dispatchTable, {}, pageInfo)

    // handle CRUD
    const _requestDataTable = () => requestTable(dispatchTable, filter, pageInfo)
    const _handleFilter = (body) => requestTable(dispatchTable, body, { ...pageInfo, current: 1 })

    const _handleDel = (body) => requestDel(body, () => {
        _requestDataTable();
        setShowDetail(false)
    })
    const _handleAddNew = (body) => requestAddNew(body, () => {
        _requestDataTable();

        setShowDetail(false)
    })
    const _handleUpdate = (body) => requestEdit(body, () => {
        _requestDataTable();
        setShowDetail(false)
    })

    // change config
    const _onSaveColumn = (body) => requestUpdateColumn(dispatchConfig, body)
    const _handleDownload = async (filterData) => {
        const queryString = convert2StringQuery(filterData);
        const urlServer = ENDPOINT.BASE
        
        // return 1;
        // BASE_URL.DOWNLOAD
        const link = document.createElement('a');
        link.href = `${urlServer}/powerstatistics?export=true&${queryString}?${moment().valueOf()}`;
        console.log(link.href)
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    const {t} = useTranslation();
    const lang = "statistics";
    const change_view = "change_view";
    return (
        <div style={{}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                    <Tooltip title={t(`${change_view}.chart_view`)} style={{ padding: '5px 10px', background: '#fff', borderRadius: 5, border: '1px solid #ddd', }}>
                        <Button style={{ marginLeft: 10, marginRight: 20 }} onClick={() => hideMachine()}>
                            <TableOutlined />
                        </Button>
                    </Tooltip>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>{t(`${lang}.power_statistic`)}</span>
                </div>
                <Extra
                    loading={loading} showDel={selectedRow && selectedRow[0]}
                    listColumn={configState.listColumn}
                    _onReload={_handleReset}
                    _onDownload={() => _handleDownload(filter)}
                    // _handleDel={_handleDel}
                    _onFilter={() => setShowFilter(filter)}
                    _onClickAdd={() => setShowAddNew(true)}
                // _onClickColumnShow={() => setShowColumn(true)}
                />
            </div>
            <CardCustom
            // title={
            //     TITLE_TABLE
            // }
            // extra={<Extra
            //     loading={loading} showDel={selectedRow && selectedRow[0]}
            //     listColumn={configState.listColumn}

            //     _onReload={_handleReset}
            //     _onDownload={() => _handleDownload(filter)}
            //     // _handleDel={_handleDel}
            //     _onFilter={() => setShowFilter(filter)}
            //     _onClickAdd={() => setShowAddNew(true)}
            // // _onClickColumnShow={() => setShowColumn(true)}
            // />}
            >
                <TableCustom
                    dataSource={dataTable}
                    columns={configState.listColumn}
                    // columns={columnInitTable}
                    loading={loading}
                    scroll={{ x: 1300 }} pagination={false}

                    // rowSelection={{ type: 'checkbox', onChange: setSelectRow, selectedRowKeys: selectedRow }}
                    // onRow={(r) => ({ onClick: () => setShowDetail({ data: r, type: "EDIT" }) })}
                />
                <Pagination
                    showSizeChanger
                    pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
                    style={{ marginTop: 10, float: 'right' }}
                    current={pageInfo.current}
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
    _onDownload = () => { },
    // _onClickColumnShow = () => { },
}) => {
    const {t} = useTranslation();
    const lang = "setting";
    return (
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 7, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex' }}>
                    {/* {!showDel ? null : <Button loading={loading} onClick={_handleDel} className="ro-custom" type="text" icon={<DeleteOutlined />} >Xoá item đã chọn</Button>} */}
                    <Button loading={loading} onClick={() => _onDownload()} className="ro-custom" type="text" icon={<DownloadOutlined />} >{t(`${lang}.down`)}</Button>
                    <Button loading={loading} onClick={() => _onReload()} className="ro-custom" type="text" icon={<ReloadOutlined />} >{t(`${lang}.reset`)}</Button>
                    {/* <Button loading={loading} onClick={_onClickAdd} className="ro-custom" type="text" icon={<PlusOutlined />} >Thêm mới</Button> */}
                    <Button loading={loading} onClick={_onFilter} className="ro-custom" type="text" icon={<FilterOutlined />} >{t(`${lang}.filter`)}</Button>
                    {/* <Button loading={loading} onClick={_onClickColumnShow} className="ro-custom" type="text" icon={<UnorderedListOutlined />} >Hiển thị</Button> */}
                </div>
            </div>
        </div>
    )
}

export default TableFunction;