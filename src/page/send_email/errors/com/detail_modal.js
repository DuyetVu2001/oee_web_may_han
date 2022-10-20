
import React, { Component, useState, useEffect, useCallback, useMemo } from "react";
import { findIndex, get, isEmpty, update } from "lodash";
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
  _changeDetail = () => { }
}) => {
  // state
  const [loading, setLoading] = React.useState(false);
  const [jsonInput, setJsonInput] = useState(jsonFormInput)
  // 
  const [form] = Form.useForm();
  // value
  const type = useMemo(() => get(visible, 'type', 'add'), [visible]);

  const dataInit = get(visible, 'data', {})
  // const [dataInit , setDataInit] = useState(visible.data)
  // effect
  useEffect(() => form.resetFields(), [dataInit]);
  // handle
  console.log("visb", visible);

  const _handleSubmitForm = async ({ data = null, type = null } = {}) => {
    try {
      if (!data || !type) return 0;
      setLoading(true);
      if (type === ACT_TYPE.ADD) {
        await services.post(data);
        openNotificationWithIcon("success", "Thêm mới thành công")
      } else if (type === ACT_TYPE.EDIT) {
        _onSubmit({
          id: visible.data.id,
          ...data,
          machine_id: data.machine_id
        })
        // await services.updateProduct()
        // _onClose()
      } else if (type === ACT_TYPE.DEL) {
        const confirm = window.confirm("Xác nhận xoá?")
        if (confirm) {
          await services.deleteMany(data);
          openNotificationWithIcon("success", "Xoá thành công")
        }
      }
      setLoading(false);
    } catch (error) {
      console.log('<err__handleSubmitForm>', error)
      setLoading(false);
      handleErr(error)
    }
  }
  const onFinish = async (val) => {
    // pre handle submit

    // submit
    _handleSubmitForm({ data: val, type })
  };
  const handleValueChange = (val) => {
    // console.log("change" , val);
    if (val.error_type) {
      _changeDetail(val)
    }
  }

  const _handleChange = (name, val, type) => {
    if (name === "error_type") {
      jsonFormInput.map(item => {
        if (item.name === 'condition') {
          item.data = new Array(12).fill(0).map((_, index) => ({
            id: (index + 1) * 5,
            name: (index + 1) * 5 + (val === 'OEE Index low' ? ' %' : ' minutes')
          }))
        }
      });
      setJsonInput([...jsonFormInput])
    }
  }
  return (
    <Drawer bodyStyle={{ padding: 10 }} title={false}
      placement={'right'} closable={false} onClose={_onClose} visible={visible} width={500}>
      <TitleDetail _onClose={_onClose} _onReset={() => form.resetFields()} />
      <StyledForm onFinish={onFinish} form={form} initialValues={dataInit}
        onValuesChange={handleValueChange}
        style={{ padding: '0px 10px' }} layout="vertical" >
        <Form.Item> <HeaderForm loading={loading} type={type} /> </Form.Item>
        <RenderForm
          jsonFrom={jsonInput.length ? jsonInput : jsonFormInput}
          type={type}
          _handleChange={_handleChange}
          dataInit={dataInit} />
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
      <span style={{ fontSize: 18, fontWeight: '500' }}>{type === ACT_TYPE.EDIT ? "Chỉnh sửa" : "Thêm mới"}</span>
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