import api from 'utils/api';
import { toast } from 'react-toast';

export const getPublicPayoutsServices = (query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/service/payouts`, { params: query }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const getServices = (module_id, query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/merchant/service/all/${module_id}`, { params: query }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const getActivedServices = (module_id, query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/merchant/service/${module_id}`, { params: query }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const onboardServices = (data) => {
    return new Promise((resolve, reject) => {
        return api.post(`/merchant/service/onboarding`, data).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

// active one service
export const activeService = (data) => {
    return new Promise((resolve, reject) => {
        return api.post(`/merchant/service`, data).then(response => {
            resolve(response.data);
            toast.success("Your services is actived!");
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

// active many services
export const activeManyServices = (data) => {
    return new Promise((resolve, reject) => {
        return api.post(`/merchant/service/active`, data).then(response => {
            resolve(response.data);
            toast.success("Your services is actived!");
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const updateService = (id, data) => {
    return new Promise((resolve, reject) => {
        return api.put(`/merchant/service/${id}`, data).then(response => {
            resolve(response.data);
            toast.success("Your services is updated!");
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const getServiceDetail = (id) => {
    return new Promise((resolve, reject) => {
        return api.get(`/merchant/service/detail/${id}`).then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}