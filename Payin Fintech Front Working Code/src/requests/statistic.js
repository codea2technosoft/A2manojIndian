import api from 'utils/api';

export const getOverviewSummary = (filters) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/partner/summary/overview', { params: filters })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
export const Payout_payin_bank_transaction_filter = (filters) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/Payout-payin-bank-transaction-list', { params: filters })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getOrderSummary = () => {
    return new Promise((resolve, reject) => {
        return api
            .get('/partner/summary/orders')
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getSettlementSummary = () => {
    return new Promise((resolve, reject) => {
        return api
            .get('/partner/summary/settlements')
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getTransactionSummary = () => {
    return new Promise((resolve, reject) => {
        return api
            .get('/partner/summary/transactions')
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getPaymentMethodSummary = () => {
    return new Promise((resolve, reject) => {
        return api
            .get('/partner/summary/payment-method')
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getPayoutOverviewSummary = (filters) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/Payout-dashboard', { params: filters })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
export const getPayInOverviewSummary = (filters) => {
    return new Promise((resolve, reject) => {
        return api
            .get('/orders/merchant-payin-dashboard', { params: filters })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
