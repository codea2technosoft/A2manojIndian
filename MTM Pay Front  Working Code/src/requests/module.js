import api from 'utils/api';

export const getModules = (filter = {}) => {
    return new Promise((resolve, reject) => {
        return api.get('/merchant/modules', {params: filter}).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}