import api from 'utils/api';

export const getPlans = (query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/plans`, { params: query }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}