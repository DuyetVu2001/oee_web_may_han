import React, { useState } from 'react';
import InApp from '../../com/in_app_layout'
import { Tabs, Breadcrumb, Popover, Button } from 'antd';
import { HomeOutlined, MessageOutlined, UserOutlined, ApiOutlined, BranchesOutlined, BugOutlined } from '@ant-design/icons';
import { Route, Switch, useRouteMatch, Link, useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { ROUTER_MAP } from './_config';
import axios from 'axios';
import { apiClient } from 'helper/request/api_client';

const Setting = () => {
    let { path } = useRouteMatch();
    return (
        <InApp BreadCum={HeaderPage}>
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
    const {t} = useTranslation();
    const selectedKeys = React.useMemo(() => {
        const listKey = ROUTER_MAP.map(m => `${path}/${m.path}`);
        console.log('listKey', listKey, pathname)
        return listKey.find(i => i.includes(pathname)) || listKey[0]
    }, [path, pathname])

    const _handleChangeTab = (key) => {
        console.log('ddd', key)
        history.push(key);
    }
    return (
        <Tabs defaultActiveKey="1" activeKey={selectedKeys} onChange={_handleChangeTab} size="small" tabBarGutter={1}>
            {ROUTER_MAP
                .map(route => <Tabs.TabPane
                    style={{ padding: 0 }}
                    key={`${path}/${route.path}`}
                    tab={<Button className="ro-custom" border={false} type="text"> {t(route.name)}</Button>}

                />)}
        </Tabs>
    )
})

const TabIcon = ({
    text = '',
    Icon
}) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px 10px' }}>
            <Icon style={{ fontSize: 24, margin: 0, marginRight: 10 }} />
            <span style={{ textTransform: 'uppercase' }}>{text}</span>
        </div>

    )
}
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
                    <img src='data:image/jpeg;base64,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' style={{ height: 20, width: 20, marginRight: 10 }} />
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