import React, { useState } from 'react';
import { Breadcrumb, Popover } from 'antd';
import { get } from 'lodash';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { apiClient } from 'helper/request/api_client';

export const Breadcrumbs = () => {
    const history = useHistory();
    const template = useSelector(state => get(state, 'app.user.template', {}) || {});
    let { pathname } = useLocation();
    const list = React.useMemo(() => {
        return pathname.split('/')
    }, [pathname]);
    return (
        <div style={{
            // borderBottom: '1px solid #eee', 
            padding: '4px 0px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
            <Breadcrumb separator=">">
                {list.map((pathName, index) => {
                    if (!index) return (
                        <Breadcrumb.Item key="home" onClick={() => history.push('/')} >
												{/* {template.head_title} */}
												OEE
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
        </div>
    );
};
