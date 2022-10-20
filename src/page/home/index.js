import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { Table } from 'antd';
// com
import InApp from 'com/in_app_layout';
import { HeaderPage } from 'com/header';
// 
import FactoryStructure from './factory_chart';
import FactoryTable from './factory_table';
import FactoryTree from './factory_tree';
import ListMachine from './list_machine';
import { apiClient } from 'helper/request/api_client';
import { useTranslation } from 'react-i18next';
const App = () => {
    const [view, setView] = React.useState(0);
    const { t } = useTranslation();
    const lang = "change_view"
    return (
        <InApp BreadCum={HeaderPage}>
            {view === 0 ? <ListMachine /> : null}
            {view === 1 ? <FactoryTree /> : null}
            {view === 2 ? <FactoryTable /> : null}
            {/* {view === 3 ? <FactoryStructure /> : null} */}
            <Tooltip title={t(`${lang}.view`)}>
                <div className='fixed-btn' onClick={() => setView((view + 1) % 3)}><SwapOutlined /> </div>
            </Tooltip>
        </InApp>
    );
};

export default App;
