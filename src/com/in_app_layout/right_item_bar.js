import React, { useState } from 'react';
import { Breadcrumb, Popover } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { apiClient } from 'helper/request/api_client';


export const Items = () => {
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

        <div style={{ display: 'flex', alignItems: 'center' }}>
        <div onClick={() => history.push('/about-us')} style={{ height: 25, width: 25, borderRadius: 25, marginRight: 10,display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* <i className="fa-solid fa-info"></i> */}
            <i className="fa-solid fa-circle-info"></i>
        </div>
            <Popover placement="topLeft" title={null} content={content}
                trigger="click"
            >
                <span style={{ height: 25, display: 'flex', alignItems: 'center', marginRight: 10 }}>
                    <i className="fa-solid fa-language"></i>
                </span>
            </Popover>
            <div onClick={() => history.push('/profile')} style={{ height: 25, width: 25, borderRadius: 25, marginRight: 10, border: '1px solid #eee', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <UserOutlined />
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
`;
