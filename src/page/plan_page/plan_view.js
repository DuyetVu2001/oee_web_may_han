//1. import
import React, { useEffect, useState } from 'react';
import moment from 'moment'
import { Drawer, DatePicker, Button, Col, Row, Skeleton } from 'antd';
import styled from 'styled-components';
import { get, isArray } from 'lodash';

import {
    PlusCircleOutlined,
    UploadOutlined,
    PlusOutlined,
    PauseCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    RightCircleOutlined,
    PlayCircleOutlined,
    ScheduleOutlined,
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined,
    SwapOutlined,
} from "@ant-design/icons";

import { filterOrder, editOrder } from './services';

import Timeline, {
    TimelineMarkers,
    TimelineHeaders,
    TodayMarker,
    CustomMarker,
    CursorMarker,
    CustomHeader,
    SidebarHeader,
    DateHeader
} from 'react-calendar-timeline'
// make sure you include the timeline stylesheet or the timeline will not be styled
import 'react-calendar-timeline/lib/Timeline.css'
// import moment from 'moment'

const groups_ = [{ id: 1, title: 'group 1' }, { id: 2, title: 'group 2' }]

const items_ = [
    {
        id: 1,
        group: 1,
        title: 'item 1',
        start_time: moment(),
        end_time: moment().add(1, 'hour')
    },
    {
        id: 2,
        group: 2,
        title: 'item 2',
        start_time: moment().add(-0.5, 'hour'),
        end_time: moment().add(0.5, 'hour')
    },
    {
        id: 3,
        group: 1,
        title: 'item 3',
        start_time: moment().add(2, 'hour'),
        end_time: moment().add(3, 'hour')
    }
]


