import api from 'utils/api';

export const getNotificationConfig = async () => {
    const response = await api.get('merchant/notification/config');
    return response.data;
};

export const setNotificationConfig = async (data) => {
    const response = await api.post('merchant/notification/config', data);
    return response.data;
};

export const getWhatsappNumbers = async () => {
    const response = await api.get('merchant/notification/whatsapp/numbers');
    return response.data;
};

export const getWhatsappMessageTemplates = async (params) => {
    const response = await api.get('merchant/notification/whatsapp/templates', { params });
    return response.data;
};

export const getNotificationEvents = async (type) => {
    const response = await api.get(`merchant/notification/events/${type}`);
    return response.data;
};

export const setNotificationEventSettings = async (id, body) => {
    const response = await api.post(`merchant/notification/events/${id}`, body);
    return response.data;
};

export const getSentMessageLogs = async (params) => {
    const response = await api.get('merchant/notification/logs', { params });
    return response.data;
};

export const resendWhatsappMessage = async (id) => {
    const response = await api.post(`merchant/notification/logs/resend/${id}`);
    return response.data;
};
