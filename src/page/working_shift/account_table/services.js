// import { apiClient } from "../../../../helper/request/api_client";
import { apiClient } from '../../../helper/request/api_client';
import { ENDPOINT } from "./const";
import axios from 'axios';
import { TEST_HOST1,TEST_HOST } from '_config/constant';

// export const get = (params) => apiClient.get(ENDPOINT, params)

export const post = (body) => apiClient.post(ENDPOINT,body)
// export const patch = (body) => apiClient.patch(ENDPOINT, body)

export const deleteMany = (params) => apiClient.delete(ENDPOINT, params)

// format form
// http://54.169.159.150:5010/user/filter
export const getFilterForm = (body) => apiClient.get(`${ENDPOINT}/filter`, body)
export const getPostForm = (body) => apiClient.get(`${ENDPOINT}/post`, body)
// 
export const updateListColumn = (body) => apiClient.patch(`${ENDPOINT}/column`, body)
// export const list machine
export const listMachine = (body) => axios.get(`${TEST_HOST1}/machine`, body);
export const get = (body) => axios.get(`${TEST_HOST1}/working_shift`, body);
export const patch = (body) => axios.put(`${TEST_HOST1}/working_shift`, body);
export const getPatchForm = (body) => axios.get(`${TEST_HOST1}/working_shift/patch`, body);
export const getListColumn = () => axios.get(`${TEST_HOST1}/working_shift/table`);

