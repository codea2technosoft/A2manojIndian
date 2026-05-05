import api from 'utils/api';

export const getConfig = (data) => {
    return api.get('/config-new', data);
}


