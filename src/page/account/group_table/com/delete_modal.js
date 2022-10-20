import { Button, Form, Input, Modal } from 'antd';
import { useEffect } from 'react';

export default function DeleteModal({
	onCancel = () => {},
	_onSubmit = () => {},
	modalData: { visible = false, id = null },
}) {

	const [form] = Form.useForm();
	useEffect(() => form.resetFields(), [form, visible]);

	/**
	 * ======== FUNCTION HANDLER ========
	 */

	const handleSubmit = async (data) => {
		_onSubmit({ ...data, id })
		onCancel();
	};

	//====================================

	return (
		<Modal visible={visible} title={null} onCancel={onCancel} footer={null}>
			<Form onFinish={handleSubmit} form={form} layout="vertical">
				{/* <Form.Item
					name="admin_password"
					label="Admin password"
					hasFeedback
					rules={[{ required: true, message: 'Please enter admin password' }]}
				>
					<Input.Password placeholder="Admin password" />
				</Form.Item> */}

				<Form.Item>
					<Button type="danger" htmlType="submit">
						Delete
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
}
