import api from 'utils/api';
import { toast } from 'react-toast';

export const getServices = (module_id, query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/admin/PartnerService/service/all/${module_id}`, { params: query }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const getActivedServices = (module_id, user_id, query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/admin/PartnerService/${module_id}/${user_id}`, { params: query }).then(response => {
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
        return api.post(`/admin/PartnerService`, data).then(response => {
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

export const updateService = (id, user_id, data) => {
    return new Promise((resolve, reject) => {
        return api.put(`/admin/PartnerService/${id}/${user_id}`, data).then(response => {
            resolve(response.data);
            toast.success("Your services is updated!");
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const getServiceDetail = (id, user_id) => {
    return new Promise((resolve, reject) => {
        return api.get(`/admin/PartnerService/detail/${id}/${user_id}`).then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}