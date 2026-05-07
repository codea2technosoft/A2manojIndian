import { toast } from 'react-toast';
import api from 'utils/api';

export const getApps = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/admin/apps', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const createApp = (data) => {
	return new Promise((resolve, reject) => {
		return api
			.post('/admin/apps', data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				reject(err);
			});
	});
};

export const getApp = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.get(`/admin/apps/${id}`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const updateApp = (id, data) => {
	return new Promise((resolve, reject) => {
		return api
			.put(`/admin/apps/${id}`, data)
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

export const deleteApp = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.delete(`/admin/apps/${id}`)
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
