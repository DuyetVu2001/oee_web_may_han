import React from 'react';
import moment from 'moment';
import {
  PlusCircleOutlined, EditOutlined, DeleteOutlined,
} from "@ant-design/icons";

export const ENDPOINT = 'oeestatistics';
export const TITLE_TABLE = "Thống kê OEE"

export const columnInitTable = [
  // {
  //   title: "Ind",
  //   key: "_id",
  //   dataIndex: '_id'
  // },
  {
    title: "Tên máy",
    key: "machine_name",
    dataIndex: "machine_name"
  },
  {
    title: "Availibility",
    key: "A",
    dataIndex: "A"
  },
  {
    title: "Productivity",
    key: "P",
    dataIndex: 'P',
    
  },
  {
    title: "Quality",
    key: "Q",
    dataIndex: "Q"
  },
  {
    title: "OEE",
    key: "OEE",
    dataIndex: "OEE"
  },
  {
    title: "Thời điểm",
    key: "time",
    dataIndex: "time",
    render: (val) => {
      return (
        <span>
          {moment(val * 1000).format('DD-MM-YYYY HH:mm')}
        </span>
      )
    }
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

