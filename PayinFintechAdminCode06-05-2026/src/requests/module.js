import { toast } from 'react-toast';
import api from 'utils/api';

export const getModules = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/admin/partner/modules', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const createModule = (data) => {
	return new Promise((resolve, reject) => {
		return api
			.post('/admin/partner/modules', data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				reject(err);
			});
	});
};

export const getModule = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.get(`/admin/partner/modules/${id}`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const updateModule = (id, data) => {
	return new Promise((resolve, reject) => {
		return api
			.put(`/admin/partner/modules/${id}`, data)
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

export const deleteModule = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.delete(`/admin/partner/modules/${id}`)
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
