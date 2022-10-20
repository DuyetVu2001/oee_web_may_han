import { apiClient } from 'helper/request/api_client';
import { ENDPOINT } from '_config/end_point';

export const authServices = {
    handleLogin: body => apiClient.post(`/login`, body),
    handleSignOut: body => apiClient.post(`/logout`, body)
};

export const appPermissionService = {
    requestAppUser: () => apiClient.get('/application/getuser'),
    requestAllApp: () => apiClient.get('/application'),
}
