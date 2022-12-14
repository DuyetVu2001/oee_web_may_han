import { AutoComplete, Button, Col, Drawer, Form, Row, Skeleton, Space, Switch } from 'antd';
import axios from 'axios';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import React, { Fragment, useState } from 'react';

import { BtnTus } from 'com/btn_tutorial';
import ReloadBtn from 'com/reload_btn';
import { TEST_HOST } from '_config/constant';
import { useHistory } from 'react-router-dom';
import { ReloadOutlined } from '@ant-design/icons';

const LOCAL_STORAGE_UNIQUE_KEY = 'cards_reload_time';
const FAKE_MACHINE=[
  {
    "uab": "113.1",
      "ubc": "0.3",
      "uca": "112.9",
      "udc": "0.06",
      "ia": "0.0",
      "ib": "0.0",
      "ic": "0.0",
      "idc": "0.0",
      "powerConsumption": "55.63999893143773",
      "wireConsumption": "0.0",
      "wire_diameter": "1.2mm",
      "wire_v": "0",
      "allowReading": "1",
      "name": "may0122",
      "id": "/dev/ttyAMA4-2",
      "status": "0",
      "errorCode": "1"
  },
 {
    "uab": "113.1",
      "ubc": "0.3",
      "uca": "112.9",
      "udc": "0.06",
      "ia": "0.0",
      "ib": "0.0",
      "ic": "0.0",
      "idc": "0.0",
      "powerConsumption": "55.63999893143773",
      "wireConsumption": "0.0",
      "wire_diameter": "1.2mm",
      "wire_v": "0",
      "allowReading": "1",
      "name": "may0122",
      "id": "/dev/ttyAMA4-2",
      "status": "0",
      "errorCode": "1"
  },
  {
    "uab": "113.1",
      "ubc": "0.3",
      "uca": "112.9",
      "udc": "0.06",
      "ia": "0.0",
      "ib": "0.0",
      "ic": "0.0",
      "idc": "0.0",
      "powerConsumption": "55.63999893143773",
      "wireConsumption": "0.0",
      "wire_diameter": "1.2mm",
      "wire_v": "0",
      "allowReading": "1",
      "name": "may0122",
      "id": "/dev/ttyAMA4-2",
      "status": "0",
      "errorCode": "1"
  }
]
const Cards2 = () => {
	let history = useHistory();

	const [loading, setLoading] = React.useState(false);
	// const [machineShow, setMachineShow] = useState(FAKE_MACHINE);
	const [machineShow, setMachineShow] = useState();
	const [reloadTime, setReloadTime] = useState(
		localStorage.getItem(LOCAL_STORAGE_UNIQUE_KEY) || 10
	);
  
  const [visible,setVisible] = useState({data: {},open: false});

	React.useEffect(() => {
		_requestRealtimeData();
		// const inter = setInterval(() => {
		// 	_requestRealtimeData();
		// }, 1000 * reloadTime);

		// return () => {
		// 	clearInterval(inter);
		// };
	}, [reloadTime]);

	const _requestRealtimeData = () => {
		setLoading(true);

		axios
			.get(`${TEST_HOST}/machines`)
			.then(({ data }) => setMachineShow(data?.data || []))
			.catch((err) => {
				openNotificationWithIcon('error', JSON.stringify(err));
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleReloadTime = (time) => {
		setReloadTime(time);

		localStorage.setItem(LOCAL_STORAGE_UNIQUE_KEY, time);
	};


  const [form] = Form.useForm();
	return (
		<div
			style={{ margin: 'auto', overflow: 'hidden', padding: 8, paddingTop: 0 }}
		>
			<div
				style={{
					marginBottom: 22,
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<div className=""></div>
			</div>

			<Row
				gutter={[
					{ xs: 6, sm: 12 },
					{ xs: 6, sm: 12 },
				]}
			>
				{machineShow?.map((data, index) => (
					
					<Fragment key={index}>
						<Col xs={24} sm={12} md={8} lg={6} xxl={4}>
							<Card data={data} onClick={()=>{setVisible({data, open: true})}} />
						</Col>
					</Fragment>
				))
				}
			</Row>

			{!machineShow ? <Skeleton /> : null}
      <Drawer 
                visible={visible.open}
                title={
                  <div  style={{fontSize:"22px"}}>Th??ng s??? chi ti???t : <span>{((visible?.data.name))}</span></div>
                }
                closable={true}
                maskClosable={true}
                onClose={()=>{setVisible({ data: {}, open: false})}}
                placement="right"
                height="400px"
                width="500px"
              >
              <div
            style={{
              width: '100%',
              textAlign: 'right',
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
          >
            <Button 
              type="primary"
              style={{
                marginRight: 8,
                
              }}
              onClick={() => form.resetFields()}
            >
              Reload
            </Button>
          </div>
              <div  style={{fontSize:"22px"}} >
              
              <div style={{ border: '2px solid #ddd', padding: 10, margin: 5, borderRadius: 10, position: 'relative' }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -100 }}>
                        <span style={{ textAlign: 'center' }}>D??ng v??o pha A1</span>
                        <span style={{ textAlign: 'center' }}>{(Number(visible?.data.ia) || 0).toFixed(2)} (A)</span>
                </div>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -100, }}>
                        <span style={{ textAlign: 'left' }}>D??ng v??o pha A2</span>
                        <span style={{ textAlign: 'left' }}>{(Number(visible?.data.ib) || 0).toFixed(2)} (A)</span>
                </div>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -100 }}>
                        <span style={{ textAlign: 'left' }}>D??ng v??o pha A3</span>
                        <span style={{ textAlign: 'left' }}>{(Number(visible?.data.ic) || 0).toFixed(2)} (A)</span>
                </div>
              </div>
              <div style={{ border: '2px solid #ddd', padding: 10, margin: 5, borderRadius: 10, position: 'relative' }}>

              
                <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -100, }}>
                        <span style={{ textAlign: 'left' }}>??i???n ??p v??o V1</span>
                        <span style={{ textAlign: 'left' }}>{(Number(visible?.data.uab) || 0).toFixed(2)} (V)</span>
                </div>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -100}}>
                        <span style={{ textAlign: 'left' }}>??i???n ??p v??o V2</span>
                        <span style={{ textAlign: 'left' }}>{(Number(visible?.data.ubc) || 0).toFixed(2)} (V)</span>
                </div>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -100, }}>
                        <span style={{ textAlign: 'left' }}>??i???n ??p v??o V3</span>
                        <span style={{ textAlign: 'left' }}>{(Number(visible?.data.uca) || 0).toFixed(2)} (V)</span>
                </div>
              </div>
              <div style={{ border: '2px solid #ddd', padding: 10, margin: 5, borderRadius: 10, position: 'relative' }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -100 }}>
                        <span style={{ textAlign: 'left' }}>T???c ????? ra d??y</span>
                        <span style={{ textAlign: 'left' }}>{(Number(visible?.data.wire_v) || 0).toFixed(2)} (m/ph??t)</span>
                </div>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -100, }}>
                        <span style={{ textAlign: 'left' }}>L?????ng d??y ti??u th??? </span>
                        <span style={{ textAlign: 'left' }}>{(Number(visible?.data.wire_consumption) || 0).toFixed(2)} (kg)</span>
                </div>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -100}}>
                        <span style={{ textAlign: 'left' }}>??i???n n??ng ti??u hao th???c t???</span>
                        <span style={{ textAlign: 'left' }}>{(Number(visible?.data.powerConsumption) || 0).toFixed(2)} (kWh)</span>
              </div>
              </div>
              
              <div style={{ border: '2px solid #ddd', padding: 10, margin: 5, borderRadius: 10, position: 'relative' }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -100, }}>
                        <span style={{ textAlign: 'left' }}>D??ng ra</span>
                        <span style={{ textAlign: 'left' }}>{(Number(visible?.data.idc) || 0).toFixed(2)} (A)</span>
                </div>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -100}}>
                        <span style={{ textAlign: 'left' }}>??p ra</span>
                        <span style={{ textAlign: 'left' }}>{(Number(visible?.data.udc) || 0).toFixed(2)} (V)</span>
                </div>
              </div>
              
              </div>
              </Drawer>
		</div>
	);
};

