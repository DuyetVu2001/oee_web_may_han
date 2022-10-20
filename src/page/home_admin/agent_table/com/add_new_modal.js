import { CloseOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button, Drawer, Form
} from "antd";
import { get, rest } from "lodash";
import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { ACT_TYPE } from "../const";
import { RenderForm } from '../helper/render_form';

const ModalForm = ({
  visible,
  jsonFormInput,
  _onClose,
  _onSubmit = () => { },
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
  const onFinish = async (val) => {
    try {
      // pre handle submit

      // submit
      setLoading(true);
      const {
        address,
        company_name,
        email_temp,
        head_title,
        phone_temp,
        software_name,
        web,
        ...dataVal
      } = val;

      const dataBody = {
        ...dataVal,
       
      }

      const isSuccess = await _onSubmit(dataBody);
      if (isSuccess) _onClose();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Drawer bodyStyle={{ padding: 10 }} title={false}
      placement={'right'} closable={false} onClose={_onClose} visible={visible} width={500}>
      <TitleDetail _onClose={_onClose} _onReset={() => form.resetFields()} />
      <StyledForm onFinish={onFinish} form={form} initialValues={dataInit}
        style={{ padding: '0px 10px' }} layout="vertical" >
        <Form.Item> <HeaderForm loading={loading} type={type} /> </Form.Item>
        <RenderForm jsonFrom={jsonFormInput} type={type} />
      </StyledForm>
    </Drawer>
  )
};

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

const HeaderForm = ({ loading, type, _onClose = () => { } }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: 10 }}>
      <span style={{ fontSize: 18, fontWeight: '500' }}>{type === ACT_TYPE.EDIT ? "Chỉnh sửa" : "Thêm mới"}</span>
      <div>
        <Button
          loading={loading}
          type="primary"
          style={{ float: "left", borderRadius: 5, marginLeft: 13, marginTop: 6 }}
          htmlType="submit"
        > Submit  </Button>
      </div>
    </div>
  )
}

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