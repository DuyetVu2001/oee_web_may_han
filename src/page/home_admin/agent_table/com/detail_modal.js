import { CloseOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button, Drawer, Form
} from "antd";
import { get } from "lodash";
import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { ACT_TYPE } from "../const";
import { handleErr } from "../helper/handle_err_request";
import { openNotificationWithIcon } from "../helper/notification_antd";
import { RenderForm } from '../helper/render_form';
import * as services from '../services';

const ModalForm = ({
  visible,
  jsonFormInput,
  _onClose = () => {},
  _onSubmit = () => {},
}) => {
  // state
  const [loading, setLoading] = React.useState(false);
  // 
  const [form] = Form.useForm();
  // value
  const type = useMemo(() => get(visible, 'type', 'add'), [visible]);
  const dataInit = useMemo(() => {
    try {

      const {template = '', ...data} = get(visible, 'data', {});
      if(!template) {
        return data
      }
      const {
        phone,
        email,
        ...temRest
      } = JSON.parse(template);

      return {
        ...data,
        ...temRest,
        email_temp: email,
        phone_temp: phone,
      }

    } catch (err) {
      console.log('asdfasf', err)
    }
  }, [visible]);
  // effect
  useEffect(() => form.resetFields(), [dataInit]);
  // handle

  // const _handleSubmitForm = async ({ data = null, type = null } = {}) => {
  //   console.log('_handleSubmitForm', { data, type })
  //   try {
  //       if (!data || !type) return 0;
  //       setLoading(true);
  //       if (type === ACT_TYPE.ADD) {
  //           await services.post(data);
  //           openNotificationWithIcon("success", "Thêm mới thành công")
  //       } else if (type === ACT_TYPE.EDIT) {
  //           await services.patch(data);
  //           openNotificationWithIcon("success", "Chỉnh sửa thành công")
  //       } else if (type === ACT_TYPE.DEL) {
  //           console.log('dndd')
  //           const confirm = window.confirm("Xác nhận xoá?")
  //           if (confirm) {
  //               await services.deleteMany(data);
  //               openNotificationWithIcon("success", "Xoá thành công")
  //           }
  //       }
  //       setLoading(false);
  //   } catch (error) {
  //       console.log('<err__handleSubmitForm>', error)
  //       setLoading(false);
  //       handleErr(error)
  //   }
  // }

  const onFinish = async (val) => {
    try {
      // pre handle submit

      // submit
      setLoading(true);
      if(!val.password) {
        delete val.password;
      }
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
        // password: ""
        // template: JSON.stringify({
        //   address,
        //   company_name,
        //   email:email_temp,
        //   head_title,
        //   phone:phone_temp,
        //   software_name,
        //   web,
        // })
      }
      const isSuccess = await _onSubmit({ id: dataInit.id, ...val });
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

const HeaderForm = ({ loading, type }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: 10 }}>
      <span style={{ fontSize: 18, fontWeight: '500' }}>Chỉnh sửa</span>
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
