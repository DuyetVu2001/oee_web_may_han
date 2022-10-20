import { createSlice } from '@reduxjs/toolkit';
import { get } from 'lodash';
// com
import { openNotificationWithIcon } from "../helper/request/notification_antd";
import { handleErr } from "../helper/request/handle_err_request";
// helper
import {
    finishedLoadingSuccess,
    finishedLoadingFailure,
    isLoadingRequest,
} from '../helper/redux/slice_redux';
import { appPermissionService } from './services';

const initialState = {
    loading: false,
    canAccess: [],
    allApp: [],
};

// Slice
const slice = createSlice({
    name: 'app_permission',
    initialState,
    reducers: {
        load_data_app: (state) => {
            isLoadingRequest(state);
        },
        load_data_app_ss: (state, { payload }) => {
            finishedLoadingSuccess(state);
            state.canAccess = payload.canAccess;
            state.allApp = payload.allApp;
        },
        load_data_app_fail: (state, { payload }) => {
            finishedLoadingFailure(state);
        },
    }
});
// ACTION
const { load_data_app, load_data_app_ss, load_data_app_fail } = slice.actions;

export const requestDataApp = () => async (dispatch) => {
    try {
        dispatch(load_data_app());
        const [allApp, canAccess] = await Promise.all([
            appPermissionService.requestAllApp().catch(err => {
                return {
                    data: []
                }
            }),
            appPermissionService.requestAppUser().catch(err => {
                return {
                    data: []
                }
            }),
        ])
        console.log('allApp.data', allApp.data)
        dispatch(load_data_app_ss({
            allApp: allApp.data,
            canAccess: canAccess.data,
        }));

        return 1;
    } catch (err) {
        handleErr(err);
        dispatch(load_data_app_fail())
        return 0;
    }
}

// SELECTOR

export const getAllApp = state => {
    return get(state, 'app_permission.allApp', [])
};
export const getAppAccess = state => get(state, 'app_permission.canAccess', []);

export default slice.reducer;
