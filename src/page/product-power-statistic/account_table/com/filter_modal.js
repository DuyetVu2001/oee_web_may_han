
import React, { useEffect, useMemo } from "react";
import { get, isEmpty } from "lodash";
import { Button, Form, Drawer } from "antd";
import styled from "styled-components";
import {
    CloseOutlined, ReloadOutlined
} from "@ant-design/icons";


import { RenderForm } from "com/antd_form/render_form";
import { convertDataToRequest, convertDataToFillForm, convertTimestamp } from "helper/convert_data/convert_2_send";
const ModalForm = ({
    visible,
    jsonFormInput,
    _onClose,
    _onSubmit,
}) => {
    const [form] = Form.useForm();
    const dataInit = useMemo(() => {
        console.log('dnd===', visible);
        if(visible) {
            return convertDataToFillForm(jsonFormInput, visible)
        }
        return {};
    }, [visible]);

    useEffect(() => form.resetFields(), [dataInit]);

    const onFinish = async (val) => {
        try {
            const dataConvert = convertTimestamp(jsonFormInput, val);
            console.log('dataConvert', dataConvert, 'fffff', val)
            await _onSubmit(dataConvert);
            _onClose()
        } catch (err) {
            _onClose()
        }
    };
    if (isEmpty(jsonFormInput)) return null;

    return (
        <Drawer title={false} placement={'right'} closable={false} onClose={_onClose} visible={visible} width={500}>
            <TitleDetail _onClose={_onClose} _onReset={() => form.resetFields()} />
            <StyledForm layout="vertical" onFinish={onFinish} form={form} initialValues={dataInit}>
                <Form.Item> <Header loading={false} _handleReset={() => form.resetFields()} /></Form.Item>
                <RenderForm jsonFrom={jsonFormInput} />
            </StyledForm>
        </Drawer>
    )
};

const Header = React.memo(({ loading }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: 10 }}>
            <span style={{ fontSize: 18, fontWeight: '500' }}>Bộ lọc</span>
            <div>
                <Button
                    loading={loading}
                    type="primary"
                    style={{
                        float: "left",
                        borderRadius: 5, marginLeft: 13, marginTop: 6
                    }}
                    htmlType="submit"
                > Submit  </Button>
            </div>
        </div>
    )
})
const TitleDetail = React.memo(({ _onReset, _onClose }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
            <div></div>
            <div>
                <ReloadOutlined onClick={_onReset} />
                <CloseOutlined style={{ marginLeft: 15 }} onClick={() => _onClose()} />
            </div>
        </div>)
})



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