import api from 'utils/api';

export const getPlatforms = (query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/merchant/platforms`, { params: query }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}