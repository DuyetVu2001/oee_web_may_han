import React, { useState } from 'react';
import InApp from '../../com/in_app_layout'
import { Tabs, Button } from 'antd';
import { Route, Switch, useRouteMatch, Link, useHistory, useLocation } from 'react-router-dom';
import { ROUTER_MAP } from './_config';
import {useTranslation} from 'react-i18next';
const Setting = () => {
    let { path } = useRouteMatch();
    return (
        <InApp>
            <TabsMenu />
            <Switch>
                {
                    ROUTER_MAP.map(({ exact = true, ...route }) => {
                        return (
                            <Route key={`${path}/${route.path}`} exact={exact} path={`${path}/${route.path}`}>
                                <route.Com /> 
                            </Route>
                        )
                    })
                }
            </Switch>
        </InApp>
    )
};


export default Setting;

// com


const TabsMenu = React.memo(() => {
    const history = useHistory();
    let { path } = useRouteMatch();
    let { pathname } = useLocation();
    const { t } = useTranslation();

    const selectedKeys = React.useMemo(() => {
        const listKey = ROUTER_MAP.map(m => `${path}/${m.path}`);
        return listKey.find(i => i.includes(pathname)) || listKey[0]
    }, [path, pathname])

    const _handleChangeTab = (key) => {
        console.log("Key Trang", key);
        history.push(key);
    }
    return (
        <Tabs defaultActiveKey="1" activeKey={selectedKeys} onChange={_handleChangeTab} size="small" tabBarGutter={1}>
            {ROUTER_MAP.map(route => <Tabs.TabPane
                    style={{ padding: 0 }}
                    key={`${path}/${route.path}`}
                    tab={<Button className="ro-custom" border={false} type="text">  {" "} {t(route.name)}</Button>}
                // tab={<TabIcon text={route.name} Icon={route.Icon} />} 
                />)}
        </Tabs>
    )
})