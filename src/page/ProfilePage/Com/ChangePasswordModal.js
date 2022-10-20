import { Button, Modal, Form } from "antd";
import { RenderForm } from 'page/account/account_table/helper/render_form';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ChangePasswordModal = ({
    visible = {},
    onCancel = () => { },
    handleAction = () => { },
    requestSignOut = () => { }
}) => {
    const [dataForm] = Form.useForm();
    const [dataInit, setDataInit] = useState({});

    const { t, i18n } = useTranslation();
    useEffect(() => dataForm.resetFields(), [dataInit]);
    const handleReset = () => {
        setDataInit({});
    };

    const onFinishFrom = (val) => {
        handleAction(val)
    };

    useEffect(() => {
        handleReset();
    }, [visible]);
    const manageAccount = "manage_account";
    const text = t(`${manageAccount}.edit_pass`)

    return (
        <Modal
            title={text}
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
                    name="control-hooks-change-pwd"
                    onFinish={onFinishFrom}
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 15 }}
                    initialValues={dataInit}
                >
                    <RenderForm jsonFrom={changePwdForm} disabled={[]} vali />
                    <Form.Item
                        style={{
                            marginTop: 20,
                            paddingTop: 10,
                            borderTop: "1px solid #ddd",
                            marginRight: 15,
                        }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ float: "right" }}
                            loading={false}
                        >
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

const changePwdForm = [
    {
        name: "old_password",
        label: "Mật khẩu cũ",
        type: "password",
        rules: [
            {
                required: true,
                message: "Bạn cần nhập mật khẩu",
            },
        ],
    },
    {
        name: "new_password",
        label: "Mật khẩu mới",
        type: "password",
        rules: [
            {
                required: true,
                message: "Mật khẩu cần có ít nhất 6 ký tự",
                min: 6,
            },
        ],
    },
    {
        name: "confirm_pwd",
        label: "Xác nhận mật khẩu",
        type: "password",
        dependencies: ["new_password"],
        rules: [
            {
                required: true,
                message: "Xác nhận mật khẩu",
            },
            ({ getFieldValue }) => ({
                validator(rule, value) {
                    if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject("Mật khẩu không khớp");
                },
            }),
        ],
    },
];


export default ChangePasswordModal;