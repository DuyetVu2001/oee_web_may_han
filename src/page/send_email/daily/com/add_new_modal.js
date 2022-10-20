
import React, { Component, useState, useEffect, useCallback, useMemo } from "react";
import { findIndex, get, isEmpty } from "lodash";
import {
  Table,
  Upload,
  Button,
  Modal, Space,
  Form, Drawer,
  Input,
  Select,
  DatePicker,
  InputNumber,
  TimePicker, Card,
} from "antd";

import {
  PlusOutlined, DeleteOutlined, CloseOutlined, ReloadOutlined
} from "@ant-design/icons";

import styled from "styled-components";

import { RenderForm } from "com/antd_form/render_form";
import { ACT_TYPE } from "../const";
import * as services from '../services';
import { openNotificationWithIcon } from "../helper/notification_antd";
import { handleErr } from "../helper/handle_err_request";

const ModalForm = ({
  visible,
  jsonFormInput,
  _onClose,
  _onSubmit = () => { },
}) => {
  // state
  const [loading, setLoading] = React.useState(false);
  const [jsonInput, setJsonInput] = useState(jsonFormInput)
  // 
  const [form] = Form.useForm();
  // value
  const type = useMemo(() => get(visible, 'type', 'add'), [visible]);
  const dataInit = useMemo(() => get(visible, 'data', {}), [visible]);
  // effect
  useEffect(() => form.resetFields(), [dataInit]);
  // handle
  const onFinish = (val) => {
    try {
      console.log("val", val);
      setLoading(true);
      _onSubmit(val)
      setLoading(false);
      // _onClose()
    } catch (err) {
      setLoading(false);
    }
  };
  const _handleChange = (name, val, type) => {
    if (type === "select_condition") {
      console.log("khanh1" , {name , val , type});
      let jsonNew = [...jsonFormInput]
      jsonNew.splice(2 , 0 , {
        name: 'condition',
        label: 'Condition',
        placeholder : "Choose",
        type: 'condition',
        device : val,
        data : [
          {
            id : 5,
            name : "5 minutes"
          },
          {
            id : 10,
            name : "10 minutes"
          },
          {
            id : 15,
            name : "15 minutes"
          },
          {
            id : 20,
            name : "20 minutes"
          },
          {
            id : 25,
            name : "25 minutes"
          },
          {
            id : 30,
            name : "30 minutes"
          },
          {
            id : 35,
            name : "35 minutes"
          },
          {
            id : 40,
            name : "40 minutes"
          },
          {
            id : 45,
            name : "45 minutes"
          },
          {
            id : 50,
            name : "50 minutes"
          },
          {
            id : 55,
            name : "55 minutes"
          },
          {
            id : 60,
            name : "60 minutes"
          }
        ]
      },)
      setJsonInput(jsonNew)
    }
  }
  return (
    <Drawer bodyStyle={{ padding: 10 }} title={false}
      placement={'right'} closable={false} onClose={_onClose} visible={visible} width={500}>
      <TitleDetail _onClose={_onClose} _onReset={() => form.resetFields()} />
      <StyledForm onFinish={onFinish} form={form} initialValues={dataInit}
        style={{ padding: '0px 10px' }} layout="vertical" >
        <Form.Item> <HeaderForm loading={loading} type={type} /> </Form.Item>
        <RenderForm jsonFrom={jsonInput.length ? jsonInput : jsonFormInput} type={type} _handleChange={_handleChange} />
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', }}>
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