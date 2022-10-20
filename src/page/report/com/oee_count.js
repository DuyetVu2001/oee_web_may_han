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
import BtnDownload from 'com/BtnDownload';
import { ENDPOINT } from '_config/end_point';
import { apiClient } from 'helper/request/api_client';


const Line = ({ dataFilter }) => {
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        requestInit(dataFilter);
    }, [dataFilter]);

    const titlePage = useMemo(() => {
        return `OEE Loss - ${dataFilter.machine_id} (minute)`
    }, [dataFilter])

    const requestInit = async (params) => {
        try {
            const { data } = await apiClient.get(`report_error_machine?`, params);
            const machineData = { };
            const col = {};

            Object.keys(data).map(machine_id => {
                Object.keys(data[machine_id]).map(day => {
                    Object.keys(data[machine_id][day]).map(key => {
                        set(machineData, `${key}.${day}`, get(data, [machine_id, day, key]))
                    })
                    col[day] = 1
                });


            })
            setColumns([
                {
                    title: 'Lỗi',
                    dataIndex: 'err_name',
                    key: 'err_name',
                    width: 10,
                },
                ...Object.keys(col).map(day => ({
                    title: day,
                    dataIndex: day,
                    key: day,
                    width: 30,
                }))
            ])
            const dataS = Object.keys(machineData).map(err_name => ({
                err_name,
                ...machineData[err_name]
            }))
            setDataSource(dataS)
        } catch (err) {
            console.log('dddd', err)
        }
    }

    return (
        <div>
            <div style={{ height: 2, background: '#dedede' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>{titlePage}</h2>
                <BtnDownload url={`report_error_machine`} params={{ ...dataFilter, excels: true }} />
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
		padding: 5px;
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