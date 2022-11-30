import React, { useState, useEffect } from "react";
import {
    Pagination, Input, Button, Upload, Checkbox,
    Image, Popover, List
} from "antd";
import {
    PlusOutlined, DeleteOutlined, FilterOutlined, ReloadOutlined,
    UploadOutlined, UnorderedListOutlined
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
import { apiClient } from "helper/request/api_client";
import moment from "moment";
import { useTranslation } from "react-i18next";

const TableFunction = (props) => {
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
    const [dataTimeZone , setDataTimeZone] = useState([])
    // effect

    const { t } = useTranslation();

    const lang = "working_shift"

    const _requestDataTimeZone = async () => {
       const {data} = await apiClient.get('timezone')
    //    console.log("321" , data);
       const convertData = data.map(i => ({id : i , name : i}))
       setDataTimeZone(convertData)
    }

  

    useEffect(() => {
        _requestDataTimeZone()
        _requestDataTable();
        // requestDataColumn(dispatchConfig)
        requestFormData(dispatchConfig)
        // console.log("1234" , window.innerHeight);
    }, []);

    // change Pagination
    const _handleChangePage = (skip, limit) => {
        requestTable(dispatchTable, filter, { skip, limit })
    };
    // handle reset 
    const _handleReset = () => _requestDataTable()

    // handle CRUD
    const _requestDataTable = () => requestTable(dispatchTable, filter, pageInfo)

    const _handleFilter = (body) => requestTable(dispatchTable, body, { ...pageInfo, current: 1 })

    const _handleDel = (body) => requestDel({id : selectedRow} , () => _requestDataTable())


    const _handleAddNew = (body) => requestAddNew(body, () => _requestDataTable() , () => setShowAddNew(false))

    const _handleUpdate = (body) => requestEdit(body, () => _requestDataTable() , () => setShowDetail(false))


    // change config
    const _onSaveColumn = (body) => requestUpdateColumn(dispatchConfig, body)

    return (
        <div style={{}}>
            <CardCustom
                title={t(`${lang}.work_shift`)}
                extra={<Extra
                    loading={loading} showDel={selectedRow && selectedRow[0]}
                    listColumn={configState.listColumn}

                    _onReload={_handleReset}
                    _handleDel={selectedRow.length>0 ? _handleDel : () => {}}
                    _onFilter={() => setShowFilter(filter)}
                    _onClickAdd={() => setShowAddNew(true)}
                // _onClickColumnShow={() => setShowColumn(true)}
                />}
            >
                <TableCustom
                    dataSource={dataTable}
                    // columns={configState.listColumn}
                    columns={[
                        {
                          title: t(`${lang}.work_shift`),
                          key: "name",
                          dataIndex: 'name',
                        },
                        {
                          title: t(`${lang}.time_zone`),
                          key: "time_zone",
                          dataIndex: 'time_zone',
                        },
                        {
                          title: t(`${lang}.day_start`),
                          key: "dates",
                          dataIndex: 'dates',
                        },
                        {
                          title: t(`${lang}.start_time`),
                          key: "start_time",
                          dataIndex: 'start_time',
                        },
                        {
                          title: t(`${lang}.end_time`),
                          key: "end_time",
                          dataIndex: 'end_time',
                        },
                        // {
                        //   title: "Updated",
                        //   key: "updated",
                        //   dataIndex: 'updated',
                        // },
                        {
                          title: t(`${lang}.machine`),
                          key: "machines",
                          dataIndex: 'machines',
                          render : val => val?.toString()
                        },
                      
                      ]}
                    loading={loading}
                    scroll={{ y: 'calc(100vh - 200px)' }} pagination={false}
                    rowSelection={{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            // console.log(selectedRowKeys, selectedRows);
                            setSelectRow(selectedRowKeys)
                        }
                    }}
                    onRow={(r) => ({ onClick: () => {
                        setShowDetail({ data: {
                            ...r,
                            dates : r.dates.split(","),
                            start_time : moment(r.start_time , "HH:mm"),
                            end_time : moment(r.end_time , "HH:mm")
                        }, type: "EDIT" })
                        // r.dates.split(",")
                        console.log("rrrr" , { data: {
                            ...r,
                            dates : r.dates.split(",")
                        }, type: "EDIT" });
                    } })}
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
                dataTimeZone = {dataTimeZone}
                _onClose={() => setShowAddNew(false)}
                _onSubmit={_handleAddNew}
            />
            <ModalFormDetail
                visible={showDetail} jsonFormInput={configState.formEdit}
                dataTimeZone = {dataTimeZone}
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
    // _onClickColumnShow = () => { },
}) => {

    const { t } = useTranslation();
    const lang = "setting"

    return (
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 7, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex' }}>
                    {!showDel ? null : <Button loading={loading} onClick={_handleDel} className="ro-custom" type="text" icon={<DeleteOutlined />} >{t(`${lang}.del`)}</Button>}
                    <Button loading={loading} onClick={() => _onReload()} className="ro-custom" type="text" icon={<ReloadOutlined />} >{t(`${lang}.reset`)}</Button>
                    <Button loading={loading} onClick={_onClickAdd} className="ro-custom" type="text" icon={<PlusOutlined />} >{t(`${lang}.add`)}</Button>
                    {/* <Button loading={loading} onClick={_onFilter} className="ro-custom" type="text" icon={<FilterOutlined />} >{t(`${lang}.filter`)}</Button> */}
                    {/* <Button loading={loading} onClick={_onClickColumnShow} className="ro-custom" type="text" icon={<UnorderedListOutlined />} >Hiển thị</Button> */}
                </div>
            </div>
        </div>
    )
}

export default TableFunction;