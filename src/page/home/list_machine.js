import { apiClient } from 'helper/request/api_client';
import React, { useState } from 'react';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import { Skeleton } from "antd";
import { useHistory } from 'react-router-dom';
import {
    icon,
    convertStt,
} from './_config'
import _ from 'lodash';

import { map_color } from '_config/constant'
import { BtnTus } from 'com/btn_tutorial';

const App = () => {
    const [loading, setLoading] = React.useState(false);
    const [machineShow, setMachineShow] = useState([]);
    const [machineMap, setMachineMap] = useState({});

    React.useEffect(() => {
        _requestRealtimeData()
        const inter = setInterval(() => {
            _requestRealtimeData()
        }, 1000 * 30);

        apiClient.get('machine')
            .then(({ data }) => {
                console.log('data', data)
                const dataConvert = data.data.reduce((cal, cur) => {
                    cal[cur.id] = cur;
                    return cal;
                }, {});

                setMachineMap(dataConvert)
            })

        return () => {
            clearInterval(inter);
        }
    }, [])

    const _requestRealtimeData = () => {
        setLoading(true);
        apiClient.get('/structure_oee')
            .then(({ data }) => {
                const listMachine = {};
                Object.keys(data).map(area => {
                    const { Oee, W, kWh, ...restLine } = data[area];
                    Object.keys(restLine).map(line => {
                        const { Oee, W, kWh, ...restMachine } = restLine[line];
                        Object.keys(restMachine).map(m => {
                            const { Oee = '', W = '', kWh = '', PLan = '', Actual = '', status } = restMachine[m];
                            listMachine[m] = {
                                Oee, W, kWh, PLan, Actual, line, area,
                                name: m,
                                status
                                // status: convertStt(Oee),
                            }
                        })
                    })
                });
                setMachineShow(Object.values(listMachine));
            })
            .catch(err => {
                openNotificationWithIcon("error", JSON.stringify(err))
            })
            .finally(() => {
                setLoading(false);
            })

    }
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: 'auto' }}>
            {machineShow.map(i => <Item key={i.name} data={i} machine={machineMap[i.name] || {}} />)}
            {(!machineShow || loading) ? <Skeleton /> : null}
            <BtnTus>
                <div>
                    <div>A: Actual</div>
                    <div>P: Plan</div>
                    <div>E1_M1: Tên máy</div>
                    <div>%: Đơn vị tính của OEE</div>
                </div>
            </BtnTus>
            
        </div>
    )
};

const WIDTH = 'calc((100vw - 140px) / 6)'

const Item = ({ data, machine = {} }) => {
    const history = useHistory();
    return (
        <div
            onClick={() => history.push(`/monitor?machine_id=${data.name || ''}&area=${data.area || ''}&line=${data.line || ''}`)}
            style={{
                minHeight: '30vh',
                minWidth: WIDTH,
                // height: WIDTH,
                background: '#ddd',
                margin: 5,
                borderRadius: 6,
            }}>
            <div style={{
                border: `1px solid #ccc`, height: '100%',
                borderRadius: 6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '3px 0' }}>
                    <div style={{ fontSize: '1.5vw', fontWeight: '600' }}>{machine.name}</div>
                </div>
                <div style={{
                    flex: 1,
                    background: map_color[data.status] || '#ddd',
                    borderRadius: 3,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <span style={{ fontSize: '4.5vw', lineHeight: -10, color: '#fff', fontWeight: '600' }}>{(Number(data.Oee) || 0).toFixed(0)}%</span>
                </div>
                <div style={{ background: '#dedede', fontSize: '1.8vw', fontWeight: '600', padding: '0px 25px', }}>
                    <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -10, }}>
                        <span style={{ textAlign: 'left' }}>A</span>
                        <span style={{ textAlign: 'left' }}>{(Number(data.Actual) || 0).toFixed(0)}</span>
                    </div>
                    <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -10, }}>
                        <span style={{ textAlign: 'left' }}>P</span>
                        <span style={{ textAlign: 'left' }}>{(Number(data.PLan) || 0).toFixed(0)}</span>
                    </div>
                </div>
                {/* {info.Oee ? <div><span style={{ fontSize: 22, width: 200 }}>OEE: {Number(info.Oee).toFixed(2)}% </span></div> : null}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
    
                            {info.W ? <span style={{ fontSize: 18, width: 200 }}>{Number(info.W).toFixed(2)} (W) </span> : null}
                            {info.kWh ? <span style={{ fontSize: 18, width: 200 }}>{Number(info.kWh).toFixed(2)} (kWh) </span> : null}
    
                            {info.Actual ? <span style={{ fontSize: 18, width: 200 }}>Actual: {Number(info.Actual).toFixed(2)} </span> : null}
                            {info.PLan ? <span style={{ fontSize: 18, width: 200 }}>PLan: {Number(info.PLan).toFixed(2)} </span> : null}
                        </div> */}
                {/* {info.Oee ? <div>Oee: {Number(info.Oee).toFixed(2)}%</div> : null} */}
            </div>
        </div>
    )
}

export default App;