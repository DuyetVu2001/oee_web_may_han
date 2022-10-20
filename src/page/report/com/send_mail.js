import React, { useEffect, useMemo, useState } from 'react';
import { isEmpty, get } from 'lodash';
import styled from 'styled-components';
import { CloseOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import { Drawer, Input, Button, Select, Row, Col, DatePicker } from 'antd';



const ModalForm = ({ visible, _onClose, _onSubmit, dateEnterprise }) => {
	
	useEffect(() => {
		if (visible) {
			
		};
	}, [visible])

	const _handleFilter = () => {
		
		_onSubmit();

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
			<span style={{ fontSize: 18, fontWeight: '500' }}>Setup Sent Email</span>
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
