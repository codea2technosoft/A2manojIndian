import api from 'utils/api';

export const getSms = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/partner/sms', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};
