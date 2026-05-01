import { toast } from 'react-toast';
import api from 'utils/api';

export const getCustomerGroups = (query) => {
    return new Promise((resolve, reject) => {
        return api.get('/merchant/customer-groups', {params: query}).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const getCustomerGroupDetail = (id) => {
    return new Promise((resolve, reject) => {
        return api.get(`/merchant/customer-groups/${id}`).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}