const Card = ({ data, onClick = () => {} }) => {
	// const history = useHistory();
	return (
		<div
			onClick={onClick}
			style={{
				borderRadius: 10,
				background: '#ccc',
				padding: '12px 8px',
				cursor: 'pointer',
			}}
		>

			<div style={{
                border: `2px solid #ccc`, height: '100%',
                borderRadius: 6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '3px 0' }}>
                    <div style={{ fontSize: '1.5vw', fontWeight: '600' }}>{data.name || 'Not found machine'} </div>
                </div>
                <div style={{
                    flex: 1,
                    background: data?.errorCode !== "0" ? 'red' : (data?.status === "1" ? "green" : "orange"),
                    borderRadius: 3,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <span style={{ fontSize: '4.5vw', lineHeight: -10, color: '#fff', fontWeight: '600' }}>{(Number(data.powerConsumption) || 0).toFixed(2)}</span>
                </div>
                <div style={{ background: '#dedede', fontSize: '28px', fontWeight: '600', padding: '0px 20px', }}>
                    <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -10, }}>
                        <span style={{ textAlign: 'left' }}>D??ng ra</span>
                        <span style={{ textAlign: 'left' }}>{(Number(data.idc) || 0).toFixed(2)}(A)</span>
                    </div>
                    <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', lineHeight: -10, }}>
                        <span style={{ textAlign: 'left' }}>??p ra</span>
                        <span style={{ textAlign: 'left' }}>{(Number(data.udc) || 0).toFixed(2)}(V)</span>
                    </div>
                </div>
            </div>

		</div>
	);
};

export default Cards2;
