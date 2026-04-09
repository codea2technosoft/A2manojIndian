import api from 'utils/api';
import { toast } from 'react-toast';

export const createStore = (data) => {
    return new Promise((resolve, reject) => {
        return api.post(`/merchant/stores`, data).then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const getStores = (query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/merchant/stores`, { params: query }).then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const getStoreDetail = (id) => {
    return new Promise((resolve, reject) => {
        return api.get(`/merchant/stores/${id}`).then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const updateStoreDetail = (id, data) => {
    return new Promise((resolve, reject) => {
        return api.post(`/merchant/stores/${id}`, data).then(response => {
            resolve(response.data);
            toast.success('Store is updated successfully');
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const updateStoreStatus = (id, data) => {
    return new Promise((resolve, reject) => {
        return api.post(`/merchant/stores/${id}/status`, data).then(response => {
            resolve(response.data);
            toast.success('Store is updated successfully');
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const syncStoreData = (id, data) => {
    return new Promise((resolve, reject) => {
        return api.post(`/merchant/stores/${id}/sync`, data).then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const getSyncStoreProgress = (id) => {
    return new Promise((resolve, reject) => {
        return api.get(`/merchant/stores/${id}/sync-progress`).then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}