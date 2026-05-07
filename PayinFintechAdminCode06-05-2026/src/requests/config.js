import api from 'utils/api';

export const getConfig = () => {
    return api.get('/admin/config');
}

export const saveConfig = (data) => {
    return api.post('/admin/config', data);
}
