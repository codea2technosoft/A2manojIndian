import { toast } from 'react-toast';
import api from 'utils/api';

export const getCurrencies = (query) => {
    return new Promise((resolve, reject) => {
        return api.get('/admin/currencies', {params: query}).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const createCurrency = (data) => {
    return new Promise((resolve, reject) => {
        return api.post('/admin/currencies', data).then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const getCurrency = (id) => {
    return new Promise((resolve, reject) => {
        return api.get(`/admin/currencies/${id}`).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const updateCurrency = (id, data) => {
    return new Promise((resolve, reject) => {
        return api.put(`/admin/currencies/${id}`, data).then(response => {
            toast.success("Success");
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const deleteCurrency = (id) => {
    return new Promise((resolve, reject) => {
        return api.delete(`/admin/currencies/${id}`).then(response => {
            toast.success("Success");
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}
