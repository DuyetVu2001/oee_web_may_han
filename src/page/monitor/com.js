import { FieldTimeOutlined, HourglassOutlined } from '@ant-design/icons';
import moment from 'moment';
import React from 'react';

const Com = ({ item, onClick }) => {
    return (
        <div onClick={onClick} className="com"
            style={{
                background: item.status == 2 ?
                    "linear-gradient(120deg, rgb(226, 144, 0), rgb(255, 108, 22))" :
                    "linear-gradient(120deg, rgb(169, 27, 25), rgb(214, 32, 78))"
            }}>
            <div style={{ display: 'flex', height: '10%', alignItems: 'center' }}>
                <FieldTimeOutlined style={{ fontSize: '1.5vw', margin: '0 5px' }} />
                <div style={{ fontSize: '1.5vw', fontWeight: 700 }}>{item.ts}</div>
            </div>
            {/* <div style={{ height: '10%', display: 'flex', alignItems: 'center', fontSize: '1.5vw', fontWeight: '500', }}>{moment(item.timestamp * 1000).format("HH:mm")} - {moment((item.timestamp + item.duration) * 1000).format("HH:mm")}</div> */}
            <div style={{ display: 'flex', height: '10%', alignItems: 'center' }}>
                <HourglassOutlined style={{ fontSize: '1.5vw', margin: '0 5px' }} />
                <div style={{ fontSize: '1.5vw', fontWeight: 700 }}>{(item.duration / 60).toFixed()}min</div>
            </div>
        </div>
    );
};

export default Com;