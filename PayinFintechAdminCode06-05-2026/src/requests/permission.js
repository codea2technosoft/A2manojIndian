import { toast } from 'react-toast';
import api from 'utils/api';

export const getPermissions = (query) => {
    return new Promise((resolve, reject) => {
        return api.get('/permissions', {params: query}).then(response => {
            resolve(response.data.records);
        }).catch(err => {
            reject(err);
        });
    })
}
