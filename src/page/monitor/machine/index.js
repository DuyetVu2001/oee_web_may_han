import React, { useEffect, useState, useWindowDimensions, useRef } from 'react';
import moment from 'moment';
import {
    Skeleton, Drawer, Popover, Input, message, Space, Form, TextAre, Pagination, Row, Col, Tabs
} from 'antd';
import { ReloadOutlined, SettingOutlined } from '@ant-design/icons';

import { apiClient } from 'helper/request/api_client';
import { SRC_PRODUCT } from '_config/storage_key';
import '../index.css'
import { getGrafana } from '../service';
import { handleErr } from 'helper/request/handle_err_request';
import _, { get, set } from 'lodash';
import { useTranslation } from "react-i18next";
import "./machine.css"
import { useQuery } from 'helper/hook/get_query';
import { FilterMachine } from 'com/filter_machine';
import { TimeAndInfo, HeaderForm, TableFooter } from '../com/filter_time';
import { useSelector } from 'react-redux';

const h8 = moment().set('hour', 8).set('minute', 0).valueOf();
const h20 = moment().set('hour', 20).set('minute', 0).valueOf();
const h20p = moment().set('hour', 20).subtract(1, 'd').set('minute', 0).valueOf();
const h8n = moment().add(1, 'd').set('hour', 8).set('minute', 0).valueOf();

const App = ({ filter = {} }) => {
    const { t } = useTranslation();

    const [timestamp, setTimestamp] = React.useState({ from: h8, to: h20, });
    const [timeLoop, setTimeLoop] = useState(5);
    const [production, setProduction] = useState({})
    const [srcMachine, setSrcMachine] = useState("")
    const [loading, setLoading] = React.useState(false);
    const [filterMachine, setFilterMachine] = useState({});
    
    const { area, line, machine } = filterMachine;
    const User = useSelector(state => get(state, 'app.user', {}));

    useEffect(() => {
        if (machine) {
            requestProduction(machine);
        }
    }, [machine])
    React.useEffect(() => {
        _requestData()
        checkTime();
        const interVal = setInterval(() => { checkTime() }, 60 * 1000);
        return () => {
            clearInterval(interVal)
        }
    }, []);

    // 
    const requestProduction = (machine) => {

        apiClient.get(`production/machine?machine_id=${machine}`)
            .then(({ data }) => {
                setProduction(data)
            })
    }

    const _requestData = async () => {
        try {
            getGrafana({ name: "detail" }).then(({ data }) => {
                setSrcMachine(get(data, `url`))
            })
        } catch (error) {
            handleErr(error)
            console.log("err", error);
        }
    }

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
            {/* header */}
            {/* <div style={{textAlign:'center', color:"black", fontSize:'28px', fontFamily:'sans-serif',  left: 50, bottom: 25,zIndex: 1}}><b>{t(`${title_home}.operate`)} và điều khiển dây truyền máy đúc nhựa</b></div> */}
            <Row className='top'>
                <FilterMachine onChange={setFilterMachine} />
                <TimeAndInfo  {...{ production, timeLoop, setTimeLoop }} />
            </Row>
            <div>
                <div style={{ minHeight: 410, height: '50vh' }}>
                    <div style={{ minHeight: 410, height: '50vh' }}>
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
                    <TableFooter timeLoop={timeLoop} machine={machine} production={production} requestProduction={requestProduction} />
                </div>
            </div>
        </div>
    )
};


export default App;


