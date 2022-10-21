import axios from 'axios';
import moment from 'moment';

import { Select } from 'antd';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useState } from 'react';
import { useEffect } from 'react';
import ReloadBtn from 'com/reload_btn';
import { LoadingOutlined } from '@ant-design/icons';

const ENDPOINT = 'http://localhost:3888';
const LOCAL_STORAGE_UNIQUE_KEY = 'charts_reload_time';

const Charts = () => {
	const [loading, setLoading] = useState(false);
	const [reloadTime, setReloadTime] = useState(
		localStorage.getItem(LOCAL_STORAGE_UNIQUE_KEY) || 10
	);

	const [machinesName, setMachinesName] = useState();

	const [options, setOptions] = useState({
		xAxis: {
			categories: [1, 2, 3, 4, 5, 6, 7],
		},
		chart: {
			type: 'spline',
		},
		title: {
			text: 'Demo chart',
		},
		series: [],
	});

	useEffect(() => {
		axios
			.get(`${ENDPOINT}/machines`)
			.then((res) => setMachinesName(res.data?.data.map((item) => item.id)));

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
			.get(`${ENDPOINT}/voltage/line-chart`)
			.then((res) => {
				const data = res.data?.data || [];

				const xAxis = data['m001']?.map((item) =>
					moment.unix(item.time).format('MM:HH DD/MM/YYYY')
				);

				const series = Object.keys(data).map((item) => ({
					data: data[item]?.map((item2) => item2.value) || [],
					name: item,
				}));

				setOptions((prevState) => ({
					...prevState,
					series,
					xAxis: { categories: xAxis },
				}));
			})
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
			style={{
				background: '#fff',
				padding: 16,
				paddingTop: 0,
				overflow: 'hidden',
			}}
			className="hidden-scroll"
		>
			<div
				style={{
					marginLeft: 12,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					{machinesName ? (
						<>
							<p
								style={{
									marginRight: 6,
									marginBottom: 'unset',
									fontWeight: 600,
								}}
							>
								Chọn máy:
							</p>

							<Select
								style={{ width: 120 }}
								defaultValue={machinesName?.[0]}
								optionLabelProp="label"
							>
								{machinesName?.map((i) => {
									return (
										<Select.Option value={i} label={i}>
											<div>{i}</div>
										</Select.Option>
									);
								})}
							</Select>
						</>
					) : (
						<LoadingOutlined />
					)}
				</div>

				<ReloadBtn
					reloadTime={reloadTime}
					handleReloadTime={handleReloadTime}
					handleReloadBtn={_requestRealtimeData}
					loading={loading}
				/>
			</div>
			<HighchartsReact highcharts={Highcharts} options={options} />
		</div>
	);
};
export default Charts;
