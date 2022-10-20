import { RollbackOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Input, message, Row, Select, Skeleton } from 'antd';
import { FilterMachine } from 'com/filter_machine';
import { useQuery } from 'helper/hook/get_query';
import { apiClient } from 'helper/request/api_client';
import { handleErr } from 'helper/request/handle_err_request';
import { get } from 'lodash';
import moment from 'moment';
import { TimeAndInfo } from 'page/monitor/com/filter_time';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { SRC_REALTIME } from '_config/storage_key';
import { getGrafana } from './service';

const pre1D = moment().subtract(7, 'd').valueOf();
const now = moment().valueOf();
const h8 = moment().set('hour', 8).set('minute', 0).valueOf();
const h20 = moment().set('hour', 20).set('minute', 0).valueOf();

const GrafanaArea = () => {
    const params = useQuery();
    const [filterMachine, setFilterMachine] = useState({});
    const { area, line, machine } = filterMachine;
    const User = useSelector(state => get(state, 'app.user', {}));

    return <div style={{ position: 'relative', width: '100vw', height: '100vh', overflowY: 'scroll', background: '#fff', paddingTop: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '1.3em', marginLeft: 20, fontWeight: '500' }}>{params.get("name")}</div>
            <FilterMachine onChange={setFilterMachine} />
        </div>
        <iframe
            src={`${params.get("link")}&var-ENTERPRISE=${User.enterprise_id}&var-AREA=${area}&var-LINE=${line}&var-MACHINE=${machine}&kiosk&theme=light`}
            width="100%"
            height="100%"
            frameBorder="0"
            title="full screen page"
        />
    </div>
}

export default GrafanaArea