import api from 'utils/api';

/**
 * Order API
 */

export const subscribeTrialPlan = (plan_id) => {
    return new Promise((resolve, reject) => {
        return api.post('/merchant/subscribe/order/trial', {plan_id: plan_id}).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            reject(err);
        });
    });
};

export const subscribePaidPlan = (plan_id, type, is_auto_renew) => {
    return new Promise((resolve, reject) => {
        return api.post('/merchant/subscribe/order/paid', {plan_id: plan_id, subscription_type: type, is_auto_renew: is_auto_renew}).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            reject(err);
        });
    });
};

export const getSubscriptionResult = (txId) => {
    return new Promise((resolve, reject) => {
        return api.get('/merchant/subscribe/result', {params: {tx_id: txId}}).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            reject(err);
        });
    });
};

export const getSubscriptionsHistory = (query) => {
    return new Promise((resolve, reject) => {
        return api.get('/merchant/subscriptions', {params: query}).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            reject(err);
        });
    });
};