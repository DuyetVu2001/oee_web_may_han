import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
    PauseOutlined, SwapOutlined, PlayCircleOutlined, FullscreenOutlined,
    CaretUpOutlined,
    CaretDownOutlined, SearchOutlined,
    FullscreenExitOutlined

} from '@ant-design/icons'
import axios from 'axios';
import { get, set } from 'lodash';

import { Form, Input, Button, Select, Row, Col, DatePicker, Table } from 'antd';
import moment from 'moment';
import { apiClient } from 'helper/request/api_client';
import BtnDownload from 'com/BtnDownload';
import { ENDPOINT } from '_config/end_point';


const Line = ({ dataFilter }) => {
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        requestInit(dataFilter);
    }, [dataFilter]);

    const titlePage = useMemo(() => {
        try {
            return `OEE Overview`
        } catch (err) {
            return `OEE tổng hợp theo tháng`
        }

    }, [dataFilter])

    const requestInit = async (params) => {
        try {
            const { machine_id, ...dataConvert } = params
            const { data } = await apiClient.get(`${ENDPOINT.BASE}/report_oee?`, dataConvert);
            const machineData = {};

            const col = Object.keys(data).map(day => {
                Object.keys(data[day]).map(machine_id => {
                    set(machineData, `${machine_id}.${day}`, data[day][machine_id])
                });

                return {
                    title: day,
                    dataIndex: day,
                    key: day,
                    width: 20,
                }
            })
            setColumns([
                {
                    title: 'Machine',
                    dataIndex: 'machine_id',
                    key: 'machine_id',
                    width: 15,
                },
                ...col,
            ])
            const dataS = Object.keys(machineData).map(machine_id => ({
                machine_id,
                ...machineData[machine_id]
            }))
            console.log('machineData---', dataS, machineData)
            setDataSource(dataS)


        } catch (err) {
            // alert('Lỗi call api ' + JSON.stringify(err))
            console.log('dddd', MediaError)
        }
    }

    return (
        <div>
            <div style={{ height: 2, background: '#dedede' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>{titlePage}</h2>
                <BtnDownload url={`report_oee`} params={{ ...dataFilter, excels: true, machine_id:undefined }} />
            </div>
            <div style={{ overflow: 'scroll' }}>
                <TableCustom
                    rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                    columns={columns} dataSource={dataSource} pagination={false} />
            </div>
        </div>
    )
}

export default Line;




// const dataSource = [
//     {
//       key: '1',
//       name: 'Mike',
//       age: 32,
//       address: '10 Downing Street',
//     },
//     {
//       key: '2',
//       name: 'John',
//       age: 42,
//       address: '10 Downing Street',
//     },
//   ];

const columns_ = [
    {
        title: 'Ngày',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Tên máy',
        dataIndex: 'machine_id',
        key: 'machine_id',
    },
    {
        title: 'Actual output',
        dataIndex: 'actual',
        key: 'actual',
    },
    {
        title: 'Target',
        dataIndex: 'target',
        key: 'target',
    },
    {
        title: 'NG',
        dataIndex: 'ng',
        key: 'ng',
    },
    {
        title: 'Scrap rate',
        dataIndex: 'scrap_rate',
        key: 'scrap_rate',
    },
]



const TableCustom = styled(Table)`

    /* overflow: hidden; */
	td.ant-table-cell {
		padding: 10px;
	}
	.ant-table-thead > tr > th {
		padding: 10px;
        background: #183668;
        color: #fff
		/* background: #aeaeae !important;
		font-weight: 500;
		border-bottom: 1px solid #555; */
	}
    .table-row-light {
    background-color: #ffffff;
}
.table-row-dark {
    background-color: #ddd;
}
	/* table th {
		background: #eee;
	}
	.ant-table-thead > tr.ant-table-row-hover td,
	.ant-table-tbody > tr.ant-table-row-hover td,
	.ant-table-thead > tr td,
	.ant-table-tbody > tr td {
		transition-property: transform;
		transition-duration: 0.5s;
	}
	.ant-table-thead > tr.ant-table-row-hover td,
	.ant-table-tbody > tr.ant-table-row-hover td,
	.ant-table-thead > tr:hover td,
	.ant-table-tbody > tr:hover td {
		background: #fff;
		transform: scale(1.04);
		border: '1px solid #000';
		/* height: 55px; */
	} */
`;