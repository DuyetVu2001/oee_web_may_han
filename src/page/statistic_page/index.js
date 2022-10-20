import {
  Button,
  DatePicker,
  Drawer,
  Select,
  Skeleton,
  Tabs,
  Form,
  Input,
  message,
  Popover,
  Breadcrumb,
} from "antd";
import {
  DotChartOutlined,
  FundOutlined,
  HomeOutlined,
  IssuesCloseOutlined,
  PoweroffOutlined,
  SettingOutlined,
  UserOutlined,
  BorderlessTableOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
// COMPONENT
import InApp from "com/in_app_layout";
import moment from "moment";
import React, { useState } from "react";
import "./index.css";
import {
  Route,
  Switch,
  useRouteMatch,
  Link,
  useHistory,
  useLocation,
} from "react-router-dom";

import Statistic from "./statistic";
import StatisticLine from "./statistic_line";
import Product_Oee_Statistic from "../product-oee-statistic";
import Product_Machine_Statistic from "../product-machine-statistic";
import WaterFall from "./water_fall";
import { useTranslation } from "react-i18next";

const { RangePicker } = DatePicker;

const pre1D = moment().subtract(1, "d").valueOf();
const now = moment().valueOf();
// &var-ENTERPRISE=${User.enterprise_id}&var-AREA=AREA_01&var-LINE=LI NE_01&var-MACHINE=HPE2&from=1639614593780&to=1639636193780&theme=light&panelId=10"

const App = () => {
  let { path } = useRouteMatch();
  return (
    <InApp>
      <TabsMenu />
      <Switch>
        {ROUTER_MAP.map(({ exact = true, ...route }) => {
          return (
            <Route
              key={`${path}/${route.path}`}
              exact={exact}
              path={`${path}/${route.path}`}
            >
              <route.Com />
            </Route>
          );
        })}
      </Switch>
    </InApp>
  );
};

const TabsMenu = () => {
  const history = useHistory();
  let { path } = useRouteMatch();
  let { pathname } = useLocation();
  const { t } = useTranslation();

  const selectedKeys = React.useMemo(() => {
    const listKey = ROUTER_MAP.map((m) => `${path}/${m.path}`);
    console.log("listKey", listKey, pathname);
    return listKey.find((i) => i.includes(pathname)) || listKey[0];
  }, [path, pathname]);

  const _handleChangeTab = (key) => {
    console.log("ddd", key);
    history.push(key);
  };
  return (
    <Tabs
      className="header-tab"
      defaultActiveKey="1"
      activeKey={selectedKeys}
      onChange={_handleChangeTab}
      size="small"
      tabBarGutter={1}
    >
      {ROUTER_MAP.map((route) => (
        <Tabs.TabPane
          style={{ padding: 0 }}
          key={`${path}/${route.path}`}
          tab={
            <Button className="ro-custom" border={false} type="text">
              {" "}
              {t(route.name)}
            </Button>
          }
          // tab={<TabIcon text={route.name} Icon={route.Icon} />}
        />
      ))}
    </Tabs>
  );
};

const ROUTER_MAP = [
  {
    path: "",
    Com: () => (
      <StatisticLine
        input="statistic_line"
        showMachine
      />
    ),
    name: "statistic_setting.production_statistic",
  },
  {
    path: "Machine_Statistic",
    name: "statistic_setting.machine_statistic",
    Com: () => (
      <WaterFall
        Com={Product_Machine_Statistic}
        input="statistic"
        showMachine
      />
    ),
  },
  {
    path: "Oee_Statistic",
    name: "statistic_setting.oee_machine",
    Com: () => <Statistic 
                Com={Product_Oee_Statistic} 
                input="oee" 
                />,
  },
  // {
  //     path: 'Power_Statistic',
  //     name: 'statistic_setting.power_statistic',
  //     Com: () => <Statistic Com={Product_Power_Statistic} input="power_statistic" />
  // },
  // {
  //   path: "Report_Chart",
  //   name: "statistic_setting.report_statistic",
  //   Com: () => <TV_Link />,
  // },
];

export default App;
