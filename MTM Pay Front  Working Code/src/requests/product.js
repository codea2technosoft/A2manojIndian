import api from 'utils/api';

/**
 * Order API
 */

export const getProducts = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/merchant/products', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const getProduct = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.get(`/merchant/products/${id}`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};
