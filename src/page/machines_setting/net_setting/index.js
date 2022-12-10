import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';

import Device from './device';
import Queue from './queue';

const App = () => {
    const { t } = useTranslation();

    return (
        <div>
            <Tabs
                tabBarStyle={{
                    background: '#fafafa'
                }}
                tabPosition={'top'} size="middle" type="card">
                <Tabs.TabPane tab={<TabSpan text='Thông tin thiết bị' />} key="1">
                    <Device />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<TabSpan text='Thông tin Hàng đợi' />} key="2">
                    <Queue />
                </Tabs.TabPane>
            </Tabs>

        </div>
    )
}
const TabSpan = ({ text }) => <span style={{ textTransform: 'capitalize' }}>{text}</span>
export default App;