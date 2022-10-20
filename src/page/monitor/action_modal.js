import { useEffect, useState } from 'react';

import {
	Button,
	Col,
	Drawer,
	Form,
	Tabs,
	Row,
	Select,
	InputNumber,
	Table,
} from 'antd';
import {
	getReason,
	getTableNG,
	patchActualQuantity,
	patchTableNG,
} from './service';
import moment from 'moment';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import { handleErr } from 'helper/request/handle_err_request';

const { TabPane } = Tabs;
const { Option } = Select;

export default function ActionModal({ onCancel, modalData }) {
	const [tableNG, setTableNG] = useState([]);
	const [reasonList, setReasonList] = useState([]);
	const [updateTableNG, setUpdateTableNG] = useState(false);

	const { visible, data: editData } = modalData;

	const [form] = Form.useForm();
	const [formActualQuantity] = Form.useForm();

	useEffect(() => {
		const getReasonList = async () => {
			const res = await getReason();
			setReasonList(res.data.data);
		};

		getReasonList();
	}, []);

	useEffect(() => {
		if (editData && editData.id) {
			getNG();
			setUpdateTableNG(false);
		}
	}, [editData, updateTableNG, visible]);

	useEffect(() => form.resetFields(), [editData, form]);
	useEffect(
		() => formActualQuantity.resetFields(),
		[editData, formActualQuantity]
	);

	/**
	 * ======== FUNCTION HANDLER ========
	 */

	const getNG = async () => {
		const res = await getTableNG({ production_id: editData.id });
		const data =
			res.data?.map((i) => {
				let re = i.ngreasoncode_id;
				if (reasonList) {
					const reason = reasonList.find(r => r.id === i.ngreasoncode_id)
					if (reason) {
						re = reason.name
					}
				}
				return {
					...i,
					key: i.id,
					time: moment.unix(i.time).format('DD-MM-YYYY HH:mm'),
					reason: re,
				}
			}) || [];
		setTableNG(data);
	};

	const handleNG = async (data) => {
		const body = {
			...data,
			production_id: editData.id,
		};

		try {
			const res = await patchTableNG(body);
			openNotificationWithIcon('success', res.data.msg);
			setUpdateTableNG(true);
			form.resetFields();
		} catch (error) {
			handleErr(error);
		}
	};

	const handleActualQuantity = async (data) => {
		const body = {
			...data,
			staff_id: editData.staff_id,
			production_id: editData.id,
		};

		try {
			const res = await patchActualQuantity(body);
			openNotificationWithIcon('success', res.data.msg);
			formActualQuantity.resetFields();
		} catch (error) {
			handleErr(error);
		}
	};

	//====================================

	return (
		<Drawer
			title=""
			width={720}
			onClose={onCancel}
			visible={visible}
			bodyStyle={{ paddingBottom: 80 }}
		>
			<Tabs defaultActiveKey="ng">
				<TabPane tab="NG" key="ng">
					<Form
						onFinish={handleNG}
						form={form}
						layout="vertical"
						initialValues={editData}
					>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name="quantity"
									label="Add amount"
									hasFeedback
									rules={[
										{ required: true, message: 'Please enter this field' },
									]}
								>
									<InputNumber
										style={{ width: '100%' }}
										min={0}
										placeholder="amount"
									/>
								</Form.Item>
							</Col>

							<Col span={12}>
								<Form.Item
									name="name"
									label="Choose a reason"
									rules={[{ required: true, message: 'Please enter name' }]}
									hasFeedback
								>
									<Select>
										{reasonList.map((r) => (
											<Option key={r.id} value={r.name}>
												{r.name}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>

						<Table
							style={{ margin: '16px 0' }}
							pagination={false}
							dataSource={tableNG}
							scroll={{ y: '50vh' }}
							columns={[
								{
									title: 'CREATE DATE',
									dataIndex: 'time',
									key: 'time',
								},
								{
									title: 'AMOUNT',
									dataIndex: 'quantity',
									key: 'quantity',
								},
								{
									title: 'REASON',
									dataIndex: 'reason',
									key: 'reason',
								},
							]}
						/>

						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
							// loading={loading}
							>
								Submit
							</Button>
						</Form.Item>
					</Form>
				</TabPane>

				<TabPane tab="Actual quantity" key="actual_quantity">
					<Form
						onFinish={handleActualQuantity}
						form={formActualQuantity}
						layout="vertical"
					>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name="quantity"
									label="Actual quantity"
									hasFeedback
									rules={[
										{ required: true, message: 'Please enter this field' },
									]}
								>
									<InputNumber
										style={{ width: '100%' }}
										min={0}
										placeholder="quantity"
									/>
								</Form.Item>
							</Col>
						</Row>

						<Form.Item>
							<Button type="primary" htmlType="submit">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</TabPane>
			</Tabs>
		</Drawer>
	);
}
