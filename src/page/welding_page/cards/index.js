import { Col, Row, Skeleton } from 'antd';
import axios from 'axios';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import React, { useState } from 'react';

import { BtnTus } from 'com/btn_tutorial';
import ReloadBtn from 'com/reload_btn';
import { TEST_HOST } from '_config/constant';

const LOCAL_STORAGE_UNIQUE_KEY = 'cards_reload_time';

const Cards = () => {
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
				{machineShow?.map((data) => (
					<>
						<Col xs={24} sm={12} md={8} lg={6} xxl={4}>
							<Card data={data} />
						</Col>
					</>
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

const Card = ({ data }) => {
	return (
		<div
			style={{
				// width: 236,
				borderRadius: 10,
				background: '#484552',
				padding: '12px 8px',
			}}
		>
			<h3
				style={{
					fontSize: 22,
					textAlign: 'center',
					color: data?.status === '1' ? 'green' : 'red',
				}}
			>
				{data.id || 'Not found .id'}
				<p style={{ margin: 'unset', fontSize: 15 }}>
					({data?.status === '1' ? 'online' : 'offline'})
				</p>
			</h3>

			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '0 8px',

					color: 'white',
					fontSize: 18,
					fontWeight: 500,
				}}
			>
				<p style={{ margin: 'unset' }}>Runtime</p>
				<p style={{ margin: 'unset' }}>{data.runtime}</p>
			</div>
			<p
				style={{
					borderRadius: 8,
					padding: '4px 8px',
					marginBottom: 10,
					marginTop: 12,

					color: 'white',
					fontSize: 18,
					background: '#C7da49',
				}}
			>
				Thông số dây hàn
			</p>

			{data?.wire_info?.map((item, index) => (
				<div
					key={index}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '0 8px',

						color: '#C7da49',
						fontSize: 18,
						fontWeight: 500,
					}}
				>
					<p style={{ marginBlock: 'unset' }}>{item.key}</p>
					<p style={{ marginBlock: 'unset' }}>{item.value}</p>
				</div>
			))}

			<p
				style={{
					borderRadius: 8,
					padding: '4px 8px',
					marginBottom: 10,
					marginTop: 12,

					color: 'white',
					fontSize: 18,
					background: '#5A86DE',
				}}
			>
				Dòng
			</p>

			{data?.current?.map((item, index) => (
				<div
					key={index}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '0 8px',

						color: '#5A86DE',
						fontSize: 18,
						fontWeight: 500,
					}}
				>
					<p style={{ marginBlock: 'unset' }}>{item.key}</p>
					<p style={{ marginBlock: 'unset' }}>{item.value}</p>
				</div>
			))}

			{/* ============================ */}
			<p
				style={{
					borderRadius: 8,
					padding: '4px 8px',
					marginBottom: 10,
					marginTop: 24,

					color: 'white',
					fontSize: 18,
					background: '#FB7936',
				}}
			>
				Áp
			</p>

			{data?.voltage?.map((item, index) => (
				<div
					key={index}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '0 8px',

						color: '#FB7936',
						fontSize: 18,
						fontWeight: 500,
					}}
				>
					<p style={{ marginBlock: 'unset' }}>{item.key}</p>
					<p style={{ marginBlock: 'unset' }}>{item.value}</p>
				</div>
			))}
		</div>
	);
};

export default Cards;
