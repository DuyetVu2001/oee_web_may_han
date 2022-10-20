import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
    Button, Table,
    AutoComplete, Tooltip,
    Pagination, Col
} from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { openNotificationWithIcon } from 'helper/request/notification_antd';

import { handleErr } from 'helper/request/handle_err_request';
import _, { get, set } from 'lodash';
import { useTranslation } from "react-i18next";
import { resetDeviceData } from 'helper/request/request_urlencoded';
import { apiClient } from 'helper/request/api_client';


import "../machine.css";
import '../index.css';

import ActionModal from '../action_modal';
import { updateNG, updateReasonCode } from '../service';
import { BtnTus } from 'com/btn_tutorial';

export const TimeAndInfo = ({ production, timeLoop, setTimeLoop }) => {

    const { t } = useTranslation();
    return (
        <Col xs={20} sm={20} md={20} lg={20} xl={10} xxl={10}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <TitleForm text={t("machine.group")} />
                <Tooltip 
                    // title={production.group_name}
                    title={"Tên nhóm: "  + production.group_name}
                >
                    <div className='show-input' style={{ background: '#fff' }}>{production.group_name}</div>
                </Tooltip>
                <TitleForm style={{minWidth: 100}} text={t("machine.employee")} />
                <Tooltip 
                    // title={production.staff_name}
                    title={"Tên nhân viên: " + production.staff_name}
                >
                    <div className='show-input' style={{ background: '#fff' }} >{production.staff_name}</div>
                </Tooltip>
                <div onClick={() => {
                    window.location.reload()
                }} style={{
                    // padding: '3px 10px', 
                    background: '#fff', borderRadius: 5,
                    border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 25, height: 25,
                }}>
                    <ReloadOutlined style={{ color: '#6e9fff' }} />
                </div>

                <AutoComplete
                    style={{
                        width: 100, borderRadius: 5, marginLeft: 4, marginRight: 15,
                        //  height: 25
                    }}
                    value={timeLoop}
                    options={[
                        {
                            // value: 10,
                            value: '5s'
                        },
                        {
                            // value: 10,
                            value: '10s'
                        },
                        {
                            // value: 20,
                            value: '20s'
                        },
                        {
                            // value: 30,
                            value: '30s'
                        }, {
                            // value: 60,
                            value: '60s'
                        }, {
                            // value: 60 * 3,
                            value: '180s'
                        }, {
                            // value: 60 * 5,
                            value: '300s'
                        }]}
                    placeholder="Nhập số giây"
                    onChange={(e) => {
                        const time = e.split('s')[0]
                        setTimeLoop(time)
                    }
                    }

                />
            </div>
        </Col>
    )
}

const TitleForm = ({ text, style={} } = {}) => <div style={{ padding: '0px 10px', background: '#fff', borderRadius: 5, border: '1px solid #ddd', ...style }}>
    <span style={{ color: '#1890ff', fontWeight: '600', textTransform: 'uppercase' }}>{text}</span>
</div>

const selectStyle = {
    width: 100, borderRadius: 5, marginLeft: 4, marginRight: 15,
}


export const HeaderForm = ({ loading = false, _onClose = () => { } }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: 10 }}>
            <span style={{ fontSize: 18, fontWeight: '500' }}>Setting</span>
            <div>
                <Button
                    loading={loading}
                    type="primary"
                    style={{ float: "left", borderRadius: 5, marginLeft: 13, marginTop: 6 }}
                    htmlType="submit"
                > Submit  </Button>
            </div>
        </div>
    )
}


