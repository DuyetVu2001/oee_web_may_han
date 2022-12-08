import { Col, Row, Skeleton } from 'antd';
import axios from 'axios';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import React, { Fragment, useState } from 'react';

import { BtnTus } from 'com/btn_tutorial';
import ReloadBtn from 'com/reload_btn';
import { TEST_HOST } from '_config/constant';
import { useHistory } from 'react-router-dom';

const LOCAL_STORAGE_UNIQUE_KEY = 'cards_reload_time';

const Cards2 = () => {
	let history = useHistory();

	const [loading, setLoading] = React.useState(false);
	const [machineShow, setMachineShow] = useState();
	const [reloadTime, setReloadTime] = useState(
		localStorage.getItem(LOCAL_STORAGE_UNIQUE_KEY) || 10
	);

	React.useEffect(() => {
		_requestRealtimeData();
		const inter = setInterval(() => {
			_requestRealtimeData();
		}, 1000 * reloadTime);

		return () => {
			clearInterval(inter);
		};
	}, [reloadTime]);

	const _requestRealtimeData = () => {
		setLoading(true);

		axios
			.get(`${TEST_HOST}/machines`)
			.then(({ data }) => setMachineShow(data?.data || []))
			.catch((err) => {
				openNotificationWithIcon('error', JSON.stringify(err));
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleReloadTime = (time) => {
		setReloadTime(time);

		localStorage.setItem(LOCAL_STORAGE_UNIQUE_KEY, time);
	};

	const handleRedirect = (machine_id) => {

		// history.push(`/machines/machine-info?machineId=${id}`);
		history.push(`/monitor?machineId=${machine_id}`);
		// console.log("ID :", id);
	};

	return (
		<div
			style={{ margin: 'auto', overflow: 'hidden', padding: 8, paddingTop: 0 }}
		>
			<div
				style={{
					marginBottom: 22,
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<div className=""></div>
			</div>

			<Row
				gutter={[
					{ xs: 6, sm: 12 },
					{ xs: 6, sm: 12 },
				]}
			>
				{machineShow?.map((data, index) => (
					
					<Fragment key={index}>
						<Col xs={24} sm={12} md={8} lg={6} xxl={4}>
							<Card data={data} onClick={() => handleRedirect(data?.name)} />
						</Col>
					</Fragment>
				))
				}
			</Row>

			{!machineShow ? <Skeleton /> : null}

		</div>
	);
};

const Card = ({ data, onClick = () => {} }) => {
	// const history = useHistory();
	return (
		<div
			// onClick={() => history.push(`/monitor/machine-info?machineId=${data.machineId || ''}`)}
			onClick={onClick}
			style={{
				borderRadius: 10,
				background: '#ccc',
				padding: '12px 8px',
				cursor: 'pointer',
			}}
		>

			<div style={{
                border: `1px solid #ccc`, height: '100%',
                borderRadius: 6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '3px 0' }}>
                    <div style={{ fontSize: '1.5vw', fontWeight: '600' }}>{data.name || 'Not found machine'} </div>
                </div>
                <div style={{
                    flex: 1,
                    background: data?.allowReading === '1' ? 'green' : '#aaa',
                    borderRadius: 3,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <span style={{ fontSize: '4.5vw', lineHeight: -10, color: '#fff', fontWeight: '600' }}>{(Number(data.powerConsumption) || 0).toFixed(2)}</span>
                </div>
                <div style={{ background: '#dedede', fontSize: '1.8vw', fontWeight: '600', padding: '0px 25px', }}>
                    <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -10, }}>
                        <span style={{ textAlign: 'left' }}>Dòng ra</span>
                        <span style={{ textAlign: 'left' }}>{(Number(data.udc) || 0).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -10, }}>
                        <span style={{ textAlign: 'left' }}>Áp ra</span>
                        <span style={{ textAlign: 'left' }}>{(Number(data.idc) || 0).toFixed(2)}</span>
                    </div>
                </div>
            </div>

		</div>
	);
};

export default Cards2;
