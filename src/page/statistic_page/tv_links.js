import React, { useEffect } from 'react';
import {
    HomeOutlined,
    RollbackOutlined,
    UserOutlined,
    BarChartOutlined,
    RetweetOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import {
    Breadcrumb, Button, Col, Tabs,
    Input, message, Popover, Row, Tooltip, Skeleton, Table, DatePicker, Select, Drawer
} from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    useHistory,
    useLocation,
} from 'react-router-dom/cjs/react-router-dom.min';
import styled from 'styled-components';
import InApp from '../../com/in_app_layout';
import { getGrafana } from './service';
import moment from 'moment';
import { SRC_REALTIME } from '_config/storage_key';
import { apiClient } from 'helper/request/api_client';
import { handleErr } from 'helper/request/handle_err_request';
import { get } from 'lodash';
import { ENDPOINT } from '_config/end_point';
import axios from 'axios';
import { FilterMachine } from 'com/filter_machine';
import { useSelector } from 'react-redux';

const pre1D = moment().subtract(7, 'd').valueOf();
const now = moment().valueOf();

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


function TvLink(props) {
    const [visible, setVisible] = React.useState({
        name: "Biểu đồ số cuộn/phút",
        url: 'https://dashboard.quantrisanxuat.info/d/0j4nyhLnz/cong-suat-lam-viec-cua-may?orgId=2',
        area: true,
        line: true,
        machine: true,
        // product: 340760,
        rangepiker: true,
        select: true
    })
    const handleClick = (val) => {
        setVisible(val)
    }

    const handleClickChart = (val) => {
        console.log('chart', val)
        setVisible(val)
    }
    return (
        <div>
            <GrafanaIf visible={visible} setVisible={setVisible} onClickChart={handleClickChart} />
        </div>
    );
}


const GrafanaIf = ({ visible,
    setVisible, input = ""
}) => {
    const [product, setProduct] = useState('');
    const [productId, setProductId] = useState('')
    const [shiftList, setShiftList] = useState([])
    const [shift, setShift] = useState('')

    const [staff, setStaff] = useState('')
    const [listStaff, setListStaff] = useState([])

    const [listProduct, setListProduct] = useState([]);
    // 
    const [srcRealtime, setSrcRealTime] = useState("")
    const [timestamp, setTimestamp] = useState({
        from: pre1D,
        to: now,
    })
    const [listReport, setListReport] = React.useState(dataInitTable);
    const [filterMachine, setFilterMachine] = useState({});

    const { area, line, machine } = filterMachine;

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
            if (visible?.change_api) {

                apiClient.get(`/product/production?machine_id=${machine}`)
                    .then(({ data }) => {
                        setListProduct(data)
                        setProduct(visible.product || data[0].name)
                        setProductId(data[0].id)
                    })
                    .catch(err => {
                        handleErr(err)
                    })
            }
            else {
                apiClient.get(`${ENDPOINT.BASE}/product/production_statistic?machine_id=${machine}`)
                    .then(({ data }) => {
                        setListProduct(data)
                        setProduct(visible.product || data[0].name)
                        // setProductId(data[0].id)
                    })
                    .catch(err => {
                        handleErr(err)
                    })
            }
        }

    }, [machine])

    const requestInitData = async () => {

        const { data } = await getGrafana({
            name: input || "statistic"
        })
        setSrcRealTime(data?.url)
        const { data: staff } = await apiClient.get('/staff')
        console.log('1234', staff.data);
        setListStaff(staff.data.map(i => {
            return {
                id: i.id, name: i.name
            }
        }))
        setStaff(_.get(staff, `data[5].name`))

        const { data: dataPr } = await apiClient.get(`production?machine_id=${machine ? machine : 'HPFF7'}`)

        const dataPrConvert = [...new Set(dataPr.data.map(i => i.shift_id).filter(data => data))]
        setShiftList(dataPrConvert)
        setShift(dataPrConvert[0])

        apiClient.get('title_report')
            .then(({ data }) => {
                const dataConvert = data.map(i => {
                    return {
                        ...i,
                        area: true,
                        line: true,
                        machine: true,
                        // product: 340760,
                        rangepiker: true,
                        select: true,
                    }
                });
                setVisible(dataConvert[0])
                setListReport(dataConvert)
            })
    }

    function onChange(value) {
        setTimestamp({
            from: moment().valueOf() - value,
            to: moment().valueOf()
        })
    }

    function onSearch(val) {
        console.log('search:', val);
    }
    const User = useSelector(state => get(state, 'app.user', {}));

    return <div style={{ position: 'relative', width: '100%', height: '80vh', overflowY: 'scroll' }}>
        <div style={{ backgroundColor: '#ffffff' }}>
            <Row gutter={[0, { xs: 8, sm: 8, md: 8, lg: 8 }]} style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10 }}>
                <FilterMachine onChange={setFilterMachine} />
                <Col xs={20} sm={20} md={20} lg={20} xl={8} xxl={8} style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', marginRight: 10 }}>
                    {visible.rangepiker ? <>
                        <DatePicker.RangePicker
                            style={{ marginRight: '10px' }}
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            value={[moment(timestamp.from), moment(timestamp.to)]}
                            onChange={val => {
                                if (val && val[0]) {
                                    setTimestamp({
                                        from: val[0].valueOf(),
                                        to: val[1].valueOf()
                                    })
                                }
                            }} />
                    </> : null}
                    {visible.select ? <>
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
                    </> : null}
                </Col>
            </Row>
        </div>

        <div className="card-container">
            <Tabs
                tabBarStyle={{ background: '#fafafa' }}
                tabPosition={'top'} size="middle" type="card">
                {
                    listReport.map(i => {
                        return (
                            <Tabs.TabPane tab={i.name} key={i.name}>
                                <div style={{ height: '100vh' }}>
                                    {i.url ? <iframe
                                        src={`${i.url}&theme=light&var-ENTERPRISE=${User.enterprise_id}&var-AREA=${area}&var-LINE=${line}&var-MACHINE=${machine}&var-PRODUCT=${product}&var-CA=${shift}&var-STAFF=${staff}&from=${timestamp.from}&to=${timestamp.to}`}
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        title="full screen page"
                                    /> : null}
                                </div>
                            </Tabs.TabPane>
                        )
                    })
                }
            </Tabs>
        </div>
    </div>
}



