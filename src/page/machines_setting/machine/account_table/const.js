import React from 'react';
import moment from 'moment';
import {
  PlusCircleOutlined, EditOutlined, DeleteOutlined,
} from "@ant-design/icons";

export const ENDPOINT = 'product';
export const TITLE_TABLE = "Dữ liệu tổng hợp"

// "name_class": "furniture",
// "creator": "admin",
// "created": 1640224687,
// "updated": 1640224687

export const columnInitTable = [
  // {
  //   title: "Mã máy",
  //   key: "id",
  //   dataIndex: 'id',
  // },
  {
    title: "Tên máy",
    key: "name",
    dataIndex: 'name',
  },
  // {
  //   title: "Áp đầu vào",
  //   key: "udc",
  //   dataIndex: 'udc',
  // },
  // {
  //   title: "Dòng đầu vào",
  //   key: "idc",
  //   dataIndex: 'idc',
  // },
  // {
  //   title: "Loại dây",
  //   key: "wire_diameter",
  //   dataIndex: 'wire_diameter',
  // },
  {
    title: "Status",
    key: "allowReading",
    dataIndex: 'allowReading',
    render: (text, record) => (text === '0' ? "Off" : "On")
  }
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

