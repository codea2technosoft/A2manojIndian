import api from 'utils/api';
import { toast } from 'react-toast';

/**
 * Order API
 */

export const createOrder = (data) => {
    // console.warn(data);
    return new Promise((resolve, reject) => {
        // console.warn(data);
        return api
            .post('/partner/orders', data)
            .then((response) => {
                // alert('opop');
                resolve(response.data);
            })
            .catch((err) => {
                // alert('ppppp');
                toast.error(err.response.data.message);
                reject(err);
            });
    });
};

export const createpaylink = (data) => {
    // console.warn(data);
    return new Promise((resolve, reject) => {
        // console.warn(data);
        return api
            .post('/merchant-Paypal-payment-link', data)
            .then((response) => {
                // alert('opop');
                resolve(response.records);
            })
            .catch((err) => {
                // alert('ppppp');
                toast.error(err.response.data.message);
                reject(err);
            });
    });
};

export const getOrders = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/partner/orders', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
export const getBanklist = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/Payment-tranfer-bank-list')
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getOrdersAll = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/partner/orders/partner-all', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getchargebackAll = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/partner/orders/partner-chargeback-list', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getOrderspending = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/partner/orders/partner-pending', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const exportOrders = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .post('/partner/orders/export?type=pending', {}, { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
export const exportOrdersAll = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .post('/partner/orders/export?type=All', {}, { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
export const exportOrdersInprocess = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .post('/partner/orders/export?type=inprocess', {}, { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const exportOrdersSuccess = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .post('/partner/orders/export?type=success', {}, { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const exportOrdersFLD = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .post('/partner/orders/export?type=failed', {}, { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getOrderDetail = (id) => {
    return new Promise((resolve, reject) => {
        return api
            .get(`/merchant/orders/${id}`)
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const updateOrderDetail = (id, data) => {
    return new Promise((resolve, reject) => {
        return api
            .put(`/merchant/orders/${id}`, data)
            .then((response) => {
                toast.success('Update order successfully');
                resolve(response.data);
            })
            .catch((err) => {
                toast.error(err.response.data.message);
                reject(err);
            });
    });
};

export const addToShipment = (data) => {
    return new Promise((resolve, reject) => {
        return api
            .post(`/merchant/orders/shipment`, data)
            .then((response) => {
                toast.success('Success');
                resolve(response.data);
            })
            .catch((err) => {
                toast.error(err.response.data.message);
                reject(err);
            });
    });
};

/**
 * Settlements
 * @param {*} query
 * @returns
 */
export const getSettlements = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/partner/orders/settlements', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

/**
 * Recent transactions
 * @param {*} query
 * @returns
 */
export const getRecentTransactions = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/partner/orders/recent-transactions', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getPayoutOrders = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/Payout-dashboard', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
export const getPayInOrders = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/orders/merchant-payin-dashboard', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const payinPayoutList = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/Payout-Payout-transaction-list', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getPendingreport = (query) => {
    return new Promise((resolve, reject) => {
        return (
            api
                .get('/payout-transaction-all-list?type=pending', { params: query })
                // .get('/paypal-transaction-pending')
                .then((response) => {
                    resolve(response.data);
                })
                .catch((err) => {
                    reject(err);
                })
        );
    });
};
export const getInprocessreport = (query) => {
    return new Promise((resolve, reject) => {
        return (
            api
                .get('/payout-transaction-all-list?type=inprocess', { params: query })
                // .get('/paypal-transaction-pending')
                .then((response) => {
                    resolve(response.data);
                })
                .catch((err) => {
                    reject(err);
                })
        );
    });
};
export const getAllreport = (query) => {
    return new Promise((resolve, reject) => {
        return (
            api
                .get('/payout-transaction-all-list?type=All', { params: query })
                // .get('/paypal-transaction-pending')
                .then((response) => {
                    resolve(response.data);
                })
                .catch((err) => {
                    reject(err);
                })
        );
    });
};

export const getWalletPendingreport = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/topup-pending-dashbooard', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getPatinPendingreport = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/partner/orders/partner-pending', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getSuccessreport = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/payout-transaction-all-list?type=success', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getWalletSuccessreport = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/topup-success-dashbooard', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getPayinSuccessreport = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/partner/orders/partner-all?payment_status=2', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getPayinFaieldreport = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/partner/orders/partner-all?payment_status=7', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
export const getPayinRefundreport = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/partner/orders/partner-all?payment_status=4', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getFailedreport = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/payout-transaction-all-list?type=faild', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getWalletFailedreport = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/topup-faild-dashbooard', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const payoutPayouttransferList = (query) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/Payout-Payout-transaction-list-bulk', { params: query })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
