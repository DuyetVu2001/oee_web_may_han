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
			.get(`${TEST_HOST}/machines/cards`)
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

	const handleRedirect = (id) => {
		history.push(`/monitor?id=${id}`);
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

				<ReloadBtn
					reloadTime={reloadTime}
					handleReloadTime={handleReloadTime}
					handleReloadBtn={_requestRealtimeData}
					loading={loading}
				/>
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
							<Card data={data} onClick={() => handleRedirect(data?.id)} />
						</Col>
					</Fragment>
				))}
			</Row>

			{!machineShow ? <Skeleton /> : null}

			{/* <BtnTus>
				<div>
					<div>A: Actual</div>
					<div>P: Plan</div>
					<div>E1_M1: Tên máy</div>
					<div>%: Đơn vị tính của OEE</div>
				</div>
			</BtnTus> */}
		</div>
	);
};

const Card = ({ data, onClick = () => {} }) => {
	return (
		<div
			onClick={onClick}
			style={{
				borderRadius: 10,
				background: '#ccc',
				padding: '12px 8px',
				cursor: 'pointer',
			}}
		>
			<h3
				style={{
					fontSize: 24,
					textAlign: 'center',
				}}
			>
				{data.id || 'Not found .id'}
			</h3>

			<p
				style={{
					borderRadius: 8,
					padding: '46px 18px',
					marginBottom: 10,
					marginTop: 12,

					color: 'white',
					fontSize: 46,
					textAlign: 'center',
					fontWeight: 500,
					background: data?.status === '1' ? 'green' : '#aaa',
				}}
			>
				{data.wattage}
			</p>

			{data?.detail?.map((item, index) => (
				<div
					key={index}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '0 8px',

						fontSize: 18,
						fontWeight: 500,
					}}
				>
					<p style={{ marginBlock: 'unset', fontSize: 26 }}>{item.key}</p>
					<p style={{ marginBlock: 'unset', fontSize: 26 }}>{item.value}</p>
				</div>
			))}
		</div>
	);
};

export default Cards2;
