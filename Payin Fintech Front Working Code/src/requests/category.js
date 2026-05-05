import api from 'utils/api';

/**
 * Order API
 */

export const getCategories = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/merchant/categories', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const getCategory = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.get(`/merchant/categories/${id}`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};
