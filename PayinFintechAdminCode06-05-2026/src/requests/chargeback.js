import api from 'utils/api';

export const getChargebackTransactions = (query) => {
    return new Promise((resolve, reject) => {
        return api.get('/manager/chargeback-transactions', {params: query}).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const createChargebackTransaction = (data) => {
    return new Promise((resolve, reject) => {
        return api.post('/manager/chargeback-transactions', data).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const updateChargebackTransaction = (id, data) => {
    return new Promise((resolve, reject) => {
        return api.put(`/manager/chargeback-transactions/${id}`, data).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const deleteChargebackTransaction = (id, data) => {
    return new Promise((resolve, reject) => {
        return api.delete(`/manager/chargeback-transactions/${id}`).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}