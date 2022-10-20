import React from 'react';
import moment from 'moment';
import {
  PlusCircleOutlined, EditOutlined, DeleteOutlined, MailOutlined
} from "@ant-design/icons";

export const ENDPOINT = 'enterprise';
export const TITLE_TABLE = "Thông tin doanh nghiệp"

// "name_class": "furniture",
// "creator": "admin",
// "created": 1640224687,
// "updated": 1640224687

export const columnInitTable = [
  // {
  //   title: "Name",
  //   key: "user_name",
  //   dataIndex: 'user_name',
  // },
  // {
  //   title: "Error type",
  //   key: "error_type",
  //   dataIndex: 'error_type',
  // },
  {
    title: "Time",
    key: "condition",
    dataIndex: 'condition',
    render: (val, obj) => {
      return `${val}:00`
    }
  },
  {
    title: "Machine",
    key: "machine_name",
    dataIndex: 'machine_name',
    render: (val, obj) => {
      return (
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {
            val.map(i => (
              <div style={{ padding: '3px 7px', margin: '1px 2px', background: '#ddd', borderRadius: 5 }}>{i}</div>
            ))
          }
        </div>
      );
    }
  },
  {
    title: "Email",
    key: "email",
    dataIndex: 'email',
    render: (val, obj) => {
      return (
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {
            val.split(',').map(i => (
              <div style={{ padding: '3px 7px', margin: '1px 2px', background: '#ddd', borderRadius: 5 }}>{i}</div>
            ))
          }
        </div>
      );
    }
  },
  {
    title: "Active",
    key: "active",
    dataIndex: 'active',
    render: val => '' + val
  },
  // {
  //   title: "Contact info",
  //   key: "email",
  //   dataIndex: 'email',
  //   render : (text , record) => {
  //   return <div ><MailOutlined style={{fontSize : 15 , marginRight : 5 ,}}/> {text}</div>
  //   }
  // }
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

