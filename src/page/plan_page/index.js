import React, { Component, useState, useEffect, useCallback } from "react";
import {
  Table, Upload, Button, Modal, Form, Input, Select, DatePicker,
  InputNumber, Drawer, TimePicker, Card, Breadcrumb, Popover
} from "antd";
import { findIndex, get, isEmpty, isArray } from "lodash";
import Styled from "styled-components";
import moment from "moment";
import {
  PlusCircleOutlined, UploadOutlined, PlusOutlined, PauseCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, RightCircleOutlined, PlayCircleOutlined, ScheduleOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, SwapOutlined, VerticalAlignBottomOutlined, HomeOutlined, UserOutlined,
} from "@ant-design/icons";
import { useTranslation, initReactI18next } from "react-i18next";
import styled from "styled-components";

// import { dispatchHeaderTitle } from "../Topbar/actions";

import {
  createrOrder, updateOrder, editOrder, deleteOrder, filterOrder, uploadExcelOrder, downloadPlan, getLine, getOrderDetail, initData, _handleUploadUnPlanFile, filterUnplannedOrder,
} from "./services";

import { moldListForm } from './com/const';
import ScheduleView from './plan_view';
import { apiClient } from "helper/request/api_client";
import { ENDPOINT } from "_config/end_point";
import { openNotificationWithIcon } from "helper/request/notification_antd";

import InApp from 'com/in_app_layout';
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import BtnDownload from "com/BtnDownload";
const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";
const confirm = Modal.confirm;

const COLOR = {
  Next: "#c1c72c",
  Complete: "#6fc4fd",
  Running: "#8efe48",
  Planed: "#d9d8da",
  Ready: "#8efe48",
  Paused: "#ff793a",
};

