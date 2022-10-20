import { SettingOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Input, message, Popover } from 'antd';
import { get } from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';
import { SRC_WAT } from '_config/storage_key';
import './index.css'
import { getGrafana } from './service';

const h8 = moment().set('hour', 8).set('minute', 0).valueOf();
const h20 = moment().set('hour', 20).set('minute', 0).valueOf();
const h20p = moment().set('hour', 20).subtract(1, 'd').set('minute', 0).valueOf();
const h8n = moment().add(1, 'd').set('hour', 8).set('minute', 0).valueOf();

const App = () => {
    const [timestamp, setTimestamp] = React.useState({
        from: h8,
        to: h20,
    });
    const [srcWat , setSrcWat] = useState('')
    const [showSrc, setShowSrc] = React.useState(false)
    const _requestData = async() => {
        try {
            const {data} = await getGrafana({
                name : "power"
            })
            setSrcWat(data?.url || localStorage.getItem(SRC_WAT))
        } catch (error) {
            console.log("err" ,error);
        }
    }

    React.useEffect(() => {
        _requestData()
        checkTime();
        const interVal = setInterval(() => { checkTime() }, 60 * 1000);
        return () => {
            clearInterval(interVal)
        }
    }, []);

    const checkTime = () => {
        const h = moment().format("HH");
        if (+h >= 8 && +h < 20) {
            if (timestamp.from != h8) setTimestamp({ from: h8, to: h20 })
        } else if (+h >= 0 && +h <= 8) {
            if (timestamp.from != h20) setTimestamp({ from: h20p, to: h8 })
        } else {
            if (timestamp.from != h20) setTimestamp({ from: h20, to: h8n })
        }
    }

    const { TextArea } = Input;
    const onFinish = (val) => {
        setSrcWat(val.src)
        localStorage.setItem(SRC_WAT, val.src)
        setShowSrc(false)
    };

    const onFinishFailed = () => {
        message.error('Submit failed!');
    };

    return (
        <div style={{ padding: 15, height: 'calc(100vh - 50px)', overflow: 'scroll', marginTop: -5 }}>
            <div
                style={{ position: 'fixed', bottom: 5, right: 10, display: 'flex', marginRight: "56px", zIndex: "5" }}
            >
                {/* <ButtonSetting handleSetting={() => { setShowSrc(true) }}>
                    <SettingOutlined />
                </ButtonSetting> */}
                <Drawer title={false} width={500} visible={showSrc} onClose={() => setShowSrc(false)} >
                    <div className='title'>Giám sát điện năng</div>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ "src": srcWat }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item>
                            <HeaderForm />
                        </Form.Item>
                        <Form.Item
                            name="src"
                            style={{ width: "465px" }}
                        >
                            <TextArea rows={2} />
                        </Form.Item>
                    </Form>
                </Drawer>
            </div>
            <iframe
                src={`${srcWat}&from=${timestamp.from}&to=${timestamp.to}&theme=light&kiosk`}
                width="100%" height="100%" frameborder="0"></iframe>
        </div>
    )
};

const ButtonSetting = ({ handleSetting = () => { }, children }) => {
    return (
        <Popover title="setting" >
            <div
                onClick={handleSetting}
                style={{
                    height: 50,
                    width: 50,
                    background: '#ddd',
                    color: '#000',
                    borderRadius: '50%',
                    opacity: '0.7',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 12,
                    cursor: 'pointer',
                }}
            >
                {children}
            </div>
        </Popover>
    )
}
export default App;


const HeaderForm = ({ loading = false, _onClose = () => { } }) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: 10 }}>
        <span style={{ fontSize: 18, fontWeight: '500' }}>Setting</span>
        <div>
          <Button
            loading={loading}
            type="primary"
            style={{ float: "left", borderRadius: 5, marginLeft: 13, marginTop: 6 }}
            htmlType="submit"
          > Submit  </Button>
        </div>
      </div>
    )
  }

// {
//     Object.keys(LIST_LINK).map(machine => {
//         return (
//             <div key={machine} style={{ display: 'flex' }}>
//                 {
//                     LIST_LINK[machine].map((frame, index) => {
//                         return (
//                             <div key={index + ''} style={{ flex: 1, padding: 5 }}>
//                                 <iframe
//                                     src={frame}
//                                     width="100%" height="200" frameborder="0"></iframe>
//                             </div>
//                         )
//                     })
//                 }
//             </div>

//         )
//     })
// }