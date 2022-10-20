import { Col, Row, Skeleton } from 'antd';
import axios from 'axios';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import React, { useState } from 'react';

import { BtnTus } from 'com/btn_tutorial';

const ENDPOINT = 'http://localhost:3888';

const Cards = () => {
	const [loading, setLoading] = React.useState(false);
	const [machineShow, setMachineShow] = useState();

	React.useEffect(() => {
		_requestRealtimeData();
		const inter = setInterval(() => {
			_requestRealtimeData();
		}, 1000 * 10);

		return () => {
			clearInterval(inter);
		};
	}, []);

	const _requestRealtimeData = () => {
		setLoading(true);
		axios
			.get(`${ENDPOINT}/voltage/cards`)
			.then(({ data }) => setMachineShow(data?.data || []))
			.catch((err) => {
				openNotificationWithIcon('error', JSON.stringify(err));
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<div style={{ margin: 'auto', overflow: 'hidden', padding: 8 }}>
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

			<BtnTus>
				<div>
					<div>A: Actual</div>
					<div>P: Plan</div>
					<div>E1_M1: Tên máy</div>
					<div>%: Đơn vị tính của OEE</div>
				</div>
			</BtnTus>
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
			<h3 style={{ textAlign: 'center', color: data?.status === '1' ? 'green' : 'red' }}>
        {data.id || 'Not found .id'}
      </h3>

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
