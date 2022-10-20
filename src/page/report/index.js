import React, { useEffect, useState } from 'react';

import ReactToPrint, { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import {
	SettingOutlined,
	SearchOutlined,
	SendOutlined,
	PrinterFilled
} from '@ant-design/icons'
import { Select, Row, Col, DatePicker, Button } from 'antd';
import {
	BrowserRouter as Router,
	Link,
	useLocation
} from "react-router-dom";
import { images } from 'helper/static/images';
import './styles.module.css'
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { openNotificationWithIcon } from 'helper/request/notification_antd';
import InApp from 'com/in_app_layout'

import ActualAndTarget from './com/actual_and_target';
import Waterfall from './com/waterfall';
import SendMail from './com/send_mail';
import OeeMonthly from './com/oee_monthly';
import OeeCount from './com/oee_count';
import { apiClient } from 'helper/request/api_client';
import { useTranslation } from 'react-i18next';


function Home() {
	const componentRef = React.useRef();
	const btnPrint = React.useRef();
	const User = useSelector(state => get(state, 'app.user', {}));
	const template = useSelector(state => get(state, 'app.user.template', {}) || {});
	const [dateEnterprise, setDataEnterprise] = React.useState({});
	const [visible, setVisible] = React.useState(false);

	const [initFilter, setInitFilter] = useState({
		from: Math.floor(moment().subtract(7, 'd').valueOf() / 1000),
		to: Math.floor(moment().valueOf() / 1000)

	})

	const [dataFilter, setDataFilter] = React.useState({
		// from: Math.floor(moment().subtract(7, 'd').valueOf() / 1000),
		// to: Math.floor(moment().valueOf() / 1000)
	});
	const titlePage = React.useMemo(() => {
		try {
			console.log('asdf3', dataFilter)
			const area = get(dateEnterprise, `${dataFilter.area}.name`)
			const line = get(dateEnterprise, `${dataFilter.area}.lineMap.${dataFilter.line}.name`)
			const machineList = get(dateEnterprise, `${dataFilter.area}.lineMap.${dataFilter.line}.machines`)
			let machine_id = dataFilter.machine_id
			if (machineList) {
				machine_id = machineList.map(i => {
					console.log('machine_idmachine_id', dataFilter.machine_id, i.id)
					if (dataFilter.machine_id.includes(i.id+'')) {
						return i.name;
					}
				})
			}
			return {
				date_from: `${moment(dataFilter.from * 1000).format('DD/MM/YYYY')}`,
				date_to: `${moment(dataFilter.to * 1000).format('DD/MM/YYYY')}`,
				...dataFilter,
				area, line, machine_id,
			}
		} catch (err) {
			return {}
		}

	}, [dataFilter])

	const params = useQuery();

	// 
	useEffect(() => {
		_requestData();
		if (params.get("machine_id")) {
			setDataFilter({
				...dataFilter,
				machine_id: params.get("machine_id"),
				from: params.get("from") || Math.floor(moment().subtract(7, 'd').valueOf() / 1000),
				to: params.get("to") || Math.floor(moment().valueOf() / 1000)
			});
		}
	}, [])

	const _requestData = async () => {
		const { data } = await apiClient.get('/enterprise/detail')
		const dataConvert = {};

		data.areas.map((area) => {
			dataConvert[area.id] = area;
			dataConvert[area.id].lineMap = {};
			area.lines.map((line) => {
				dataConvert[area.id].lineMap[line.id] = line
			})
		});

		setDataEnterprise(dataConvert)
	}
	const query = useQuery();


	useEffect(() => {
		try {
			if (!dateEnterprise) return () => { };
			if (query.get('machine_id') || query.get('line') || query.get('area')) {
				setTimeout(() => {
					setInitFilter({
						...dataFilter,
						machine_id: [query.get('machine_id')],
						line: query.get('line'),
						area: query.get('area'),
					})
					setDataFilter({
						...dataFilter,
						machine_id: [query.get('machine_id')],
						line: query.get('line'),
						area: query.get('area'),
					})

				}, 1000)
			} else {
				const listAreaIds = Object.keys(dateEnterprise)
				const lines = get(dateEnterprise, `[${listAreaIds[0]}].lineMap`);
				const linesId = Object.keys(lines)
				const machine = lines[linesId[0]].machines
				setDataFilter({
					...dataFilter,
					machine_id: ['' + machine[0].id],
					line: linesId[0],
					area: listAreaIds[0],
				})
				setInitFilter({
					...dataFilter,
					machine_id: ['' + machine[0].id],
					line: linesId[0],
					area: listAreaIds[0],
				})

			}
		} catch (err) {
			console.log('errors set default machine filter', err)
		}
	}, [dateEnterprise, query])

	const _requestData_ = async () => {
		try {

			const { data } = await apiClient.get('/enterprise/detail')
			const dataConvert = {};
			const dataInit = {}
			data.areas.map((area, indexArea) => {
				if (!indexArea && area.id) {
					// setArea(area.id);
					dataInit.area = area.id
					if (get(area, 'lines[0].id')) {
						// setLine(get(area, 'lines[0].id'))
						dataInit.line = get(area, 'lines[0].id')
						if (get(area, 'lines[0].machines[0].id')) {
							// setMachine(get(area, 'lines[0].machines[0].id'))
							dataInit.machine_id = [get(area, 'lines[0].machines[0].id')]
						}
					}
				}
				dataConvert[area.id] = {};
				area.lines.map((l, lIndex) => {
					dataConvert[area.id][l.id] = l.machines
				})
			})

			setDataEnterprise(dataConvert);
			if (!params.get("machine_id")) {
				setDataFilter({
					...dataFilter,
					...dataInit,
					from: Math.floor(moment().subtract(7, 'd').valueOf() / 1000),
					to: Math.floor(moment().valueOf() / 1000)
				});
			}


			// setTimeout(() => {

			// 	handlePrint()
			// }, 2 * 1000)
		} catch (error) {
			console.log("err", error);
		}
	}
	const { t } = useTranslation();
	const title = "report_oee";


	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	return (
		<div style={{ background: '#fff', paddingBottom: 120 }}>
			<div style={{
				display: 'flex',
				justifyContent: 'space-between',
				background: '#ddd',
				paddingTop: 10,
				paddingLeft: 20,
				position: 'fixed',
				top: 35,
				left: 35,
				right: 0,
				zIndex: 100,
			}}>
				<div style={{ fontSize: 25, fontWeight: 500 }}>{t(`${title}.name`)}</div>
				<Filter
					dateEnterprise={dateEnterprise}
					filterInit={initFilter}
					_onFilter={(data) => {
						setDataFilter(data);
					}}
				/>
			</div>
			<div style={{ marginTop: 52 }}>
				<ReactToPrint
					trigger={() => <Button ref={btnPrint} icon={<PrinterFilled />}
						style={{ position: 'fixed', borderRadius: 6, bottom: 20, right: 15, width: 90 }}
						type='primary'>Print</Button>}
					content={() => componentRef.current}
					onAfterPrint={() => {
						console.log('ddddd43134124')
						window.close();
					}}
				/>
				<div style={{
					width: '10in',
					margin: 'auto',
				}} ref={componentRef}>
					<div style={{
						backgroundImage: `url(${images.bgReport})`,
						height: 130,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'cover',

						display: 'flex', paddingLeft: 10, justifyContent: 'space-between',
						alignItems: 'flex-end', color: '#fff'
					}}>
						<div>
							<h2 style={{ fontSize: 45, color: '#fff', marginBottom: -2 }}>OEE Report</h2>
							<p style={{ fontSize: 18, marginBottom: 4 }}> <span style={{ fontStyle: 'italic' }}>From </span>{`${titlePage.date_from}`} <span style={{ fontStyle: 'italic' }}> To </span> {`${titlePage.date_to}`}</p>
						</div>
						<div style={{ alignSelf: 'center', marginRight: 20 }}>
							<img style={{ height: 77 }} src={User.logo} />
						</div>
					</div>
					<div style={{
						background: "#efefef",
						display: "flex",
						marginTop: "10px",
						padding: 10,
						marginBottom: 7,

						justifyContent: 'space-around',
						borderTop: "1px #ddd solid",
						borderBottom: "1px #ddd solid",
					}}>
						<div style={{ display: 'flex', marginTop: 1 }}>
							<div style={{ textAlign: 'center', width: 100, color: '#34517F', fontSize: 19, fontWeight: '500' }}>Area:</div><div style={{ width: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{titlePage.area}</div>
						</div>
						<div style={{ display: 'flex', marginTop: 1 }}>
							<div style={{ textAlign: 'center', width: 100, color: '#34517F', fontSize: 19, fontWeight: '500' }}>Line:</div><div style={{ width: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{titlePage.line}</div>
						</div>
						<div style={{ display: 'flex', marginTop: 1 }}>
							<div style={{ textAlign: 'center', width: 100, color: '#34517F', fontSize: 19, fontWeight: '500' }}>Machine:</div><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{titlePage.machine_id}</div>
						</div>
					</div>
					{
						isEmpty(dataFilter) ? null : <div style={{
							paddingLeft: '0.5in',
							paddingRight: '0.5in',
						}}>
							{/* <div style={{ marginBottom: '3in' }}>
							</div> */}

							<ActualAndTarget dataFilter={dataFilter} />
							<OeeMonthly dataFilter={dataFilter} />
							{
								get(dataFilter, 'machine_id[0]') ? get(dataFilter, 'machine_id').map(machine_id => <Waterfall dataFilter={{ ...dataFilter, machine_id }} />) : null
							}
							{
								get(dataFilter, 'machine_id[0]') ? get(dataFilter, 'machine_id').map(machine_id => <OeeCount dataFilter={{ ...dataFilter, machine_id }} />) : null
							}
							{/* <OeeCount dataFilter={dataFilter} /> */}
							<div style={{ height: 2, background: '#333', marginTop: 50 }} />
							<div style={{ paddingBottom: 20, display: 'flex', justifyContent: 'space-between', padding: '5px 20px' }}>
								<span>Phone: {template.phone}</span>
								<span>Website: {template.web}</span>
								<span>Email: {template.email}</span>
							</div>
						</div>
					}

				</div>
			</div>
			{/* <Button onClick={() => setVisible(dataFilter)} icon={<SendOutlined />}
				style={{ position: 'fixed', borderRadius: 6, bottom: 60, right: 15, width: 90 }}
				type='primary'>Mail</Button> */}

			{/* <div onClick={() => setVisible(dataFilter)} style={{
				position: 'fixed',
				bottom: 60,
				right: 30,
				height: 50,
				width: 50,
				borderRadius: 50,
				background: '#ddd',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<SendOutlined />
			</div> */}

			<SendMail
				dateEnterprise={dateEnterprise}
				visible={visible}
				_onClose={() => setVisible(false)}
				_onSubmit={(data) => {
					setDataFilter(data);
					setVisible(false);
				}} />

		</div>
	);
};



function useQuery() {
	const { search } = useLocation();

	return React.useMemo(() => new URLSearchParams(search), [search]);
}



const Filter = ({ _onFilter, dateEnterprise, filterInit }) => {

	const [filter, setFilter] = useState({ area: '', machine_id: '', line: '' })
	const [rangeDate, setRangeDate] = useState([moment().subtract(1, 'd'), moment()])



	// const [dateEnterprise, setDataEnterprise] = useState(null);
	useEffect(() => {
		if (filterInit) {
			setFilter(filterInit)
			if (filterInit.from && filterInit.to) {
				setRangeDate([moment(filterInit.from * 1000), moment(filterInit.to * 1000)]);
			}
		};
	}, [filterInit])

	const _handleFilter = () => {
		if (!filter.machine_id) {
			openNotificationWithIcon('error', 'Please select machine_id!');
			return 1;
		}

		const dataSubmit = {
			machine_id: filter.machine_id,
			area: filter.area, line: filter.line,
		};
		if (rangeDate && rangeDate[0]) {
			dataSubmit.from = Math.floor(moment(rangeDate[0]).valueOf() / 1000)
			dataSubmit.to = Math.floor(moment(rangeDate[1]).valueOf() / 1000)
		}
		_onFilter(dataSubmit);

	}
	return (
		<Row className='top-first' style={{ display: 'flex', alignItems: 'center', padding: '0 0 10px' }}>
			<Col style={{ display: 'flex', marginRight: 15 }}>
				<span className='span' style={{ color: '#1f62e0', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#eee', border: '1px solid #24292e1f', height: '31px', width: '60px', marginRight: 5 }}>AREA</span>
				<Select style={{ width: 120 }} className='top-select' value={filter.area} onChange={(val) => {
					setFilter({ area: val, line: '', machine_id: '' })
				}}>
					{dateEnterprise && Object.keys(dateEnterprise)
						.map(areaId => <Select.Option key={areaId} value={areaId}>{get(dateEnterprise, `${areaId}.name`, '')}</Select.Option>)}
				</Select>
			</Col>
			<Col style={{ display: 'flex', marginRight: 15 }}>
				<span className='span' style={{ color: '#1f62e0', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#eee', border: '1px solid #24292e1f', height: '31px', width: '60px', marginRight: 5 }}>LINE</span>
				<Select style={{ width: 120 }} className='top-select' value={filter.line} onChange={(val) => {
					setFilter({ ...filter, line: val, machine_id: '' })
				}}>
					{get(dateEnterprise, `${filter.area}.lineMap`)
						&& Object.keys(get(dateEnterprise, `${filter.area}.lineMap`, []))
							.map(lineID => <Select.Option key={lineID} value={lineID}>
								{get(dateEnterprise, `${filter.area}.lineMap.${lineID}.name`, '')}
							</Select.Option>)}
				</Select>
			</Col>
			<Col style={{ display: 'flex', marginRight: 15, alignItems: 'center' }}>
				<span className='span' style={{ color: '#1f62e0', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#eee', border: '1px solid #24292e1f', height: '31px', minWidth: '83px', marginRight: 5 }}>MACHINE</span>
				<SelectAnt
					mode="multiple"
					className='report-mul-select' value={filter.machine_id}
					onChange={(val) => { setFilter({ ...filter, machine_id: val }) }} >
					{get(dateEnterprise, `${filter.area}.lineMap.${filter.line}.machines[0]`)
						&& get(dateEnterprise, `${filter.area}.lineMap.${filter.line}.machines`)
							.map(machine_id => <Select.Option key={machine_id.id} value={machine_id.id + ''}>
								{machine_id.name}
							</Select.Option>)}
				</SelectAnt>
			</Col>
			<Col style={{ display: 'flex', marginRight: 15 }}>
				<DatePicker.RangePicker style={{ width: 250 }} value={rangeDate} onChange={setRangeDate} />
			</Col>
			<Col style={{ display: 'flex', marginRight: 15 }}>
				<Button onClick={_handleFilter} style={{ borderRadius: 6 }} type="primary">Submit</Button>
			</Col>
		</Row>

	)
}



const SelectAnt = styled(Select)`
width: 180px;
& .ant-select-selection-overflow {
	overflow: scroll;
	flex-wrap: nowrap !important;
	/* width */
	::-webkit-scrollbar {
	height: 1px;
	width: 0px;
	}
}
`


const App = () => {
	return (
		<InApp>
			<Home />
		</InApp>
	)
}
export default App;