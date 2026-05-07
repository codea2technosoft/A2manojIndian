import { toast } from 'react-toast';
import api from 'utils/api';

export const getUsers = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/admin/users', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};




export const getAdminMerchantlist = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/admin/users/merchant-list', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const createUser = (data) => {
	return new Promise((resolve, reject) => {
		return api
			.post('/admin/users', data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				reject(err);
			});
	});
};

export const getUser = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.get(`/admin/users/${id}`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const fetchData1 = (query, page, per_page) => {
	return new Promise((resolve, reject) => {
	  return api
		.get('/admin/partner/paypal-transaction-list', {
		  params: { ...query, page, per_page }, // Ensure pagination params are passed correctly
		})
		.then((response) => {
		  resolve(response.data);
		  console.warn(response.data.length)
		})
		.catch((err) => {
		  reject(err);
		});
	});
  };
  
  

export const updateUser = (id, data) => {
	return new Promise((resolve, reject) => {
		return api
			.put(`/admin/users/${id}`, data)
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

export const deleteUser = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.delete(`/admin/users/${id}`)
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


export const deleteIPUser = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.delete(`/ip-whitelist-payout-delete/${id}`)
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

export const assignPermissions = (id, data) => {
	return new Promise((resolve, reject) => {
		return api
			.put(`/admin/users/${id}/permissions`, data)
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

export const assignUsersToParent = (data) => {
	return new Promise((resolve, reject) => {
		return api
			.post(`/admin/users/assign`, data)
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

export const unassignUsersFromParent = (data) => {
	return new Promise((resolve, reject) => {
		return api
			.post(`/admin/users/unassign`, data)
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

export const getUserStores = (id, query) => {
	return new Promise((resolve, reject) => {
		return api
			.get(`/admin/users/${id}/stores`, { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const getUserStore = (userId, id, query) => {
	return new Promise((resolve, reject) => {
		return api
			.get(`/admin/users/${userId}/stores/${id}`, { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const fetchUserAccessToken = (userId) => {
	return new Promise((resolve, reject) => {
		return api
			.post(`/admin/users/${userId}/access-token`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};



/**
 * User API
 */

export const getPartners = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/manager/partners', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};


export const getManager = (query,page,per_page) => {
	// alert('ppppp');
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


export const partnermanagerlistadmin = (query,page,per_page) => {
	// alert('ppppp');
	return new Promise((resolve, reject) => {
		return api
			.get('admin/admin-ledger-report/partner-manager-list-admin', { params: query,page:page,perPage:per_page })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};


export const getPartner = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.get(`/admin/partner/ListUserPayinChargeByAdmin/${id}`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};


// export const getMerchantCommision = (id) => {
// 	return new Promise((resolve, reject) => {
// 		return api
// 			.post(`/admin/partner/ListUserPayinChargeByAdmin/${id}`)
// 			.then((response) => {
// 				resolve(response.data);
// 			})
// 			.catch((err) => {
// 				reject(err);
// 			});
// 	});
// };



export const getManagerParnter = (id) => {
	const segment = window.location.pathname.split("/");
	
	return new Promise((resolve, reject) => {
		return api
			.get(`/manager/merchant/partners/${segment[2]}`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const updatePartner = (id, data) => {
	return new Promise((resolve, reject) => {
		return api
			.put(`/manager/partners/${id}`, data)
			.then((response) => {
				resolve(response.data);
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
export const partnerPaypalpermission = (id) => {

	return new Promise((resolve, reject) => {
		return api
			.post(`/manager/summary/partner-paypal-permission`, id)
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


export const paymentmode = (payload) => {
	return new Promise((resolve, reject) => {
	  return api
		.post(`/admin/permission_management/payment-mode-permission-set`, payload)
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


export const getUsersOfPartner = (partnerId, query) => {
	return new Promise((resolve, reject) => {
		return api
			.get(`/manager/partners/${partnerId}`, { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const updateUserOfPartner = (partnerId, userId, data) => {
	return new Promise((resolve, reject) => {
		return api
			.put(`/admin/partner/updateUserPayinChargeByAdmin/${partnerId}`, data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};


export const updateMerchanatLimit = (id, data) => {
	return new Promise((resolve, reject) => {
	  return api
		.put(`/admin/partner/merchant-commission-update/${id}`, data)
		.then((response) => {
		  resolve(response.data);
		})
		.catch((err) => {
		  reject(err);
		});
	});
  };

export const onboardUsersOfPartner = (partnerId, data) => {
	return new Promise((resolve, reject) => {
		return api
			.post(`/manager/partners/${partnerId}/users/onboarding`, data)
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const getSubUsers = (query) => {
	return new Promise((resolve, reject) => {
		return api
			.get('/manager/users', { params: query })
			.then((response) => {
				resolve(response.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};


export const updatemerchantordersdata = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.post(`/update-merchant-orders-data`, id)
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


export const deletemerchantlimitpayin = (id) => {
	return new Promise((resolve, reject) => {
		return api
			.get(`/admin/partner/merchant-commission-delete/${id}`)
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