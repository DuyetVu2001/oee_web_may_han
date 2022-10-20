import axios from 'axios';
import moment from 'moment';

import { openNotificationWithIcon } from 'helper/request/notification_antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useState } from 'react';
import { useEffect } from 'react';

const ENDPOINT = 'http://localhost:3888';

const Charts = () => {
	const [options, setOptions] = useState({
		xAxis: {
			categories: [1, 2, 3, 4, 5, 6, 7],
		},
		chart: {
			type: 'spline',
		},
		title: {
			text: 'My chart',
		},
		series: [],
	});

	useEffect(() => {
		_requestRealtimeData();
		const inter = setInterval(() => {
			_requestRealtimeData();
		}, 1000 * 10);

		return () => {
			clearInterval(inter);
		};
	}, []);

	const _requestRealtimeData = () => {
		// setLoading(true);
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
				// setLoading(false);
			});
	};

	return (
		<div
			style={{
				background: '#fff',
				padding: 16,
				overflow: 'hidden',
			}}
			className="hidden-scroll"
		>
			<HighchartsReact highcharts={Highcharts} options={options} />
		</div>
	);
};
export default Charts;
