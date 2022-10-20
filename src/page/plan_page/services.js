import { apiClient } from "helper/request/api_client";

const getAllOrder = () => {
    return apiClient.get('order_schedule/all');
    // id=1&from=20-09-2020&to=20-10-2020
};

const createrOrder = (body) => {
    return apiClient.post('order_schedule', body);
    // id=1&from=20-09-2020&to=20-10-2020
};
const editOrder = (body) => {
    return apiClient.patch('order_schedule', body);
    // id=1&from=20-09-2020&to=20-10-2020
};

const updateOrder = (body) => {
    return apiClient.patch('order_schedule/change_state', body);
    // id=1&from=20-09-2020&to=20-10-2020
};

const deleteOrder = (body) => {
    return apiClient.delete(`order_schedule`, body);

}

const filterOrder = (params) => {
    return apiClient.get(`order_schedule`, params)
}

const filterUnplannedOrder = (plan) => {
    const params = plan == 'Un-planned' ? '?search=Un-planned' : '/today';
    return apiClient.get(`order_schedule${params}`);
}

const getOrderById = (id) => {
    return apiClient.get('order_schedule/detail', { id });
}

export const getAllSchedule = () => apiClient.get('order_schedule');

const uploadExcelOrder = (formData) => {
    return apiClient.post('import/order', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const _handleUploadUnPlanFile = (formData) => {
    return apiClient.post('import/update-mold', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

const downloadPlan = () => apiClient.get('/export/template')
const getLine = () => apiClient.get('/line/all')
const getOrderDetail = (id) => apiClient.get('order_schedule/detail?id=' + id)
const initData = (id) => apiClient.get('order_schedule/today')

export {
    getAllOrder,
    createrOrder,
    updateOrder,
    editOrder,
    deleteOrder,
    filterOrder,
    getOrderById,
    uploadExcelOrder,
    downloadPlan,
    getLine,
    getOrderDetail,
    initData,
    filterUnplannedOrder
};
