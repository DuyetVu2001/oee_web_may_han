
import React, { Component, useState, useEffect, useCallback, useMemo } from "react";
import { findIndex, get, isEmpty, update } from "lodash";
import {
  Table,
  Upload,
  Button,
  Modal, Space,
  Form, Drawer,
  Input, Tabs,
  Select,
  DatePicker, Typography,
  InputNumber,
  TimePicker, Card, List, Pagination
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
import { apiClient } from "helper/request/api_client";
import moment from "moment";

const ModalForm = ({
  visible,
  jsonFormInput,
  _onClose,
  _onSubmit = () => { }
}) => {
  return (
    <Drawer
      closable={false}
      width={600}
      placement={'right'} onClose={_onClose} visible={visible}>
      <TitleDetail _onClose={_onClose}/>
      <HeaderForm visible={visible} />
      <Tabs>
        <Tabs.TabPane key={'0'} tab="Lịch sử">
          <Log visible={visible} />
        </Tabs.TabPane>
        <Tabs.TabPane key={'2'} tab="Lấy dữ liệu phần cứng">
          <HardWare visible={visible} />
        </Tabs.TabPane>
        <Tabs.TabPane key={'3'} tab="Cài đặt phần cứng">
          <iframe height="1200px" width="600px" src={`http://${get(visible, 'data.IPAddress')}`} title="Setup hardware">
          </iframe>
        </Tabs.TabPane>

      </Tabs>
    </Drawer>
  )
};

const TitleDetail = React.memo(({ _onReset, _onClose }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
      <div></div>
      <div>
        {/* <ReloadOutlined onClick={_onReset} /> */}
        <CloseOutlined style={{ marginLeft: 15 }} onClick={() => _onClose()} />
      </div>
    </div>)
})

const HardWare = ({ visible }) => {
  const [dataShow, setDataShow] = useState({});

  useEffect(() => {
    if (visible && visible.data && visible.data.id) {
      const query = {
        machine_id: visible.data.id,
      }
      apiClient.get(`device/info`, query)
        .then(({ data }) => {
          console.log('asdfasdf', data);
          setDataShow(data)
        })
    }
  }, [visible])
  return (
    <div>
      {dataShow ?
        <List
          // bordered
          dataSource={Object.keys(dataShow)}
          renderItem={key => (
            <List.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: 350 }}>
                <div style={{ fontWeight: 500, textTransform: 'capitalize' }}>{key}</div>
                <div>{key.includes('_at') ? moment(1000 * dataShow[key]).format("HH:mm DD/MM/YYYY") : dataShow[key]}</div>
              </div>
            </List.Item>
          )}
        />
        : null}
    </div>
  )
}

const HeaderForm = ({ loading, visible, _onClose = () => { } }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', }}>
      <span style={{ fontSize: 18, fontWeight: '500' }}>{get(visible, 'data.name')}</span>
      <div>
        <Button
          loading={loading}
          type="danger"
          style={{ float: "left", borderRadius: 5, marginLeft: 13, marginTop: 6 }}
          htmlType="submit"
        > Delete  </Button>
      </div>
    </div>
  )
}


const Log = ({ visible }) => {
  const [dataShow, setDataShow] = useState([])
  const [pageInfo, setPageInfo] = useState({})
  useEffect(() => {
    if (visible && visible.data && visible.data.id) {
      _requestData()
    }
  }, [visible])

  const onChangePage = (page) => {
    console.log('page', page)
    _requestData({ skip: page - 1 })
  }

  const _requestData = (filter = {} || {}) => {

    if (visible && visible.data && visible.data.id) {
      const query = {
        machine_id: visible.data.id,
        limit: 15,
        skip: 0,
        ...filter
      }
      apiClient.get(`device/log`, query)
        .then(({ data }) => {
          setDataShow(data.data)
          setPageInfo(data.page_info)
        })
    }
  }
  return (
    <List
      footer={<div style={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination pageSize={15} onChange={onChangePage} simple current={pageInfo.current} total={pageInfo.total} />
      </div>}
      // bordered
      dataSource={dataShow}
      renderItem={i => (
        <List.Item>
          {i.connected_at ? <Typography.Text type="success">Connected at &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography.Text> : <Typography.Text type="danger">Disconnected at &nbsp;</Typography.Text>}
          :&nbsp;{moment(1000 * (i.connected_at || i.disconnected_at)).format("HH:mm DD-MM-YYYY")}
        </List.Item>
      )}
    />
  )
}

export default ModalForm;