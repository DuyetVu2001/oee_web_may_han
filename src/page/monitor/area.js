import React, { useEffect, useState } from 'react';
import { InputNumber, Button, Table, Modal, Select, Skeleton, Drawer, Popover, Input, message, Space, Form, TextAre } from 'antd';
import moment from 'moment';
import { get } from 'lodash';
import { ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { apiClient } from 'helper/request/api_client';
import { handleErr } from 'helper/request/handle_err_request';
import { SRC_MACHINE } from '_config/storage_key';
import TextArea from 'antd/lib/input/TextArea';
import './index.css'
import { getGrafana, getGrafanaArea } from './service';

const h8 = moment().set('hour', 8).set('minute', 0).valueOf();
const h20 = moment().set('hour', 20).set('minute', 0).valueOf();
const h20p = moment().set('hour', 20).subtract(1, 'd').set('minute', 0).valueOf();
const h8n = moment().add(1, 'd').set('hour', 8).set('minute', 0).valueOf();
const App = () => {
    const [area, setArea] = useState('AREA_01')
    const [line, setLine] = useState('LINE_01')
    const [machine, setMachine] = useState('HPE1')
    const [dateEnterprise, setDataEnterprise] = useState(null);
    // 
    const [timeLoop, setTimeLoop] = useState(30);
    //
    const [showSrc, setShowSrc] = React.useState(false)
    const [srcArea, setSrcArea] = useState("");
    //
    const [timestamp, setTimestamp] = useState({
        from: h8,
        to: h20,
    })
    console.log('machine', machine);
    const [loading, setLoading] = React.useState(false);


    React.useEffect(() => {
        setSrcArea(localStorage.getItem(SRC_MACHINE) || srcArea)
        requestInitData();
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

    const requestInitData = async () => {
        // setLoading(true)
        const { data } = await getGrafana({
            name: "area"
        })
        setSrcArea(data?.url)
        // console.log("acaca" , data);
        apiClient.get('/enterprise/detail?id=ENTERPRISE_01')
            .then(({ data }) => {
                const dataConvert = {}
                data.areas.map(area => {
                    dataConvert[area.id] = {};
                    area.lines.map(l => {
                        dataConvert[area.id][l.id] = l.machines
                    })
                })
                setDataEnterprise(dataConvert)
                console.log('dataConvert', dataConvert)
            })
            .catch(err => {
                handleErr(err);
            })
    }
    const { TextArea } = Input;
    const onFinish = (val) => {
        console.log("val", val);
        setSrcArea(val.src)
        localStorage.setItem(SRC_MACHINE, val.src)
        setShowSrc(false)
    };

    const onFinishFailed = () => {
        message.error('Submit failed!');
    };
    console.log('srcArea123', srcArea);
    if (!dateEnterprise) return <Skeleton />
    return (

        <div style={{ height: 'calc(100vh - 80px)', overflowY: 'scroll' }}>
            <div
                style={{ position: 'fixed', bottom: 5, right: 10, display: 'flex', marginRight: "56px", zIndex: "5" }}
            >
                {/* <ButtonSetting handleSetting={() => { setShowSrc(true) }}>
                    <SettingOutlined />
                </ButtonSetting> */}
                <Drawer title={false} width={500} visible={showSrc} onClose={() => setShowSrc(false)} >
                    <div className='title' >Giám sát khu vực</div>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 8 }}
                        initialValues={{ "src": srcArea }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"

                    >
                        <Form.Item>
                            <HeaderForm />
                        </Form.Item>
                        <Form.Item
                            name="src"
                        >
                            <TextArea rows={2} value={srcArea} />
                        </Form.Item>
                        {/* <Form.Item wrapperCol={{ span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item> */}
                    </Form>
                </Drawer>
            </div>
            {/* <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ padding: '5px 10px', background: '#eee', border: 5, }}>
                        <span style={{ color: '#6e9fff' }}>Area</span>
                    </div>
                    <Select value={area} style={{ width: 100, marginLeft: 4, marginRight: 15 }} onChange={setArea}>
                        {Object.keys(dateEnterprise).map(areaId => <Select.Option key={areaId} value={areaId}>{areaId}</Select.Option>)}
                    </Select>
                    <div style={{ padding: '5px 10px', background: '#eee', border: 5, }}>
                        <span style={{ color: '#6e9fff' }}>Line</span>
                    </div>
                    <Select value={line} style={{ width: 100, marginLeft: 4, marginRight: 15 }} onChange={setLine}>
                        {Object.keys(get(dateEnterprise, `${area}`, {})).map(lineID => <Select.Option key={lineID} value={lineID}>{lineID}</Select.Option>)}
                    </Select>
                    <div style={{ padding: '5px 10px', background: '#eee', border: 5, }}>
                        <span style={{ color: '#6e9fff' }}>Machine</span>
                    </div>
                    <Select value={machine} style={{ width: 100, marginLeft: 4, marginRight: 15 }} onChange={setMachine}>
                        {get(dateEnterprise, `${area}.${line}`, {}).map(machine => <Select.Option key={machine.id} value={machine.id}>{machine.id}</Select.Option>)}
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
            </div> */}
            <div>
                <div style={{ minHeight: 410, height: '100vh' }}>
                    <div style={{ minHeight: 410, height: '100vh' }}>
                        <iframe
                            src={`${srcArea}&refresh=${timeLoop}s&from=${timestamp.from}&to=${timestamp.to}&theme=light&kiosk`}
                            width="100%" height="100%"
                            frameBorder="0"></iframe>
                    </div>
                    {loading ? <div style={{ background: '#fff', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                        <Skeleton />
                    </div> : null}
                </div>

                {/* <div>
                    <TableFooter timeLoop={timeLoop} machine={machine} />
                </div> */}
            </div>
        </div>
    )
};

const InitNum = styled(InputNumber)`
    .ant-input-number-input {
        text-align: center
    }
`
// id: 12250,
// timestamp: 1639530425,
// status: 2,
// machine_id: "HPE1",
// reason_code: 0,
// duration: 522
var toHHMMSS = (secs) => {
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return `${hours > 9 ? '' : `0`}${hours}:${minutes > 9 ? '' : `0`}${minutes}:${seconds > 9 ? '' : `0`}${seconds}`
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