const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";
// const DATE_FORMAT = 'YYYY-MM-DD'
const App = ({ setShow, show, handleSelectState = () => { } }) => {
    const [groups, setGroup] = useState([])
    const [items, setItem] = useState([])
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({
        date: [
            moment(moment().subtract(1, "M"), dateFormat),
            moment(moment().add(1, "M"), dateFormat),
        ]
    });

    const [selectItem, setSelectItem] = useState(null)

    React.useEffect(() => {
        _handleSearch()
    }, [filter]);

    useEffect(() => {
        _requestData();
    }, [])

    const handleAction = async (body) => {
        const result = await handleSelectState(body)
        if (result == 'reload') {
            _requestData();
        }

    }

    const _handleSearch = () => {

        const filterData = {};
        if (get(filter, 'date[0]')) {
            const [from, to] = filter.date;
            if (from && to) {
                filterData.from = moment(from).format("DD-MM-YYYY");
                filterData.to = moment(to).format("DD-MM-YYYY");

            }
        }
        _requestData(filterData);

    }

    const _requestData = async (params = {}) => {
        try {
            setLoading(true)
            const { data } = await filterOrder(params);
            setLoading(false)
            const eventConvert = [];
            const resourcesConvert = [];

            const actualEvent = {};
            const planEvent = {};
            data.map(r => {
                if (r.actual_start) {
                    let endTime = moment(r.actual_start * 1000).endOf('M')
                    if (r.actual_end) {
                        endTime = moment(r.actual_end * 1000)
                    }
                    const eventItem = {
                        id: r.id,
                        start_time: moment(r.actual_start * 1000),
                        end_time: endTime,
                        group: `${r.machine_id}`,
                        title: `${r.id} | ${r.molds}`,

                        // canMove: true,
                        canResize: false,
                        // canChangeGroup: true,
                        itemProps: {
                            // these optional attributes are passed to the root <div /> of each item as <div {...itemProps} />
                            'data-custom-attribute': 'Random content',
                            'aria-hidden': true,
                            onDoubleClick: () => {
                                r.title = `${r.id} | ${r.molds}`;
                                setSelectItem(r)
                                console.log('data', r)
                            },
                            className: 'weekend',
                            fontWeight: '600',
                            style: {
                                fontWeight: '600',
                                // background: 'fuchsia'
                            }
                        },
                        // add
                        order_state: r.order_state
                    }
                    actualEvent[r.machine_id] = [...(actualEvent[r.machine_id] || []), eventItem]
                } else {
                    const eventItem = {
                        id: r.id,
                        start_time: moment(r.start_time * 1000),
                        end_time: moment(r.start_time * 1000).endOf('M'),
                        group: `${r.machine_id}_plan`,
                        title: `${r.id} | ${r.molds}`,
                        // 
                        canMove: true,
                        canResize: false,
                        canChangeGroup: false,
                        itemProps: {
                            // these optional attributes are passed to the root <div /> of each item as <div {...itemProps} />
                            // 'data-custom-attribute': 'Random content',
                            // 'aria-hidden': true,
                            onDoubleClick: () => {
                                r.title = `${r.id} | ${r.molds}`;
                                setSelectItem(r)
                                console.log('data', r)
                            },
                            // className: 'weekend',
                            style: {
                                background: '#ddd',
                                color: '#000',
                                fontWeight: '600'
                            }
                        }
                    };
                    planEvent[r.machine_id] = [...(planEvent[r.machine_id] || []), eventItem]
                }
                // const reFinded = resourcesConvert.find(i => i.machine_id === r.machine_id);
                if (!resourcesConvert.find(i => i.machine_id === r.machine_id)) {
                    // { id: 1, title: 'group 1' }
                    resourcesConvert.push({
                        id: `${r.machine_id}`,
                        machine_id: `${r.machine_id}`,
                        stackItems: true,
                        title: <span style={{}}> <span style={{ fontWeight: 'bold' }}>{r.machine_id}</span> - Thực tế</span>,
                        // rightTitle: 'sd'
                    })
                    resourcesConvert.push({
                        id: `${r.machine_id}_plan`,
                        machine_id: `${r.machine_id}`,

                        title: <span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Kế hoạch</span>,

                    })
                }

            })

            console.log('(====', actualEvent)
            Object.keys(actualEvent).map((key) => {
                try {
                    // resourcesConvert
                    const dataItem = actualEvent[key];
                    dataItem.sort((a, b) => a.start_time.valueOf() - b.start_time.valueOf()).map((i, index) => {
                        if (index & 1) i.itemProps.style.background = '#22669E';
                        if (COLOR[i.order_state]) {
                            i.itemProps.style.background = COLOR[i.order_state];
                            i.itemProps.style.color = "#000";
                        }
                        // return i
                        eventConvert.push(i)
                    });
                } catch (err) {
                    console.log('eerre', err)
                }
            })
            Object.keys(planEvent).map((key) => {
                try {
                    // resourcesConvert
                    const dataItem = planEvent[key];
                    dataItem.sort((a, b) => a.start_time.valueOf() - b.start_time.valueOf()).map((i, index) => {
                        if (index & 1) i.itemProps.style.background = '#999';
                        // return i
                        eventConvert.push(i)
                    });
                } catch (err) {
                    console.log('eerre', err)
                }
            })
            setGroup(resourcesConvert);
            setItem(eventConvert);
            //             actual_end: 0
            // actual_start: 1634432400
            // cavity: 1
            // created: 1634432400
            // cycle_time: 1
            // id: 60
            // machine_id: "M01-01"
            // molds: []
            // name: "Un-planned"
            // order_state: "Running"
            // start_time: 1634432400
            // type: "MP"
            console.log('eventConvert123', eventConvert)
        } catch (err) {
            console.log('asdf', err)
            setLoading(false)
        }
    }
    return (
        <Drawer
            bodyStyle={{ padding: 0 }}
            height={'calc(100vh - 50px)'}
            style={{
                width: 'calc(100vw - 61px)',
                marginLeft: 50,
                marginTop: 50
            }}
            placement="bottom"
            onClose={() => { setShow(false) }}
            visible={show}
            title={
                <div>
                    <span>Kế hoạch </span>
                    <RangePicker
                        value={get(filter, 'date', [])}
                        format={dateFormat}
                        style={{ borderRadius: 5, marginLeft: 20 }}
                        onCalendarChange={(value) => {
                            setFilter({ ...filter, date: value });
                        }}
                    />
                    <Button type="primary" onClick={_handleSearch} style={{ marginLeft: 20 }} loading={loading}>Submit</Button>
                </div>
            }
        >
            <div>
                {groups[0] && items[0] ? <Timeline
                    onItemMove={(itemId, dragTime, newGroupOrder) => {
                        editOrder({ id: itemId, start_time: dragTime / 1000 })
                            .then(() => {
                                _requestData();
                            })
                    }}
                    groups={groups}
                    items={items}
                    defaultTimeStart={moment().add(-1, 'month')}
                    defaultTimeEnd={moment().add(1, 'month')}
                >
                    <TimelineMarkers>
                        <TodayMarker color='red' style={{ background: 'red' }} />
                    </TimelineMarkers>
                </Timeline> : null}
                {loading && <Skeleton />}

            </div>

            {selectItem && <div style={{
                zIndex: 100,
                position: 'fixed', bottom: 10, right: 10,
                // height: 400, 
                width: 400,
                background: '#fff', borderRadius: 10,
                padding: 10,
            }}>
                <CloseCircleOutlined onClick={() => setSelectItem(null)} style={{ position: 'absolute', right: 10, top: 10 }} />
                <RenderItemDetail eventItem={{ data: selectItem }} handleAction={handleAction} />
            </div>}
        </Drawer>
    )

}


