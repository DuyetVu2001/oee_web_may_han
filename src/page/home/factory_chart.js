import React, { Children } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
// com
import InApp from 'com/in_app_layout';
import { apiClient } from 'helper/request/api_client';
import { useHistory } from 'react-router-dom';
import {
    icon,
    convertStt,
} from './_config';
import {map_color} from '_config/constant'
const App = () => {
    const [structure, setStructure] = React.useState(null);
    const [treeData, setTreeData] = React.useState(null);

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

    const requestRealtimeData = (structure) => {
        apiClient.get('/structure_oee')
            .then(({ data }) => {
                try {
                    Object.keys(data).map(area => {
                        const { Oee, W, kWh, ...restLine } = data[area];
                        const dataUpdate = structure.children[area]
                        dataUpdate.Oee = Oee;
                        dataUpdate.area = area;
                        dataUpdate.status = convertStt(Oee);
                        dataUpdate.W = W;
                        dataUpdate.kWh = kWh;
                        Object.keys(restLine).map(line => {
                            const { Oee, W, kWh, ...restMachine } = restLine[line];
                            const dataLineUpdate = dataUpdate.children[line]
                            dataLineUpdate.Oee = Oee;
                            dataLineUpdate.area = area;
                            dataLineUpdate.line = line;
                            dataLineUpdate.status = convertStt(Oee);
                            dataLineUpdate.W = W;
                            dataLineUpdate.kWh = kWh;
                            // 
                            Object.keys(restMachine).map(m => {
                                const { Oee = '', W = '', kWh = '', PLan = '', Actual = '', status } = restMachine[m];
                                const dataMachineUpdate = dataLineUpdate.children[m]
                                dataMachineUpdate.machine = m;
                                dataMachineUpdate.line = line;
                                dataMachineUpdate.area = area;
                                dataMachineUpdate.Oee = Oee;
                                dataMachineUpdate.status = status;
                                dataMachineUpdate.W = W;
                                dataMachineUpdate.kWh = kWh;
                                dataMachineUpdate.Actual = Actual;
                                dataMachineUpdate.PLan = PLan;
                            })
                        })
                    });
                    setTreeData({ ...structure })
                } catch (er) {

                }
            })

    }

    const requestEnterprise = () => {
        apiClient.get('/enterprise/detail?id=ENTERPRISE_01')
            .then(({ data }) => {
                const dataConvert = {
                    name: data.name,
                    type: 'enterprise',
                    // sub_title: data.id,
                    status: '1',
                    children: {},
                }
                data.areas.map((area, index) => {
                    dataConvert.children[area.id] = {
                        name: area.id,
                        type: 'area',
                        // sub_title: data.name,
                        status: '1',
                        children: {},
                    }
                    area.lines.map((l, indexLine) => {
                        dataConvert.children[area.id].children[l.id] = {
                            name: l.id,
                            type: 'line',
                            // sub_title: data.name,
                            status: '1',
                            children: {},
                        }
                        l.machines.map(m => {
                            dataConvert.children[area.id].children[l.id].children[m.id] = {
                                type: 'machine',
                                name: m.name,
                                status: '1',
                            }
                        })

                    })
                })
                setStructure(dataConvert)
            })
    }
    if (!structure) return null;
    return (
        <Tree label={<RenderHeader info={structure} />}>
            {structure.children ? Object.keys(structure.children).map(key => <RenderTree key={key} note={structure.children[key]} />) : null}
        </Tree>
    );
};

const RenderTree = ({ note = {} }) => {
    const { children = null, ...info } = note;
    return (
        <TreeNode label={<RenderNote info={info} />}>
            {
                children ?
                    Object.keys(children).map(key => <RenderTree key={key} note={children[key]} />) :
                    null
            }
        </TreeNode>
    )
};

const RenderHeader = ({ info }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ border: `1px solid #ddd`, borderRadius: 3, width: 250 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5, paddingRight: 10 }}>
                    <div style={{ height: 27, width: 5, marginRight: 5, background: map_color[info.status] || '#ddd', alignSelf: 'flex-start' }} />
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {icon[info.type]}
                        <div style={{ fontSize: 13 }}>{info.name}</div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const RenderNote = ({ info }) => {
    const history = useHistory();
    return (
        <div
            onClick={() => history.push(`/monitor?machine_id=${info.machine || ''}&area=${info.area || ''}&line=${info.line || ''}`)}

            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ border: `1px solid #ddd`, borderRadius: 6, width: 'enterprise' === info.type ? 250 : 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', }}>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5px 0' }}>
                        {icon[info.type]}
                        <div style={{ fontSize: '1.2vw', fontWeight: '500' }}>{info.name}</div>
                    </div>
                </div>
                <div style={{ background: map_color[info.status] || '#ddd', borderRadius: 3, }}>
                    <span style={{ fontSize: '2vw', color: '#fff', fontWeight: '600' }}>{(Number(info.Oee) || 0).toFixed(0)}%</span>
                </div>
                <div style={{ background: '#dedede', fontSize: '1.5vw', fontWeight: '500' }}>
                    {info.Actual ? <div style={{ display: 'flex' }}>
                        <div style={{ flex: 1 }}>A</div>
                        <span style={{ flex: 2, textAlign: 'left' }}> {(Number(info.Actual) || 0).toFixed(0)}</span>
                    </div> : null}
                    {info.PLan ? <div style={{ display: 'flex' }}>
                        <div style={{ flex: 1 }}>P</div>
                        <span style={{ flex: 2, textAlign: 'left' }}> {(Number(info.PLan) || 0).toFixed(0)}</span>
                    </div> : null}
                </div>
                {/* {info.Oee ? <div><span style={{ fontSize: 22, width: 200 }}>OEE: {Number(info.Oee).toFixed(2)}% </span></div> : null}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>

                        {info.W ? <span style={{ fontSize: 18, width: 200 }}>{Number(info.W).toFixed(2)} (W) </span> : null}
                        {info.kWh ? <span style={{ fontSize: 18, width: 200 }}>{Number(info.kWh).toFixed(2)} (kWh) </span> : null}

                        {info.Actual ? <span style={{ fontSize: 18, width: 200 }}>Actual: {Number(info.Actual).toFixed(2)} </span> : null}
                        {info.PLan ? <span style={{ fontSize: 18, width: 200 }}>PLan: {Number(info.PLan).toFixed(2)} </span> : null}
                    </div> */}
                {/* {info.Oee ? <div>Oee: {Number(info.Oee).toFixed(2)}%</div> : null} */}
            </div>
        </div>
    )
};

export default App;