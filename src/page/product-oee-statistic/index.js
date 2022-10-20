import React, { useState } from 'react';
import { Tabs, Breadcrumb, Popover, Tooltip, Button } from 'antd';
import { HomeOutlined, MessageOutlined, RetweetOutlined, TableOutlined, UserOutlined } from '@ant-design/icons';
import TableAccount from './account_table';
import InApp from '../../com/in_app_layout'
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import axios from 'axios';
import { apiClient } from 'helper/request/api_client';
// can have many table
const App = ({ hideMachine }) => {
    return (
        <div
        // BreadCum={HeaderPage}
        >
            <TableAccount hideMachine={hideMachine} />
        </div>
    )
}
export default App;
