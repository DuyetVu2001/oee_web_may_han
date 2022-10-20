import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
    PauseOutlined, SwapOutlined, PlayCircleOutlined, FullscreenOutlined,
    CaretUpOutlined,
    CaretDownOutlined, SearchOutlined,
    FullscreenExitOutlined

} from '@ant-design/icons'
import axios from 'axios';
import { get } from 'lodash';

import { Form, Input, Button, Select, Row, Col, DatePicker } from 'antd';
import moment from 'moment';

import { apiClient } from 'helper/request/api_client';


import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import HC_more from 'highcharts/highcharts-more';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
HC_more(Highcharts);


const options = {
    chart: {
        type: 'waterfall',
        inverted: true
    },
    title: null,

    // title: {
    //     text: 'Highcharts Waterfall'
    // },

    xAxis: {
        type: 'category'
    },

    yAxis: {
        title: {
            text: 'Phần trăm'
        }
    },

    legend: {
        enabled: false
    },

    tooltip: {
        pointFormat: '<b>{point.y}</b> %'
    },

    // series: [{
    //     upColor: Highcharts.getOptions().colors[2],
    //     color: Highcharts.getOptions().colors[3],
    //     data: [{
    //         name: 'Start',
    //         y: 120000
    //     }, {
    //         name: 'Product Revenue',
    //         y: 569000
    //     }, {
    //         name: 'Service Revenue',
    //         y: 231000
    //     }, {
    //         name: 'Positive Balance',
    //         isIntermediateSum: true,
    //         color: Highcharts.getOptions().colors[1]
    //     }, {
    //         name: 'Fixed Costs',
    //         y: -342000
    //     }, {
    //         name: 'Variable Costs',
    //         y: -233000
    //     }, {
    //         name: 'Balance',
    //         isSum: true,
    //         color: Highcharts.getOptions().colors[1]
    //     }],
    //     dataLabels: {
    //         enabled: true,
    //         formatter: function () {
    //             return Highcharts.numberFormat(this.y / 1000, 0, ',') + 'k';
    //         },
    //         style: {
    //             fontWeight: 'bold'
    //         }
    //     },
    //     pointPadding: 0
    // }]
}


const Line = ({ dataFilter }) => {

    const [dataChart, setDataChart] = useState(options);

    const titlePage = React.useMemo(() => {
        try {
            return `OEE loss % daily (${moment(dataFilter.to * 1000).format('DD-MM-YYYY')}- ${dataFilter.line}, ${dataFilter.area}, ${dataFilter.machine_id})`
        } catch (err) {
            return `OEE loss % daily`
        }

    }, [dataFilter])

    useEffect(() => {
        requestInit(dataFilter);
    }, [dataFilter]);

    const requestInit = async (params) => {
        try {
            if (!params || !params.machine_id) {
                // openNotificationWithIcon('error', 'please select machine');
                return 1;
            }
            const { data } = await apiClient.get(`/report_alibility`, {
                // day: params.to,
                ...params,
                // machine_id: 'HPFF8'

            })

            const dataSeriesPositive = [];
            const dataSeriesNegative = [];
            Object.keys(data[params.machine_id]).map(key => {
                if (data[params.machine_id][key] > 0) {

                    dataSeriesPositive.push({
                        name: key,
                        y: +Number(data[params.machine_id][key]).toFixed(2)
                    })
                } else {
                    dataSeriesNegative.push({
                        name: key,
                        y: +Number(data[params.machine_id][key]).toFixed(2)
                    })

                }
            })

            setDataChart({
                ...dataChart,
                series: [{
                    upColor: '#15AC9A',
                    borderWidth: 0,
                    color: '#E0653A',
                    data: [
                        ...dataSeriesPositive,
                        ...dataSeriesNegative,
                        {
                            name: 'Total',
                            isSum: true,
                            color: '#2F8CD6',
                        },],
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return this.key == 'Total' ? 100 : this.y;
                            // return Highcharts.numberFormat(this.y) + 'k';
                        },
                        style: {
                            fontWeight: 'bold'
                        }
                    },
                    pointPadding: 0
                }]

            });
        } catch (err) {
            console.log(err, 'dmdd')
            // alert('Lỗi call api ' + JSON.stringify(err))
        }
    }

    return (
        <div style={{
            background: '#fff',
            marginTop: 20,
            height: 'calc(60vh)', overflow: 'hidden'
        }} className='hidden-scroll'>
            <HighchartsReact
                containerProps={{ style: { height: `calc(50vh)` } }}
                highcharts={Highcharts}
                options={dataChart}
            />
        </div>
    )
}

