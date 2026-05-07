import { toast } from 'react-toast';
import api from 'utils/api';

export const getServices = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/admin/services', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const createService = (data) => {
	return new Promise((resolve, reject) => {
		return api
			.post('/admin/services', data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				reject(err);
			});
	});
};

export const getService = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.get(`/admin/services/${id}`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const updateService = (id, data) => {
	return new Promise((resolve, reject) => {
		return api
			.put(`/admin/services/${id}`, data)
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

export const deleteService = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.delete(`/admin/services/${id}`)
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

export const getActivedPaymentServices = () => {
    return new Promise((resolve, reject) => {
        return api.get(`/service/payment`).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}