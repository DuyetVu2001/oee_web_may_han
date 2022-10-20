import { SettingOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';
import { images } from 'helper/static/images';
import { DATA_LINE } from './const';
import { apiClient } from 'helper/request/api_client';
import InApp from 'com/in_app_layout';
import { useHistory } from 'react-router-dom';

// const WIDTH_PER_2_5 = '100vw/30';
const LEFT_WIDTH = '270px';
const HEIGHT = '12vh'

const App = () => {
    const [unit, setUnit] = useState(24);
    const [dataLine, setDataLine] = useState([]);
    const [mqttData, setMqttData] = useState([]);
    const history = useHistory()

    const WIDTH_PER_2_5 = useMemo(() => {
        return `100vw/${unit}`
    }, [unit]);

    useEffect(() => {
        getMasterData();
        getRealTimeData()
        const inter = setInterval(() => {
            getRealTimeData()
        }, 1000 * 10)
        return () => {
            clearInterval(inter);
        }

    }, []);

    const getMasterData = () => {
        // setDataLine({
        //     'M2': {
        //         // id: 'M-01_RC2-1213',
        //         // machine_id: 'M2',
        //         // mold_id: 'RC2-1213',
        //         // steps: {
        //         stop_mc: 2.5,
        //         take_out_die: 2.5,
        //         set_up_die: 7.5,
        //         adjust_and_start: 7.5,
        //         // },

        //         // standard_time: 8,
        //         // time: 50,
        //         // residuals: 0
        //     }
        // })
        // apiClient.get('/master')
        //     .then(({ data }) => {
        //         setDataLine(data)
        //     })
    }

    const getRealTimeData = () => {
        apiClient.get('/time_change_mold')
            .then(({ data }) => {
                // console.log('data.data', data.data)
                //                 id: 1
                // machine_id: "M2"
                // product_id: 1
                // product_name: "Front A125F"
                // status: "Complete"
                // time_end: 1655199284
                // time_start: 1655198749
                // setMqttData(data.data)
                // const dataConvert = {}
                // data.data.map(time => {
                //     dataConvert[time.machine_id] = {
                //         start: time.time_end * 1000,
                //         end: time.time_start * 1000,
                //         product_name: time.product_name
                //     }
                // })
                setMqttData(data.data.map(i => {
                    i.start = i.time_start * 1000;
                    i.end = i.time_end * 1000;
                    return i;
                }))
                // setMqttData({
                //     "M2":
                //     {
                //         start: 1655221146000,
                //         end: 1655221816000,
                //     }
                // })
            })
    }

    return (
        <div style={{ height: '100vh', background: 'rgb(242, 242, 242)', padding: `6px 20px` }}>
            <Title />
            <div style={{
                zIndex: 10, background: '#ddd',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                position: 'fixed', bottom: 60, right: 10, width: 40, height: 40, borderRadius: 40,
            }}
                onClick={() => {
                    setUnit(unit + 1)
                }}><PlusOutlined /></div>
            <div style={{
                zIndex: 10, background: '#ddd',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                position: 'fixed', bottom: 110, right: 10, width: 40, height: 40, borderRadius: 40,
            }} onClick={() => setUnit(unit - 1)}><MinusOutlined /></div>

            <div style={{ overflow: 'hidden', background: 'rgb(242, 242, 242)' }}>
                <Header WIDTH_PER_2_5={WIDTH_PER_2_5} unit={unit} />
                {mqttData && mqttData[0] && mqttData.map((item) => {
                    const { machine_id } = item;
                    // if (!dataLine[machine_id]) return null;
                    if (item.end) {
                        const endTimeDiff = moment().diff(moment(item.end), 'minute');
                        if (endTimeDiff > 10) return null
                    }
                    return (
                        <div key={'' + item.id} style={{ display: 'flex', height: HEIGHT, padding: '0px 0px', background: '#393535' }}>
                            {/* Left */}
                            <div style={{ minWidth: LEFT_WIDTH, display: 'flex' }}>
                                <div style={{ flex: 2.7, background: '#322D2E', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid #151515' }}>
                                    <div style={{ fontSize: '1.85em', fontWeight: 'bold', color: '#9DCCE4', textAlign: 'center' }}> {machine_id} </div>
                                    <div style={{ fontSize: '1.45em', color: '#2D8DE6' }}> {item.product_name || ''}</div>
                                </div>
                                <div style={{ flex: 1, borderBottom: '1px solid #726262' }}>
                                    {/* <div style={{ height: '50%', fontSize: '1.2em', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> </div> */}
                                    <div style={{ height: '70%', fontSize: '1.2em', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Time </div>
                                </div>
                            </div>
                            {/* Main */}
                            <TimeShower
                                WIDTH_PER_2_5={WIDTH_PER_2_5}
                                start={item.start}
                                end={item.end}
                                item={dataLine[machine_id]}
                            />
                            {/*  */}
                        </div>
                    )
                })}
                <div style={{ height: '2vh', background: '#393535' }} />
            </div>
        </div>
    );
};

const TimeShower = ({ WIDTH_PER_2_5, item, start: timeStart, end: endTime }) => {
    // state
    const [time, setTime] = useState(0);
    const [arrTime, setArrTime] = useState([0]);
    const planTime = useMemo(() => arrTime[arrTime.length - 1], [arrTime]);

    // useEffect(() => {
    //     const listStep = [];
    //     let temp = 0;
    //     Object.keys(item).map((key) => {
    //         temp = temp + Number(item[key]);
    //         listStep.push(temp);
    //     });
    //     console.log('listStep', listStep);
    //     setArrTime(listStep)
    // }, [item])

    useEffect(() => {
        _calCalTime(timeStart);
        let inter = null;
        if (endTime) {
            const timeDiff = moment(endTime).diff(moment(timeStart), 'minute');
            console.log('timeDiff==== endTime', timeDiff, moment(timeStart).format("HH:mm:ss"), moment(endTime).format("HH:mm:ss"))
            setTime(timeDiff);
            clearInterval(inter);
        } else {
            inter = setInterval(() => {
                _calCalTime(timeStart);
            }, 1000);
        }
        return () => {
            clearInterval(inter)
        }

    }, [timeStart, endTime]);

    const _calCalTime = (timeStart) => {
        const timeDiff = moment().diff(moment(timeStart), 'minute')
        console.log('timeDiff', timeDiff, moment(timeStart).format("HH:mm:ss"))
        setTime(timeDiff);
    }

    return (

        <div style={{
            flex: 1,
            padding: '2vh 0px', borderBottom: '1px solid #726262'
        }}>
            {/* <StepsShow
                WIDTH_PER_2_5={WIDTH_PER_2_5}
                item={item}
                time={time}
                arrTime={arrTime}
                planTime={planTime}
            /> */}
            {/* time running */}
            <TimeShow
                WIDTH_PER_2_5={WIDTH_PER_2_5}
                item={item}
                time={time}
                arrTime={arrTime}
                planTime={planTime}
                isEnd={!!endTime}
            />
        </div>
    )
}

const TimeShow = ({ WIDTH_PER_2_5, planTime, time, isEnd }) => {
    return (
        <div style={{
            height: '60%', background: '#ACAAE2',
            width: `calc(${WIDTH_PER_2_5} * ${convertTimeToWidth(planTime)})`,
        }}>
            <Tooltip title={`${time}'`}>
                <div style={{ width: `calc(${WIDTH_PER_2_5} * ${convertTimeToWidth(time)})`, height: '100%', background: '#615DC4', position: 'relative' }}>
                    {time > planTime ? <div style={{
                        height: '100%', background: '#615DC4',
                        width: `calc(${WIDTH_PER_2_5} * ${convertTimeToWidth(planTime)})`,
                    }} /> : null}
                    <div style={{ color: '#C0FF89', position: 'absolute', right: -20, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>{time}</div>
                    {isEnd ? <div style={{
                        position: 'absolute', right: 0, top: 0,
                        background: 'green', height: '100%', width: 2
                    }} /> : null}
                </div>
            </Tooltip>
        </div>
    )
}

const StepsShow = ({ WIDTH_PER_2_5, item, time, arrTime, planTime }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        for (var i = arrTime.length - 1; i >= 0; i--) {
            if (time > arrTime[i]) {
                setActiveIndex(arrTime.length - 1)
                return 0
            }
            if (time < arrTime[0]) {
                setActiveIndex(0)
                return 0
            }
            if (time <= arrTime[i] && time >= arrTime[i - 1]) {
                setActiveIndex(i)
                return 0
            }
        }
    }, [time, arrTime])

    return (<div style={{
        height: '40%', background: '#C5C4E6', display: 'flex',
        width: `calc(${WIDTH_PER_2_5} * ${convertTimeToWidth(planTime)})`,
    }}>
        {
            Object.keys(item).map((key, indexStep) => {
                return (
                    <div key={key} style={{
                        // fontWeight: 'bold', 
                        fontSize: '0.8em',
                        width: `calc(${WIDTH_PER_2_5} * ${convertTimeToWidth(item[key])})`,
                        borderLeft: !indexStep ? 'none' : '1px solid rgb(128, 128, 128)',
                        textTransform: 'capitalize',
                        // textOverflow: 'ellipsis',
                        fontFamily: 'Arial, sans-serif',
                        // overflow: 'hidden',
                        // whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0px 2px',
                        background: activeIndex === indexStep ? '#FFFF7C' : 'rgb(64, 64, 64)',
                        color: activeIndex === indexStep ? '#000' : '#fff',
                    }}>
                        <Tooltip title={key.replaceAll('_', ' ').replaceAll('and', '&') + ` (${item[key]}')`}>
                            {key.replaceAll('_', ' ').replaceAll('and', '&')}
                        </Tooltip>
                    </div>)
            })
        }
    </div>)

}

const TimeRun = ({
    timeStart = 1645024941608,
    timeEnd,
    planTime,
    WIDTH_PER_2_5
}) => {
    const [time, setTime] = useState(10);
    useEffect(() => {
        const timeDiff = moment().diff(moment(timeStart), 'minutes')
        setTime(timeDiff);
        const inter = setInterval(() => {
            const timeDiff = moment().diff(moment(timeStart), 'minutes')
            setTime(timeDiff);
        }, 1000 * 60);
        return () => {
            clearInterval(inter)
        }
    }, [timeStart]);
    // if (planTime)

    return (

        <Tooltip title={`${time}'`}>
            <div style={{ width: `calc(${WIDTH_PER_2_5} * ${convertTimeToWidth(time)})`, height: '100%', background: '#aaa' }}>

                {time > planTime ? <div style={{
                    height: '100%', background: '#817273',
                    width: `calc(${WIDTH_PER_2_5} * ${convertTimeToWidth(planTime)})`,
                }} /> : null}
            </div>
        </Tooltip>
    )
}

const convertTimeToWidth = (time) => {
    return time / 2.5
}

const Title = () => {
    return (
        <div style={{ background: '#000', display: 'flex', color: '#fff' }} >
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <img style={{ height: 50 }} src={images.nidec} /> </div>
            <div style={{
                flex: 5, fontSize: '3em', textAlign: 'center',
                fontWeight: '600',
                textTransform: 'uppercase'
            }}> change mold andon control board </div>
        </div>
    )
}

const Header = ({ WIDTH_PER_2_5, unit }) => {
    return (
        <div style={{ display: 'flex', background: 'rgb(242, 242, 242)' }}>
            <div style={{ minWidth: LEFT_WIDTH, display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ flex: 2.7, }}>
                    <div>(Time Minutes)</div>
                    <div style={{ flex: 2, display: 'flex', padding: '4px 5px', color: '#fff', fontWeight: 'bold', background: '#2B451B' }}>
                        <div style={{ flex: 1 }}>Machine/</div>
                        <div style={{ flex: 2 }}>Product</div>
                    </div>
                </div>
                <div style={{ flex: 1, background: '#000' }}>
                    &nbsp;
                </div>
            </div>
            {Array(unit + 10).fill(0).map((_, index) => {
                return (
                    <div key={'' + index} style={{ minWidth: `calc(${WIDTH_PER_2_5})` }}>
                        {index % (unit + 10 > 50 ? 4 : 2) ?
                            <div style={{ height: '20px', color: '#6d7071' }} /> :
                            <div style={{ height: '20px', color: '#000', fontWeight: '600' }}>{index / 2 * 5}</div>
                        }
                        <div style={{ width: '100%', height: 4, borderRight: '1px solid rgb(170, 170, 170)', borderLeft: '1px solid rgb(170, 170, 170)' }}></div>
                        {index % (unit + 10 > 50 ? 4 : 2) ?
                            <div style={{ backgroundColor: '#a09c9b', borderTop: '1px solid rgb(170, 170, 170)', borderLeft: '1px solid rgb(170, 170, 170)', height: '28px' }}></div> :
                            <div style={{ backgroundColor: '#a09c9b', borderTop: '1px solid rgb(170, 170, 170)', borderLeft: '1px solid #e4e0df', height: '28px' }}></div>}
                    </div>
                )
            })}
        </div>
    )
}
export default App;