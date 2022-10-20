import { Button, Form, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { RenderForm } from '../helper/render_form';

export default function DeleteModal({
	visible,
  jsonFormInput,
  _onClose,
  _onSubmit = () => { },
}) {
	const [loading, setLoading] = useState(false);
  
  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [form, visible]);

	/**
	 * ======== FUNCTION HANDLER ========
	 */

	const handleSubmit = async (val) => {
		try {
      setLoading(true);
      const isSuccess = await _onSubmit({id: visible?.data, ...val});
      if (isSuccess) _onClose();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
	};

	//====================================

	console.log(jsonFormInput);

	return (
		<Modal visible={visible} title={null} onCancel={_onClose} footer={null}>
			<Form onFinish={handleSubmit} form={form} layout="vertical">
				<RenderForm jsonFrom={jsonFormInput}/>

				<div style={{ display: 'flex', justifyContent: 'end' }}>
					<Form.Item style={{ margin: '8px 15px' }}>
						<Button type="danger" htmlType="submit" loading={loading}>
							Delete
						</Button>
					</Form.Item>
				</div>
			</Form>
		</Modal>
	);
}
