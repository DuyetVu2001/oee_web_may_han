import { Button, Modal, Form } from "antd";
import { RenderForm } from 'page/account/account_table/helper/render_form';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { openNotificationWithIcon } from "helper/request/notification_antd";

import { setProfile } from '../service';
const ModalEditProfile = ({
    visible = {},
    onCancel = () => { },
    handleAction = () => { },
    line = [],
    handleOk = () => { }
}) => {
    const [dataForm] = Form.useForm();
    const [dataInit, setDataInit] = useState({});

    const [editAccountForm, setJsonForm] = useState(editAccountFormInit)
    useEffect(() => dataForm.resetFields(), [dataInit]);
    useEffect(() => {
        if (line && line[0]) {
            setJsonForm(editAccountForm.map(json => {
                if (json.name == 'line_id') {
                    json.data = line;
                }
                return json
            }))
        }
    }, [line]);

    const onFinishFrom = (val) => {
        setProfile({id: visible.id, ...val})
            .then((res) => {
                // console.log('editAccount === ', res);
                handleAction();
                openNotificationWithIcon('success', 'Chỉnh sửa thông tin thành công');
                handleOk();
                onCancel();
            })
            .catch((err) => {
                openNotificationWithIcon('error', 'Chỉnh sửa thông tin thất bại ')
            })
    }

    const _handleChange = (type, val) => {
        console.log({type , val});
    }

    const handleReset = () => {
        setDataInit({})
    }
    useEffect(() => {
        if(visible?.data){
            setDataInit(visible.data)
        }
    }, [visible])

    return (
        <Modal
            title={`Chỉnh sửa thông tin`}
            visible={!!visible}
            onCancel={() => {
                handleReset();
                onCancel();
            }}
            footer={null}
        >
            <div>
            <Form
                    form={dataForm}
                    name="control-hooks"
                    onFinish={onFinishFrom}
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
                    initialValues={dataInit}
                >
                    <RenderForm
                        jsonFrom={editAccountForm}
                        disabled={['username']}
                        _handleChange={_handleChange}
                        vali
                    />

                    <Form.Item style={{ marginTop: 20, paddingTop: 10, borderTop: '1px solid #ddd', marginRight: 15 }} wrapperCol={{ span: 24 }} >
                        <Button type="primary" htmlType="submit" style={{ float: 'right' }} loading={false}>
                            Chỉnh sửa
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    )
}

const editAccountFormInit = [
    {
        name: 'username',
        label: 'Tên đăng nhập',
        rules: [{ required: true, message: 'Tên đăng nhập cần có ít nhất 3 ký tự', min: 3 }],
        // type: 'number'
    },
    {
        name: 'name',
        label: 'Tên',
        rules: [{ required: true, message: 'Bạn cần nhập tên tài khoản' }],
    },
    {
        name: 'email',
        label: 'Email',
        rules: [{ required: true, type: 'email', message: 'Địa chỉ email không đúng định dạng' }],
    },
    {
        name: 'phone',
        label: 'Số điện thoại',
        type: 'phone',
        rules: [{ required: true, message: 'Bạn cần điền số điện thoại' }],
    },

    // {
    //     name: 'line_id',
    //     label: 'Line',
    //     type: 'select',
    //     rules: [{ required: true, message: 'Bạn cần điền line' }],
    // },
    // {
    //     name: 'machines',
    //     label: 'Hidden machine',
    //     type: 'select',
    //     isMul: true
    // },

];

export default ModalEditProfile;