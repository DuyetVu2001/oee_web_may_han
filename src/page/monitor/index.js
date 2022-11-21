import InApp from 'com/in_app_layout';
import ReloadBtn from 'com/reload_btn';
import { useQuery } from 'helper/hook/get_query';
import { useEffect, useState } from 'react';
import Tag, { TAG_COLORS } from './com/tag';

import axios from 'axios';
import moment from 'moment';

import { Select } from 'antd';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { LoadingOutlined } from '@ant-design/icons';
import { TEST_HOST } from '_config/constant';
import { BtnTus } from 'com/btn_tutorial';

const FAKE_DETAIL = {
	id: 'may1',
	status: '1',
	voltage: [
		{
			key: 'uab',
			value: '1',
		},
		{
			key: 'ubc',
			value: 2,
		},
		{
			key: 'uca',
			value: 3,
		},
		{
			key: 'udc',
			value: 4,
		},
	],
	current: [
		{
			key: 'ia',
			value: 2,
		},
		{
			key: 'ib',
			value: 2,
		},
		{
			key: 'ic',
			value: 2,
		},
		{
			key: 'idc',
			value: 2,
		},
	],
	wire_info: [
		{
			key: 'wire_out_velocity',
			value: 2,
		},
		{
			key: 'wire_consumption',
			value: 2,
		},
		{
			key: 'power_consumption',
			value: 2,
		},
	],
};

const FILTER_TYPES = [
	{
		id: 1,
		label: '1 day',
	},
	{
		id: 24,
		label: '24 h',
	},
	{
		id: 30,
		label: '30 days',
	},
];

const LOCAL_STORAGE_UNIQUE_KEY = 'charts_reload_time';

export default function MonitorPage() {
	let query = useQuery();

	const [loading, setLoading] = useState(false);
	const [reloadTime, setReloadTime] = useState(
		localStorage.getItem(LOCAL_STORAGE_UNIQUE_KEY) || 10
	);
	const [machinesName, setMachinesName] = useState();
	const [filterTypeSelected, setFilterTypeSelected] = useState(
		FILTER_TYPES[0].id
	);
	const [machineNameSelected, setMachineNameSelected] = useState();
	const [machinesDetail, setMachinesDetail] = useState(FAKE_DETAIL);

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
		const machineId = query.get('id');
		setMachineNameSelected(machineId);
	}, [query]);

	useEffect(() => {
		axios
			.get(`${TEST_HOST}/machines/name`)
			.then((res) => {
				const machines = res.data;
				setMachinesName(machines);

				if (!query.get('id')) setMachineNameSelected(machines?.[0]);
				else setMachineNameSelected(query.get('id'));
			})
			.catch((err) => openNotificationWithIcon('error', JSON.stringify(err)));
	}, [reloadTime, query]);

	useEffect(() => {
		if (!machineNameSelected) return () => {};

		_requestChart();
		_requestDetailMachine();
		const inter = setInterval(() => {
			_requestChart();
			_requestDetailMachine();
		}, 1000 * reloadTime);

		return () => {
			clearInterval(inter);
		};
	}, [reloadTime, machineNameSelected, machineNameSelected]);

	useEffect(() => {
		if (!machineNameSelected) return () => {};
		_requestChart();
	}, [filterTypeSelected]);

	const _requestChart = async () => {
		setLoading(true);

		try {
			const resChart = await axios.get(
				`${TEST_HOST}/machines/line-chart?type=${filterTypeSelected}&machineId=${machineNameSelected}`
			);

			// handle data chart
			const data = resChart.data?.data || [];
			const xAxis = Object.values(data)?.[0]?.map((item) =>
				moment.unix(item.time).format('MM:HH DD/MM/YYYY')
			);
			const series = Object.keys(data).map((item) => ({
				data: data[item]?.map((item2) => +item2.value) || [],
				name: item,
			}));

			setOptions((prevState) => ({
				...prevState,
				series,
				xAxis: { categories: xAxis },
			}));
		} catch (err) {
			openNotificationWithIcon('error', JSON.stringify(err));
		} finally {
			setLoading(false);
		}
	};

	const _requestDetailMachine = async () => {
		setLoading(true);

		try {
			const resChart = await axios.get(
				`${TEST_HOST}/machines/details?machineId=${machineNameSelected}`
			);

			setMachinesDetail((resChart.data.data[0]));
		} catch (err) {
			openNotificationWithIcon('error', JSON.stringify(err));
		} finally {
			setLoading(false);
		}
	};

	const handleReloadTime = (time) => {
		setReloadTime(time);

		localStorage.setItem(LOCAL_STORAGE_UNIQUE_KEY, time);
	};

	return (
		<InApp>
			<div style={{ marginTop: 6 }}>
				{/* FILTER */}
				<div
					style={{
						marginLeft: 12,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginBottom: 6,
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center' }}>
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
										value={machineNameSelected}
										optionLabelProp="label"
										onChange={setMachineNameSelected}
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
					</div>

					<ReloadBtn
						reloadTime={reloadTime}
						handleReloadTime={handleReloadTime}
						handleReloadBtn={() => {
							_requestDetailMachine();
							_requestChart();
						}}
						loading={loading}
					/>
				</div>

				{/* TAGS SPECS */}
				<div style={{ marginBottom: 22, display: 'flex'}}>
					<div>
						{machinesDetail.current?.map((i, index) => (
							<Tag label={i.key} value={Number(i.value || 0 ).toFixed(2)} color={TAG_COLORS[0]} />
						))}

						<div className="">
							{machinesDetail.voltage?.map((i, index) => (
								<Tag label={i.key} value={Number(i.value || 0 ).toFixed(2)} color={TAG_COLORS[2]} />
							))}
						</div>
					</div>

					{machinesDetail.wire_info?.map((i, index) => (
						<Tag  label={i.key} value={Number(i.value || 0 ).toFixed(2)}></Tag>
					))}
				</div>

				{/* CHART */}
				<div style={{ display: 'flex', alignItems: 'center', marginLeft: 16 }}>
					<p
						style={{
							marginRight: 6,
							marginBottom: 'unset',
							fontWeight: 600,
						}}
					>
						Lọc:
					</p>

					<Select
						style={{ width: 96 }}
						defaultValue={FILTER_TYPES[0].id}
						optionLabelProp="label"
						onChange={setFilterTypeSelected}
					>
						{FILTER_TYPES.map((i) => {
							return (
								<Select.Option value={i.id} label={i.label}>
									<div>{i.label}</div>
								</Select.Option>
							);
						})}
					</Select>
				</div>
				<div
					style={{
						background: '#fff',
						padding: 16,
						paddingTop: 0,
						overflow: 'hidden',
					}}
					className="hidden-scroll"
				>
					<HighchartsReact highcharts={Highcharts} options={options} />
				</div>
			</div>
		</InApp>
	);
}