export const TableFooter = ({ machine, timeLoop, production, requestProduction }) => {
    const { t } = useTranslation();

    // NG
    // const [ng, setNG] = React.useState(0);
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        limit: 3,
        total: 150
    });
    const [pageInfoPro, setPageInfoPro] = useState({
        current: 1,
        limit: 3,
        total: 150
    });
    const lang = "machine"

    const _handleChangePage = (current, limit) => {
        requestTableData({ current, limit })
    };
    const send = (item) => {
        updateReasonCode({
            'machine_id': machine,
            reason_code: item.id,
        }).then(({ data }) => {
            openNotificationWithIcon('success', data.message);
            setVisible(false)
        }).catch(err => alert(JSON.stringify(err)))

    }
    // table

    const [data, setData] = React.useState([]);
    const [tablePro, setTablePro] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [listErr, setListErr] = React.useState([]);

    // MODALS
    const [actionModal, setActionModal] = React.useState({
        visible: false,
        data: {},
        type: 'CREATE',
    });
    // 
    const [visibleWaste, setVisibleWaste] = useState(false)
    const [visibleProduct, setVisibleProduct] = useState(false);
    const [visibleEditProduct, setVisibleEditProduct] = useState(false);
    const [dataInit, setDataInit] = useState({});
    React.useEffect(() => {
        if(!machine) return () => {}
        apiClient.get('machinereasoncode')
            .then(({ data }) => {
                console.log("dataaaa", data);
                setListErr(data.data);
            })
        Promise.all([
            apiClient.get('staff?limit=1000'),
            apiClient.get(`product/machine?machine_id=${machine}`),
            apiClient.get('group_staff?limit=1000'),
        ])
            .then(([dataStaff, dataProduct, dataStaffGroup]) => {
                setDataInit({
                    ...dataInit,
                    staff: get(dataStaff, 'data.data', []),
                    product: get(dataProduct, 'data', []),
                    group_staff: get(dataStaffGroup, 'data.data', []),
                    production: production
                })
            })
    }, [machine, production])

    useEffect(() => {
        setDataInit({
            ...dataInit,
            production
        })
    }, [production])


    useEffect(() => {
        requestTableData();
        const interVal = setInterval(() => {
            requestTableData();
        }, timeLoop * 1000);
        return () => {
            clearInterval(interVal)
        }
    }, [timeLoop, machine]);

    const requestTableData = async ({ current = pageInfo.current, limit = pageInfo.limit } = {}) => {
        try {
            if(!machine) return 0;
            const { data } = await apiClient.get(`/production/employee?machine_id=${machine}`, {
                machine_id: machine,
                skip: current,
                limit: limit
            })
            const { data: table } = await apiClient.get('/production/table')
            setPageInfo({ ...pageInfo, limit, ...data.page_info })
            setData(data.data.map(i => {
                i.key = i.id
                return i;
            }))
            setTablePro(table.map((i) => {
                if (i.key == "gap" || i.key == "cavity" || i.key == "cycle_time" || i.key == "id" || i.key == "machine_id") {
                    i.disable = true
                }
                return i
            }))
        } catch (error) {
            console.log("err", error);
        }
    }
    const submitChangeWaste = (val) => {
        // updateNG({
        //     'machine_id': machine,
        //     'ng': ng
        // })
        //     .then(() => {
        //         requestTableData()
        //         openNotificationWithIcon("success", "Change NG success")
        //     })
        //     .catch((err) => {
        //         handleErr(err)
        //         // alert(JSON.stringify(err))
        //     })
        updateNG({
            'machine_id': machine,
            ...val
        })
            .then(() => {
                requestTableData()
                openNotificationWithIcon("success", "Change NG success")
            })
            .catch((err) => {
                handleErr(err)
                alert(JSON.stringify(err))
            })
    }

    const submitProduct = (val) => {
        apiClient.patch('production/machine', {
            machine_id: machine,
            ...val,
        }).then(({ data }) => {
            openNotificationWithIcon('success', data.msg);
            setVisibleProduct(false)
            requestProduction()
        }).catch(err => {
            handleErr(err)
        })
    }

    const changeProduct = (val) => {
        apiClient.patch('/production/change_product', {
            machine_id: machine,
            ...val,
        }).then(({ data }) => {
            openNotificationWithIcon('success', data.msg);
            resetDeviceData();
            setVisibleEditProduct(false)
            requestProduction()
        }).catch(err => {
            // handleErr(err)
            console.log("err", err);
        })

    }
    const lang_table = "table_monitor";
    const title_home = "home";


    return (
        <>
       
        <div className='wrap-adjusted-table'>
            <div className='table_production'>
                <Table
                    className='antd-table'
                    size='small'
                    dataSource={data}
                    // columns={
                    //     tablePro.filter(i => !i.disable)
                    // }

                    columns={
                        [
                            {
                                title: t(`${lang_table}.product`),
                                key: "product_name",
                                dataIndex: 'product_name',
                            },
                            {
                                title: t(`${lang_table}.target`),
                                key: "target",
                                dataIndex: 'target',
                            },
                            {
                                title: t(`${lang_table}.actual`),
                                key: "actual",
                                dataIndex: 'actual',
                            },
                            {
                                title: t(`${lang_table}.qty_report`),
                                key: "qty_report",
                                dataIndex: 'qty_report',
                            },
                            {
                                title: t(`${lang_table}.ng`),
                                key: "ng",
                                dataIndex: 'ng',
                            },
                            {
                                title: t(`${lang_table}.staff`),
                                key: "staff_name",
                                dataIndex: 'staff_name',
                            },
                            {
                                title: t(`${lang_table}.group`),
                                key: "group_staff_name",
                                dataIndex: 'group_staff_name',
                            },
                            {
                                title: t(`${lang_table}.shift`),
                                key: "shift_name",
                                dataIndex: 'shift_name',
                            },
                            {
                                title: t(`${lang_table}.start_time`),
                                key: "start_time",
                                dataIndex: 'start_time',
                            },
                            {
                                title: t(`${lang_table}.end_time`),
                                key: "end_time",
                                dataIndex: 'end_time',
                            }
                        ]
                    }
                    scroll={{ y: 'calc(27vh - 30px)', x: '100vh' }}
                    onRow={(r) => ({
                        onClick: () => setActionModal(() => ({
                            data: r,
                            visible: true,
                            type: 'CREATE',
                        }))
                    })}
                    pagination={false}
                />
                <Pagination
                    showSizeChanger
                    pageSizeOptions={[2, 3, 5, 8, 10, 15, 20]}
                    style={{ marginTop: 10, float: 'right' }}
                    current={pageInfo.current}
                    pageSize={Number(pageInfo.limit || 2)}
                    total={pageInfo.total}
                    showQuickJumper
                    onChange={_handleChangePage}
                />
            </div>
            {/* MODALS */}
            <ActionModal onCancel={() =>
                setActionModal((state) => ({ ...state, visible: false }))
            }
                modalData={actionModal} />

        <BtnTus>
            <div><b>AVAILABILITY:</b> TG máy chạy / TG sản xuất</div>
            <div><b>PERFORMANCE:</b> Tỷ lệ thực tế / Tỷ lệ tiêu chuẩn</div>
            <div><b>QUALITY:</b> (SL thực tế - NG) / SL thực tế</div>
            <div><b>OEE = </b> A * P * Q</div>
        </BtnTus>
        </div>

        {/* <div style={{textAlign:'center', color:"black", fontSize:'28px',fontFamily:'sans-serif',  left: 50, bottom: 20, top:20,zIndex: 1}}><b>{t(`${title_home}.machine_monitor`)} và điều khiển dây truyền máy đúc nhựa</b></div> */}
        </>
        
    )

}
