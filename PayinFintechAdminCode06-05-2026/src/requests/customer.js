import { toast } from 'react-toast';
import api from 'utils/api';

export const getCustomers = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/admin/customers', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const createCustomer = (data) => {
	return new Promise((resolve, reject) => {
		return api
			.post('/admin/customers', data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				reject(err);
			});
	});
};

export const getCustomer = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.get(`/admin/customers/${id}`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const deleteCustomer = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.delete(`/admin/customers/${id}`)
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

export const createCustomerAddress = (customerId, data) => {
	return new Promise((resolve, reject) => {
		return api
			.post(`/admin/customers/${customerId}/addresses`, data)
			.then((response) => {
				// toast.success('Success');
				resolve(response.data);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				reject(err);
			});
	});
};

export const deleteCustomerAddress = (customerId, id) => {
	return new Promise((resolve, reject) => {
		return api
			.delete(`/admin/customers/${customerId}/addresses/${id}`)
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
