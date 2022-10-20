import React, { useEffect } from 'react';
import './style.css';
import { useTranslation, initReactI18next } from "react-i18next";


// COMPONENT
import InApp from 'com/in_app_layout';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { Breadcrumb, Popover } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { apiClient } from 'helper/request/api_client';
import axios from 'axios';
import { get } from 'lodash';
// 
const key_lang = "introduce";

const AboutUs = props => {
    const {t, i18n } = useTranslation();
    const template = useSelector(state => get(state, 'app.user.template', {}) || {});


    const updateProfile = () => {
        axios.patch('http://13.229.103.205:5111/profile', {
            "icon_logo": "https://rostek.com.vn/wp-content/uploads/2021/07/cropped-512-32x32.png",
            "url": "https://cedobackend.rosoee.com",
            template: JSON.stringify({
                head_title: "Rostek OEE",
                "software_name": "Giám sát hiệu suất tổng thể",
                "company_name": "Công ty TNHH Công nghệ và Tự động hóa ROSTEK",
                "phone": "Phone: +84.986.990.169",
                "email": "infor.rostek.com",
                "web": "https://rostek.com.vn",
                "address": "Số 973 Giải Phóng, Định Công, Quận Hoàng Mai, Thành phố Hà Nội"
            })
        }, {
            headers: {
                Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1MDg3NjQ2NiwianRpIjoiN2VmMTNlMmYtYjQzZC00ZjFjLTlhNzQtNTNlY2IxNDI4Mjc4IiwibmJmIjoxNjUwODc2NDY2LCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoiYWdlbnQuY21jIiwiZXhwIjoxNjUzNDY4NDY2fQ.v10vXElEzkZeAUZSV95sF1Wz-1S0lJ7FuhIRor0XjAg"
            }
        })
    }
    const about = "about_us";

    return (
        <InApp>
            <div
                style={{
                    padding: '20px',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <p>{template.software_name}</p>
                <ul className="a">
                    <li>{t(`${about}.name`)}: {template.company_name}</li>
                    <li>{t(`${about}.phone`)}: {template.phone}</li>
                    <li>{t(`${about}.email`)}: {template.email}</li>
                    <li>{t(`${about}.website`)}: <a target='__blank' href={template.web}> {template.web}</a></li>
                    <li>{t(`${about}.address`)}: {template.address}</li>
                </ul>
                {/* <a onClick={updateProfile}>.</a> */}
            </div>
        </InApp>
    );
};



export default AboutUs;
