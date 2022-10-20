import React, { useState, useEffect, useCallback } from "react";
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
import { apiClient } from "helper/request/api_client";
import { ENDPOINT } from "_config/end_point";
import { useTranslation } from "react-i18next";
import { SERVER_URL } from "_config/storage_key";

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


    const { t } = useTranslation();

    const lang = "setting_title"

    // effect
    useEffect(() => {
        _requestDataTable();
        requestDataColumn(dispatchConfig)
        requestFormData(dispatchConfig)
        console.log("abababa", window.innerHeight, " ===== ",);
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

    const _handleDel = (body) => requestDel({ id: selectedRow }, () => _requestDataTable())


    const _handleAddNew = (body) => requestAddNew(body, () => _requestDataTable(), () => setShowAddNew(false))

    const _handleUpdate = (body) => requestEdit(body, () => _requestDataTable(), () => setShowDetail(false))


    // change config
    const _onSaveColumn = (body) => requestUpdateColumn(dispatchConfig, body)

    return (
        <div style={{}}>
            <CardCustom
                title={t(`${lang}.product`)}
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
    const [fileUpload, setFileUpload] = useState();
    const _handleSelectFile = useCallback(async (file, type) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        setFileUpload({ formData, type, name: file.name });

        return false;
    }, []);

    const { t } = useTranslation();
    const lang = "setting"

    useEffect(() => {
        if (fileUpload && fileUpload.type) {
            if (fileUpload.type === 'new') {
                _handleUploadFile(fileUpload.formData)
                setFileUpload(null);

                // } else if (fileUpload.type === 'update') {
                //     window.confirm({
                //         title: 'Xác nhận',
                //         content: `Thao tác này sẽ thêm mới tất cả các kế hoạch trong ${fileUpload.name} và KHÔNG XÓA kế hoạch cũ`,
                //         okText: 'Cập nhật',
                //         onOk() {
                //             _handleUploadFile(fileUpload.formData)
                //             setFileUpload(null);
                //         },
                //         onCancel() {
                //             setFileUpload(null)
                //         },
                //     });
            }
            else if (fileUpload.type === 'price') {
                _handleUploadFilePrice(fileUpload.formData)
                setFileUpload(null);

                // } else if (fileUpload.type === 'update') {
                //     window.confirm({
                //         title: 'Xác nhận',
                //         content: `Thao tác này sẽ thêm mới tất cả các kế hoạch trong ${fileUpload.name} và KHÔNG XÓA kế hoạch cũ`,
                //         okText: 'Cập nhật',
                //         onOk() {
                //             _handleUploadFile(fileUpload.formData)
                //             setFileUpload(null);
                //         },
                //         onCancel() {
                //             setFileUpload(null)
                //         },
                //     });
            }
            else {
                setFileUpload(null);
            }
        }
    }, fileUpload)
    const _handleUploadFilePrice = (file) => {
        apiClient.post('product/price', file, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                openNotificationWithIcon('success', 'Tải dữ liệu lên thành công');
            })

            .catch(error => {

                // Error 😨
                if (error.response) {
                    /*
                     * The request was made and the server responded with a
                     * status code that falls out of the range of 2xx
                     */
                    console.log('error.response.data', error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    try {
                        if (error.response.data) {
                            if (error.response.data.message) {
                                openNotificationWithIcon('error', JSON.stringify(error.response.data.message));
                            } else {
                                openNotificationWithIcon('error', JSON.stringify(error.response.data));
                            }
                        }
                    } catch (err) {
                        openNotificationWithIcon('error', 'Tải dữ liệu lên thất bại');

                    }
                } else if (error.request) {
                    openNotificationWithIcon('error', 'Tải dữ liệu lên thất bại');
                    /*
                     * The request was made but no response was received, `error.request`
                     * is an instance of XMLHttpRequest in the browser and an instance
                     * of http.ClientRequest in Node.js
                     */
                    console.log('error.request', error.request);
                } else {
                    openNotificationWithIcon('error', 'Tải dữ liệu lên thất bại');
                    // Something happened in setting up the request and triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error);
                // console.log(err, '======err.reponseerr.reponseerr.reponseerr.reponseerr.reponse')
            })
            .catch((err) => {

            });

    }
    const _handleUploadFile = (file) => {
        console.log("aaaaaa", file);
        apiClient.post('product/import', file, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                console.log("-----", res);
                openNotificationWithIcon('success', 'Tải dữ liệu lên thành công');

            })

            .catch(error => {

                // Error 😨
                if (error.response) {
                    /*
                     * The request was made and the server responded with a
                     * status code that falls out of the range of 2xx
                     */
                    console.log('error.response.data', error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    try {
                        if (error.response.data) {
                            if (error.response.data.message) {
                                openNotificationWithIcon('error', JSON.stringify(error.response.data.message));
                            } else {
                                openNotificationWithIcon('error', JSON.stringify(error.response.data));
                            }
                        }
                    } catch (err) {
                        openNotificationWithIcon('error', 'Tải dữ liệu lên thất bại');

                    }
                } else if (error.request) {
                    openNotificationWithIcon('error', 'Tải dữ liệu lên thất bại');
                    /*
                     * The request was made but no response was received, `error.request`
                     * is an instance of XMLHttpRequest in the browser and an instance
                     * of http.ClientRequest in Node.js
                     */
                    console.log('error.request', error.request);
                } else {
                    openNotificationWithIcon('error', 'Tải dữ liệu lên thất bại');
                    // Something happened in setting up the request and triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error);
                // console.log(err, '======err.reponseerr.reponseerr.reponseerr.reponseerr.reponse')
            })
            .catch((err) => {

            });

    }
    return (
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 7, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex' }}>
                    {/* <Upload className="ro-custom" fileList={[]} beforeUpload={file => { _handleSelectFile(file, 'price'); return false; }}>
                        <Button
                            type="text" icon={<UploadOutlined />}>{t(`${lang}.upload_price`)}</Button>
                    </Upload>
                    <Button
                        className="ro-custom"
                        border={false}
                        type="text"
                        onClick={async () => {
                            // BASE_URL.DOWNLOAD
                            const link = document.createElement('a');
                            link.href = `${urlServer}/master_cedo/price`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }} icon={<DownloadOutlined />
                        }
                    >
                        {t(`${lang}.template_price`)}
                    </Button> */}
                    <Button
                        className="ro-custom"
                        border={false}
                        type="text"
                        onClick={async() => {
                            // BASE_URL.DOWNLOAD
                            
                            const link = document.createElement('a');
                            link.href = `${ENDPOINT.BASE}/product/export`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }} icon={<DownloadOutlined />} >
                        {t(`${lang}.export`)}
                    </Button>
                    <Upload className="ro-custom" fileList={[]} beforeUpload={file => { _handleSelectFile(file, 'new'); return false; }}>
                        <Button
                            type="text" icon={<UploadOutlined />}>{t(`${lang}.import`)}</Button>
                    </Upload>
                    {!showDel ? null : <Button loading={loading} onClick={_handleDel} className="ro-custom" type="text" icon={<DeleteOutlined />} >{t(`${lang}.del`)}</Button>}
                    <Button loading={loading} onClick={() => _onReload()} className="ro-custom" type="text" icon={<ReloadOutlined />} >{t(`${lang}.reset`)}</Button>
                    <Button loading={loading} onClick={_onClickAdd} className="ro-custom" type="text" icon={<PlusOutlined />} >{t(`${lang}.add`)}</Button>
                    <Button loading={loading} onClick={_onFilter} className="ro-custom" type="text" icon={<FilterOutlined />} >{t(`${lang}.filter`)}</Button>
                    {/* <Button loading={loading} onClick={_onClickColumnShow} className="ro-custom" type="text" icon={<UnorderedListOutlined />} >Hiển thị</Button> */}
                </div>
            </div>
        </div>
    )
}

export default TableFunction;