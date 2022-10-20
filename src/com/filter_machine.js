import React, { useEffect, useState } from 'react';
import {
    Select,
    Col
} from 'antd';
import { apiClient } from 'helper/request/api_client';
import _, { get } from 'lodash';
import { useQuery } from 'helper/hook/get_query';

export const FilterMachine = React.memo(({ initFilter, onChange = () => { } }) => {

    const [dateEnterprise, setDataEnterprise] = useState(null);
    const [filter, setFilter] = useState({ area: '', machine: '', line: '' })
    const query = useQuery();
    useEffect(() => {
        _requestData();
    }, []);

    useEffect(() => {
        try {
            if (!dateEnterprise) return () => { };
            if (query.get('machine_id') || query.get('line') || query.get('area')) {
                setTimeout(() => {
                    setFilter({
                        machine: query.get('machine_id'),
                        line: query.get('line'),
                        area: query.get('area'),
                    })

                }, 1000)
            } else if (!_.isEmpty(initFilter)) {
                setFilter(initFilter);
            } else {
                const listAreaIds = Object.keys(dateEnterprise)
                const lines = get(dateEnterprise, `[${listAreaIds[0]}].lineMap`);
                const linesId = Object.keys(lines)
                const machine = lines[linesId[0]].machines
                setFilter({
                    machine: ('' + machine[2]?.id) || ('' + machine[0].id),
                    line: linesId[0],
                    area: listAreaIds[0],
                })
            }
        } catch (err) {
            console.log('errors set default machine filter', err)
        }
    }, [initFilter, dateEnterprise, query])

    useEffect(() => {
        onChange(filter)
    }, [filter]);

    const _requestData = async () => {
        const { data } = await apiClient.get('/enterprise/detail')
        const dataConvert = {};

        data.areas.map((area) => {
            dataConvert[area.id] = area;
            dataConvert[area.id].lineMap = {};
            area.lines.map((line) => {
                dataConvert[area.id].lineMap[line.id] = line
            })
        });

        setDataEnterprise(dataConvert)
    }
    return (
        <Col xs={20} sm={20} md={20} lg={20} xl={11} xxl={12}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <TitleForm text="Area" />
                <Select size="small" style={selectStyle} value={filter.area} onChange={(val) => {
                    setFilter({ area: val, line: '', machine: '' })
                }}>
                    {dateEnterprise && Object.keys(dateEnterprise)
                        .map(areaId => <Select.Option key={areaId} value={areaId}>{get(dateEnterprise, `${areaId}.name`, '')}</Select.Option>)}
                </Select>
                <TitleForm text="Line" />
                <Select size="small" style={selectStyle} value={filter.line} onChange={(val) => {
                    setFilter({ ...filter, line: val, machine: '' })
                }}>
                    {get(dateEnterprise, `${filter.area}.lineMap`)
                        && Object.keys(get(dateEnterprise, `${filter.area}.lineMap`, []))
                            .map(lineID => <Select.Option key={lineID} value={lineID}>
                                {get(dateEnterprise, `${filter.area}.lineMap.${lineID}.name`, '')}
                            </Select.Option>)}
                </Select>
                <TitleForm text="Machine" />
                <Select size="small" style={selectStyle} value={filter.machine}
                    onChange={(val) => { setFilter({ ...filter, machine: val }) }} >
                    {get(dateEnterprise, `${filter.area}.lineMap.${filter.line}.machines[0]`)
                        && get(dateEnterprise, `${filter.area}.lineMap.${filter.line}.machines`)
                            .map(machine => <Select.Option key={machine.id} value={machine.id + ''}>
                                {machine.name}
                            </Select.Option>)}
                </Select>
            </div>
        </Col>
    )
})

const TitleForm = ({ text }) => <div style={{ padding: '0px 10px', background: '#fff', borderRadius: 5, border: '1px solid #ddd' }}>
    <span style={{ color: '#1890ff', fontWeight: '600', textTransform: 'uppercase' }}>{text}</span>
</div>

const selectStyle = {
    width: 120, borderRadius: 5, marginLeft: 4, marginRight: 12,
}

