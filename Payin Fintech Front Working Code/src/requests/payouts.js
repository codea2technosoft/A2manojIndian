import api from 'utils/api';
import { toast } from 'react-toast';

export const getAvailableUsers = (query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/partner/payouts/users`, { params: query }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const createPayoutsAccount = (data) => {
    return new Promise((resolve, reject) => {
        return api.post(`/partner/payouts/accounts`, data).then(response => {
            resolve(response.data);
            toast.success('Create payouts account successfully');
        }).catch(err => {
            reject(err);
            toast.error(err.response.data.message);
        });
    })
}

export const getPayoutsAccounts = (query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/partner/payouts/accounts`, { params: query }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const getPayoutsAccount = (payoutsAccountId, query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/partner/payouts/accounts/${payoutsAccountId}`, { params: query }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

// export const getPayoutsBeneficiaryAccounts = (payoutsAccountId, query) => {
//     return new Promise((resolve, reject) => {
//         return api.get(`/partner/payouts/accounts/${payoutsAccountId}/beneficiary-accounts`, { params: query }).then(response => {
//             resolve(response.data);
//         }).catch(err => {
//             reject(err);
//         });
//     })
// }

export const getPayoutsBeneficiaryAccountsOfService = (serviceId, query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/partner/payouts/services/${serviceId}/beneficiary-accounts`, { params: query }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

// export const createPayoutsBeneficiaryAccount = (payoutsAccountId, data) => {
//     return new Promise((resolve, reject) => {
//         return api.post(`/partner/payouts/accounts/${payoutsAccountId}/beneficiary-accounts`, data).then(response => {
//             resolve(response.data);
//         }).catch(err => {
//             reject(err);
//         });
//     })
// }

export const getPayouts = (query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/partner/payouts`, { params: query }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const getPayoutsBeneficiaryAccounts = (query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/partner/payouts/beneficiary-accounts`, { params: query }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}


export const addgetPayoutsBeneficiaryAccounts = (query) => {
    return new Promise((resolve, reject) => {
        return api.get(`/Payment-tranfer-bank-list`, { params: query }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const createPayoutsBeneficiaryAccounts = (data) => {
    return new Promise((resolve, reject) => {
        return api.post(`/partner/payouts/beneficiary-accounts`, data).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}


export const newcreatePayoutsBeneficiaryAccounts = (data) => {
    return new Promise((resolve, reject) => {
        return api.post(`/Payment-tranfer-bank-add-payout`, data).then(response => {
            // console.warn(response.data);
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const updatePayoutsBeneficiaryAccounts = (id, data) => {
    return new Promise((resolve, reject) => {
        return api.put(`/partner/payouts/beneficiary-accounts/${id}`, data).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const deletePayoutsBeneficiaryAccounts = (id) => {
    return new Promise((resolve, reject) => {
        return api.delete(`/partner/payouts/beneficiary-accounts/${id}`).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}