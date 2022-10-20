import React, { useEffect, useMemo, useState } from 'react';
import { isEmpty, get } from 'lodash';
import styled from 'styled-components';
import { CloseOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import { Drawer, Input, Button, Select, Row, Col, DatePicker } from 'antd';



const ModalForm = ({ visible, _onClose, _onSubmit, dateEnterprise }) => {
	const [area, setArea] = useState('')
	const [line, setLine] = useState('')
	const [machine, setMachine] = useState('');
	const [rangeDate, setRangeDate] = useState([moment().subtract(1, 'M'), moment()]);

	useEffect(() => {
		if (visible) {
			if (visible.area) setArea(visible.area);
			if (visible.line) setLine(visible.line);
			if (visible.machine_id) setMachine(visible.machine_id);
			if (visible.from && visible.to) {
				setRangeDate([moment(visible.from * 1000), moment(visible.to * 1000)]);
			}
		};
	}, [visible])

	const _handleFilter = () => {
		if (!machine) {
			alert('Please select machine!');
			return 1;
		}

		const dataSubmit = {
			machine_id: machine,
			line, area,
		};
		if (rangeDate && rangeDate[0]) {
			dataSubmit.from = Math.floor(moment(rangeDate[0]).valueOf() / 1000)
			dataSubmit.to = Math.floor(moment(rangeDate[1]).valueOf() / 1000)
		}
		_onSubmit(dataSubmit);

	}

	return (
		<Drawer
			title={false}
			placement={'right'}
			closable={false}
			onClose={_onClose}
			visible={visible}
			width={500}
		>
			<div>

				<TitleDetail _onClose={_onClose} />
				<Header onSubmit={_handleFilter} />

				<div style={{ display: 'flex' }}>
					<span className='span' style={{ color: '#1f62e0', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#eee', border: '1px solid #24292e1f', height: '31px', width: '110px', marginBottom: 10, marginRight: 5 }}>AREA</span>
					<Select style={{ width: 250 }} value={area} onChange={setArea}>
						{dateEnterprise && Object.keys(dateEnterprise).map(areaId => <Select.Option key={areaId} value={areaId}>{areaId}</Select.Option>)}
					</Select>
				</div>

				<div style={{ display: 'flex' }}>
					<span className='span' style={{ color: '#1f62e0', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#eee', border: '1px solid #24292e1f', height: '31px', width: '110px', marginBottom: 10, marginRight: 5 }}>LINE</span>
					<Select style={{ width: 250 }} value={line} onChange={setLine}>
						{dateEnterprise && Object.keys(get(dateEnterprise, `${area}`, [])).map(lineID => <Select.Option key={lineID} value={lineID}>{lineID}</Select.Option>)}
					</Select>
				</div>

				<div style={{ display: 'flex' }}>
					<span className='span' style={{ color: '#1f62e0', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#eee', border: '1px solid #24292e1f', height: '31px', minWidth: '110px', marginBottom: 10, marginRight: 5 }}>MACHINE</span>
					<Select style={{ width: 250 }} value={machine} onChange={setMachine}>
						{dateEnterprise && get(dateEnterprise, `${area}.${line}`, []).map(machine => <Select.Option key={machine.id} value={machine.id}>{machine.id}</Select.Option>)}
					</Select>
				</div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<span className='span' style={{ color: '#1f62e0', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#eee', border: '1px solid #24292e1f', height: '31px', minWidth: '110px',  marginRight: 5 }}>RANGE DATE</span>

					<DatePicker.RangePicker style={{ width: 250 }} value={rangeDate} onChange={setRangeDate} />
				</div>
			</div>
		</Drawer >
	);
};


const Header = React.memo(({ loading, onSubmit }) => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				borderBottom: '1px solid #eee',
				paddingBottom: 10,
				marginBottom: 20
			}}
		>
			<span style={{ fontSize: 18, fontWeight: '500' }}>Bộ lọc</span>
			<div>
				<Button
					loading={loading}
					type="primary"
					style={{
						float: 'left',
						borderRadius: 5,
						marginLeft: 13,
						marginTop: 6,
					}}
					onClick={onSubmit}

				>
					{' '}
					Submit{' '}
				</Button>
			</div>
		</div>
	);
});

const TitleDetail = React.memo(({ _onReset, _onClose }) => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				marginBottom: 15,
			}}
		>
			<div></div>
			<div>
				<CloseOutlined style={{ marginLeft: 15 }} onClick={() => _onClose()} />
			</div>
		</div>
	);
});

export default ModalForm;
