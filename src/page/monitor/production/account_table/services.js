import { apiClient } from "../../../../helper/request/api_client";
import { ENDPOINT } from "./const";

export const get = (params) => apiClient.get(ENDPOINT, params)
export const post = (body) => apiClient.post(ENDPOINT, body)
export const patch = (body) => apiClient.patch(ENDPOINT, body)
export const deleteMany = (params) => apiClient.delete(ENDPOINT, params)

// format form
// http://54.169.159.150:5010/user/filter
export const getFilterForm = (body) => apiClient.get(`${ENDPOINT}/filter`, body)
export const getPostForm = (body) => apiClient.get(`${ENDPOINT}/post`, body)
export const getPatchForm = (body) => apiClient.get(`${ENDPOINT}/patch`, body)
export const getListColumn = () => apiClient.get(`${ENDPOINT}/table`)
// 
export const updateListColumn = (body) => apiClient.patch(`${ENDPOINT}/column`, body)

//

