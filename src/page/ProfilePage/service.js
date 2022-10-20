import { apiClient } from "helper/request/api_client";


export const getProfile = (params) => apiClient.get("/profile" ,params )
export const setProfile = (params) => apiClient.patch("/profile" ,params )
