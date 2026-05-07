import { toast } from 'react-toast';
import api from 'utils/api';

export const getEvents = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/admin/notification-events', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const createEvent = (data) => {
	return new Promise((resolve, reject) => {
		return api
			.post('/admin/notification-events', data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				reject(err);
			});
	});
};

export const getEvent = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.get(`/admin/notification-events/${id}`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const updateEvent = (id, data) => {
	return new Promise((resolve, reject) => {
		return api
			.put(`/admin/notification-events/${id}`, data)
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

export const deleteEvent = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.delete(`/admin/notification-events/${id}`)
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

export const getWhatsappTemplates = (params) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/admin/notification/whatsapp/templates', { params })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				reject(err);
			});
	});
};
