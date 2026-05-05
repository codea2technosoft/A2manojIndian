import api from 'utils/api';

export const getIpInfo = () => {
    return new Promise((resolve, reject) => {
        return api.get('/ip').then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const getCinInfo = (data) => {
    return new Promise((resolve, reject) => {
        return api.post('/cin', data).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const searchGstin = (gstinNumber) => {
    return new Promise((resolve, reject) => {
        return api.get('/search-gstin', { params: { gstin: gstinNumber } }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const uploadFile = (data) => {
    return new Promise((resolve, reject) => {
        return api.post('/files/saveFile', data, { headers: { "Content-Type": "multipart/form-data" } }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const removeFile = (path) => {
    return new Promise((resolve, reject) => {
        return api.delete(`/files/${path}`).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const handleButtonUrl = (url) => {
    return new Promise((resolve, reject) => {
        return api.get(url).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}