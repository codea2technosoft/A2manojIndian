import api from 'utils/api';

/**
 * User API
 */

export const getUsers = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/partner/users', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const updateUser = (id, data) => {
	return new Promise((resolve, reject) => {
		return api
			.put(`/partner/users/${id}`, data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const onboardUsers = (data) => {
	return new Promise((resolve, reject) => {
		return api
			.post('/partner/users/onboarding', data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};


export const getManager = (query,page,per_page) => {
	
	return new Promise((resolve, reject) => {
		return api
			.get('/admin/partner/list', { params: query,page:page,perPage:per_page })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const partnerpayoutpayinpermission = (id) => {

	return new Promise((resolve, reject) => {
		return api
			.post(`/manager/summary/partner-payin-permission`, id)
			.then((response) => {
				resolve(response.data);
				getManager();
				console.warn(response);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const partnerpayoutpayoutpermission = (id) => {

	return new Promise((resolve, reject) => {
		return api
			.post(`/manager/summary/partner-payout-permission`, id)
			.then((response) => {
				resolve(response.data);
				getManager();
				console.warn(response);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const updatePartnerPayinPayout = (id) => {

	return new Promise((resolve, reject) => {
		return api
			.post(`/manager/partners/payinpayout`, id)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};


///////////////my api IND 03-04-2026
// GET: Payment-tranfer-bank-edit/{id}
export const Paymenttranferbankedit = (id) => {
	return api
		.get(`/Payment-tranfer-bank-edit/${id}`)
		.then((response) => response.data)
		.catch((err) => Promise.reject(err));
};


// POST: Payment-tranfer-bank-update
export const Paymenttranferbankupdate = (data) => {
	return api
		.post(`/Payment-tranfer-bank-update`, {
			id: data.id,
			name: data.name,
			bank_name: data.bank_name,
			ifsc_code: data.ifsc_code,
			account_number: data.account_number,
		})
		.then((response) => response.data)
		.catch((err) => Promise.reject(err));
};