import React, { useEffect, useState, useWindowDimensions, useRef } from 'react';
import axios from 'axios'
import { Route, Switch, useRouteMatch, Link, useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import {
    InputNumber, Button, Table, Modal, Select,
    AutoComplete, Tooltip,
    Skeleton, Drawer, Popover, Input, message, Space, Form, TextAre, Pagination, Row, Col, Tabs
} from 'antd';
import {
    CloseCircleOutlined, PlusCircleFilled,
    CaretLeftOutlined, CaretRightOutlined, FallOutlined, ReloadOutlined, RiseOutlined, SettingOutlined
} from '@ant-design/icons';

import { openNotificationWithIcon } from 'helper/request/notification_antd';
import { apiClient } from 'helper/request/api_client';
import { getDataTable, getGrafana, updateDowntime, updateNG, updateReasonCode } from './service';
import { handleErr } from 'helper/request/handle_err_request';
import _, { get, set } from 'lodash';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";
import { resetDeviceData } from 'helper/request/request_urlencoded';
import { useQuery } from 'helper/hook/get_query';
import { FilterMachine } from 'com/filter_machine';

import './index.css'
import "./machine.css"
import './test.css'
import Com from './com';
import ActionModal from './action_modal';
import { TimeAndInfo } from './com/filter_time';
import { useSelector } from 'react-redux';
import { BtnTus } from 'com/btn_tutorial';


const h8 = moment().set('hour', 8).set('minute', 0).valueOf();
const h20 = moment().set('hour', 20).set('minute', 0).valueOf();
const h20p = moment().set('hour', 20).subtract(1, 'd').set('minute', 0).valueOf();
const h8n = moment().add(1, 'd').set('hour', 8).set('minute', 0).valueOf();

const lang = 'machine';

const App = () => {
    const { t } = useTranslation();

    const [timestamp, setTimestamp] = React.useState({
        from: h8,
        to: h20,
    });
    const [timeLoop, setTimeLoop] = useState(5);
    const [production, setProduction] = useState({})

    const [srcMachine, setSrcMachine] = useState("")
    const [loading, setLoading] = React.useState(false);

    const [filterMachine, setFilterMachine] = useState({});

    const { area, line, machine } = filterMachine;

    const User = useSelector(state => get(state, 'app.user', {}));
    useEffect(() => {
        if (machine) {
            requestProduction();
        }
    }, [machine])

    const requestProduction = () => {
        if (!machine) return 0;
        setLoading(true)
        apiClient.get(`production/machine?machine_id=${machine}`)
            .then(({ data }) => {
                setProduction(data)
            })
            .catch(err => {
                openNotificationWithIcon("error", `fetch production fail with machine_id: ${machine}`)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const _requestData = async () => {
        try {
            getGrafana({
                name: "employee"
            }).then(({ data }) => {
                setSrcMachine(get(data, `url`));
            })
        } catch (error) {
            handleErr(error)
            console.log("err", error);
        }
    }

    React.useEffect(() => {
        _requestData()
        checkTime();
        const interVal = setInterval(() => { checkTime() }, 60 * 1000);
        return () => {
            clearInterval(interVal)
        }
    }, []);

    const checkTime = () => {
        const h = moment().format("HH");
        if (+h >= 8 && +h < 20) {
            if (timestamp.from != h8) setTimestamp({ from: h8, to: h20 })
        } else if (+h >= 0 && +h <= 8) {
            if (timestamp.from != h20) setTimestamp({ from: h20p, to: h8 })
        } else {
            if (timestamp.from != h20) setTimestamp({ from: h20, to: h8n })
        }
    }
    const title_home = "home"
    return (
        <div className='wrap-machine' style={{ padding: 15, height: 'calc(100vh - 50px)', overflow: 'scroll', marginTop: -5 }}>
            {/* <div style={{textAlign:'center', color:"black", fontSize:'28px', fontFamily:'sans-serif',  left: 50, bottom: 25,zIndex: 1}}><b>{t(`${title_home}.operate`)} và điều khiển dây truyền máy đúc nhựa</b></div> */}
            <Row className='top'>
                <FilterMachine onChange={setFilterMachine} />
                <TimeAndInfo  {...{ production, timeLoop, setTimeLoop }} />
            </Row>
            <div>
                <div style={{ height: '235px', minHeight: '235px' }}>
                    <div style={{ height: '235px', minHeight: '235px' }}>
                        <iframe
                            onLoad={() => setTimeout(() => setLoading(false), 1000)}
                            src={`${srcMachine}&theme=light&from=${timestamp.from}&to=${timestamp.to}&refresh=${timeLoop}s&var-ENTERPRISE=${User.enterprise_id}&var-AREA=${area}&var-LINE=${line}&var-MACHINE=${machine}&kiosk`}
                            width="100%" height="100%"
                            frameBorder="0"></iframe>
                    </div>
                    {loading ? <div style={{ background: '#fff', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                        <Skeleton />
                    </div> : null}
                </div>


                <div>
                    <TableFooter loading={loading} timeLoop={timeLoop}
                        machine={machine} production={production}
                        requestProduction={requestProduction} />
                </div>

                <div style={{ height: '31vh', margin: '0px 10px' }}>
                    <TableCustom timeLoop={timeLoop} machine={machine} production={production} requestProduction={requestProduction} />
                </div>
            </div>
        </div>
    )
};

const TableCustom = ({ machine, timeLoop, production, requestProduction }) => {
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
    const [actionModal, setActionModal] = React.useState({
        visible: false,
        data: {},
        type: 'CREATE',
    });

    const [data, setData] = React.useState([]);
    const [tablePro, setTablePro] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [listErr, setListErr] = React.useState([]);
    // 
    const [visibleWaste, setVisibleWaste] = useState(false)
    const [visibleProduct, setVisibleProduct] = useState(false);
    const [visibleEditProduct, setVisibleEditProduct] = useState(false);
    const [dataInit, setDataInit] = useState({});
    React.useEffect(() => {
        if (!machine) return () => { }
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
        }, 60 * 60 * 1000);
        return () => {
            clearInterval(interVal)
        }
    }, [timeLoop, machine]);

    const requestTableData = async ({ current = pageInfo.current, limit = pageInfo.limit } = {}) => {
        try {
            if (!machine) return 0;
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
    const lang_table = "table_monitor";
    return (
        <>
            <div className='wrap-adjusted-table' style={{ marginTop: 0 }}>
                <div className='table_production'>
                    <Table
                        className='antd-table'
                        size='small'
                        dataSource={data}
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
                <ActionModal
                    onCancel={() =>
                        setActionModal((state) => ({ ...state, visible: false }))
                    }
                    modalData={actionModal}
                />

            </div>
            {/* <div style={{textAlign:'center', color:"black", fontSize:'28px', fontFamily:'sans-serif',  left: 50, bottom: 20, top:20,zIndex: 1}}><b>{t(`${title_home}.operate`)} và điều khiển dây truyền máy đúc nhựa</b></div> */}
        </>
    )

}


const TableFooter = ({ machine, timeLoop, production, requestProduction, loading }) => {
    const lang = "machine"
    const { t } = useTranslation();

    // NG
    // const [ng, setNG] = React.useState(0);
    const [pageInfo, setPageInfo] = useState({
        current: 0,
        limit: 5,
        total: 150
    });


    const _handleChangePage = (current, limit) => {
        requestTableData({ current, limit })
        // console.log(current, limit);
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
    const [visible, setVisible] = React.useState(false);
    const [listErr, setListErr] = React.useState([]);
    // 
    const [visibleWaste, setVisibleWaste] = useState(false)
    const [visibleProduct, setVisibleProduct] = useState(false);
    const [visibleEditProduct, setVisibleEditProduct] = useState(false);
    const [dataInit, setDataInit] = useState({});
    React.useEffect(() => {
        if (machine) {
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
        }
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
        }, 3 * 60 * 1000);
        return () => {
            clearInterval(interVal)
        }
    }, [timeLoop, machine]);

    useEffect(() => {
        // requestTableData(pageInfo)
    }, [pageInfo.current])



    const requestTableData = async ({ current = pageInfo.current, limit = pageInfo.limit } = {}) => {
        try {
            if (machine) {
                const { data } = await getDataTable({
                    machine_id: machine,
                    skip: current,
                    limit: limit
                })

                setPageInfo({ ...pageInfo, limit, ...data.page_info })
                setData(data.data.map(i => {
                    i.key = i.id;
                    return i;
                }))
            }
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
        // dnd
        apiClient.patch('/production/change_product', {
            machine_id: machine,
            ...val,
        }).then(({ data }) => {
            requestTableData();
            openNotificationWithIcon('success', data.msg);
            resetDeviceData();
            // setVisibleEditProduct(false)
            requestProduction()
        }).catch(err => {
            openNotificationWithIcon('error', get(err, 'msg', "Update errors"));
        })
    }
    return (
        <div className='wrap-table-adjusted'>
            <BtnTus>
                <div>
                    <div>Staff: Nhân viên thực hiện</div>
                    <div>Group: Nhóm nhân viên</div>
                    <div></div>
                </div>
            </BtnTus>
            <Row gutter={[16, 16]} type="flex" justify="center" align="center" style={{ marginBottom: 5, marginRight: 5 }}>
                <Col sm={24} md={19} style={{ paddingRight: 5 }}>
                    <div style={{
                        // width: '100%',
                        // minWidth: '100%',
                        minHeight: '150px', position: "relative", borderRadius: 4,
                        border: '1px solid #24292e1f',
                        backgroundColor: '#ffffff', marginLeft: 12,
                        // marginRight: 10,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-around', padding: 10 }}>
                            {
                                data.map((item,) =>
                                    (item.duration / 60).toFixed() >= 3 ?
                                        <Com onClick={() => {
                                            console.log("item", item);
                                            setVisible(item)
                                        }} item={item} />
                                        : null
                                )
                            }
                        </div>
                        <Pagination simple current={pageInfo.current} total={pageInfo.total}
                            pageSize={5}
                            onChange={_handleChangePage}
                            style={{ paddingTop: 0, paddingBottom: 5, display: 'flex', justifyContent: 'center' }}
                        />
                    </div>
                    <Modal width={800} footer={null} visible={!!visible} title={`INTERRUPTION ${visible.ts}`} style={{ top: 10 }} onCancel={() => setVisible(false)}>
                        <div style={{
                            display: 'flex', flexWrap: 'wrap',
                            //  marginTop: 20, marginRight: 10,
                            // width: 530, justifySelf: 'center', justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Tabs defaultActiveKey="1">
                                <Tabs.TabPane tab={
                                    <div className='tabs'><FallOutlined style={{ paddingBottom: 5 }} /> <div>Unplanned</div></div>
                                } key="1">
                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {
                                            listErr.map((item, index) => {
                                                return item.type === "UnPlanned" ? (
                                                    <div className='list-div' key={index + ''}
                                                        onClick={() => {
                                                            if (get(visible, 'type') === 'ng') {
                                                                send(visible)
                                                            } else {
                                                                apiClient.patch('downtime/change_reasoncode',
                                                                    {
                                                                        id: visible.id,
                                                                        reason_code: item.id,
                                                                    }).then(({ data }) => {
                                                                        requestTableData()
                                                                        openNotificationWithIcon('success', data.msg);
                                                                        setVisible(false)
                                                                    }).catch(err => {
                                                                        handleErr(err)
                                                                    })
                                                            }
                                                        }}
                                                    >
                                                        {item.name}
                                                    </div>

                                                ) : null
                                            })
                                        }
                                    </div>
                                </Tabs.TabPane>
                                <Tabs.TabPane tab={
                                    <div className='tabs'><RiseOutlined style={{ paddingBottom: 5 }} /> <div>Planned</div></div>
                                } key="2">
                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {
                                            listErr.map((item, index) => {
                                                return item.type === "Planned" ? (
                                                    <div className='list-div' key={index + ''}
                                                        onClick={() => {
                                                            if (get(visible, 'type') === 'ng') {
                                                                send(visible)
                                                            } else {
                                                                apiClient.patch('downtime/change_reasoncode',
                                                                    {
                                                                        id: visible.id,
                                                                        reason_code: item.id,
                                                                    }).then(({ data }) => {
                                                                        requestTableData()
                                                                        openNotificationWithIcon('success', data.msg);
                                                                        setVisible(false)
                                                                    }).catch(err => {
                                                                        handleErr(err)
                                                                    })
                                                            }
                                                        }}
                                                    >
                                                        {item.name}
                                                    </div>

                                                ) : null
                                            })
                                        }
                                    </div>
                                </Tabs.TabPane>
                            </Tabs>

                        </div>
                    </Modal>
                    <ModalEditProduct
                        visible={visibleProduct} loading={loading}
                        onCancel={() => setVisibleProduct(false)}
                        onSubmit={submitProduct}
                    />
                    <ModalChangeWaste
                        visible={visibleWaste}
                        onCancel={() => setVisibleWaste(false)}
                        onSubmit={submitChangeWaste}
                    />
                    <ModalChangeProduct
                        visible={visibleEditProduct}
                        onCancel={() => setVisibleEditProduct(false)}
                        onSubmit={changeProduct}
                        machine_id={machine}
                    />
                </Col>
                <Col sm={{ span: 24 }} md={{ span: 5, marginTop: 10 }}>

                    <div style={{
                        // width: '100%',
                        height: '100%',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'space-around',
                        background: '#fff',
                        padding: '10px 20px',
                        minWidth: '200px',
                        maxWidth: '300px',
                        // marginBottom: 10,
                        borderRadius: 4,
                        // marginLeft: 10,
                        // marginRight: 10,
                        border: '1px solid #24292e1f',
                        textTransform: 'uppercase',
                        margin: 'auto'
                        // maxWidth: 
                        // height: '27vh'
                    }}>
                        <Button
                            // icon={<DeleteOutlined />}
                            style={{ textTransform: 'uppercase', width: "100%", borderRadius: 8, margin: '1px', fontSize: '2vh', height: 40, }}
                            type="primary"
                            loading={loading}
                            onClick={() => {
                                setVisibleWaste(true)
                            }}
                        >{t(`${lang}.set_ng`)}</Button>
                        <Button
                            // icon={<SettingOutlined />}
                            style={{ textTransform: 'uppercase', width: "100%", borderRadius: 8, margin: '1px', fontSize: '2vh', height: 40, }}
                            type="primary"
                            loading={loading}
                            onClick={() => {
                                setVisibleProduct(dataInit)
                            }}
                        >{t(`${lang}.edit_pr`)}</Button>
                        <Button
                            // icon={<SwapOutlined />}
                            style={{ textTransform: 'uppercase', width: "100%", borderRadius: 8, margin: '1px', fontSize: '2vh', height: 40, }}
                            type="primary"
                            loading={loading}
                            onClick={() => {
                                setVisibleEditProduct(dataInit)
                            }}
                        >{t(`${lang}.change_pr`)}</Button>
                    </div>
                </Col>
            </Row>
        </div >
    )

}

const ModalChangeWaste = ({ visible, onCancel, onSubmit }) => {
    const [ng, setNG] = React.useState(0);
    const [shift, setShift] = React.useState("")
    const handleChange = (val) => {
        setShift(val)
    }
    const _handleSubmit = () => {
        console.log("---", {
            'ng': ng,
            'shift': shift
        });
        setNG(0);
        setShift("")
        onSubmit({
            'ng': ng,
            'shift': shift
        })
        onCancel()
    }
    return (
        <Modal title="Phế phẩm" width={500} footer={null} visible={!!visible} onCancel={onCancel}>
            <div>
                <div>
                    <span style={{ marginRight: '40px', marginLeft: '30px' }}>Phế phẩm:</span>
                    <InitNum step={0.1} style={{ width: 130, marginRight: 170, textAlign: 'right', marginLeft: 'auto', marginTop: 5, marginBottom: 4 }}
                        value={ng} onChange={setNG} />

                </div>
                <div>
                    <span style={{ marginRight: '50px', marginLeft: '30px' }}>Chọn ca:</span>
                    <Select onChange={handleChange} defaultValue="before" style={{ width: 130 }}>
                        <Select.Option value="before">Ca Trước</Select.Option>
                        <Select.Option value="current">Ca hiện tại</Select.Option>
                    </Select>
                </div>

                <Button type="primary" onClick={_handleSubmit} style={{ marginLeft: '30px', marginTop: '20px' }}>Submit</Button>
            </div>
        </Modal>
    )
}

const ModalChangeProduct = ({ visible, onCancel, onSubmit, machine_id }) => {
    const { t } = useTranslation();
    const [dataProductions, setDataProductions] = useState([{
        // product_name: ''
    }]);
    const [showStartChangeMold, setShowStartChangeMold] = useState(true)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        try {
            if (visible && visible.production && visible.production.data_product) {
                const dataProd = JSON.parse(visible.production.data_product)
                setDataProductions(JSON.parse(visible.production.data_product))
                _handleGetLatestStatusChangeMold();
            }

        } catch (err) {

        }
    }, [visible]);

    const _handleGetLatestStatusChangeMold = async () => {
        try {
            setLoading(true)
            const { data } = await apiClient.get('time_change_mold', {
                machine_id: machine_id,
                status: 'Processing'
            })
            setShowStartChangeMold(_.isEmpty(data?.data))
            setLoading(false)
        } catch (err) {
            setLoading(false)
        }
    }
    const _handleOnChange = (type, val, index) => {
        if (!dataProductions[index]) {
            dataProductions[index] = {};
        }
        if (type === 'product_name') {
            const data = get(visible, 'product').find(i => i.name === val)
            if (!data) return 1;

            dataProductions[index]['cavity'] = data.cavity
            dataProductions[index]['cycle_time'] = data.cycle_time
            dataProductions[index]['product_name'] = val
            dataProductions[index]['id'] = data.id
        } else {
            dataProductions[index][type] = val;
        }
        setDataProductions([...dataProductions])
    }
    const _handleSubmit = () => {
        if (dataProductions.length > 0 && dataProductions[0].product_name) {
            onSubmit({
                datas: dataProductions,
            });
            // const isConfirm = window.confirm("Đổi sản phẩm và thay khuôn?")
            // if (!isConfirm) return false;
            // const dataBody = dataProductions.map(i => ({
            //     "product_name": i.product_name,
            //     "machine_id": machine_id,
            //     time: moment().unix(),
            //     "status": "Start"
            // }));
            // apiClient.patch('/time_change_mold', dataBody[0])
            //     .then(() => {
            //         openNotificationWithIcon("success", "Change mold success")
            //         onSubmit({
            //             datas: dataProductions,
            //         });
            //         _handleGetLatestStatusChangeMold()
            //     })
            //     .catch(err => {
            //         openNotificationWithIcon("error", "Change mold error")
            //     })


            // onCancel()
        } else {
            alert("Please fill data!")
        }
    }

    const _handleStop = () => {
        const dataBody = dataProductions.map(i => ({
            "product_name": i.product_name,
            "machine_id": machine_id,
            time: moment().unix(),
            "status": "End"
        }));
        apiClient.patch('/time_change_mold', dataBody[0])
            .then(() => {
                openNotificationWithIcon("success", "Change mold success")
                _handleGetLatestStatusChangeMold()
            })
            .catch(err => {
                openNotificationWithIcon("error", "Change mold error")
            })
    }
    return (
        <Drawer title={t(`machine.change_pr`)} width={450} footer={null} visible={!!visible} onClose={!showStartChangeMold ? () => {
            const isConfirm = window.confirm("Chưa kết thúc thay khuôn?")
            if (!isConfirm) return false;
            onCancel()
        } : onCancel}>
            {/* dnd */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {/* {showStartChangeMold ?
                    <Button loading={loading} type="primary" style={{}} onClick={_handleSubmit}>{t(`machine.change_pr`)}</Button> :
                    <Button loading={loading} type="danger" style={{ margin: '0px 3px' }} onClick={_handleStop}>{t(`machine.stop_change_mold`)}</Button>
                } */}
                <Button loading={loading} type="primary" style={{}} onClick={_handleSubmit}>{t(`machine.change_pr`)}</Button>
                <Button onClick={() => {
                    // history.push('/change-mold-realtime')
                    window.open('/change-mold-realtime', '_blank')
                }} style={{ marginLeft: 8 }}>View</Button>
            </div>
            <div style={{ clear: 'right' }} />
            {showStartChangeMold ?
                <div>
                    <div>
                        <span>Danh sách sản phẩm: </span>
                        <PlusCircleFilled onClick={() => {
                            setDataProductions([...dataProductions, {}])
                        }} style={{ marginLeft: 20 }} />
                    </div>
                    {dataProductions.map((value, index) => {
                        return (
                            <div style={{ border: '1px solid #ddd', padding: 10, margin: 5, borderRadius: 10, position: 'relative' }}>
                                <div style={{ marginRight: '5px', display: 'flex', marginBottom: 10, marginTop: 10 }}>
                                    <label style={{ width: 90 }}>Product:</label>
                                    <Select value={get(value, 'product_name')}
                                        style={{ width: 200, marginRight: '5px' }}
                                        placeholder="Select product"
                                        showSearch
                                        onChange={(val) => _handleOnChange('product_name', val, index)}
                                    >
                                        {get(visible, 'product') ? visible.product
                                            .map(val => <Select.Option key={val.name} value={val.name}>{val.name}</Select.Option>) : null}
                                    </Select>
                                </div>
                                <div style={{ marginRight: '5px', display: 'flex', marginBottom: 10 }}>
                                    <label style={{ width: 90 }}>Cavity:</label>
                                    <Input style={{ width: 200, }} value={value.cavity}

                                        onChange={(e) => {
                                            _handleOnChange('cavity', e.target.value, index)
                                        }} />
                                </div>
                                <div style={{ marginRight: '5px', display: 'flex', marginBottom: 20 }}>
                                    <label style={{ width: 90 }}>CycleTime:</label>
                                    <Input style={{ width: 200, }} value={value.cycle_time} onChange={(e) =>
                                        _handleOnChange('cycle_time', e.target.value, index)
                                    } />
                                </div>
                                {/*  */}
                                <div style={{ position: 'absolute', top: -10, right: -5 }}>
                                    <CloseCircleOutlined onClick={() => {
                                        dataProductions.splice(index, 1)
                                        setDataProductions([...dataProductions])
                                    }} style={{ color: 'red' }} />
                                </div>
                            </div>
                        )
                    })}
                </div> : <div>

                    {dataProductions.map((value, index) => {
                        return (
                            <div key={index + ''}>
                                <div style={{ marginRight: '5px', display: 'flex', marginTop: 5 }}><label style={{ width: 90, fontWeight: '600' }}>Product</label>: {get(value, 'product_name')} </div>
                                <div style={{ marginRight: '5px', display: 'flex', marginTop: 5 }}><label style={{ width: 90, fontWeight: '600' }}>Cavity</label>:   {get(value, 'cavity')} </div>
                                <div style={{ marginRight: '5px', display: 'flex', marginTop: 5 }}><label style={{ width: 90, fontWeight: '600' }}>CycleTime</label>:   {get(value, 'cycle_time')} </div>
                            </div>
                        )
                    })
                    }
                </div>}


        </Drawer>
    )
}

const ModalEditProduct = ({ loading, visible, onCancel, onSubmit }) => {
    const { t } = useTranslation();

    //     "staff_id" : "cong",
    //     "group_id" : "A"
    const [staff_id, set_staff_id] = useState("");
    const [group_id, set_group_id] = useState("");
    // 
    const [dataProductions, setDataProductions] = useState([{
        "product_name": "",
        //             "cavity" : 2,
        //             "cycle_time" : 60
    }]);

    const [listStaff, setListStaff] = useState([]);
    useEffect(() => {
        try {
            if (visible && visible?.production) {
                const dataInit = JSON.parse(visible.production.data_product);
                setDataProductions(dataInit);

                setListStaff((prev) => {
                    const dataStaff = visible.staff.filter(i => i.group_id == get(visible, 'production.group_id'))
                    const listData = dataStaff.map(i => ({ value: i.name, id: i.id }))
                    console.log('listData', listData)
                    return listData
                })

                set_group_id(get(visible, 'production.group_id') + '')
                set_staff_id(get(visible, 'production.staff_id') + '')

            }
        } catch (err) {

        }
    }, [visible])


    // "product_name" : "321170",
    // "cavity" : 2,
    // "cycle_time" : 60
    const _handleOnChange = (type, val, index) => {
        if (type === 'product_name') {
            const data = get(visible, 'product').find(i => i.name === val);
            const dataProd = dataProductions[index];
            dataProd.product_name = val;
            dataProd.id = data.id;

            dataProd.cavity = data.cavity;
            dataProd.cycle_time = data.cycle_time;
            setDataProductions([...dataProductions])
        } else {
            const dataProd = dataProductions[index];
            dataProd[type] = val;
            setDataProductions([...dataProductions])
        }
    }
    const _handleSubmit = () => {
        if (_.uniqBy(dataProductions, 'product_name').length !== dataProductions.length) {
            alert("Trùng sản phẩm vui lòng kiểm tra lại");
            return 1;
        }
        const dataSubmit = {
            staff_id, group_id,
            datas: dataProductions
        };

        onSubmit(dataSubmit);
    }
    return (
        <Drawer title={t(`${lang}.edit_pr`)} footer={null} visible={!!visible} onClose={onCancel} width={450}>

            <Button loading={loading} type="primary" onClick={_handleSubmit} style={{ float: 'right' }}>Submit</Button>
            <div style={{ clear: 'right' }} />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ marginBottom: '5px', }}>Chọn nhóm nhân viên</div>
                    <Select value={group_id}
                        style={{ width: 300, marginBottom: 15 }}
                        placeholder="Select group staff"
                        showSearch
                        onChange={(val) => {
                            setListStaff((prev) => {
                                const dataStaff = visible.staff.filter(i => i.group_id == val)
                                const listData = dataStaff.map(i => ({ value: i.name, id: i.id }))
                                return listData
                            })
                            set_group_id(val)
                        }}
                    >
                        {get(visible, 'group_staff') ? visible.group_staff
                            .map(val => <Select.Option key={val.name} value={val.id + ''}>{val.name}</Select.Option>) :
                            null}
                    </Select>
                </div>
                <div>
                    <div style={{ marginBottom: '5px', }}>Chọn nhân viên</div>
                    <Select value={staff_id + ''}
                        style={{ width: 300, marginBottom: 15 }} onChange={val => set_staff_id(val)}>
                        {listStaff.map(i => <Select.Option value={i.id + ''}>{i.value}</Select.Option>)}
                    </Select>
                </div>

                <div style={{ marginBottom: '5px', }}>
                    Danh sách sản phẩm
                    <PlusCircleFilled onClick={() => {
                        setDataProductions([...dataProductions, {}])
                    }} style={{ marginLeft: 20 }} />
                </div>
                {
                    dataProductions.map((prod, index) => {
                        return (
                            <div style={{ border: '1px solid #ddd', padding: 10, margin: 5, borderRadius: 10, position: 'relative' }}>
                                <div>
                                    <div style={{ marginBottom: '5px', }}>
                                        Tên sản phẩm:
                                    </div>
                                    <Select value={get(prod, 'product_name')}
                                        style={{ width: 300, marginBottom: 15 }}
                                        placeholder="Select product"
                                        showSearch
                                        onChange={(val) => _handleOnChange('product_name', val, index)}
                                    >
                                        {get(visible, 'product') ? visible.product
                                            .map(val => <Select.Option key={val.name} value={val.name}>{val.name}</Select.Option>) : null}
                                    </Select>
                                </div>
                                <div>
                                    <div>Cavity:</div>
                                    <Input style={{ width: 300, marginTop: 5 }} value={prod.cavity}
                                        onChange={(e) => _handleOnChange('cavity', e.target.value, index)} />
                                </div>
                                <div style={{ marginTop: 10 }}>
                                    <div>CycleTime:</div>
                                    <Input style={{ width: 300, marginTop: 5, marginBottom: 10 }}
                                        value={prod.cycle_time}
                                        onChange={(e) => _handleOnChange('cycle_time', e.target.value, index)} />
                                </div>
                                <div style={{ position: 'absolute', top: -10, right: -5 }}>
                                    <CloseCircleOutlined onClick={() => {
                                        dataProductions.splice(index, 1)
                                        console.log('dataProductions', dataProductions);
                                        setDataProductions([...dataProductions])
                                    }} style={{ color: 'red' }} />
                                </div>
                            </div>
                        )

                    })
                }
            </div>
        </Drawer>
    )
}

const InitNum = styled(InputNumber)`
    .ant-input-number-input {
        text-align: center
    }
`
export default App;