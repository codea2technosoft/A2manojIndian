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

export const getCountry = (id) => {
    return new Promise((resolve, reject) => {
        return api.get(`/countries/${id}`).then(response => {
            resolve(response.data);
        }).catch(err => {
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

export const getState = (countryId, id) => {
    return new Promise((resolve, reject) => {
        return api.get(`/countries/${countryId}/states/${id}`).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}
