import { SwapOutlined } from '@ant-design/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { LINE_WIDTH_CHART } from '../const';
import './change_mold_process.css'


const convertTimeToPosition = (val) => (78.5 / 24) + 'vw'
const convertLeftToPx = (val) => (78.5 / 24 * val) + 'vw'
const convertTimeData = (minute) => {
    return `calc(89.5vw - 169px) * ${minute} / 24`
}

const ChangeMold = ({ dataLine }) => {
    const history = useHistory()
    return (
        <div className='wrap'>
            <div>
            <SwapOutlined onClick={() => history.push('./')} style={{display : 'flex', fontSize : '30px' , marginLeft : '0' ,paddingLeft : '0' }}/>
            </div>
            <div className='chart' >
                <div>
                    <div className='tab-left-header'>
                        <span style={{ width: '60px', paddingLeft: '15px', paddingTop: '3px' }}>MC</span>
                        <span style={{ width: '100px', paddingLeft: '15px', paddingTop: '3px' }}>Part NO</span>
                    </div>
                    <div className='tab-left'>
                        {dataLine.map(item =>
                            <div className='item-chart'>
                                <div className='item1'>{item.nameSquare1}</div>
                                <div className='item2'>{item.nameSquare2}</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='tab-right-header'>
                    <div style={{ display: 'flex', position: 'absolute', top: 48, marginLeft: '10px', opacity: 0.8, width: 'calc(100% - 180px)', height: '27px' }}>
                        {Array(24).fill(0).map((_, index) => {
                            return (
                                <div style={{ width: 'calc((89.5vw - 169px)/24)' }}>
                                    {index % 2 ? <div style={{ height: '30px', color: '#6d7071' }}></div> : <div style={{ height: '30px', color: '#6d7071' ,fontWeight : '600' }}>{(index + 2) / 2 * 5}</div>}
                                    <div style={{ width: '100%', height: 4, borderRight: '1px solid rgb(170, 170, 170)', borderLeft: '1px solid rgb(170, 170, 170)' }}></div>
                                    {index % 2 ? <div style={{ backgroundColor: '#a09c9b', borderTop: '1px solid rgb(170, 170, 170)', borderLeft: '1px solid rgb(170, 170, 170)', height: '28px' }}></div> : <div style={{ backgroundColor: '#a09c9b', borderTop: '1px solid rgb(170, 170, 170)', borderLeft: '1px solid #e4e0df', height: '28px' }}></div>}
                                </div>
                            )
                        })}
                    </div>
                    <div style={{ position: 'absolute', marginTop: '22px', height: '80vh', width: '79vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginTop: '26px' }}>
                        {dataLine.map((item, index) => {
                            return (
                               
                                    <div className='crossbar'>
                                        <div style={{ width: `calc((89.5vw - 169px) * ${item.data.standard_time} / 24)`, height: "11vh", backgroundColor: 'white', position: 'relative', borderRadius: 2, display: 'flex', alignItems: 'flex-end' }}>
                                            <div style={{ width: `calc((89.5vw - 169px) * ${item.data.time} / 24)`, height: '9vh', backgroundColor: '#8b8081', position: 'absolute', display: 'flex' }}>
                                                {Array(Math.floor(item.data.time / 2)).fill(0).map((_, index) => {
                                                    return <div style={{ width: '2px', height: '100%', backgroundColor: '#8a50b9', position: 'absolute', left: `calc((89.5vw - 169px) * ${(index + 1) * 2} / 24)` }}></div>
                                                })}
                                            </div>
                                        </div>
                                        <div style={{ width: `calc((89.5vw - 169px) * ${item.data.residuals} / 24)`, height: "11vh", backgroundColor: '#d60093', borderRadius: 1 }}></div>
                                    </div>
                                 
                                
                            )
                        })}
                    </div>
                    <div style={{ position: 'absolute', marginTop: '22px', height: '80vh', width: '79vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginTop: '26px' }}>
                        {
                            dataLine.map((_ , index) => {
                                return (
                                    <div style={{width : `calc((89.5vw - 169px)` , height : '3px' , backgroundColor : '#6e6566' , marginTop : '100px'}}></div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ChangeMold;