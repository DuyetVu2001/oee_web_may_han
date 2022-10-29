import { apiClient } from '../../../../helper/request/api_client';
import { ENDPOINT } from './const';
import axios from 'axios';

// export const get = (params) => apiClient.get(ENDPOINT, params);
export const post = (body) => apiClient.post(ENDPOINT, body);
// export const patch = (body) => apiClient.patch(ENDPOINT, body);
export const deleteMany = (params) => apiClient.delete(ENDPOINT, params);

// format form
// http://54.169.159.150:5010/user/filter
export const getFilterForm = (body) =>
	apiClient.get(`${ENDPOINT}/filter`, body);
export const getPostForm = (body) => apiClient.get(`${ENDPOINT}/post`, body);
// export const getPatchForm = (body) => apiClient.get(`${ENDPOINT}/patch`, body);
// export const getListColumn = () => apiClient.get(`${ENDPOINT}/table`);
//
export const updateListColumn = (body) =>
	apiClient.patch(`${ENDPOINT}/column`, body);

const ENDPOINT1 = 'http://192.168.1.44:3888/machines';

export const get = (body) => axios.get(`${ENDPOINT1}`, body);
export const patch = (body) => axios.put(`${ENDPOINT1}`, body);
export const getPatchForm = (body) => axios.get(`${ENDPOINT1}/patch`, body);
export const getListColumn = () => axios.get(`${ENDPOINT1}/table`);
