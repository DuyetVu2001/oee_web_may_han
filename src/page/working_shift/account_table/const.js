import React from 'react';
import moment from 'moment';
import {
  PlusCircleOutlined, EditOutlined, DeleteOutlined,
} from "@ant-design/icons";

export const ENDPOINT = 'working_shift';
export const TITLE_TABLE = "Ca làm việc"

// "name_class": "furniture",
// "creator": "admin",
// "created": 1640224687,
// "updated": 1640224687

export const columnInitTable = [
  {
    title: "Mã",
    key: "id",
    dataIndex: 'id',
  },
  {
    title: "TimeZone",
    key: "time_zone",
    dataIndex: 'time_zone',
  },
  {
    title: "Ngày hoạt động",
    key: "dates",
    dataIndex: 'dates',
  },
  {
    title: "Thời gian bắt đầu",
    key: "start_time",
    dataIndex: 'start_time',
  },
  {
    title: "Thời gian kết thúc",
    key: "end_time",
    dataIndex: 'end_time',
  },
  {
    title: "Máy",
    key: "machines",
    dataIndex: 'machines',
    render : val => val?.toString()
  },

];
export const jsonFormFilterInit = [
  {
    name: "name",
    label: "Tên",
  },
]

export const jsonFormInit = [
  {
    name: "username",
    label: "Mã đăng nhập",
    rules: [{ required: true }],
  },
  {
    name: "name",
    label: "Tên",
    rules: [{ required: true }],
  },
  {
    name: "email",
    label: "email",
    rules: [{ required: true }],
  },
  {
    name: "password",
    label: "Mật khẩu",
    rules: [{ required: true }],
  },
  {
    name: "phone",
    // type: 'number',
    label: "Số điện thoại",
    rules: [{ type: 'number' }]
  },
  {
    name: "role_id",
    label: "Chức năng",
    type: 'select',
    data: [{
      id: '2',
      
    }],
    rules: [{ required: true }],
  },
  {
    name: "description",
    label: "Mô tả",
    // rules: [{ required: true }],
  },

];

export const ACT_TYPE = {
  "ADD": "ADD",
  "EDIT": "EDIT",
  "DUP": "DUP",
  "DEL": "DEL",
}
export const action = [
  {
    name: ACT_TYPE.EDIT,
    title: "Edit",
    Icon: () => <EditOutlined style={{ fontSize: 25 }} />,
  },
  {
    name: ACT_TYPE.DEL,
    title: "Delete",
    Icon: () => <DeleteOutlined style={{ fontSize: 25 }} />,
  },
  {
    name: ACT_TYPE.DUP,
    title: "Duplicate",
    Icon: () => <PlusCircleOutlined style={{ fontSize: 25 }} />,
  },
]

