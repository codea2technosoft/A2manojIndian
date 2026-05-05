import api from 'utils/api';

export const getTransactions = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/partner/transactions/manual', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const updateTransaction = (id, data) => {
	return new Promise((resolve, reject) => {
		return api
			.put(`/partner/transactions/manual/${id}`, data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const getRecentTransactions = () => {
    return new Promise((resolve, reject) => {
        return api.get('/partner/transactions/recent').then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}