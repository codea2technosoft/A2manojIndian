import { toast } from 'react-toast';
import api from 'utils/api';

export const getCustomers = (query) => {
    return new Promise((resolve, reject) => {
        return api.get('/merchant/customers', {params: query}).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const createCustomer = (data) => {
	return new Promise((resolve, reject) => {
		return api
			.post('/merchant/customers', data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				reject(err);
			});
	});
};

export const updateCustomer = (id, data) => {
	return new Promise((resolve, reject) => {
		return api
			.put(`/merchant/customers/${id}`, data)
			.then((response) => {
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
			.post(`/merchant/customers/${customerId}/addresses`, data)
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
			.delete(`/merchant/customers/${customerId}/addresses/${id}`)
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