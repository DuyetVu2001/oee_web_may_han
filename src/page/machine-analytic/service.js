import { apiClient } from "helper/request/api_client";


export const getGrafana =(params) => apiClient.get("/grafana" , params) 
export const getDataTable = (params) => apiClient.get("/downtime/today" , params)
export const updateNG = (body) => apiClient.patch("/production/ng" , body)
export const updateReasonCode = (body) => apiClient.post("/machine/reason_code" , body)
// export const 