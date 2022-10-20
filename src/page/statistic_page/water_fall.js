import {
    Button, DatePicker, Drawer, Select, Skeleton, Form, Input,
    Tabs, message, Popover, Breadcrumb, AutoComplete, Tooltip, Row, Col
} from 'antd';
import { BarChartOutlined, HomeOutlined, RetweetOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
// COMPONENT
import InApp from 'com/in_app_layout';
import { apiClient } from 'helper/request/api_client';
import { handleErr } from 'helper/request/handle_err_request';
import _, { get } from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';
import { SRC_MACHINE, SRC_REALTIME } from '_config/storage_key';
import './index.css'
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import styled from 'styled-components';
import { getGrafana } from 'page/monitor/service';
import Chart from './com/waterfall'
import axios from 'axios';
import { FilterMachine } from 'com/filter_machine';

const { RangePicker } = DatePicker;


const pre1D = moment().subtract(1, 'd').valueOf();
const now = moment().valueOf();
// &var-ENTERPRISE=${User.enterprise_id}&var-AREA=AREA_01&var-LINE=LI NE_01&var-MACHINE=HPE2&from=1639614593780&to=1639636193780&theme=light&panelId=10"

const App = ({ input, showMachine, Com }) => {
    const { t } = useTranslation();
    // 
    const [srcRealtime, setSrcRealTime] = useState("")
    const [showSrc, setShowSrc] = React.useState(false)
    const [showStatistic, setShowStatistic] = useState(false)


    const [timestamp, setTimestamp] = useState({
        from: pre1D,
        to: now,
    })
    const [loading, setLoading] = React.useState(false);


    const [filterMachine, setFilterMachine] = useState({});

    const { area, line, machine } = filterMachine;

    React.useEffect(() => {
        requestInitData();
    }, []);

    const requestInitData = async () => {
        const { data } = await getGrafana({
            name: input || "statistic"
        })
        setSrcRealTime(_.get(data, `url`))
    }
    const option = [
        {
            value: 5 * 60 * 1000,
            title: 'Last 5 minutes'
        },
        {
            value: 15 * 60 * 1000,
            title: 'Last 15 minutes'
        },
        {
            value: 30 * 60 * 1000,
            title: 'Last 30 minutes'
        },
        {
            value: 60 * 60 * 1000,
            title: 'Last 1 hour'
        },
        {
            value: 3 * 60 * 60 * 1000,
            title: 'Last 3 hour'
        },
        {
            value: 6 * 60 * 60 * 1000,
            title: 'Last 6 hour'
        },
        {
            value: 12 * 60 * 60 * 1000,
            title: 'Last 12 hour'
        },
        {
            value: 24 * 60 * 60 * 1000,
            title: 'Last 1 days'
        },
        {
            value: 2 * 24 * 60 * 60 * 1000,
            title: 'Last 2 days'
        },
        {
            value: 7 * 24 * 60 * 60 * 1000,
            title: 'Last 7 days'
        },
        {
            value: 30 * 24 * 60 * 60 * 1000,
            title: 'Last 30 days'
        },
        {
            value: 90 * 24 * 60 * 60 * 1000,
            title: 'Last 90 days'
        }
    ]

    function onChange(value) {
        console.log(`selected ${value}`);
        setTimestamp({
            from: moment().valueOf() - value,
            to: moment().valueOf()
        })
    }

    function onSearch(val) {
        console.log('search:', val);
    }
    return (
        <div className="card-container">
            <Tabs
                tabBarStyle={{ background: '#fafafa' }} size="middle" type="card">

                <Tabs.TabPane tab={t('statistic.chart')} key={'1'}>
                    <div style={{ height: 'calc(100vh - 10px)', overflowY: 'scroll' }}>
                        <Row gutter={[0, { xs: 8, sm: 8, md: 8, lg: 8 }]} style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 10, marginBottom: 10 }}>
                            <FilterMachine onChange={setFilterMachine} />
                            <Col xs={20} sm={20} md={20} lg={20} xl={10} xxl={10} style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', marginRight: 10 }}>
                                <RangePicker
                                    style={{ marginRight: '10px' }}
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    onChange={val => {
                                        console.log("aaaaaaaa", val);
                                        console.log("bbbbbbbb", {
                                            from: val[0].valueOf(),
                                            to: val[1].valueOf()
                                        });
                                        if (val && val[0]) {
                                            setTimestamp({
                                                from: val[0].valueOf(),
                                                to: val[1].valueOf()
                                            })
                                        }
                                    }} />
                                <Select
                                    style={{ marginLeft: '10px', width: 120 }}
                                    allowClear
                                    showSearch
                                    placeholder="Quick select"
                                    onChange={onChange}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {option.map(i => <Select.Option value={i.value}>{i.title}</Select.Option>)}
                                </Select>
                            </Col>
                        </Row>
                        <div style={{ height: 'calc(100vh - 60px)' }}>
                            <Chart dataFilter={{
                                machine_id: machine,
                                from: Math.ceil(timestamp.from / 1000),
                                to: Math.ceil(timestamp.to / 1000),
                            }} />
                        </div>
                        {loading ? <div style={{ background: '#fff', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                            <Skeleton />
                        </div> : null}
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab={t('statistic.table')} key={'2'}>
                    <div style={{ height: '100vh' }}>
                        <Com hideMachine={() => { setShowStatistic(false) }} />
                    </div>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
};


export default App;

const HeaderForm = ({ loading = false, _onClose = () => { } }) => {
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
