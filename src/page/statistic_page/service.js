import { apiClient } from "helper/request/api_client";


export const getGrafana =(params) => apiClient.get("/grafana" , params) 
