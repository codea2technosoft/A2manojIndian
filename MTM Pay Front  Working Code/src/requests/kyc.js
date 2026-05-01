import api from 'utils/api';

export const getKyc = () => {
    return new Promise((resolve, reject) => {
        return api.get('/kyc').then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    }) 
}

export const createKyc = (data) => {
    return new Promise((resolve, reject) => {
        return api.post('/kyc', data).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    }) 
}

export const updateKyc = (data, step) => {
    return new Promise((resolve, reject) => {
        return api.post(`/kyc/update?step=${step}`, data).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    }) 
}