import { toast } from 'react-toast';
import api from 'utils/api';

/**
 * Country API
 */

export const getCountries = (query) => {
    return new Promise((resolve, reject) => {
        return api.get('/countries', {params: query}).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const createCountry = (data) => {
    return new Promise((resolve, reject) => {
        return api.post('/admin/countries', data).then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const getCountry = (id) => {
    return new Promise((resolve, reject) => {
        return api.get(`/countries/${id}`).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const updateCountry = (id, data) => {
    return new Promise((resolve, reject) => {
        return api.put(`/admin/countries/${id}`, data).then(response => {
            toast.success("Success");
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const deleteCountry = (id) => {
    return new Promise((resolve, reject) => {
        return api.delete(`/admin/countries/${id}`).then(response => {
            toast.success("Success");
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

/**
 * States API
 */

export const getStates = (countryId, query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/countries/${countryId}/states`, {params: query}).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const createState = (countryId, data) => {
    return new Promise((resolve, reject) => {
        return api.post(`/admin/countries/${countryId}/states`, data).then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const getState = (countryId, id) => {
    return new Promise((resolve, reject) => {
        return api.get(`/countries/${countryId}/states/${id}`).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const updateState = (countryId, id, data) => {
    return new Promise((resolve, reject) => {
        return api.put(`/admin/countries/${countryId}/states/${id}`, data).then(response => {
            toast.success("Success");
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const deleteState = (countryId, id) => {
    return new Promise((resolve, reject) => {
        return api.delete(`/admin/countries/${countryId}/states/${id}`).then(response => {
            toast.success("Success");
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}