const PlanProductPage = (props) => {
  const [rightOption, setRightOption] = useState(false);
  const [showViewSchedule, setShowViewSchedule] = useState(false);
  const {
    generalSettings = {},
  } = props;

  const [selectedRow, setSelectRow] = useState([]);
  const [listMold, setListMold] = useState([{}]);
  const [showDel, setShowDel] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [lineData, setLineData] = useState([]);
  const [selectLine, setSelectLine] = useState('');
  const [id, setId] = useState('');
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [filter, setFilter] = useState({
    date: [moment().subtract(1, "d"), moment()],
    // state: ["Running", "Paused"],
  });
  const [plan, setPlan] = useState('All'); // All * Un-planned
  const [count, setCount] = useState(0);


  useEffect(() => {
    if (selectedRow[0]) {
      setShowDel(true)
    } else {
      setShowDel(false)
    }

  }, [selectedRow])

  useEffect(() => {
    // setDataJsonForm
    if (visible) {
      if (visible.type == "add") {
        setDataJsonForm(dataJsonForm.map(i => { i.disabled = false; return i }));
      } else {
        console.log('visibleeee', visible)
        const orderStatus = get(visible, 'data.order_state', 'Running');
        getDetailOrder(get(visible, 'data.id'))
        let jsonConvert;
        if (orderStatus == 'Planned') {
          jsonConvert = dataJsonForm.map(i => {
            if (['cavity'].includes(i.name)) {
              i.disabled = true;
              return i;
            }
            i.disabled = false;
            return i;
          })
        } else {
          jsonConvert = dataJsonForm.map(i => {
            if (!(['type', 'mold'].includes(i.name))) {
              i.disabled = true;
              return i;
            }
            if (i.name == 'mold') {
              i.disabled = false;
              return i;
            }
            if (i.name == 'type') {
              if (orderStatus == 'Running') {
                i.disabled = false;
                return i;
              }
              i.disabled = true;
              return i;
            }
          })
        }
        // const jsonConvert = dataJsonForm.map(i => {
        //   if (['machine_id', 'type'].includes(i.name)) {
        //     if (orderStatus != 'Planned') {
        //       i.disabled = true;
        //     } else {
        //       i.disabled = false;
        //     }
        //   } else if (["cycle_time", "start_time",
        //     "start_time_hh", "type", 'mold'].includes(i.name)) {
        //     return i;
        //   } else {
        //     i.disabled = true;
        //     return i;
        //   }
        // })
        setDataJsonForm(jsonConvert);
      }
    } else {
      // console.log('=========reset')
      form.resetFields();
      setListMold([{}])
    }
  }, [visible])
  const plans = "planning";
  const newColumns = columns.map(val => {
    if (val.title == "Mã KH") {
      return {
        ...val,
        title: t(`${plans}.cus_code`)
      }
    }
    if (val.title == "Mã máy") {
      return {
        ...val,
        title: t(`${plans}.machine_code`)
      }
    }
    if (val.title == "TG Kế hoạch") {
      return {
        ...val,
        title: t(`${plans}.time_plan`)
      }
    }
    if (val.title == "TG Bắt đầu") {
      return {
        ...val,
        title: t(`${plans}.time_start`)
      }
    }
    if (val.title == "TG Kết thúc") {
      return {
        ...val,
        title: t(`${plans}.time_end`)
      }
    }
    if (val.title == "Trạng thái") {
      return {
        ...val,
        title: t(`managerError.status`)
      }
    }
    if (val.title == "Loại") {
      return {
        ...val,
        title: t(`${plans}.cus_code`)
      }
    }
    if (val.title == "Tên kế hoạch") {
      return {
        ...val,
        title: t(`${plans}.name_plan`)
      }
    }
    if (val.title == "Khuôn") {
      return {
        ...val,
        title: t(`${plans}.mold`)
      }
    }
    else return {
      ...val
    }
  })
  const newForm = formAddOrderInit.map(i => {
    if (i.label == "Tên kế hoạch") {
      return {
        ...i,
        label: t(`${plans}.name_plan`)
      }
    }
    if (i.label == "Mã máy") {
      return {
        ...i,
        label: t(`${plans}.machine_code`)
      }
    }
    if (i.label == "Cycle time") {
      return {
        ...i,
        label: t(`${plans}.c_time`)
      }
    }
    if (i.label == "Tổng cavity") {
      return {
        ...i,
        label: t(`${plans}.total`)
      }
    }
    if (i.label == "Thời gian theo kế hoach (ngày)") {
      return {
        ...i,
        label: t(`${plans}.time_day`)
      }
    }
    if (i.label == "Thời gian theo kế hoach (giờ)") {
      return {
        ...i,
        label: t(`${plans}.time_h`)
      }
    }
    if (i.label == "Loại") {
      return {
        ...i,
        label: t(`${plans}.type`)
      }
    }
    if (i.label == "id") {
      return {
        ...i,
        label: t(`${plans}.id`)
      }
    }
    return {
      ...i
    }
  })
  const [dataJsonForm, setDataJsonForm] = useState(newForm);
  useEffect(() => {
    // dispatchHeaderTitle(t(`${plans}.planning`));
    requestInitOrder();
    // onFilter();
    getLine()
      .then(({ data }) => setLineData(data))

    // if(requestEnterprise.machine)
    const newJson = dataJsonForm.map((i) => {
      if (i.name === "machine_id") {
        i.data = get(generalSettings, "machine", []);
      }
      return i;
    });
    setDataJsonForm(newJson);
  }, [i18n.language]);

  useEffect(() => {
    if (generalSettings.mold) {
      //  console.log(222, get(generalSettings, "mold", []))
      const newJson = dataJsonForm.map((i) => {
        if (i.name === "molds") {

          i.data = get(generalSettings, "mold", []);
        }
        return i;
      });
      setDataJsonForm(newJson);
    }
  }, [generalSettings]);

  const getDetailOrder = (id) => {
    getOrderDetail(id)
      .then(({ data }) => {
        console.log('dat---a', data)
        if (data.molds && data.molds[0])
          setListMold(data.molds)
      })
  }
  const requestInitOrder = () => {
    initData()
      .then(({ data }) => {
        console.log('requestInitOrder==========', data);
        if (data) {
          setDataSource(
            data.map((data, index) => {
              data.index = index;
              data.key = data.id;
              return data;
            })
          );
        } else {
          setDataSource([]);
        }
      })
      .catch((err) => { });
  }

  const requestOrder = () => {
    onFilter();
  };
  const onFinish = () => {
    const val = form.getFieldsValue();
    const { start_time_hh, ...valRest } = val;

    const startTimePost = moment(val.start_time_hh)
      .utcOffset("+0700")
      .format("HH:mm:ss");
    const startTimeDate = moment(val.start_time)
      .utcOffset("+0700")
      .format("DD:MM:YYYY");

    const dateConvert = (
      moment(
        `${startTimeDate} ${startTimePost}`,
        "DD:MM:YYYY HH:mm:ss"
      ).valueOf() / 1000
    ).toFixed(0);
    valRest.molds = listMold;

    // return 1;
    // console.log(dateConvert, '-----------');

    if (visible.type == "add") {
      const dataPost = {
        ...valRest,
        start_time: dateConvert,
        order_state: "Planned",
      };
      createrOrder(dataPost)
        .then(() => {
          requestOrder();
          setVisible(false);
          form.resetFields();
          openNotificationWithIcon("success", "Tạo order thành công");
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      const dataPost = {
        ...valRest,
        start_time: dateConvert,
        // order_state: 'Planned'
      };
      // console.log('==================', dataPost)
      editOrder(dataPost)
        .then(() => {
          requestOrder();
          setVisible(false);
          form.resetFields();
          openNotificationWithIcon("success", "Chỉnh sửa order thành công");
        })
        .catch((err) => {
          alert(err);
        });
    }
  };
  const [showNG, setShowNG] = useState(false);
  const handleSelectState = async ({ data, type }) => {
    if (type == "Edit") {
      onChangeSelectForm("product_id", data.product_id || "PD_01");
      onChangeSelectForm("mold_id", data.mold_id);

      setRightOption(false);

      setVisible({ type: "edit", data });
      // console.log('data', data)
      // console.log('data.start_timedata.start_timedata.start_timedata.start_time', data.start_time.split(" ")[0])
      const timeConvert = {};
      try {
        if (data.start_time) {
          timeConvert.start_time = moment(data.start_time * 1000).utcOffset(
            "+0700"
          );
          timeConvert.start_time_hh = moment(data.start_time * 1000).utcOffset(
            "+0700"
          );
        }
      } catch (err) { }
      const dataset = {
        ...data,
        ...timeConvert,
        // molds: data.molds.map(i => i.mold_id),
        // start_time: moment(data.start_time, "DD-MM-YYYY HH:mm:ss"),
        // start_time_hh: moment(data.start_time.split(" ")[1], "HH:mm:ss"),
      }
      // console.log('datasetdatasetdatasetdataset', dataset)
      form.setFieldsValue(dataset);
    } else if (type == 'NG') {
      setShowNG(data)
    } else if (type === "Delete") {
      setRightOption(false);
      const confirm = window.confirm("xoá order?");
      if (confirm) {
        try {
          await deleteOrder({ id: [data.id] });
          requestOrder();
          setRightOption(false);
          openNotificationWithIcon("success", "Xoá order thành công");
          return 'reload'
        } catch (err) {
          openNotificationWithIcon("error", "Xoá order thất bại");
        }
      }

    } else {
      try {
        await updateOrder({
          id: data.id,
          machine_id: data.machine_id,
          next_state: type,
        })
        requestOrder();
        setRightOption(false);
        openNotificationWithIcon("success", "Đổi trạng thái thành công");
        return 'reload'

      } catch (err) {
        openNotificationWithIcon("error", "Đổi trạng thái thất bại");
      }
    }
  };

  const onFilter = () => {
    console.log("---onFilter---", filter);
    const filterData = {};
    if (filter.id) filterData.id = filter.id;
    if (filter.date) {
      const [from, to] = filter.date;

      if (from && to) {
        filterData.from = moment(from).format("DD-MM-YYYY");
        filterData.to = moment(to).format("DD-MM-YYYY");
      }
    } else {
      // filterData.from = moment().subtract(1, "Y").format('DD-MM-YYYY');
      // filterData.to = moment().format('DD-MM-YYYY');
    }
    if (filter.machine_id) filterData.machine_id = filter.machine_id;
    // if (filter.key) filterData.search = filter.key;
    if (filter.type) filterData.type = filter.type;

    if (filter.state && filter.state[0]) {
      // filterData.order_state = filter.state;
      filterData.order_state = "[" + filter.state.map(i => '"' + i + '"').join(',') + "]"// '["Running","Paused"]';
    }
    // console.log(filter);

    // if (!isEmpty(filterData)) {
    requestOrderFilter(filterData)
    // }

    // dnd
  };


  const requestOrderFilter = (filterData) => {
    console.log('asakjhsakjs', filterData);
    filterOrder(filterData)
      .then(({ data }) => {
        // console.log(data, 'data result ')
        if (data) {
          setDataSource(
            data.map((data, index) => {
              data.index = index;
              data.key = data.id;
              return data;
            })
          );
        } else {
          setDataSource([]);
        }
      })
      .catch((err) => { });
  }

  const onChangeSelectForm = (type, val) => {
  };

  const [fileUpload, setFileUpload] = useState();
  const _handleSelectFile = useCallback(async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    setFileUpload({ formData, type, name: file.name });

    return false;
  }, []);
  // 
  // const [fileUpload, setFileUpload] = useState();
  const _handleSelectUnPlan = useCallback(async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await _handleUploadUnPlanFile(formData);
      openNotificationWithIcon('success', get(res, 'data.message', ''));
    } catch (error) {
      console.log('errrrr', error.response.data);
      openNotificationWithIcon('error', get(error, 'response.data.message', ''));
    }
    return false;
  }, []);

  useEffect(() => {
    if (plan && count > 0) {
      filterUnplannedOrder(plan)
        .then(res => {
          console.log('filterUnplannedOrder====', res);
          const data = get(res, 'data', []);
          setDataSource(
            data.map((data, index) => {
              data.index = index;
              data.key = data.id;
              return data;
            })
          );
        })
        .catch(err => {
          console.log('-a-s-as-a-s-as', err);
        })
    }
  }, [plan, count]);

  useEffect(() => {
    if (fileUpload && fileUpload.type) {
      if (fileUpload.type === 'new') {
        confirm({
          title: 'Xác nhận',
          content: `Thao tác này sẽ xóa hết kế hoạch hiện tại trong ngày và thêm kế hoạch mới trong ${fileUpload.name}`,
          okText: 'Thay thế',
          onOk() {
            _handleUploadFile(fileUpload.formData)
            setFileUpload(null);
          },
          onCancel() {
            setFileUpload(null)
          },
        });
      } else if (fileUpload.type === 'update') {
        confirm({
          title: 'Xác nhận',
          content: `Thao tác này sẽ thêm mới tất cả các kế hoạch trong ${fileUpload.name} và KHÔNG XÓA kế hoạch cũ`,
          okText: 'Cập nhật',
          onOk() {
            _handleUploadFile(fileUpload.formData)
            setFileUpload(null);
          },
          onCancel() {
            setFileUpload(null)
          },
        });
      } else {
        setFileUpload(null);
      }
    }

  }, fileUpload)

  const _today = () => {
    setFilter({ date: [moment(), moment().add(1, "d")] })
    setTimeout(() => {
      // onFilter()
      requestOrderFilter({
        from: moment().format("DD-MM-YYYY"),
        to: moment().add(1, "d").format("DD-MM-YYYY"),
      })
    }, 100)
  }

  const _handleUploadFile = (file) => {

    setUploadLoading(true);
    uploadExcelOrder(file)
      .then((res) => {
        console.log("-----", res);
        openNotificationWithIcon('success', 'Tải dữ liệu lên thành công');
        setUploadLoading(false);
        _today();
      })

      .catch(error => {

        setUploadLoading(false);
        // Error 😨
        if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          console.log('error.response.data', error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          try {
            if (error.response.data) {
              if (error.response.data.message) {
                openNotificationWithIcon('error', JSON.stringify(error.response.data.message));
              } else {
                openNotificationWithIcon('error', JSON.stringify(error.response.data));
              }
            }
          } catch (err) {
            openNotificationWithIcon('error', 'Tải dữ liệu lên thất bại');

          }
        } else if (error.request) {
          openNotificationWithIcon('error', 'Tải dữ liệu lên thất bại');
          /*
           * The request was made but no response was received, `error.request`
           * is an instance of XMLHttpRequest in the browser and an instance
           * of http.ClientRequest in Node.js
           */
          console.log('error.request', error.request);
        } else {
          openNotificationWithIcon('error', 'Tải dữ liệu lên thất bại');
          // Something happened in setting up the request and triggered an Error
          console.log('Error', error.message);
        }
        console.log(error);
        // console.log(err, '======err.reponseerr.reponseerr.reponseerr.reponseerr.reponse')
      })
      .catch((err) => {

      });

  }
  const _handleDel = () => {
    const confirm = window.confirm("Xoá items đã chọn?")
    if (confirm) {
      deleteOrder({ id: selectedRow })
        .then(() => {
          onFilter();
          setSelectRow([]);
          openNotificationWithIcon("success", "Xoá items thành công");
        })
        .catch((err) => {

        })
    }

  }


  return (
    <InApp BreadCum={HeaderPage}>
      <div
      // className="site-drawer-render-in-current-wrapper"
      //  style={{ height: '100%' }}
      >
        <CardCustom style={{ borderRadius: 10, height: '100%', overflow: 'scroll' }} >
          <div style={{
            display: 'flex', justifyContent: 'space-between'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              // padding: '0px 10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 10 }}>
                <BtnDownload
                  url={`export/template`}
                  text={t(`${plans}.samp_plan`)}
                />

                <Upload fileList={[]} beforeUpload={file => { _handleSelectFile(file, 'new'); return false; }}>
                  <Button
                    style={{ borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd' }} type="text" icon={<UploadOutlined />}>{t(`${plans}.rep_plan`)}</Button>
                </Upload>
                <div style={{}} />
                {/*  */}
                <Upload fileList={[]} beforeUpload={file => { _handleSelectFile(file, 'update'); return false; }}>
                  <Button type="text" icon={<UploadOutlined />}>{t(`${plans}.upd_plan`)}</Button>
                </Upload>

                <Button
                  type='primary'
                  onClick={() => {
                    setCount(1);
                    if (plan == 'All') {
                      setPlan('Un-planned');
                    } else {
                      setPlan('All');
                    }
                  }}
                  style={{ borderRadius: 4, alignSelf: 'flex-end', flex: 1, display: 'flex', width: 120, justifyContent: 'center' }}
                >
                  {plan == t(`${plans}.all`) ? t(`${plans}.un-plan`) : t(`${plans}.all`)}
                </Button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 10, marginLeft: 10 }}>

                {count == 1 && plan == 'Un-planned' &&
                  <Upload fileList={[]} beforeUpload={file => { _handleSelectUnPlan(file, 'update'); return false; }}>
                    <Button type="text" icon={<UploadOutlined />}>{t(`${plans}.upload_un_pl`)}</Button>
                  </Upload>
                }
                {showDel &&
                  // <Button
                  //   type="text"
                  //   style={{ borderLeft: '1px solid #ddd' }}
                  //   onClick={() => {
                  //     const link = document.createElement('a');
                  //     link.href = `${ENDPOINT.BASE}/export/update?id=[${selectedRow}]?dd=${moment().valueOf()}`;
                  //     document.body.appendChild(link);
                  //     link.click();
                  //     document.body.removeChild(link);
                  //   }}
                  //   icon={<DownloadOutlined />} >
                  //   Download kế hoạch hiện tại
                  // </Button>
                  <BtnDownload
                    text="Download kế hoạch hiện tại"
                    url={`export/update`}
                    params={{id: `[${selectedRow}]`}}
                  />
                }
              </div>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 10, marginLeft: 10 }}>

                {count == 1 && plan == 'Un-planned' &&
                  <Upload fileList={[]} beforeUpload={file => { _handleSelectUnPlan(file, 'unplaned'); return false; }}>
                    {/* <Button
                      border={false}
                      type="text"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = `${ENDPOINT.BASE}/export/order?dd=${moment().valueOf()}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }} icon={<DownloadOutlined />} >
                      {t(`${plans}.dw_un_pl`)} */}
                    {/* </Button> */}
                    <BtnDownload
                      text={t(`${plans}.dw_un_pl`)}
                      url={`export/order`}
                    />

                  </Upload>
                }

              </div>

              {showDel && <Button
                onClick={_handleDel}
                type="danger"
                style={{ display: 'flex', alignItems: 'center', marginLeft: 10, borderRadius: 10 }}
                icon={<DeleteOutlined />} >Xoá Items đã chọn </Button>}
            </div>
            <Button style={{ float: 'right' }} onClick={() => setShowViewSchedule(true)} icon={<SwapOutlined style={{ fontSize: 20 }} />} >Calendar</Button>
          </div>
          <div>
            {/* table */}
            <div
              style={{
                background: "#fff",
                marginTop: 10,
                borderTop: '1px solid #ddd',
                paddingTop: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                  alignItems: "center",
                }}
              >
                <div style={{ alignSelf: 'flex-end', borderRadius: 6, border: '1px solid #ddd', display: 'flex' }}>
                  <Button type="text"
                    onClick={() => setVisible({ type: "add" })}>
                    {/* <PlusOutlined
                    style={{
                      fontSize: "20px",
                      // marginBottom: "10px",
                      color: "green",
                      alignSelf: 'flex-end'
                    }}
                    onClick={() => setVisible({ type: "add" })}
                  /> */}
                    {/* <span> */}
                    {t(`${plans}.add`)}
                    {/* </span> */}
                  </Button>
                  <Button type="text" style={{ borderLeft: '1px solid #ddd' }} onClick={() => {
                    requestOrder()
                    // requestInitOrder
                  }}>{t(`${plans}.reload`)}</Button>
                </div>
                {/* filter */}
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div style={{ marginLeft: 10 }}>
                    <div>{t(`${plans}.cus_code`)}</div>
                    <Input style={{ width: 70 }} value={filter.id} placeholder={t(`${plans}.code_cus`)}
                      onChange={({ target }) => {
                        setFilter({ ...filter, id: target.value })
                      }} />
                  </div>
                  <div style={{ marginLeft: 10 }}>
                    <div>{t(`${plans}.type`)}</div>
                    <Select
                      allowClear
                      showSearch
                      style={{ flex: 3, width: 100 }}
                      placeholder={t(`${plans}.sel_line`)}
                      optionFilterProp="children"
                      onChange={(val) =>
                        setSelectLine(val)
                      }
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {lineData.map((m) => {
                        return (
                          <Select.Option key={m.id} value={m.id}>
                            {m.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </div>
                  <div style={{ marginLeft: 10 }}>
                    <div>{t(`${plans}.machine`)} </div>
                    <Select
                      allowClear
                      showSearch
                      style={{ flex: 3, width: 170 }}
                      placeholder={t(`${plans}.sel_machine`)}
                      optionFilterProp="children"
                      onChange={(val) =>
                        setFilter({ ...filter, machine_id: val })
                      }
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {get(generalSettings, "machine", []).filter(m => selectLine ? m.line_id == selectLine : true).map((m) => {
                        return (
                          <Select.Option key={m.id} value={m.id}>
                            {m.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </div>
                  <div style={{ marginLeft: 10 }}>
                    <div>{t(`${plans}.type`)} </div>
                    <Select
                      allowClear
                      showSearch
                      style={{ flex: 3, width: 170 }}
                      placeholder={t(`${plans}.sel_`)}
                      optionFilterProp="children"
                      onChange={(val) => setFilter({ ...filter, type: val })}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {['MT', 'MP'].map((m) => {
                        return (
                          <Select.Option key={m} value={m}>
                            {m}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </div>
                  <div style={{ marginLeft: 10 }}>
                    <div>{t(`managerError.status`)}</div>
                    <Select
                      allowClear
                      showSearch
                      style={{ flex: 3, width: 200 }}
                      placeholder={t(`${plans}.sel_status`)}
                      optionFilterProp="children"
                      mode="multiple"
                      // defaultValue={["Running"]}
                      value={filter.state}
                      onChange={(val) => setFilter({ ...filter, state: val })}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {["Planned", "Running", "Paused", "Complete"].map((val) => {
                        return (
                          <Select.Option key={val} value={val}>
                            {val}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </div>
                  <div style={{ marginLeft: 10 }}>
                    <div>{t(`${plans}.time`)}</div>
                    <RangePicker
                      defaultValue={
                        [
                          // moment(moment().subtract(1, "d"), dateFormat),
                          // moment(new Date(), dateFormat),
                        ]
                      }
                      value={get(filter, 'date', [])}
                      format={dateFormat}
                      style={{ borderRadius: 5 }}
                      onCalendarChange={(value) => {
                        setFilter({ ...filter, date: value });
                      }}
                    />
                  </div>
                  <Button
                    style={{ marginLeft: 20, alignSelf: 'flex-end', display: 'flex' }}
                    type="primary"
                    onClick={onFilter}
                  >
                    {t("statistics.filter")}
                  </Button>
                </div>

              </div>
              <div style={{
                // height: '100vh',
                // overflow: 'auto'
              }}>
                <TableCustom
                  dataSource={dataSource}
                  rowSelection={{
                    type: 'checkbox',
                    onChange: setSelectRow,
                    selectedRowKeys: selectedRow
                  }}
                  scroll={{ x: 1500 }}
                  // dataSource={dataFake}
                  columns={newColumns}
                  // pagination={{ pageSize: 20 }}
                  onRow={(r) => ({
                    onClick: () => {
                      setRightOption(r);
                    },
                    // onContextMenu: () => { setRightOption(r) }
                  })}
                />
              </div>
            </div>
            {/* end table */}
            <Modal
              // title="Order"
              visible={visible}
              style={{ top: 0 }}
              width={1000}
              // onOk={this.handleOk}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <StyledForm layout="vertical" onFinish={onFinish} form={form}>
                {dataJsonForm.map((item = {}, index) => {
                  if (item.type === "select") {
                    return (
                      <Form.Item
                        key={String(index)}
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                        style={item.hiden ? { display: "none" } : {}}
                      >
                        <Select
                          {...(item.multiple ? { mode: "multiple" } : {})}
                          defaultValue={get(item, "defaultValue", undefined)}
                          placeholder={get(item, "placeholder", "")}
                          // onChange={(val) => onChangeSelectForm(item.name, val)}
                          showSearch
                          disabled={item.disabled}
                        >
                          {get(item, "data", []).map((icon, index) => (
                            <Select.Option key={icon.id + index} value={icon.id}>
                              {icon.name || icon.id || icon}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    );
                  } else if (item.type == "dateTime") {
                    return (
                      <Form.Item
                        key={String(index)}
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                        style={item.hiden ? { display: "none" } : {}}
                      >
                        <DatePicker
                          // defaultValue={moment(moment(), dateFormat)}
                          // defaultValue={moment()}
                          disabled={item.disabled}
                          format={dateFormat}
                        />
                      </Form.Item>
                    );
                  } else if (item.type == "time") {
                    return (
                      <Form.Item
                        key={String(index)}
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                        style={item.hiden ? { display: "none" } : {}}
                      >
                        <TimePicker
                          defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
                          format="HH:mm:ss"
                          disabled={item.disabled}
                        />
                      </Form.Item>
                    );
                  } else if (item.type == "number") {
                    return (
                      // handleChange
                      <Form.Item
                        key={String(index)}
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                        style={item.hiden ? { display: "none" } : {}}
                      >
                        <InputNumber
                          disabled={item.disabled}
                          placeholder={item.placeholder}
                          style={{ width: "100%" }}
                        // onKeyUp={(event) => {
                        //     handleChange(event.target.value, item.name);
                        // }}
                        />
                      </Form.Item>
                    );
                  } else {
                    return (
                      <Form.Item
                        key={String(index)}
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                        style={item.hiden ? { display: "none" } : {}}
                      >
                        <Input
                          disabled={item.disabled}
                          placeholder={item.placeholder}
                        />
                      </Form.Item>
                    );
                  }
                })}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0px' }}>
                    <span style={{ marginRight: 10 }}>{t(`${plans}.mold`)}</span>
                    <PlusCircleOutlined onClick={() => {
                      setListMold([...listMold, {}])
                    }} style={{ color: 'green' }} />
                  </div>
                  <div style={{
                    borderRadius: 10,
                    border: '1px solid #dedede', paddingRight: 15, paddingTop: 10
                  }}>

                    <div style={{ display: 'flex' }}>
                      {
                        moldListForm.map(item => {
                          return (
                            <div style={{ flex: 1, textAlign: 'center' }}>
                              {item.name}
                            </div>
                          )
                        })
                      }
                    </div>
                    {
                      listMold && listMold[0] && listMold.map((moldItem, indMold) => {
                        return (
                          <div key={indMold + ''} style={{
                            padding: 10,
                            position: 'relative'
                          }}>
                            <div style={{ display: 'flex' }}>
                              {
                                moldListForm.map(item => {
                                  return (
                                    <div style={{ flex: 1 }}>
                                      <Input style={{}} key={item.key}
                                        placeholder={item.key}
                                        value={moldItem[item.key]}
                                        onChange={(val) => {
                                          moldItem[item.key] = val.target.value;
                                          setListMold([...listMold])
                                        }} />

                                    </div>
                                  )
                                })
                              }
                            </div>
                            <div style={{ position: 'absolute', right: -12, top: 10 }}>
                              <CloseCircleOutlined onClick={() => {
                                listMold.splice(indMold, 1);
                                setListMold([...listMold]);
                              }} style={{ fontSize: 20, color: 'red' }} />
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
                <Form.Item>
                  <Button
                    type="primary"
                    style={{ float: "right" }}
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </Form.Item>
              </StyledForm>
            </Modal>
            {/* option table */}
            <Modal
              title={"Action for order: " + get(rightOption, "id", "")}
              centered
              visible={rightOption}
              onCancel={() => {
                setRightOption(false);
              }}
              footer={null}
              // style={{width: 250}}
              width={800}
            >
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {rightOption.order_state &&
                  mapStateChange[rightOption.order_state] &&
                  // rightOption.
                  mapStateChange[rightOption.order_state].map((i) => {
                    return (
                      <DivAction
                        onClick={() =>
                          handleSelectState({ data: rightOption, type: i.name })
                        }
                      >
                        {i.Icon()}
                        {i.title}
                      </DivAction>
                    );
                  })}
              </div>
            </Modal>
          </div>

        </CardCustom>

        <DetailModal
          visible={showNG}
          _onSubmit={() => {
            // onFilter()
          }}
          _onClose={() => setShowNG(false)} />
        <ScheduleView
          handleSelectState={handleSelectState}
          show={showViewSchedule} setShow={setShowViewSchedule} />
      </div>
    </InApp>
  );
};

const DetailModal = ({ visible = false, _onClose = () => { }, _onSubmit }) => {
  const [ng, setNG] = useState();
  const _handleSubmit = () => {
    apiClient.patch('/order/edit_ng', {
      NG: +ng,
      order_id: get(visible, 'id', ''),
    })
      .then(() => {
        openNotificationWithIcon('success', 'Update thành công');
        _onClose()
        _onSubmit();
      })
      .catch((err) => {
        alert(String(err))
      })
  }
  return (
    //         "order_id" : 9,
    <Drawer visible={!!visible} onClose={_onClose} title="">
      <Form layout="vertical">
        <Form.Item label="NG">
          <Input
            value={ng}
            defaultValue={get(visible, 'NG', '')}
            onChange={e => setNG(e.target.value)}
          />
        </Form.Item>
        {/* <Form.Item label="order_id">
          <Input disabled defaultValue={get(visible, 'id', '')} />
        </Form.Item> */}
      </Form>
      <Button onClick={_handleSubmit}>Update</Button>
    </Drawer>
  )
}


const TableCustom = Styled(Table)`
    td.ant-table-cell {
    padding: 0px;
    }
    .ant-table-thead > tr >th{
        background: #ddd !important; 
        font-weight: bold
      }
    table th {
    background: #eee;
    }
    .row-dragging {
    background: #fafafa;
    border: 1px solid #ccc;
    }

    .row-dragging td {
    padding: 16px;
    visibility: hidden;
    }

    .row-dragging .drag-visible {
    visibility: visible;
    } 

    tbody tr {
        cursor: pointer;

    }

    .ant-table-thead > tr.ant-table-row-hover td,
    .ant-table-tbody > tr.ant-table-row-hover td,
    .ant-table-thead > tr td,
    .ant-table-tbody > tr td{
        transition-property: transform;
        transition-duration: 1s;
    }

    /* .RCM_two_level_table1 .ant-table .ant-table-tbody > tr:hover > td {
    background: unset;
    }
    & .ant-table-row:hover {
    background: red;
    } */
    .ant-table-thead > tr.ant-table-row-hover td,
    .ant-table-tbody > tr.ant-table-row-hover td,
    .ant-table-thead > tr:hover td,
    .ant-table-tbody > tr:hover td{
        /* background: #fff;
        transform: scale(1.01);
        border: '1px solid #000';
        height: 55px; */
    }
`;

const DivAction = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  width: 120px;
  cursor: pointer;

  transition-property: transform;
  transition-duration: 1s;

  &:hover {
    transform: scale(1.1);
    border: 1px solid green;
  }
`;

const mapStateChange = {
  Planned: [
    {
      name: "Running",
      title: "Running",
      Icon: () => <CheckCircleOutlined style={{ fontSize: 25 }} />,
    },
    {
      name: "Edit",
      title: "Edit",
      Icon: () => <EditOutlined style={{ fontSize: 25 }} />,
    },
    {
      name: "Delete",
      title: "Delete",
      Icon: () => <DeleteOutlined style={{ fontSize: 25 }} />,
    },
  ],
  Ready: [
    {
      name: "Closed",
      title: "Closed",
      Icon: () => <CloseCircleOutlined style={{ fontSize: 25 }} />,
    },
    {
      name: "Next",
      title: "Next",
      Icon: () => <RightCircleOutlined style={{ fontSize: 25 }} />,
    },
    {
      name: "Running",
      title: "Running",
      Icon: () => <PlayCircleOutlined style={{ fontSize: 25 }} />,
    },
  ],
  Next: [
    {
      name: "Ready",
      title: "Ready",
      Icon: () => <CheckCircleOutlined style={{ fontSize: 25 }} />,
    },
    {
      name: "Running",
      title: "Running",
      Icon: () => <PlayCircleOutlined style={{ fontSize: 25 }} />,
    },
  ],
  Running: [
    {
      name: "Paused",
      title: "Paused",
      Icon: () => <PauseCircleOutlined style={{ fontSize: 25 }} />,
    },
    {
      name: "Edit",
      title: "Edit",
      Icon: () => <EditOutlined style={{ fontSize: 25 }} />,
    },
    {
      name: "Complete",
      title: "Complete",
      Icon: () => <CheckCircleOutlined style={{ fontSize: 25 }} />,
    },
    {
      name: "NG",
      title: "NG",
      Icon: () => <VerticalAlignBottomOutlined style={{ fontSize: 25 }} />,
    },
  ],
  Paused: [
    {
      name: "Running",
      title: "Running",
      Icon: () => <PlayCircleOutlined style={{ fontSize: 25 }} />,
    },
    {
      name: "Complete",
      title: "Complete",
      Icon: () => <CheckCircleOutlined style={{ fontSize: 25 }} />,
    },
    {
      name: "Delete",
      title: "Delete",
      Icon: () => <DeleteOutlined style={{ fontSize: 25 }} />,
    },
  ],
  Complete: [
    // {
    //     name: "Closed",
    //     title: "Closed",
    //     Icon: () => <CloseCircleOutlined style={{ fontSize: 25 }} />,
    // },
    {
      name: "Edit",
      title: "Edit",
      Icon: () => <EditOutlined style={{ fontSize: 25 }} />,
    },
    {
      name: "Delete",
      title: "Delete",
      Icon: () => <DeleteOutlined style={{ fontSize: 25 }} />,
    },
  ],
};

const columns = [
  {
    fixed: 'left',
    title: "Mã KH",
    key: "id",
    width: 80,
    render: (val) => {
      return (
        <div
          style={{
            padding: 12,
            height: 50,
            // textAlign: 'center',
            background: val.description == 'Next' ? '#C8F1C8' : COLOR[val.order_state],
          }}
        >
          <span>{val.id}</span>
        </div>
      );
    },
  },
  {
    fixed: 'left',
    width: 100,
    title: "Mã máy",
    key: "machine_id",
    render: (val) => {
      return (
        <div
          style={{
            padding: 12,
            height: 50,
            background: val.description == 'Next' ? '#C8F1C8' : COLOR[val.order_state],
          }}
        >
          <span>{val.machine_id}</span>
        </div>
      );
    },
  },
  {
    title: "TG Kế hoạch",
    // dataIndex: 'planedRate',
    key: "start_time",
    render: (val) => {
      return (
        <div
          style={{
            padding: 12,
            height: 50,
            background: val.description == 'Next' ? '#C8F1C8' : COLOR[val.order_state],
          }}
        >
          <span>
            {val.start_time ? moment(val.start_time * 1000).format("DD-MM-YYYY HH:mm") :
              "..."}
          </span>
        </div>
      );
    },
  },
  {
    title: "TG Bắt đầu",
    // dataIndex: 'planedRate',
    key: "actual_start",
    render: (val) => {
      return (
        <div
          style={{
            padding: 12,
            height: 50,
            background: val.description == 'Next' ? '#C8F1C8' : COLOR[val.order_state],
          }}
        >
          <span>
            {val.actual_start ? moment(val.actual_start * 1000).format("DD-MM-YYYY HH:mm") :
              "..."}
          </span>
        </div>
      );
    },
  },
  {
    title: "TG Kết thúc",
    // dataIndex: 'planedRate',
    key: "actual_end",
    render: (val) => {
      return (
        <div
          style={{
            padding: 12,
            height: 50,
            background: val.description == 'Next' ? '#C8F1C8' : COLOR[val.order_state],
          }}
        >
          <span>
            {val.actual_end ? moment(val.actual_end * 1000).format("DD-MM-YYYY HH:mm") :
              "..."}
          </span>
        </div>
      );
    },
  },
  {
    title: "Trạng thái",
    // dataIndex: 'planedRate',
    key: "order_state",
    render: (val) => {
      return (
        <div
          style={{
            padding: 12,
            height: 50,
            background: val.description == 'Next' ? '#C8F1C8' : COLOR[val.order_state],
          }}
        >
          <span>{val.order_state}</span>
        </div>
      );
    },
  },
  {
    title: "Loại",
    key: "type",
    render: (val) => {
      return (
        <div
          style={{
            padding: 12,
            height: 50,
            background: val.description == 'Next' ? '#C8F1C8' : COLOR[val.order_state],
          }}
        >
          <span>{val.type}</span>
        </div>
      );
    },
  },
  {
    title: "Cycle time",
    // dataIndex: 'orderQuantity',
    key: "cycle_time",
    render: (val) => {
      return (
        <div
          style={{
            padding: 12,
            height: 50,
            background: val.description == 'Next' ? '#C8F1C8' : COLOR[val.order_state],
          }}
        >
          <span>{val.cycle_time}</span>
        </div>
      );
    },
  },
  {
    title: "Tên kế hoạch",
    key: "name",
    render: (val) => {
      return (
        <div
          style={{
            padding: 12,
            height: 50,
            background: val.description == 'Next' ? '#C8F1C8' : COLOR[val.order_state],
          }}
        >
          <span>{val.name}</span>
        </div>
      );
    },
  },
  {
    title: "Khuôn",
    // dataIndex: 'orderDate',
    fixed: 'right',
    // key: "mold",
    width: 170,
    render: (val) => {
      // console.log('====dddd', get(val, 'molds', []))
      return (
        <div
          style={{
            padding: 12,
            height: 50,
            minWidth: 170,
            // display: 'flex',
            background: val.description == 'Next' ? '#C8F1C8' : COLOR[val.order_state],
            // overflow: 'scroll'
          }}
        >
          {isArray(get(val, 'molds', [])) && get(val, 'molds', []).map((i, ind) => {
            return (
              <span >
                {ind == val.molds.length - 1 ? i : `${i}, `}
              </span>
            )
          })}
        </div>
      );
    },
  },
];

// const newForm = formAddOrderInit.map(i => {
//   if(i.label == "Tên kế hoạch"){
//     return {
//       ...i,
//       label : t(`${plans}.name_plan`)
//     }
//   }
//   if(i.label == "Mã máy"){
//     return {
//       ...i,
//       label : t(`${plans}.machine_code`)
//     }
//   }
//   if(i.label == "Cycle time"){
//     return {
//       ...i,
//       label : t(`${plans}.c_time`)
//     }
//   }
//   if(i.label == "Tổng cavity"){
//     return {
//       ...i,
//       label : t(`${plans}.total`)
//     }
//   }
//   if(i.label == "Thời gian theo kế hoach (ngày)"){
//     return {
//       ...i,
//       label : t(`${plans}.time_day`)
//     }
//   }
//   if(i.label == "Thời gian theo kế hoach (giờ)"){
//     return {
//       ...i,
//       label : t(`${plans}.time_h`)
//     }
//   }
//   if(i.label == "Loại"){
//     return {
//       ...i,
//       label : t(`${plans}.type`)
//     }
//   }
//   if(i.label == "id"){
//     return {
//       ...i,
//       label : t(`${plans}.id`)
//     }
//   }
// })

const formAddOrderInit = [
  {
    name: "name",
    label: "Tên kế hoạch",
    rules: [{ required: true }],
  },
  {
    name: "machine_id",
    label: "Mã máy",
    rules: [{ required: true }],
    type: "select",
    data: [],
  },
  // {
  //   name: "molds",
  //   label: "Mold",
  //   multiple: true,
  //   rules: [{ required: true, message: "Mold là bắt buộc" }],
  //   type: "select",
  //   placeholder: "Chọn mold",
  //   data: [],
  // },
  {
    name: "cycle_time",
    label: "Cycle time",
    type: "number",
    // rules: [{ required: true }],
  },
  {
    name: "cavity",
    label: "Tổng cavity",
    // rules: [{ required: true }],
  },
  {
    name: "start_time",
    label: "Thời gian theo kế hoach (ngày)",
    type: "dateTime",
    rules: [{ required: true }],
  },
  {
    name: "start_time_hh",
    label: "Thời gian theo kế hoach (giờ)",
    type: "time",
    // rules: [{ required: true }],
  },
  // {
  //   name: "quantity",
  //   label: "Quantity",
  //   type: "number",
  //   rules: [{ required: true }],
  // },
  // {
  //   name: "usage_per_min",
  //   label: "Usage_per_min",
  //   type: "number",
  //   // rules: [{ required: true }],
  // },

  // MT, MP hoặc MT/MP
  {
    name: "type",
    label: "Loại",
    rules: [{ required: true }],
    type: "select",
    data: [
      {
        name: "MT",
        id: "MT",
      },
      {
        name: "MP",
        id: "MP",
      },
      // {
      //   name: "MT/MP",
      //   id: "MT/MP",
      // },
    ],
  },
  // {
  //   name: "description",
  //   label: "Mô tả",
  // },
  // {
  //   name: "product_id",
  //   label: "Product",
  //   rules: [{ required: true }],
  //   type: "select",
  //   data: [],
  // },
  // {
  //   name: "cavity",
  //   label: "cavity",
  //   placeholder: "Vui lòng chọn Mold",
  //   rules: [{ required: true }],
  //   disabled: true,
  // },
  {
    name: "id",
    label: "id",
    hiden: true,
  },
];
const StyledForm = styled(Form)`
  .ant-modal-body {
    padding: 0px 24px 24px 24px;
    background: red;
  }

  .ant-form-item {
    margin-bottom: 4px;
  }
`;


export default PlanProductPage;

const CardCustom = styled(Card)`
  /* box-shadow: 0px 6px 14px 2px #ccc; */
  /* margin: 10px 10px; */
`;

const HeaderPage = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  let { pathname } = useLocation();
  // let { path } = useRouteMatch();
  const list = React.useMemo(() => {
    return pathname.split('/')
  }, [pathname]);

  const listLang = React.useMemo(() => ([
    {
      title: 'Tiếng việt',
      key: 'vn',
    },
    {
      title: 'English',
      key: 'en',
    },
    {
      title: '日本',
      key: 'ja',
    },
    {
      title: '한국인',
      key: 'ko',
    },
  ]), []);


  const _handleChangeLang = React.useCallback((val) => {
    if (val == "vn") {
      i18n.changeLanguage(val);
      localStorage.setItem("lang", val);
      apiClient.post("/user/language", {
        language: "vi"
      })
        .finally(() => {
          window.location.reload()
        })
    }
    else {
      i18n.changeLanguage(val);
      localStorage.setItem("lang", val);
      apiClient.post("/user/language", {
        language: val
      })
        .finally(() => {
          window.location.reload()
        })
    }
  }, [])

  const content = (
    <ListSelect>
      {listLang.map(({ key, title }) => <div
        key={key}
        style={i18n.language === key ? { background: '#ddd' } : {}}
        onClick={() => _handleChangeLang(key)}>{title}</div>)}
    </ListSelect>
  )
  return (
    <div style={{
      borderBottom: '1px solid #eee', padding: '4px 0px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <Breadcrumb>
        {list.map((pathName, index) => {
          if (!index) return (
            <Breadcrumb.Item key="home" onClick={() => history.push('/')} >
              <HomeOutlined />
            </Breadcrumb.Item>
          )
          if (!pathName) return null;
          return (
            <Breadcrumb.Item key={pathName} onClick={() => index !== list.length - 1 && history.push(`/${pathName}/`)}>
              <span style={{ textTransform: 'capitalize' }}>{pathName}</span>
            </Breadcrumb.Item>
          )
        })}
      </Breadcrumb>
      <div style={{ display: 'flex' }}>
        <Popover style={{ padding: 0 }} placement="topLeft" title={null} content={content}
        //  trigger="click"
        >
          <img src="data:image/jpeg;base64,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" style={{ height: 20, width: 20, marginRight: 10 }} />
        </Popover>

        <UserOutlined onClick={() => history.push('/profile')} />
      </div>

    </div>
  );
};

const ListSelect = styled.div`
  div {
      padding: 5px 10px;
  }
  div:hover {
      background: #ddd
  }
`