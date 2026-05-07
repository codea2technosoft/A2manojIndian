import { toast } from 'react-toast';
import api from 'utils/api';

export const getRoles = (query) => {
    return new Promise((resolve, reject) => {
        return api.get('/admin/roles', {params: query}).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const createRole = (data) => {
    return new Promise((resolve, reject) => {
        return api.post('/admin/roles', data).then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const getRole = (id) => {
    return new Promise((resolve, reject) => {
        return api.get(`/admin/roles/${id}`).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const updateRole = (id, data) => {
    return new Promise((resolve, reject) => {
        return api.put(`/admin/roles/${id}`, data).then(response => {
            toast.success("Success");
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const deleteRole = (id) => {
    return new Promise((resolve, reject) => {
        return api.delete(`/admin/roles/${id}`).then(response => {
            toast.success("Success");
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}


export const assignPermissions = (id, data) => {
    return new Promise((resolve, reject) => {
        return api.put(`/admin/roles/${id}/permissions`, data).then(response => {
            toast.success("Success");
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}