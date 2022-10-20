import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { InputNumber, Button, Table, Modal, Select, Skeleton, Drawer, Popover, Input, message, Space, Form, TextAre, Pagination } from 'antd';
import { ReloadOutlined, SettingOutlined } from '@ant-design/icons';

import { openNotificationWithIcon } from 'helper/request/notification_antd';
import { apiClient } from 'helper/request/api_client';
import { SRC_PRODUCT } from '_config/storage_key';
import './index.css'
import { getDataTable, getGrafana, updateDowntime, updateNG, updateReasonCode } from './service';
import { handleErr } from 'helper/request/handle_err_request';
import { get } from 'lodash';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const h8 = moment().set('hour', 8).set('minute', 0).valueOf();
const h20 = moment().set('hour', 20).set('minute', 0).valueOf();
const h20p = moment().set('hour', 20).subtract(1, 'd').set('minute', 0).valueOf();
const h8n = moment().add(1, 'd').set('hour', 8).set('minute', 0).valueOf();

const App = () => {
    const [timestamp, setTimestamp] = React.useState({
        from: h8,
        to: h20,
    });
    const [area, setArea] = useState('')
    const [line, setLine] = useState('')
    const [machine, setMachine] = useState('')
    const [timeLoop, setTimeLoop] = useState(30);

    const User = useSelector(state => get(state, 'app.user', {}));

    const [dateEnterprise, setDataEnterprise] = useState(null);

    const [srcMachine, setSrcMachine] = useState("")
    const [showSrc, setShowSrc] = React.useState(false)
    const [loading, setLoading] = React.useState(false);

    const _requestData = async () => {
        try {
            const { data: url } = await getGrafana({
                name: "power_statistic"
            })
            setSrcMachine(url?.url)
            const { data } = await apiClient.get('/enterprise/detail?id=ENTERPRISE_01')
            const dataConvert = {}
            data.areas.map((area, indexArea) => {
                if (!indexArea && area.id) {
                    setArea(area.id);
                    if (get(area, 'lines[0].id')) {
                        setLine(get(area, 'lines[0].id'))
                        if (get(area, 'lines[0].machines[0].id')) {
                            setMachine(get(area, 'lines[0].machines[0].id'))
                        }
                    }
                }
                dataConvert[area.id] = {};
                area.lines.map((l, lIndex) => {
                    dataConvert[area.id][l.id] = l.machines
                })
            })
            setDataEnterprise(dataConvert)
            console.log('dataConvert', dataConvert)
        } catch (error) {
            handleErr(error)
            console.log("err", error);
        }
    }

    const { TextArea } = Input;
    const onFinish = (val) => {
        console.log("val", val);
        setSrcMachine(val.src)
        localStorage.setItem(SRC_PRODUCT, val.src)
        setShowSrc(false)
    };

    const onFinishFailed = () => {
        message.error('Submit failed!');
    };

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


    return (
        <div style={{ padding: 15, height: 'calc(100vh - 50px)', overflow: 'scroll', marginTop: -5 }}>
            <div
                style={{ position: 'fixed', bottom: 5, right: 10, display: 'flex', marginRight: "56px", zIndex: "5" }}
            >
                <ButtonSetting handleSetting={() => { setShowSrc(true) }}>
                    <SettingOutlined />
                </ButtonSetting>
                <Drawer title={false} width={500} visible={showSrc} onClose={() => setShowSrc(false)} >
                    <div className='title'>Giám sát máy</div>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ "src": srcMachine }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item>
                            <HeaderForm />
                        </Form.Item>
                        <Form.Item
                            name="src"
                            style={{ width: "465px" }}
                        >
                            <TextArea rows={2} />
                        </Form.Item>
                    </Form>
                </Drawer>
            </div>
            {dateEnterprise &&
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ padding: '5px 10px', background: '#eee', border: 5, }}>
                            <span style={{ color: '#6e9fff' }}>Area</span>
                        </div>
                        <Select value={area} style={{ width: 150, marginLeft: 4, marginRight: 15 }} onChange={setArea}>
                            {dateEnterprise && Object.keys(dateEnterprise).map(areaId => <Select.Option key={areaId} value={areaId}>{areaId}</Select.Option>)}
                        </Select>
                        <div style={{ padding: '5px 10px', background: '#eee', border: 5, }}>
                            <span style={{ color: '#6e9fff' }}>Line</span>
                        </div>
                        <Select value={line} style={{ width: 150, marginLeft: 4, marginRight: 15 }} onChange={setLine}>
                            {dateEnterprise && Object.keys(get(dateEnterprise, `${area}`, [])).map(lineID => <Select.Option key={lineID} value={lineID}>{lineID}</Select.Option>)}
                        </Select>
                        <div style={{ padding: '5px 10px', background: '#eee', border: 5, }}>
                            <span style={{ color: '#6e9fff' }}>Machine</span>
                        </div>
                        <Select value={machine} style={{ width: 150, marginLeft: 4, marginRight: 15 }} onChange={setMachine}>
                            {dateEnterprise && get(dateEnterprise, `${area}.${line}`, []).map(machine => <Select.Option key={machine.id} value={machine.id}>{machine.id}</Select.Option>)}
                        </Select>
                    </div>
                    <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                        <div style={{ padding: '8px 10px', background: '#eee', border: 5, display: 'flex', alignItems: 'center' }}>
                            <ReloadOutlined />
                        </div>
                        <Select value={timeLoop} style={{ width: 100, marginRight: 15 }} onChange={setTimeLoop}>
                            {[10, 20, 30, 40, 50, 60].map(time => <Select.Option key={time} value={time}>{time} S</Select.Option>)}
                        </Select>
                    </div>
                </div>
            }
            <div>
                <div style={{}}>
                    <div style={{height: '90vh' }}>
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
            </div>
        </div>
    )
};

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


const ButtonSetting = ({ handleSetting = () => { }, children }) => {
    return (
        <Popover title="setting" >
            <div
                onClick={handleSetting}
                style={{
                    height: 50,
                    width: 50,
                    background: '#ddd',
                    color: '#000',
                    borderRadius: '50%',
                    opacity: '0.7',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 12,
                    cursor: 'pointer',
                }}
            >
                {children}
            </div>
        </Popover>
    )
}

var toHHMMSS = (secs) => {
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return `${hours > 9 ? '' : `0`}${hours}:${minutes > 9 ? '' : `0`}${minutes}:${seconds > 9 ? '' : `0`}${seconds}`
}
const column = [
    {
        title: "Mã",
        dataIndex: "id",
        width: 80,
    },
    {
        title: "Thời gian",
        dataIndex: "timestamp",
        width: 200,
        render: val => <span>{moment(val * 1000).format("hh:mm:ss DD/MM/YYYY")}</span>
    },
    {
        title: "Khoảng thời gian",
        dataIndex: "duration",
        render: val => <span>{toHHMMSS(val)}</span>
    },
    {
        title: "Trạng thái",
        dataIndex: "status"
    },
    {
        title: "Mã máy",
        dataIndex: "machine_id"
    },
    {
        title: "Mã lỗi",
        dataIndex: "reason_code"
    },
]

export default App;