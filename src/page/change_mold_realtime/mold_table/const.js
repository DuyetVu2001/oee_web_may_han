import React from 'react';
import moment from 'moment';
import {
  PlusCircleOutlined, EditOutlined, DeleteOutlined,
} from "@ant-design/icons";

export const ENDPOINT = 'time_change_mold';
export const TITLE_TABLE = "Change mold"

// "name_class": "furniture",
// "creator": "admin",
// "created": 1640224687,
// "updated": 1640224687

export const columnInitTable = [
  {
    title: "Tên đăng nhập",
    key: "username",
    dataIndex: 'username',
  },
  {
    title: "Tên",
    key: "name",
    dataIndex: 'name',
  },
  {
    title : 'Email',
    key : 'email',
    dataIndex : 'email'
  },
  {
    title : 'Phone',
    key : 'phone',
    dataIndex : 'phone'
  },
  {
    title : 'Vai trò',
    key : 'role_name',
    dataIndex : 'role_name'
  },
  {
    title : 'Description',
    key : 'description',
    dataIndex : 'description'
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

