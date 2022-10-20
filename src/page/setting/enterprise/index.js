import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';


import AreaTable from './area_table';
import LineTable from './line_table';
import MachineTable from './machine_table';

const App = () => {
    const { t } = useTranslation();

    return (
        <div>
            <Tabs
                tabBarStyle={{
                    background: '#fafafa'
                }}
                tabPosition={'top'} size="middle" type="card">
                <Tabs.TabPane tab={<TabSpan text={t('enterprise.area')} />} key="1">
                    <AreaTable />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<TabSpan text={t('enterprise.line')} />} key="2">
                    <LineTable />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<TabSpan text={t('enterprise.machine')} />} key="3">
                    <MachineTable />
                </Tabs.TabPane>
            </Tabs>

        </div>
    )
}
const TabSpan = ({ text }) => <span style={{ textTransform: 'capitalize' }}>{text}</span>
export default App;