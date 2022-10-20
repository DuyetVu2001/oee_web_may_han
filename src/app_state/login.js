import { createSlice } from '@reduxjs/toolkit';
// com
import { openNotificationWithIcon } from "../helper/request/notification_antd";
import { handleErr } from "../helper/request/handle_err_request";
// helper
import {
    finishedLoadingSuccess,
    finishedLoadingFailure,
    isLoadingRequest,
} from '../helper/redux/slice_redux';
import { authServices } from './services';
import { ACCESS_TOKEN, REFRESH_TOKEN, SERVER_URL } from '../_config/storage_key';

const initialState = {
    userrole: 3,
    user: {}
};

// Slice
const slice = createSlice({
    name: 'app_state',
    initialState,
    reducers: {
        loginRequest: (state, { payload }) => {
            isLoadingRequest(state);
            state.isLogin = false;
        },
        loginSuccess: (state, { payload }) => {
            finishedLoadingSuccess(state);
            state.isLogin = true;
            state.userrole = payload.userrole;
            state.user = payload;
        },
        loginFail: (state, { payload }) => {
            finishedLoadingFailure(state)
            state.isLogin = false;
        },
        logout: (state) => {
            finishedLoadingSuccess(state);
            state.isLogin = false;
        }
    }
});
// ACTION
const { loginRequest, loginSuccess, loginFail, logout } = slice.actions;

export const requestLogin = (body) => async (dispatch) => {
    try {
        dispatch(loginRequest());

        const { data } = await authServices.handleLogin(body);
        try {
            data.template = JSON.parse(data.template);
        } catch (err) {
            data.template = {}
        }
        await dispatch(loginSuccess(data));

        // icon_logo: "aaaaa"
        // logo: "mmmmaanmn"
        // msg: "Logged in as agent.cmc"
        // template: "Comprehensive asset performance management solution C-APM"
        // url: "https://cedobackend.rosoee.com/"

        localStorage.setItem(ACCESS_TOKEN, data.access_token);
        localStorage.setItem(REFRESH_TOKEN, data.refresh_token);
        localStorage.setItem(SERVER_URL, data.url);

        openNotificationWithIcon("success", data.msg);
        return data;
    } catch (err) {
        console.log("err ", err.response);
        handleErr(err);
        dispatch(loginFail())
        return 0;
    }
}

export const requestLogout = (body) => async (dispatch) => {
    try {
        dispatch(logout())
        localStorage.clear();
        return 1;
    } catch (err) {
        handleErr(err);
        dispatch(loginFail())
        return 0;
    }
}

// SELECTOR

export const isLoginSelector = state => {
    return state.app.isLogin
};
export const appStateSelector = state => {
    return state.app
};


export default slice.reducer;
