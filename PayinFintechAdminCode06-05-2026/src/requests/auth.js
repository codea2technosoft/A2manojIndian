import api from 'utils/api';

export const login = (data) => {
    return api.post('/login', data);
}

export const getAuthUser = () => {
    return api.get('/auth');
}