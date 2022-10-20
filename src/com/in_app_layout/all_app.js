
import React, { useEffect, useMemo } from "react";
import { get, isEmpty, cloneDeep } from "lodash";
import { Button, Form, Drawer, Checkbox } from "antd";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRightOutlined } from '@ant-design/icons';

// component
import { getAllApp, getAppAccess } from "app_state/app_permission";
import { ENDPOINT } from "_config/end_point";


const ModalForm = ({
    visible,
    _onClose,
}) => {
    const history = useHistory();
    const listAllApp = useSelector(getAllApp);
    const listApp = useSelector(getAppAccess);

    return (
        <Drawer title={false} placement={'left'} closable={false} onClose={_onClose} visible={visible} width={370}>
            <h2>Rostek</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {
                    listAllApp.map(app => {
                        return (
                            <CardCustom
                                onClick={() => {
                                    _onClose()
                                    history.push(`/${map_link[app.name]}`)
                                }} >
                                <img
                                    style={{
                                        height: 30, width: 30,
                                        // opacity: listApp.includes(app.name) ? 1 : 0.5, 
                                    }}
                                    src={`${ENDPOINT.BASE}/application/${app.name}.png`}
                                    alt="img"
                                />
                                <span style={{ marginTop: 6 }}> {app.title}</span>
                            </CardCustom>
                        )
                    })
                }
            </div>
            <span>All App</span>
            <ArrowRightOutlined />
        </Drawer>
    )
};


const CardCustom = styled.div`
    width: 150px;
    padding: 7px 12px;
    margin: 5px 1px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
    transition: box-shadow 0.5s;
    border-radius: 5px;
    &:hover {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
`


const map_link = {
    application: 'welcome',

    employees: 'account',

    sales: 'sales',

    purchase: 'purchase',

    outsource: 'outsource',

    inventory: 'inventory',

    plm: 'plm',

    manufacture: 'manufacture',

    quality: 'quality',

    realtime: 'realtime',

    maintenance: 'maintenance',

    setting: 'setting',

    task: 'task'
}


export default ModalForm;