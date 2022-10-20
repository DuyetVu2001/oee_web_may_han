import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
    PauseOutlined, SwapOutlined, PlayCircleOutlined, FullscreenOutlined,
    CaretUpOutlined,
    CaretDownOutlined, SearchOutlined,
    FullscreenExitOutlined

} from '@ant-design/icons'
import axios from 'axios';
import { get } from 'lodash';

import { Form, Input, Button, Select, Row, Col, DatePicker, Table } from 'antd';


import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { apiClient } from 'helper/request/api_client';
import BtnDownload from 'com/BtnDownload';
import { ENDPOINT } from '_config/end_point';
const options = {
    chart: {
        zoomType: 'xy'
    },
    title: null,
    // title: {
    //     text: 'Daily output (kg) & scrap rate',
    //     align: 'left'
    // },
    // subtitle: {
    //     text: 'Source: WorldClimate.com',
    //     align: 'left'
    // },
    // xAxis: [{
    //     categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    //         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    //     crosshair: true
    // }],
    yAxis: [
        //     { // Primary yAxis
        //     labels: {
        //         format: '{value}°C',
        //         style: {
        //             color: Highcharts.getOptions().colors[2]
        //         }
        //     },
        //     title: {
        //         text: 'Temperature',
        //         style: {
        //             color: Highcharts.getOptions().colors[2]
        //         }
        //     },
        //     opposite: true

        // },
        { // Secondary yAxis
            gridLineWidth: 0,
            title: {
                text: 'Sản phẩm (sp)',
                style: {
                    color: '#1890ff',//Highcharts.getOptions().colors[0]
                    fontWeight: '600',
                }
            },
            labels: {
                format: '{value} sp',
                style: {
                    color: '#1890ff',//Highcharts.getOptions().colors[0]
                    fontWeight: '600',
                }
            }

        },
        { // Tertiary yAxis
            gridLineWidth: 0,
            title: {
                text: 'Percent (%)',
                style: {
                    color: '#000',
                    fontWeight: '600',
                }
            },
            labels: {
                format: '{value} %',
                style: {
                    color: '#000',
                    fontWeight: '600',
                }
            },
            opposite: true
        }
    ],
    tooltip: {
        shared: true
    },
    legend: {
        layout: 'horizontal',
        // align: 'left',
        // x: 80,
        verticalAlign: 'top',
        y: -10,
        // y: 50,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    floating: false,
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    x: 0,
                    y: 0
                },
                yAxis: [{
                    labels: {
                        align: 'right',
                        x: 0,
                        y: -6
                    },
                    showLastLabel: false
                }, {
                    labels: {
                        align: 'left',
                        x: 0,
                        y: -6
                    },
                    showLastLabel: false
                }, {
                    visible: false
                }]
            }
        }]
    }
};

const optionsClone = JSON.parse(JSON.stringify(options));

const Line = ({ dataFilter }) => {
    const [dataChart, setDataChart] = useState(null);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        requestInit(dataFilter);
    }, [dataFilter]);

    const titlePage = useMemo(() => {
        // try {
        //     return `Output (kg) & scrap rate - ${dataFilter.line}, ${dataFilter.area}, ${dataFilter.machine_id} (${moment(dataFilter.from * 1000).format('DD/MM/YYYY')} - ${moment(dataFilter.to * 1000).format('DD/MM/YYYY')})`
        // } catch (err) {
        return `Output & Scrap Rate`
        // }

    }, [dataFilter])

    const requestInit = async (params) => {
        try {
            const { machine_id, ...rest } = params;
            const { data } = await apiClient.get(`${ENDPOINT.BASE}/report_production`, rest);
            setDataChart(data);

            const dataTableConvert = [];


            Object.keys(data).map(day => {
                Object.keys(data[day]).map(machine => {
                    if (!machine_id.includes(machine)) {
                        return false;
                    }
                    dataTableConvert.push({
                        date: day,
                        machine_id: machine,
                        "actual": data[day][machine].actual,
                        "target": data[day][machine].target,
                        "name": data[day][machine].name,
                        "ng": data[day][machine].ng,
                        "scrap_rate": Number(data[day][machine].scrap_rate).toFixed(2),
                    })

                })
            })
            setDataSource(dataTableConvert);


        } catch (err) {
            console.log('dnds actual', err)
            // alert('Lỗi call api ' + JSON.stringify(err))
        }
    }
    return (
        <div>
            <div style={{
                // padding: '0.5in'
                // height: '11.5in'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2>{'Output & Scrap Rate Table'}</h2>
                    <BtnDownload url={`report_production`} params={{ ...dataFilter, excels: true }} />
                </div>
                <TableCustom
                    rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                    columns={columns} dataSource={dataSource} pagination={false} />
            </div>
            {
                dataChart && get(dataFilter, 'machine_id[0]') ? get(dataFilter, 'machine_id').map(i => {
                    return (
                        <ChartLine data={dataChart} machine_id={i} />
                    )
                }) : null
            }

        </div>
    )
}

export default Line;

const ChartLine = ({ data, machine_id }) => {
    const [dataChart, setDataChart] = useState(optionsClone);

    useEffect(() => {

        const dataActual = [];
        const dataTarget = [];
        const dataNG = [];
        const dataScrapRate = [];

        const dateRange = [];


        Object.keys(data).map(day => {
            if (data[day][machine_id]) {
                dataActual.push(min0(data[day][machine_id].actual));
                dataTarget.push(min0(data[day][machine_id].target));
                dataNG.push(min0(data[day][machine_id].ng));
                dataScrapRate.push(min0(+Number(data[day][machine_id].scrap_rate).toFixed(2)));
                dateRange.push(day)
            }
        });




        setDataChart({
            ...dataChart,
            xAxis: [{
                categories: dateRange,
                crosshair: true
            }],

            series: [
                {
                    name: 'Actual',
                    type: 'column',
                    yAxis: 0,
                    color: '#15AC9A',
                    data: dataActual,
                    tooltip: {
                        valueSuffix: ' sp'
                    }
                }, {
                    name: 'Target',
                    type: 'spline',
                    yAxis: 0,
                    // color: 'red',
                    data: dataTarget,
                    marker: {
                        enabled: false
                    },
                    tooltip: {
                        valueSuffix: ' sp'
                    }
                },
                {
                    name: 'NG',
                    type: 'spline',
                    yAxis: 0,
                    data: dataNG,
                    tooltip: {
                        valueSuffix: ' sp'
                    }
                },
                {
                    name: 'Scrap rate',
                    type: 'spline',
                    yAxis: 1,
                    data: dataScrapRate,
                    tooltip: {
                        valueSuffix: ' %'
                    }
                },
            ]
        });

    }, [machine_id, data])

    return (
        <div>
            <div style={{ height: 2, background: '#dedede', marginTop: 50 }} />
            <h2 style={{}}>Output & Scrap Rate Chart ({machine_id})</h2>
            <div style={{
                background: '#fff',
                padding: 20,
                overflow: 'hidden',
            }} className='hidden-scroll'>
                <HighchartsReact
                    containerProps={{ style: { width: '8.3in' } }}
                    highcharts={Highcharts}
                    options={dataChart}
                />
            </div>
        </div>

    )
}


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

const columns = [
    {
        title: 'Ngày',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Tên máy',
        dataIndex: 'name',
        key: 'name',
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


const min0 = (val) => {
    try {
        return +val < 0 ? 0 : val
    } catch (err) {
        return val
    }
}