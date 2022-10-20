import React, { useState } from 'react';
import { SwapOutlined } from '@ant-design/icons';
import Realtime from './realtime';
import Table from './mold_table';

import InApp from 'com/in_app_layout';
const App = () => {

    const [type, setType] = useState(0);

    return (
        <div style={{height: '100vh', background: '#fff', padding: '10px 5px'}}>
            {type === 1 ? <Table /> : null}
            {type === 0 ? <Realtime /> : null}

            <div style={{
                zIndex: 10, background: '#ddd',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                position: 'fixed', bottom: 10, right: 10, width: 40, height: 40, borderRadius: 40,
            }} onClick={() => setType((type + 1) % 2)}><SwapOutlined /></div>
        </div>
    )
}

export default App;