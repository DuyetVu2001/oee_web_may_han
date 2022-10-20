import React, { useState, useEffect } from "react";
import {
    Pagination, Input, Button, Upload, Checkbox,
    Image, Popover, List, Badge
} from "antd";
import {
    PlusOutlined, DeleteOutlined, FilterOutlined, ReloadOutlined,
    UploadOutlined, UnorderedListOutlined, DatabaseTwoTone
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
import { useTranslation } from "react-i18next";
import { apiClient } from "helper/request/api_client";
import { isEmpty } from "lodash";

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

    const [dataShow, setDataShow] = useState([]);
    const [staticMachine, setStaticMachine] = useState({});
    // console.log('staticMachine', staticMachine)

    // effect

    useEffect(() => {
        if (!isEmpty(dataTable)) {
            requestMachineStt();
        }
    }, [dataTable]);

    useEffect(() => {
        _requestDataTable();
        requestDataColumn(dispatchConfig)
        requestFormData(dispatchConfig)
        const inter = setInterval(() => requestMachineStt(), 1000 * 10)
        return (() => {
            clearInterval(inter)
        })
    }, []);

    const requestMachineStt = () => {
        apiClient.get('device/statistic')
            .then(({ data }) => {
                if (!data || !data.data) return 0;
                const dataConvert = data.data.reduce((cal, cur) => {
                    cal[cur.machine_id] = cur;
                    return cal;
                }, {});
                setStaticMachine({
                    lack_of_device: data.lack_of_device,
                    offline: data.offline,
                    online: data.online,
                })
                if (dataTable && dataConvert)
                    setDataShow(dataTable.map(i => {
                        const dataRealtime = dataConvert[i.id]
                        if (dataRealtime) {
                            i.status = dataRealtime.status;
                            i.IPAddress = dataRealtime.IPAddress;
                            i.BuildDateTime = dataRealtime.BuildDateTime;
                            i.connected_at = dataRealtime.connected_at;
                        }
                        return i;
                    }))
            })
    }

    const { t } = useTranslation();

    const lang = "setting_title"

    // change Pagination
    const _handleChangePage = (skip, limit) => {
        requestTable(dispatchTable, filter, { skip, limit })
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
                title={t(`${lang}.device`)}
                extra={<Extra
                    loading={loading} showDel={selectedRow && selectedRow[0]}
                    listColumn={configState.listColumn}
                    staticMachine={staticMachine}

                    _onReload={_handleReset}
                    _handleDel={selectedRow.length > 0 ? _handleDel : () => { }}
                    _onFilter={() => setShowFilter(filter)}
                    _onClickAdd={() => setShowAddNew(true)}
                // _onClickColumnShow={() => setShowColumn(true)}
                />}
            >
                <TableCustom
                    dataSource={dataTable}
                    columns={configState.listColumn}
                    // columns={columnInitTable}
                    loading={loading}
                    scroll={{ y: 'calc(100vh - 200px)' }} pagination={false}
                    // rowSelection={{
                    //     type: 'checkbox',
                    //     onChange: (selectedRowKeys, selectedRows) => {
                    //         // console.log(selectedRowKeys, selectedRows);
                    //         setSelectRow(selectedRowKeys)
                    //     }
                    // }}
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
    staticMachine = {},

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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DeviceStatic staticMachine={staticMachine} />

                    {/* {!showDel ? null : <Button loading={loading} onClick={_handleDel} className="ro-custom" type="text" icon={<DeleteOutlined />} >{t(`${lang}.del`)}</Button>} */}
                    <Button loading={loading} onClick={() => _onReload()} className="ro-custom" type="text" icon={<ReloadOutlined />} >{t(`${lang}.reset`)}</Button>
                    {/* <Button loading={loading} onClick={_onClickAdd} className="ro-custom" type="text" icon={<PlusOutlined />} >{t(`${lang}.add`)}</Button> */}
                    {/* <Button loading={loading} onClick={_onFilter} className="ro-custom" type="text" icon={<FilterOutlined />} >{t(`${lang}.filter`)}</Button> */}
                    {/* <Button loading={loading} onClick={_onClickColumnShow} className="ro-custom" type="text" icon={<UnorderedListOutlined />} >Hiển thị</Button> */}
                </div>
            </div>
        </div>
    )
}

export default TableFunction;


const DeviceStatic = ({ staticMachine }) => {
    return (

        <div style={{ display: 'flex' }}>
            <div style={{
                // border: '1px solid #eee',
                borderBottom: '3px solid green',
                padding: '5px 20px',
                width: '150px',
                borderRadius: 5,
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
            }}>
                <div style={{ fontSize: '1.4vw', fontWeight: 500, color: '#999' }}>Online</div>
                <div><Badge status="success" /> {staticMachine.online}</div>
            </div>
            <div style={{
                // border: '1px solid #eee',
                borderBottom: '3px solid red',
                padding: '5px 20px',
                width: '150px',
                borderRadius: 5,
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
                margin: '0px 10px'
            }}>
                <div style={{ fontSize: '1.4vw', fontWeight: 500, color: '#999' }}>Offline</div>
                <div><Badge status="error" /> {staticMachine.offline}</div>
            </div>
            <div style={{
                // border: '1px solid #eee',
                borderBottom: '3px solid gray',
                padding: '5px 20px',
                width: '150px',
                borderRadius: 5,
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
            }}>
                <div style={{ fontSize: '1.4vw', fontWeight: 500, color: '#999' }}>No signal</div>
                <div><Badge status="default" /> {staticMachine.lack_of_device}</div>
            </div>
        </div>)
}