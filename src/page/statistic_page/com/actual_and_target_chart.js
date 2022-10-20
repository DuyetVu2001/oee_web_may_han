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

const Line = ({ dataFilter }) => {
    const [dataChart, setDataChart] = useState(options);
    useEffect(() => {
        if (dataFilter) {
            requestInit(dataFilter);
        }
    }, [dataFilter]);

    const requestInit = async (params) => {
        try {
            params.from = +params.from.toFixed(0)
            params.to = +params.to.toFixed(0)
            const { data } = await apiClient.get(`/report_production`, params)
            const dataActual = [];
            const dataTarget = [];
            const dataNG = [];
            const dataScrapRate = [];

            const dateRange = [];
            Object.keys(data).map(day => {
                dataActual.push(min0(data[day][params.machine_id].actual));
                dataTarget.push(min0(data[day][params.machine_id].target));
                dataNG.push(min0(data[day][params.machine_id].ng));
                dataScrapRate.push(min0(data[day][params.machine_id].scrap_rate));
                dateRange.push(day)
            })

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
                        data: dataActual,
                        tooltip: {
                            valueSuffix: ' sp'
                        },
                        color: '#15AC9A',
                    }, {
                        name: 'Target',
                        type: 'spline',
                        yAxis: 0,
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
        } catch (err) {
            console.log('dnds actual', err)
            // alert('Lỗi call api ' + JSON.stringify(err))
        }
    }

    return (
        <div style={{
            background: '#fff', padding: 20,
            // height: '100vh', 
            overflow: 'hidden',
        }} className='hidden-scroll'>
            <HighchartsReact
                containerProps={{
                    style: {
                        // width: '8.3in'
                    }
                }}
                highcharts={Highcharts}
                options={dataChart}
            />
        </div>
    )
}

export default Line;

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
                    fontWeight: '600'
                }
            },
            labels: {
                format: '{value} %',
                style: {
                    color: '#000',
                    fontWeight: '600'
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

const min0 = (val) => {
    try {
        return +val < 0 ? 0 : val
    } catch (err) {
        return val
    }
}