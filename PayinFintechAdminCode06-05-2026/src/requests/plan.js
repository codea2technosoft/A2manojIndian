import { toast } from 'react-toast';
import api from 'utils/api';

export const getPlans = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/admin/plans', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const createPlan = (data) => {
	return new Promise((resolve, reject) => {
		return api
			.post('/admin/plans', data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				reject(err);
			});
	});
};

export const getPlan = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.get(`/admin/plans/${id}`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const updatePlan = (id, data) => {
	return new Promise((resolve, reject) => {
		return api
			.put(`/admin/plans/${id}`, data)
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

export const deletePlan = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.delete(`/admin/plans/${id}`)
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