const Filter = ({ _onFilter }) => {

    const [area, setArea] = useState('')
    const [line, setLine] = useState('')
    const [machine, setMachine] = useState('');
    const [rangeDate, setRangeDate] = useState([moment().subtract(1, 'd'), moment()])



    const [dateEnterprise, setDataEnterprise] = useState(null);
    useEffect(() => {
        _requestData()
    }, [])


    const _requestData = async () => {
        try {
            const { data } = await apiClient.get('/enterprise/detail?id=ENTERPRISE_01')
            const dataConvert = {};
            const dataInit = {}
            data.areas.map((area, indexArea) => {
                if (!indexArea && area.id) {
                    setArea(area.id);
                    if (get(area, 'lines[0].id')) {
                        setLine(get(area, 'lines[0].id'))
                        if (get(area, 'lines[0].machines[0].id')) {
                            setMachine(get(area, 'lines[0].machines[0].id'))
                            dataInit.machine_id = get(area, 'lines[0].machines[0].id')
                        }
                    }
                }
                dataConvert[area.id] = {};
                area.lines.map((l, lIndex) => {
                    dataConvert[area.id][l.id] = l.machines
                })
            })

            setDataEnterprise(dataConvert);
            console.log(dataInit)

            _onFilter({
                ...dataInit,
                from: Math.floor(moment(rangeDate[0]).valueOf() / 1000),
                to: Math.floor(moment(rangeDate[1]).valueOf() / 1000)

            });
        } catch (error) {
            console.log("err", error);
        }
    }

    const _handleFilter = () => {
        if (!machine) {
            openNotificationWithIcon('error', 'Please select machine!');
            return 1;
        }

        const dataSubmit = {
            machine_id: machine,
        };
        if (rangeDate && rangeDate[0]) {
            dataSubmit.from = Math.floor(moment(rangeDate[0]).valueOf() / 1000)
            dataSubmit.to = Math.floor(moment(rangeDate[1]).valueOf() / 1000)
        }
        _onFilter(dataSubmit);

    }
    return (
        <Row className='top-first' style={{ display: 'flex', alignItems: 'center', padding: '0 0 10px' }}>
            <Col xs={20} sm={20} md={20} lg={20} xl={3} style={{ display: 'flex', marginRight: 15 }}>
                <span className='span' style={{ color: '#1f62e0', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#eee', border: '1px solid #24292e1f', height: '31px', width: '60px', marginRight: 5 }}>AREA</span>
                <Select className='top-select' value={area} onChange={setArea}>
                    {dateEnterprise && Object.keys(dateEnterprise).map(areaId => <Select.Option key={areaId} value={areaId}>{areaId}</Select.Option>)}
                </Select>
            </Col>
            <Col xs={20} sm={20} md={20} lg={20} xl={3} style={{ display: 'flex', marginRight: 15 }}>
                <span className='span' style={{ color: '#1f62e0', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#eee', border: '1px solid #24292e1f', height: '31px', width: '60px', marginRight: 5 }}>LINE</span>
                <Select className='top-select' value={line} onChange={setLine}>
                    {dateEnterprise && Object.keys(get(dateEnterprise, `${area}`, [])).map(lineID => <Select.Option key={lineID} value={lineID}>{lineID}</Select.Option>)}
                </Select>
            </Col>
            <Col xs={20} sm={20} md={20} lg={20} xl={3} style={{ display: 'flex', marginRight: 15 }}>
                <span className='span' style={{ color: '#1f62e0', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#eee', border: '1px solid #24292e1f', height: '31px', minWidth: '83px', marginRight: 5 }}>MACHINE</span>
                <Select className='top-select' value={machine} onChange={setMachine}>
                    {dateEnterprise && get(dateEnterprise, `${area}.${line}`, []).map(machine => <Select.Option key={machine.id} value={machine.id}>{machine.id}</Select.Option>)}
                </Select>
            </Col>
            <Col xs={20} sm={20} md={20} lg={20} xl={6} style={{ display: 'flex', marginRight: 15 }}>
                <DatePicker.RangePicker value={rangeDate} onChange={setRangeDate} />
            </Col>
            <Col xs={20} sm={20} md={20} lg={20} xl={6} style={{ display: 'flex', marginRight: 15 }}>
                <Button onClick={_handleFilter} style={{ borderRadius: 6 }} icon={<SearchOutlined />}>Submit</Button>
            </Col>
        </Row>

    )
}
export default Line;