const ButtonBottom = ({ handleClick = () => { }, children }) => {
    const { t } = useTranslation();
    const lang = "change_view";
    return (
        <Popover title={t(`${lang}.view`)} >
            <div
                onClick={handleClick}
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
    );
};

const dataInitTable = [
    {
        name: "Biểu đồ số cuộn/phút",
        url: 'https://dashboard.quantrisanxuat.info/d/0j4nyhLnz/cong-suat-lam-viec-cua-may?orgId=2',
        area: true,
        line: true,
        machine: true,
        // product: 340760,
        rangepiker: true,
        select: true,
    },
    {
        name: "Biểu đồ Thời gian máy chạy ( theo ngày )",
        url: 'https://dashboard.quantrisanxuat.info/d/Re0yy5Ynz/machine-running?orgId=2',
        area: true,
        line: true,
        machine: true,
        rangepiker: true,
        select: true
    },
    {
        name: "Biểu đồ sensor theo ngày",
        url: 'https://dashboard.quantrisanxuat.info/d/BqRuC2Lnz/sensor-theo-ngay?orgId=2',
        area: true,
        line: true,
        machine: true,
        // product: true,
        rangepiker: true,
        select: true
    },
    {
        name: "Biểu đồ số lượng sản phẩm theo ca làm việc",
        url: 'https://dashboard.quantrisanxuat.info/d/rsmOj5Ynz/so-luong-san-pham-theo-ca-lam-viec?',
        area: true,
        line: true,
        machine: true,
        shift: true,
        change_api: true,
        product: 302960,
        rangepiker: true,
        select: true
    },
    // {
    //     name: "Biểu đồ T/g duration của 1 sản phẩm",
    //     url: 'https://dashboard.quantrisanxuat.info/d/XHPKXhLnz/duration?orgId=2',
    //     area: true,
    //     line: true,
    //     machine: true,
    //     product: true,
    // },
    {
        name: "Biểu đồ số lượng sản phẩm của nhân viên theo ca",
        url: 'https://dashboard.quantrisanxuat.info/d/Cuo8atY7z/so-luong-san-pham-cua-nhan-vien-theo-ca?orgId=2',
        area: true,
        line: true,
        shift: true,
        machine: true,
        // product: 340760,
        staff: true
    },
    {
        name: "Biểu đồ phế phẩm theo ngày",
        url: 'https://dashboard.quantrisanxuat.info/d/AJv9lcY7z/phe-pham-theo-ngay?orgId=2',
        rangepiker: true,
        select: true

    },
    {
        name: "Biểu đồ thời gian làm của máy theo giờ",
        url: 'https://dashboard.quantrisanxuat.info/d/AlPsXYo7k1/thoi-gian-may-chay-theo-gio?orgId=2',
        area: true,
        line: true,
        machine: true,
        // product: true,
        rangepiker: true,
        select: true
    },
    // {
    //     name: "Biểu đồ số lượng của 1 ca",
    //     url: 'https://dashboard.quantrisanxuat.info/d/cggNecLnk/so-luong-cua-1-ca?orgId=2'
    // }
]
export default TvLink;

const ItemShow = styled.div`
	padding: 10px 20px;
	font-size: 1.3em;
	background: ${({ active }) => active ? "#ddd" : '#fff'}
`;

