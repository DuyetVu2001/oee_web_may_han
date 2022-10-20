import React from 'react';
import moment from 'moment';
import {
  PlusCircleOutlined, EditOutlined, DeleteOutlined,
} from "@ant-design/icons";

export const ENDPOINT = 'powerstatistics';
export const TITLE_TABLE = "Thống kê điện năng"

export const columnInitTable = [
  {
    title: "STT",
    key: "id",
    dataIndex: 'id',
    fixed: 'left',
    width: 100,
  },
  {
    title: "Machine_Id",
    key: "machine_id",
    dataIndex: "machine_id",
    fixed: 'left',
    width: 100,
  },
  {
    title: "Quantity",
    key: "quantity",
    dataIndex: "quantity",
    fixed: 'left',
    width: 100,
  },
  {
    title: "Time",
    key: "time",
    dataIndex: 'time',
    width: 200,
    render: (val) => {
      return (
        <span>
          {moment(val * 1000).format('DD-MM-YYYY HH:mm')}
        </span>
      )
    }
  },
  {
    title: "Time Start",
    key: "time_start",
    dataIndex: "time_start",
    width: 200,
    render: (val) => {
      return (
        <span>
          {moment(val * 1000).format('DD-MM-YYYY HH:mm')}
        </span>
      )
    }
  },
  {
    title: "Time Stop",
    key: "time_stop",
    dataIndex: "time_stop",
    width: 200,
    render: (val) => {
      return (
        <span>
          {moment(val * 1000).format('DD-MM-YYYY HH:mm')}
        </span>
      )
    }
  },
  {
    title: "Total Time Running",
    key: "total_time_running",
    dataIndex: "total_time_running",
    width: 200,
    render: (val) => {
      return (
        <span>
          {moment(val * 1000).format('DD-MM-YYYY HH:mm')}
        </span>
      )
    }
  },
  {
    title: "Total Time Stop",
    key: "total_time_stop",
    dataIndex: "total_time_stop",
    width: 200,
    render: (val) => {
      return (
        <span>
          {moment(val * 1000).format('DD-MM-YYYY HH:mm')}
        </span>
      )
    }
  },
  {
    title: "Total Time Error",
    key: "total_time_error",
    dataIndex: "total_time_error",
    width: 200,
    render: (val) => {
      return (
        <span>
          {moment(val * 1000).format('DD-MM-YYYY HH:mm')}
        </span>
      )
    }
  },
  {
    title: "Times Stop",
    key: "times_stop",
    dataIndex: "times_stop",
    width: 200,
    render: (val) => {
      return (
        <span>
          {moment(val * 1000).format('DD-MM-YYYY HH:mm')}
        </span>
      )
    }
  },
  {
    title: "Times Error",
    key: "times_error",
    dataIndex: "times_error",
    width: 200,
    render: (val) => {
      return (
        <span>
          {moment(val * 1000).format('DD-MM-YYYY HH:mm')}
        </span>
      )
    }
  },
  {
    title: "Longgest Time Stop",
    key: "longgest_time_stop",
    dataIndex: "longgest_time_stop",
    width: 200,
    render: (val) => {
      return (
        <span>
          {moment(val * 1000).format('DD-MM-YYYY HH:mm')}
        </span>
      )
    }
  },
  {
    title: 'Staff',
    key: "staff",
    dataIndex: "staff",
    fixed: 'right',
    width: 100,
  },
  {
    title: 'Group',
    key: "group",
    dataIndex: "group",
    fixed: 'right',
    width: 100,
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

