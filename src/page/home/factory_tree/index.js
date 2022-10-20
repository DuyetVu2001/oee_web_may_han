import React, { useState, useEffect } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
// com
import InApp from 'com/in_app_layout';
import { apiClient } from 'helper/request/api_client';
import { useHistory } from 'react-router-dom';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import { Skeleton } from "antd";
import {
    icon,
    convertStt,
} from '../_config';

import { map_color } from '_config/constant'
import _ from 'lodash';

const App = () => {
    const [structure, setStructure] = React.useState(null);
    const [treeData, setTreeData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [render, setRender] = React.useState(true);
    const window = useWindowSize();

    React.useEffect(() => {
        requestEnterprise();
    }, []);

    React.useEffect(() => {
        if (!structure) return () => { };
        requestRealtimeData(structure)
        const inter = setInterval(() => {
            requestRealtimeData(structure)
        }, 1000 * 30);
        return () => {
            clearInterval(inter);
        }
    }, [structure])


    const requestRealtimeData = (dataInput) => {
        console.log('dataInput', dataInput)
        const structure = _.cloneDeep(dataInput)
        apiClient.get('/structure_oee')
            .then(({ data }) => {
                try {
                    Object.keys(data).map(area => {
                        const { Oee, W, kWh, ...restLine } = data[area];
                        const dataUpdate = structure.children[area];
                        if (!dataUpdate) return 0;

                        dataUpdate.Oee = Oee;
                        dataUpdate.area = area;
                        dataUpdate.status = convertStt(Oee);
                        dataUpdate.W = W;
                        dataUpdate.kWh = kWh;
                        // if (0)
                        Object.keys(restLine).map(line => {
                            const { Oee, W, kWh, ...restMachine } = restLine[line];
                            const dataLineUpdate = dataUpdate.children[line];
                            if (!dataLineUpdate) return 0;
                            dataLineUpdate.line = line;
                            dataLineUpdate.Oee = Oee;
                            dataLineUpdate.status = convertStt(Oee);
                            dataLineUpdate.W = W;
                            dataLineUpdate.kWh = kWh;
                            dataLineUpdate.children = {};
                            // 
                            _.chunk(Object.keys(restMachine), window.width > 1750 ? 3 : 2)
                                .map((listM, index) => {
                                    const dataMachineUpdate = {
                                        type: 'machine',
                                        data: []
                                    }
                                    listM.map((m, index) => {
                                        if (m) {
                                            dataMachineUpdate.data[index] = {}
                                            const { Oee = '', W = '', kWh = '', PLan = '', Actual = '' } = restMachine[m];
                                            
                                            dataMachineUpdate.data[index].area = area;
                                            dataMachineUpdate.data[index].line = line;
                                            dataMachineUpdate.data[index].machine_id = m;
                                            dataMachineUpdate.data[index].name = m;
                                            dataMachineUpdate.data[index].title = _.get(dataInput, `children[${area}].children[${line}].children[${m}].title`);
                                            dataMachineUpdate.data[index].Oee = Oee;
                                            dataMachineUpdate.data[index].status = convertStt(Oee);
                                            dataMachineUpdate.data[index].W = W;
                                            dataMachineUpdate.data[index].kWh = kWh;
                                            dataMachineUpdate.data[index].Actual = Actual;
                                            dataMachineUpdate.data[index].PLan = PLan;
                                            dataMachineUpdate.data[index].type = 'machine';
                                        }
                                    })
                                    dataLineUpdate.children[index] = dataMachineUpdate;

                                })
                        })
                    });
                    setTreeData(structure)
                    setRender(new Date())
                } catch (er) {
                    console.log('ddddd', er)
                }
            })
            .catch(err => {
                openNotificationWithIcon("error", JSON.stringify(err))
            })
            .finally(() => {
                setLoading(false)
            })

    }

    const _reload = () => {
        console.log('reload')
        requestRealtimeData(structure)
    }

    const requestEnterprise = () => {
        apiClient.get('/enterprise/detail')
            .then(({ data }) => {
                const dataConvert = {
                    name: data.name,
                    title: data.name,
                    type: 'enterprise',
                    // sub_title: data.id,
                    status: '1',
                    children: {},
                }
                data.areas.map((area, index) => {
                    dataConvert.children[area.id] = {
                        name: area.id,
                        type: 'area',
                        title: area.name,
                        // sub_title: data.name,
                        status: '1',
                        children: {},
                    }
                    area.lines.map((l, indexLine) => {
                        dataConvert.children[area.id].children[l.id] = {
                            name: l.id,
                            type: 'line',
                            title: l.name,
                            // sub_title: data.name,
                            status: '1',
                            children: {},
                        }
                        l.machines.map(m => {
                            dataConvert.children[area.id].children[l.id].children[m.id] = {
                                type: 'machine',
                                name: m.id,
                                title: m.name,
                                status: '1',
                            }
                        })
                        console.log('l.machines', dataConvert)

                    })
                })
                console.log('asdfa=======', dataConvert)
                setStructure(dataConvert)
            })
    }

    if (_.isEmpty(treeData) || loading) return <Skeleton />;

    return (
        <div style={{ marginTop: 10 }}>
            <Fn node={treeData} _reload={_reload} />
        </div>
    );
};

const RenderMachineNote = ({ info, _reload }) => {
    return (
        <div style={{ display: 'flex' }}>
            {info?.data?.map(val => <div key={val.name} style={{ marginRight: 8 }}>
                <RenderNote info={val} _reload={_reload} />
            </div>
            )}
        </div>
    )
};

const RenderNote = ({ info, _reload }) => {
    const history = useHistory();
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 2 }}>
            <div style={{ border: `1px solid #ddd`, borderRadius: 5, minWidth: info.type === 'machine' ? 250 : 230 }}>
                <div style={{ display: 'flex', alignItems: 'center', }}>
                    <div style={{ height: 27, width: 5, marginRight: 5, background: map_color[info.status] || '#ddd', alignSelf: 'flex-start', borderRadius: 2 }} />
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        margin: '3px 0'
                    }}>
                        <div style={{ alignSelf: 'flex-start' }}>
                            {icon[info.type]}
                        </div>
                        <div style={{ fontSize: '1.2vw', fontWeight: '600', flex: 1, maxWidth: 250 }}>
                            <div style={{ marginRight: 70, overflow: 'hidden' }}>
                                {info.title}
                            </div>
                        </div>
                    </div>
                </div>
                {info.Oee ? <div style={{ background: map_color[info.status] || '#ddd', borderRadius: 3, textAlign: 'center' }}>
                    <span style={{ fontSize: '2vw', color: '#fff', fontWeight: '600' }}>{(Number(info.Oee) || 0).toFixed(0)}%</span>
                </div> : null}
                <div style={{ background: '#dedede', fontSize: '1.5vw', fontWeight: '500', display: 'flex', padding: '0px 10px' }}>
                    {info.Actual ? <div style={{ display: 'flex', flex: 1 }}>
                        <span style={{ textAlign: 'left' }}>A: {(Number(info.Actual) || 0).toFixed(0)}</span>
                    </div> : null}
                    {info.PLan ? <div style={{ display: 'flex', flex: 1 }}>
                        <span style={{ textAlign: 'left' }}>P: {(Number(info.PLan) || 0).toFixed(0)}</span>
                    </div> : null}
                </div>
            </div>
            <div style={{ position: 'absolute', top: 5, right: 25 }}>
                <i onClick={() => {
                    if (_reload) _reload()
                }} class="fa-solid fa-arrow-rotate-left"></i>
                <i
                    onClick={() => history.push(`/monitor?machine_id=${info.machine_id || ''}&area=${info.area || ''}&line=${info.line || ''}`)}
                    class="fa-solid fa-share-from-square" style={{ marginLeft: 10 }}></i>
            </div>
        </div>
    )
};


