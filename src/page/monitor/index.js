import InApp from 'com/in_app_layout';
import ReloadBtn from 'com/reload_btn';
import { useQuery } from 'helper/hook/get_query';
import { useEffect, useState } from 'react';
import Tag, { TAG_COLORS } from './com/tag';

import axios from 'axios';
import moment from 'moment';

import { Select } from 'antd';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import { TEST_HOST } from '_config/constant';
import { BtnTus } from 'com/btn_tutorial';


const LOCAL_STORAGE_UNIQUE_KEY = 'charts_reload_time';

export default function MonitorPage() {
	let query = useQuery();

	const [loading, setLoading] = useState(false);
	const [reloadTime, setReloadTime] = useState(
		localStorage.getItem(LOCAL_STORAGE_UNIQUE_KEY) || 10
	);
	const [machinesName, setMachinesName] = useState();

	const [machineNameSelected, setMachineNameSelected] = useState();
	const [machinesDetail, setMachinesDetail] = useState();



	useEffect(() => {
		const machineId = query.get('id');
		setMachineNameSelected(machineId);
	}, [query]);

	useEffect(() => {
		axios
			.get(`${TEST_HOST}/machines`)
			.then((res) => {
				const machines = res.data;
				setMachinesName(machines);

				if (!query.get('id')) setMachineNameSelected(machines?.[0]);
				else setMachineNameSelected(query.get('id'));
			})
			// .catch((err) => openNotificationWithIcon('error', JSON.stringify(err)));
			.catch((err) => openNotificationWithIcon('error', 'Lỗi lấy tên máy'));
	}, [reloadTime, query]);

	useEffect(() => {
		if (!machineNameSelected) return () => {};

		_requestDetailMachine();
		const inter = setInterval(() => {
			_requestDetailMachine();
		}, 1000 * reloadTime);

		return () => {
			clearInterval(inter);
		};
	}, [reloadTime, machineNameSelected, machineNameSelected]);

	useEffect(() => {
		if (!machineNameSelected) return () => {};
	}, []);


	const _requestDetailMachine = async () => {
		setLoading(true);

		try {
			const resChart = await axios.get(
				`${TEST_HOST}/machines/machine-info?machineId=${machineNameSelected}`
			);

			setMachinesDetail(resChart.data.data[0]);
		} catch (err) {
			// openNotificationWithIcon('error', JSON.stringify(err));
			openNotificationWithIcon('error', 'Lỗi lấy thông tin máy!');
		} finally {
			setLoading(false);
		}
	};

	return (
		<InApp>
			<h1>Biểu đồ grafana</h1>
			<iframe  
					width="100%"
    				height="90%" 
					src='http://20.115.75.139:3000/d/7oLPOFK4z/dong-ap?orgId=1&refresh=5s' 
					title='Biểu đồ Grafana'
			/>
		</InApp>
	);
}
