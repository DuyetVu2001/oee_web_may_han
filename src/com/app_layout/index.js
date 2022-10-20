import React from 'react';
import { Helmet } from "react-helmet";
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { isLoginSelector } from '../../app_state/login';
import './index.css';

const AppLayout = ({ children }) => {
    // 
    const isLogin = useSelector(isLoginSelector);
    const User = useSelector(state => get(state, 'app.user', {}));

    return (
        <div className="in-app">
            <Helmet>
                <title>{get(User, 'template.head_title', '') + ' OEE'}</title>
                <link rel="icon" href={User.logo || 'https://rostek.com.vn/wp-content/uploads/2021/07/cropped-512-32x32.png'} />
            </Helmet>
            {children}

        </div>
    )
};

export default AppLayout;