export default App;

const Fn = ({ node, isLast, _reload }) => {
    const { children = null, ...info } = node;
    const [expand, setExpand] = React.useState(true);
    if (!children || Object.keys(children).length === 0) return <RenderLeaf info={info} isLast={isLast} _reload={_reload} />
    return (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <RenderParentNode  {...{ expand, setExpand, info, isLast, _reload }} />
            <div style={{
                borderLeft: Object.keys(children).length > 1 ? '1px solid #ddd' : 'none',
                marginTop: 15,
                marginLeft: -1
            }}>
                {expand ?
                    Object.keys(children).map((key, index) => <Fn
                        key={index}
                        node={children[key]}
                        _reload={_reload}
                        isLast={index + 1 === Object.keys(children).length}
                    />) :
                    null
                }
            </div>

            {isLast ? <div style={{ height: '100%', width: 2, position: 'absolute', top: expand ? '10%' : '50%', left: -1, background: '#fff' }} /> : null}
        </div>
    )
}


const RenderParentNode = ({ expand, setExpand, isLast, info, _reload }) => {
    return (
        <div style={{
            display: 'flex', alignItems: 'center',
            paddingBottom: 10, marginLeft: '-1px', position: 'relative'
        }}>
            <div style={{
                display: 'flex',
            }}>
                <div style={{
                    width: 15, height: 12, borderLeft: '1px solid #ddd',
                    borderBottom: '1px solid #ddd',
                    borderRadius: '0px 0px 0px 10px',
                    marginTop: 23,
                }} />
                <div style={{ height: 1, width: 15, background: '#ddd', marginTop: 34, marginLeft: 0, position: 'relative' }}>
                    <i className="fa-solid fa-play" style={{ position: "absolute", right: 0, fontSize: 10, top: -5, color: "#ccc" }}></i>
                </div>

                <div style={{}}>
                    <RenderNote info={info} _reload={_reload} />
                </div>
            </div>
            <div onClick={() => setExpand(!expand)} style={{
                height: 18, width: 18, borderRadius: 18,
                marginTop: 0, zIndex: 3,
                // background: '#ddd',
                display: 'flex',
                position: 'absolute',
                top: 6, right: 3,
                justifyContent: 'center', alignItems: 'center'
            }} >
                <i className={!expand ? "fa-solid fa-plus --fa-font-brands" : "fa-solid fa-minus"} style={{ color: '#222' }}></i>
            </div>
        </div>
    )
}
const RenderLeaf = ({ isLast, info, _reload }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 10, marginLeft: '-1px', position: 'relative' }}>
            <div style={{
                width: 15, height: 12, borderLeft: '1px solid #ddd',
                borderBottom: '1px solid #ddd', borderRadius: '0px 0px 0px 10px',
            }} />
            {/* <div style={{
                width: 15, height: 12, borderBottom: '1px solid #ddd',
            }} /> */}

            <div style={{ width: 15, height: 12, borderBottom: '1px solid #ddd', position: 'relative' }}>
                <i className="fa-solid fa-play" style={{ position: "absolute", right: 0, fontSize: 10, bottom: -5, color: "#ccc" }}></i>
            </div>
            <div style={{
                marginTop: 5,
            }}>
                {info.type === 'machine' ? <RenderMachineNote info={info} _reload={_reload} /> :
                    <RenderNote info={info} _reload={_reload} />}
            </div>
            {isLast ? <div style={{ height: 'calc(50%)', width: 2, position: 'absolute', bottom: 0, left: 0, background: '#fff' }} /> : null}
        </div>
    )
}


// Hook
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });
    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        // Add event listener
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}