import { toast } from 'react-toast';
import api from 'utils/api';

export const getEmailTemplates = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/admin/email-templates', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const createEmailTemplate = (data) => {
	return new Promise((resolve, reject) => {
		return api
			.post('/admin/email-templates', data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				reject(err);
			});
	});
};

export const getEmailTemplate = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.get(`/admin/email-templates/${id}`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const updateEmailTemplate = (id, data) => {
	return new Promise((resolve, reject) => {
		return api
			.put(`/admin/email-templates/${id}`, data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};
