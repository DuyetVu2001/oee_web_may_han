import { apiClient } from "helper/request/api_client";


export const getGrafana =(params) => apiClient.get("/grafana" , params) 
export const reportChart =(params) => apiClient.get("/title_report" , params) 
export const getDataTable = (params) => apiClient.get("/downtime/today" , params)
export const updateNG = (body) => apiClient.patch("/production/ng" , body)
export const updateReasonCode = (body) => apiClient.post("/machine/reason_code" , body)

export const getReason = () => apiClient.get("/ngreasoncode")
export const getTableNG = (params) => apiClient.get("/production/workshift_ng", params)
export const patchTableNG = (body) => apiClient.patch("/production/workshift_ng", body)

export const patchActualQuantity = (body) => apiClient.patch("/production_rp", body)
// export const 