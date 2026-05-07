import { toast } from 'react-toast';
import api from 'utils/api';

export const getSubscriptions = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/admin/subscriptions', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const updateSubscription = (id, data) => {
	return new Promise((resolve, reject) => {
		return api
			.put(`/admin/subscriptions/${id}`, data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};