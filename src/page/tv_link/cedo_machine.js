import { RollbackOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Input, message, Row, Select, Skeleton } from 'antd';
import { apiClient } from 'helper/request/api_client';
import { handleErr } from 'helper/request/handle_err_request';
import { get } from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { SRC_REALTIME } from '_config/storage_key';
import { getGrafana } from './service';



const pre1D = moment().subtract(7, 'd').valueOf();
const now = moment().valueOf();

const GrafanaMachine = ({ visible, setVisible, input = "" }) => {
    const [area, setArea] = useState('')
    const [line, setLine] = useState('')
    const [machine, setMachine] = useState('')
    const [product, setProduct] = useState('');
    const [showStatistic, setShowStatistic] = useState(false)
    const User = useSelector(state => get(state, 'app.user', {}));

    const [listProduct, setListProduct] = useState([]);
    const [dateEnterprise, setDataEnterprise] = useState(null);
    // 
    const [srcRealtime, setSrcRealTime] = useState("")
    const [showSrc, setShowSrc] = React.useState(false)

    const [timestamp, setTimestamp] = useState({
        from: pre1D,
        to: now,
    })
    React.useEffect(() => {
        setTimestamp({
            from: moment().valueOf() - 7 * 24 * 60 * 60 * 1000,
            to: moment().valueOf()
        })
        setSrcRealTime(localStorage.getItem(SRC_REALTIME) || srcRealtime)
        requestInitData();
    }, []);
    React.useEffect(() => {
        if (machine) {
            apiClient.get(`/product/production?machine_id=${machine}`)
                .then(({ data }) => {
                    setListProduct(data)
                    setProduct(data[0].name)
                })
                .catch(err => {
                    handleErr(err)
                })
        }

    }, [machine])

    const requestInitData = async () => {
        const { data } = await getGrafana({
            name: input || "statistic"
        })
        setSrcRealTime(data.url)
        apiClient.get('/enterprise/detail?id=ENTERPRISE_01')
            .then(({ data }) => {
                const dataConvert = {}
                get(data, 'areas', []).map((area, indexArea) => {
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
                    area.lines.map(l => {
                        dataConvert[area.id][l.id] = l.machines
                    })
                })
                setDataEnterprise(dataConvert)
                console.log('dataConvert', dataConvert)
            })
            .catch(err => {
                handleErr(err)
                // alert(JSON.stringify(err))
            })
    }
    const { TextArea } = Input;
    const onFinish = (val) => {
        console.log("val", val);
        setSrcRealTime(val.src)
        localStorage.setItem(SRC_REALTIME, val.src)
        setShowSrc(false)
    };

    const onFinishFailed = () => {
        message.error('Submit failed!');
    };
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
    if (!dateEnterprise) return <Skeleton />

    return <div style={{ position: 'relative', width: '100vw', height: '100vh', overflowY: 'scroll' }}>
        {/* <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
            <Button
                onClick={() => setVisible(null)}
                icon={<RollbackOutlined />}
                type="primary"
                shape="circle"
                size="large"
            />
        </div> */}

        <div style={{ backgroundColor: '#ffffff' }}>
            <Row gutter={[0, { xs: 8, sm: 8, md: 8, lg: 8 }]} style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10 }}>
                <Col xs={20} sm={20} md={20} lg={20} xl={15} xxl={15} style={{ display: 'flex', alignItems: 'center' }}>
                    
                        <div style={{ padding: '5px 10px', background: '#fff', borderRadius: 5, border: '1px solid #ddd', marginLeft: 15 }}>
                            <span style={{ color: '#6e9fff', fontWeight: '600', textTransform: 'uppercase' }}>Area</span>
                        </div>
                        <Select value={area} style={{ width: 100, borderRadius: 5, marginLeft: 4, marginRight: 15 }} onChange={setArea}>
                            {Object.keys(dateEnterprise).map(areaId => <Select.Option value={areaId}>{areaId}</Select.Option>)}
                        </Select>
                  
                        <div style={{ padding: '5px 10px', background: '#fff', borderRadius: 5, border: '1px solid #ddd', }}>
                            <span style={{ color: '#6e9fff', fontWeight: '600', textTransform: 'uppercase' }}>Line</span>
                        </div>
                        <Select value={line} style={{ width: 100, borderRadius: 5, marginLeft: 4, marginRight: 15 }} onChange={setLine}>
                            {Object.keys(get(dateEnterprise, `${area}`, {})).map(lineID => <Select.Option value={lineID}>{lineID}</Select.Option>)}
                        </Select>

                        <div style={{ padding: '5px 10px', background: '#fff', borderRadius: 5, border: '1px solid #ddd', }}>
                            <span style={{ color: '#6e9fff', fontWeight: '600', textTransform: 'uppercase' }}>Machine</span>
                        </div>
                        <Select value={machine} style={{ width: 100, borderRadius: 5, marginLeft: 4, marginRight: 15 }} onChange={setMachine}>
                            {get(dateEnterprise, `${area}.${line}`, {}).map(machine => <Select.Option value={machine.id}>{machine.id}</Select.Option>)}
                        </Select>

                        {/* <div style={{ padding: '5px 10px', background: '#fff', borderRadius: 5, border: '1px solid #ddd', }}>
                            <span style={{ color: '#6e9fff', fontWeight: '600', textTransform: 'uppercase' }}>Product</span>
                        </div>
                        <Select value={product} style={{ width: 100, borderRadius: 5, marginLeft: 4, marginRight: 15 }} onChange={setProduct}>
                            {listProduct.map(pro => <Select.Option value={pro.name}>{pro.name}</Select.Option>)}
                        </Select> */}
                    {/* </>
                    } */}
                </Col>
                {/* <Col xs={20} sm={20} md={20} lg={20} xl={8} xxl={8} style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', marginRight: 10 }}>
                        <DatePicker.RangePicker
                            style={{ marginRight: '10px' }}
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            value={[moment(timestamp.from), moment(timestamp.to)]}
                            onChange={val => {
                                // console.log("aaaaaaaa", val);
                                // console.log("bbbbbbbb", {
                                //     from: val[0].valueOf(),
                                //     to: val[1].valueOf()
                                // });
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
                </Col> */}
            </Row>
        </div>

        <iframe
            src={`https://dashboard.quantrisanxuat.info/d/FsfXVE2nk/cedo-machine-detail?orgId=2&refresh=30s&theme=light&from=${timestamp.from}&to=${timestamp.to}&var-ENTERPRISE=${User.enterprise_id}&var-AREA=${area}&var-LINE=${line}&var-MACHINE=${machine}&var-PRODUCT=${product}&kiosk`}
            width="100%"
            height="100%"
            frameBorder="0"
            title="full screen page"
        />
    </div>
}

export default GrafanaMachine