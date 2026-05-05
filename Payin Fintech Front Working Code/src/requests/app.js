import api from 'utils/api';
import { toast } from 'react-toast';

export const getApps = (query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/merchant/apps`, { params: query }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const getActivedApps = (query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/merchant/apps/actived`, { params: query }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const activeApp = (data) => {
    return new Promise((resolve, reject) => {
        return api.post(`/merchant/apps`, data).then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}


export const updateApp = (id, data) => {
    return new Promise((resolve, reject) => {
        return api.put(`/merchant/apps/${id}`, data).then(response => {
            resolve(response.data);
            toast.success("Your app is updated!");
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const getAppDetail = (id) => {
    return new Promise((resolve, reject) => {
        return api.get(`/merchant/apps/${id}`).then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}