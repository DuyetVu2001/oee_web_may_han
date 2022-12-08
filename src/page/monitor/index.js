import InApp from "com/in_app_layout";
import ReloadBtn from "com/reload_btn";
import { useQuery } from "helper/hook/get_query";
import { useEffect, useState } from "react";
import Tag, { TAG_COLORS } from "./com/tag";

import axios from "axios";
import moment from "moment";
import { Select } from "antd";
import { openNotificationWithIcon } from "helper/request/notification_antd";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { LoadingOutlined } from "@ant-design/icons";
import { TEST_HOST } from "_config/constant";
import { BtnTus } from "com/btn_tutorial";

const FILTER_TYPES = [
  {
    id: 1,
    label: "1 h",
  },
  {
    id: 8,
    label: "8 h",
  },
  {
    id: 24,
    label: "24 h",
  },

  {
    id: 7,
    label: "7 days",
  },

  {
    id: 30,
    label: "30 days",
  },
];

const LOCAL_STORAGE_UNIQUE_KEY = "charts_reload_time";

export default function MonitorPage() {
  let query = useQuery();

  const [loading, setLoading] = useState(false);
  const [reloadTime, setReloadTime] = useState(
    localStorage.getItem(LOCAL_STORAGE_UNIQUE_KEY) || 10
  );
  const [machinesName, setMachinesName] = useState();
  const [filterTypeSelected, setFilterTypeSelected] = useState(
    FILTER_TYPES[0].id
  );
  const [machineNameSelected, setMachineNameSelected] = useState();
  const [machinesDetail, setMachinesDetail] = useState({});

  // console.log(machinesDetail);

  useEffect(() => {
    const machineId = query.get("id");
    setMachineNameSelected(machineId);
  }, [query]);

  useEffect(() => {
    axios
      .get(`${TEST_HOST}/machines`)
      .then((res) => {
        const machines = res.data.data;
        setMachinesName(machines);

        if (!query.get("machineId"))
          setMachineNameSelected(machines?.data?.[0]);
        else setMachineNameSelected(query.get("machineId"));
      })
      .catch((err) => openNotificationWithIcon("error", "Lỗi lấy tên máy"));
  }, [reloadTime, query]);

  useEffect(() => {
    if (!machineNameSelected) return () => {};

    _requestDetailMachine();
    const inter = setInterval(() => {
      _requestDetailMachine();
    }, 1000 * reloadTime);

    return () => {
      clearInterval(inter);
    };
  }, [reloadTime, machineNameSelected, machineNameSelected]);

  // useEffect(() => {
  // 	if (!machineNameSelected) return () => {};
  // 	_requestChart();
  // }, [filterTypeSelected]);

  // const _requestChart = async () => {
  // 	setLoading(true);

  // 	try {
  // 		const resChart = await axios.get(
  // 			`${TEST_HOST}/machines/line-chart?type=${filterTypeSelected}&machineId=${machineNameSelected}`
  // 		);

  // 		// handle data chart
  // 		const data = resChart.data?.data || [];
  // 		const xAxis = Object.values(data)?.[0]?.map((item) =>
  // 			moment.unix(item.time).format('MM:HH DD/MM/YYYY')
  // 		);
  // 		const series = Object.keys(data)?.map((item) => ({
  // 			data: data[item]?.map((item2) => +item2.value) || [],
  // 			name: item,
  // 		}));

  // 		setOptions((prevState) => ({
  // 			...prevState,
  // 			series,
  // 			xAxis: { categories: xAxis },
  // 		}));
  // 	} catch (err) {
  // 		// openNotificationWithIcon('error', JSON.stringify(err));
  // 		openNotificationWithIcon('error', 'Lỗi lấy dữ liệu đồ thị!');
  // 	} finally {
  // 		setLoading(false);
  // 	}
  // };

  const _requestDetailMachine = async () => {
    setLoading(true);

    try {
      const resChart = await axios.get(
        `${TEST_HOST}/machines/machine-info?machineId=${machineNameSelected}`
      );
      setMachinesDetail(resChart.data);
    } catch (err) {
      openNotificationWithIcon("error", "Lỗi lấy thông tin máy!");
    } finally {
      setLoading(false);
    }
  };

  const handleReloadTime = (time) => {
    setReloadTime(time);

    localStorage.setItem(LOCAL_STORAGE_UNIQUE_KEY, time);
  };

  return (
    <InApp>
      <div style={{ marginTop: 6 }}>
        {/* FILTER */}
        <div
          style={{
            marginLeft: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {machinesName ? (
                <>
                  <p
                    style={{
                      marginRight: 6,
                      marginBottom: "unset",
                      fontWeight: 600,
                    }}
                  >
                    Chọn máy:
                  </p>

                  <Select
                    style={{ width: 120 }}
                    defaultValue={machinesName?.name?.[0]}
                    value={machineNameSelected}
                    optionLabelProp="label"
                    onChange={setMachineNameSelected}
                  >
                    {machinesName?.map((i) => {
                      return (
                        <Select.Option value={i} label={i}>
                          <div>{i}</div>
                        </Select.Option>
                      );
                    })}
                  </Select>
                </>
              ) : (
                <LoadingOutlined />
              )}
            </div>
          </div>

          {/* <ReloadBtn
						reloadTime={reloadTime}
						handleReloadTime={handleReloadTime}
						handleReloadBtn={() => {
							_requestDetailMachine();
							// _requestChart();
						}}
						loading={loading}
					/> */}
        </div>

        {/* TAGS SPECS */}
        <div
        style={{ marginBottom: 22, display: 'flex'}}
        >
          {Object.keys(machinesDetail).map((key, index) => {
            if (key === "ubc" || key === "ia" || key === "ic")
            return (
              <Tag
                label={key}
                style={{ width: 250, height: 100 }}
                value={Number(machinesDetail[key] || 0).toFixed(2)}
                color={TAG_COLORS[0]}
              />
            );
          })}
		  {Object.keys(machinesDetail).map((key, index) => {
            if (key === "uab" || key === "uca" || key === "ib")
            return (
              <Tag
                label={key}
                style={{ width: 250, height: 100 }}
                value={Number(machinesDetail[key] || 0).toFixed(2)}
                color={TAG_COLORS[1]}
              />
            );
          })}
		  {Object.keys(machinesDetail).map((key, index) => {
            if (key === "wire_v" || key === "wireConsumption" || key === "powerConsumption")
            return (
              <Tag
                label={key}
                style={{ width: 250, height: 100 }}
                value={Number(machinesDetail[key] || 0).toFixed(2)}
                color={TAG_COLORS[2]}
              />
            );
          })}
		  {Object.keys(machinesDetail).map((key, index) => {
            if (key === "udc" || key === "idc")
            return (
              <Tag
                label={key}
                style={{ width: 250, height: 100 }}
                value={Number(machinesDetail[key] || 0).toFixed(2)}
                color={TAG_COLORS[3]}
              />
            );
          })}
        </div>
      </div>
    </InApp>
  );
}
