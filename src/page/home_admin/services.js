import { apiClient } from "../../helper/request/api_client";

export const getUser = () => apiClient.get('/user');
export const getApplication = () => apiClient.get('/user');
