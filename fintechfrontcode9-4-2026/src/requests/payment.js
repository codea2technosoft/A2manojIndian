import { toast } from 'react-toast';
import api from 'utils/api';

export const getPaymentSettings = () => {
    return new Promise((resolve, reject) => {
        return api.get('merchant/payment/config').then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const savePaymentSettings = (data) => {
    return new Promise((resolve, reject) => {
        return api.post('merchant/payment/config', data).then(response => {
            toast.success('Save settings success');
            resolve(response.data);
        }).catch(error => {
            toast.error(error.response.data.message);
            reject(error);
        });
    })
}

export const getPaymentGateways = (data) => {
    return new Promise((resolve, reject) => {
        return api.get('/payment/available-services', {params: data}).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    })
}

export const checkout = (method, data) => {
    return new Promise((resolve, reject) => {
        return api.post(`/payment/checkout/${method}`, data).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    })
}