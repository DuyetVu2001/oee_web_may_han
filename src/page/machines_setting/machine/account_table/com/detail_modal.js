import { Button, Drawer, Form } from 'antd';
import { get } from 'lodash';
import React, { useEffect, useMemo } from 'react';

import { CloseOutlined, ReloadOutlined } from '@ant-design/icons';

import styled from 'styled-components';

import { RenderForm } from 'com/antd_form/render_form';
import { ACT_TYPE } from '../const';
import { handleErr } from '../helper/handle_err_request';
import { openNotificationWithIcon } from '../helper/notification_antd';
import * as services from '../services';

const ModalForm = ({
	visible,
	jsonFormInput,
	_onClose,
	_onSubmit = () => {},
}) => {
	// state
	const [loading, setLoading] = React.useState(false);
	//
	const [form] = Form.useForm();
	// value
	const type = useMemo(() => get(visible, 'type', 'add'), [visible]);
	const dataInit = useMemo(() => get(visible, 'data', {}), [visible]);
	// effect
	useEffect(() => form.resetFields(), [dataInit]);
	// handle

	const _handleSubmitForm = async ({ data = null, type = null } = {}) => {
		console.log('_handleSubmitForm', data, visible.data.id, type);
		try {
			if (!data || !type) return 0;
			setLoading(true);
			if (type === ACT_TYPE.ADD) {
				await services.post(data);
				openNotificationWithIcon('success', 'Thêm mới thành công');
			} else if (type === ACT_TYPE.EDIT) {
				console.log({
					id: visible.data.id,
					...data,
				});
				_onSubmit({
					...data,
					id: visible.data?.id,
					name: visible.data?.name,
					newName: data?.name || visible.data?.name,
				});
				// await services.updateProduct()
				// _onClose()
			}

			setLoading(false);
		} catch (error) {
			console.log('<err__handleSubmitForm>', error);
			setLoading(false);
			handleErr(error);
		}
	};
	const onFinish = async (val) => {
		// pre handle submit

		// submit
		_handleSubmitForm({ data: val, type });
	};

	return (
		<Drawer
			bodyStyle={{ padding: 10 }}
			title={false}
			placement={'right'}
			closable={false}
			onClose={_onClose}
			visible={visible}
			width={500}
		>
			<TitleDetail _onClose={_onClose} _onReset={() => form.resetFields()} />
			<StyledForm
				onFinish={onFinish}
				form={form}
				initialValues={dataInit}
				style={{ padding: '0px 10px' }}
				layout="vertical"
			>
				<Form.Item>
					
					<HeaderForm loading={loading} type={type} />
				</Form.Item>
				<RenderForm jsonFrom={jsonFormInput} type={type} />
			</StyledForm>
		</Drawer>
	);
};

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
				<ReloadOutlined onClick={_onReset} />
				<CloseOutlined style={{ marginLeft: 15 }} onClick={() => _onClose()} />
			</div>
		</div>
	);
});

const HeaderForm = ({ loading, type }) => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				borderBottom: '1px solid #eee',
				paddingBottom: 10,
			}}
		>
			<span style={{ fontSize: 18, fontWeight: '500' }}>
				{type === ACT_TYPE.EDIT ? 'Chỉnh sửa' : 'Thêm mới'}
			</span>
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
					htmlType="submit"
				>
					Submit
				</Button>
			</div>
		</div>
	);
};

const StyledForm = styled(Form)`
	.ant-modal-body {
		padding: 0px 24px 24px 24px;
		background: red;
	}

	.ant-form-item {
		margin-bottom: 4px;
	}
`;

export default ModalForm;