const RenderItemDetail = ({ eventItem, handleAction }) => {
    const title = eventItem.data.title
    return (
        <div style={{ width: 400 }}>
            <Row type="flex" align="middle" style={{ alignItems: 'center' }}>
                <Col span={22} className="overflow-text">
                    <span style={{ fontSize: 20 }} className="header2-text" title={title}>{title}</span>
                </Col>
            </Row>
            <Row type="flex" align="middle">
                <Col span={22}>
                    <div style={{ marginTop: 6, display: 'flex' }}>
                        <div style={{ flex: 1 }} className="header-text">TG kế hoạch: </div>
                        <div style={{ flex: 1 }}>{eventItem && eventItem.data && eventItem.data.start_time ?
                            moment(eventItem.data.start_time * 1000).format("DD-MM-YYYY HH:mm") :
                            "..."} </div>
                    </div>
                    <div style={{ marginTop: 6, display: 'flex' }}>
                        <div style={{ flex: 1 }} className="header-text">TG Bắt đầu: </div>
                        <div style={{ flex: 1 }}>{eventItem && eventItem.data && eventItem.data.actual_start ?
                            moment(eventItem.data.actual_start * 1000).format("DD-MM-YYYY HH:mm") :
                            "..."} </div>
                    </div>
                    <div style={{ marginTop: 6, display: 'flex' }}>
                        <div style={{ flex: 1 }} className="header-text">TG kết thúc: </div>
                        <div style={{ flex: 1 }}>{eventItem && eventItem.data && eventItem.data.actual_end ?
                            moment(eventItem.data.actual_end * 1000).format("DD-MM-YYYY HH:mm") :
                            "..."} </div>
                    </div>
                    <div style={{ marginTop: 6, display: 'flex' }}>
                        <div style={{ flex: 1 }} className="header-text">Loại: </div>
                        <div style={{ flex: 1 }} >{eventItem && eventItem.data && eventItem.data.type}</div>
                    </div>
                    <div style={{ marginTop: 6, display: 'flex' }}>
                        <div style={{ flex: 1 }} className="header-text">Trạng thái: </div>
                        <div style={{ flex: 1 }} >{eventItem && eventItem.data && eventItem.data.order_state}</div>
                    </div>
                    <div style={{ marginTop: 6, display: 'flex' }}>
                        <div style={{ flex: 1 }} className="header-text">Cycle time: </div>
                        <div style={{ flex: 1 }}>{eventItem && eventItem.data && eventItem.data.cycle_time} </div>
                    </div>
                    <div style={{ marginTop: 6, display: 'flex' }}>
                        <div style={{ flex: 1 }} className="header-text">Khuôn: </div>
                        <div style={{ flex: 1 }}>{eventItem && eventItem.data && eventItem.data.molds && eventItem.data.molds.join(' , ')} </div>
                    </div>
                    <div></div>
                    <div></div>
                </Col>
            </Row>
            <div style={{ display: 'flex', justifyContent: 'space-around', margin: '10px 0px' }}>
                {mapStateChange[get(eventItem, 'data.order_state')] ?
                    mapStateChange[eventItem.data.order_state].map((i) => <Button
                        style={{
                            borderRadius: 5, marginLeft: 5, display: 'flex',
                            fontSize: 12,
                            alignItems: 'center'
                        }}
                        // type='text'
                        icon={<i.Icon />}
                        onClick={() => handleAction({ data: eventItem.data, type: i.name })}
                    >{i.title}</Button>) : null}
            </div>
        </div>
    )
}

export default App;



const mapStateChange = {
    Planned: [
        {
            name: "Running",
            title: "Running",
            Icon: () => <CheckCircleOutlined />,
        },
        {
            name: "Edit",
            title: "Edit",
            Icon: () => <EditOutlined />,
        },
        {
            name: "Delete",
            title: "Delete",
            Icon: () => <DeleteOutlined />,
        },
    ],
    Ready: [
        {
            name: "Closed",
            title: "Closed",
            Icon: () => <CloseCircleOutlined />,
        },
        {
            name: "Next",
            title: "Next",
            Icon: () => <RightCircleOutlined />,
        },
        {
            name: "Running",
            title: "Running",
            Icon: () => <PlayCircleOutlined />,
        },
    ],
    Next: [
        {
            name: "Ready",
            title: "Ready",
            Icon: () => <CheckCircleOutlined />,
        },
        {
            name: "Running",
            title: "Running",
            Icon: () => <PlayCircleOutlined />,
        },
    ],
    Running: [
        {
            name: "Paused",
            title: "Paused",
            Icon: () => <PauseCircleOutlined />,
        },
        {
            name: "Edit",
            title: "Edit",
            Icon: () => <EditOutlined />,
        },
        {
            name: "Complete",
            title: "Complete",
            Icon: () => <CheckCircleOutlined />,
        },
    ],
    Paused: [
        {
            name: "Running",
            title: "Running",
            Icon: () => <PlayCircleOutlined />,
        },
        {
            name: "Complete",
            title: "Complete",
            Icon: () => <CheckCircleOutlined />,
        },
        {
            name: "Delete",
            title: "Delete",
            Icon: () => <DeleteOutlined />,
        },
    ],
    Complete: [
        // {
        //     name: "Closed",
        //     title: "Closed",
        //     Icon: () => <CloseCircleOutlined />,
        // },
        {
            name: "Edit",
            title: "Edit",
            Icon: () => <EditOutlined />,
        },
        {
            name: "Delete",
            title: "Delete",
            Icon: () => <DeleteOutlined />,
        },
    ],
};


const COLOR = {
    Running: "#8efe48",
    Paused: "#ff793a",
};