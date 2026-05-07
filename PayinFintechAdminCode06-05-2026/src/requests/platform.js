import { toast } from 'react-toast';
import api from 'utils/api';

export const getPlatforms = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/admin/platforms', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const createPlatform = (data) => {
	return new Promise((resolve, reject) => {
		return api
			.post('/admin/platforms', data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				reject(err);
			});
	});
};

export const getPlatform = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.get(`/admin/platforms/${id}`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const updatePlatform = (id, data) => {
	return new Promise((resolve, reject) => {
		return api
			.put(`/admin/platforms/${id}`, data)
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

export const deletePlatform = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.delete(`/admin/platforms/${id}`)
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
