import { LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { requestLogout } from 'app_state/login';
// component
import { images } from 'helper/static/images';
import { get } from 'lodash';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { private_route_admin } from '_config/route';
import { Breadcrumbs } from './breadcrumbs';
import { Items } from './right_item_bar';
import { Wrapper } from './styled';
import styled from 'styled-components';
import { UseRouter } from 'index';



const App = ({ children, title = '' }) => {
    const [collapsed, onCollapse] = React.useState(true);
    const [showAllApp, setShowAllApp] = React.useState(false);
    const User = useSelector(state => get(state, 'app.user', {}));
    // const [width, setWidth] = React.useState(window.innerWidth);

    const [showSider, setShowSider] = React.useState(true)
    const [marginContent, setMaginContent] = React.useState(40)
    const dispatch = useDispatch();
    useEffect(() => {
        if (window.innerWidth < 416) {
            setShowSider(false)
            setMaginContent(0)
        }
    }, [])
    return (
        <Wrapper>
            <Layout>
                <Layout.Header style={{
                    height: 35, position: 'fixed',
                    background: '#ccc',
                    padding: 0,
                    zIndex: 10,
                    top: 0, left: 0, right: 0,
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                            onClick={() => setShowAllApp(true)}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 40,
                                height: 35,
                            }}>
                            {/* <img src={User.logo || 'https://rostek.com.vn/wp-content/uploads/2021/07/cropped-512-32x32.png'} alt="logo" style={{ height: 25, marginLeft: 1, borderRadius: '50%' }} /> */}
                        </div>

                        <div style={{ margin: '1px 10px' }}>
                            <Breadcrumbs />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.2em' }}><b>{title}</b></div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* <Items /> */}
                    </div>
                    {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} /> */}
                </Layout.Header>
                <Layout style={{ minHeight: '95vh' }}>
                    {showSider &&
                        <Layout.Sider
                            collapsedWidth={42}
                            width={170}
                            theme='light'
                            collapsible
                            reverseArrow={false}
                            collapsed={collapsed}
                            trigger={null}
                            // onCollapse={onCollapse}
                            // onMouseLeave={() => onCollapse(true)}
                            style={{
                                overflow: 'hidden',
                                height: '100vh',
                                position: 'fixed',
                                background: '#ddd',
                                left: 0,
                                top: 35,
                                width: 40,
                                zIndex: 10,
                            }}
                        >
                            <div onClick={() => { onCollapse(!collapsed) }} style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', height: 30, width: 40 }}>
                                <i className="fa-solid fa-bars-staggered"></i>
                            </div>
                            <LeftMenu />
                            <div onClick={() => dispatch(requestLogout())} style={{
                                position: 'absolute', bottom: 35,
                                textAlign: 'center',
                                left: 0, right: 0,
                                display: 'flex',
                                alignItems: 'center',
                                padding: "10px 10px",
                            }}>
                                <LogoutOutlined style={{ color: 'red', fontSize: 20 }} />
                                <span style={{ marginLeft: 20, color: '#111' }}>Logout</span>
                            </div>
                        </Layout.Sider>}
                    <Layout style={{
                        marginLeft: marginContent,
                        // background: '#f4f5f5',
                        background: '#fff',
                    }}>

                        <LayoutContent style={{
                            margin: '5px 5px',
                            marginTop: 40,
                            overflowY: 'scroll',
                            borderRadius: 10,
                            height: 'calc(100vh - 35px)',
                            fontSize: 14,
                        }}>
                            {children}
                        </LayoutContent>
                    </Layout>
                </Layout>


            </Layout>
            {/* <AllAppModal visible={showAllApp} _onClose={() => setShowAllApp(false)} /> */}
        </Wrapper>
    )
};

const LayoutContent = styled(Layout.Content)`
/* margin: 5px 5px;
margin-top: 40px;
overflow-y: 'scroll';
border-radius: 10px;
height: 'calc(100vh - 35px)';
font-size: 14px; */
&::-webkit-scrollbar {
  width: 1px;
}
 
&::-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
}
 
&::-webkit-scrollbar-thumb {
  /* background-color: red; */
  /* outline: 1px solid slategrey; */
}
`


const lang = "route";
const LeftMenu = React.memo(() => {

    const { t } = useTranslation();
    const history = useHistory();
    let { path } = useRouteMatch();
    // let { pathname } = useLocation();
    const { userrole } = useSelector(state => state.app)
    const route = UseRouter()
    const selectedKeys = React.useMemo(() => {
        const listKey = route.map(m => `${m.path}`);
        return listKey.find(i => i === path) || listKey[0]
    }, [path]);

    return (
        <Menu
            // theme="dark"
            style={{ background: '#ddd', overflow: 'hidden' }}
            mode="inline"
            selectedKeys={selectedKeys}
        >
            {
                route.map(route => {
                    return !route.hidden ?
                        <Menu.Item
                            onClick={() => history.push(`${route.path}`)}
                            key={`${route.path}`}
                            icon={route.Icon}
                        >
                            {t(`${lang}.${route.name}`)}
                        </Menu.Item> :
                        null
                })
            }
        </Menu>
    )
})


export default App;