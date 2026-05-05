import { toast } from 'react-toast';
import api from 'utils/api';

export const getShipmentSettings = () => {
   return new Promise((resolve, reject) => {
      return api.get('merchant/shipment/config').then(response => {
         resolve(response.data);
      }).catch(error => {
         reject(error);
      })
   })
}

export const updateShipmentSettings = (data) => {
   return new Promise((resolve, reject) => {
      return api.post('merchant/shipment/config', data).then(response => {
         toast.success('Save shipment settings success');
         resolve(response.data);
      }).catch(error => {
         toast.error(error.response.data.message);
         reject(error);
      })
   })
}

export const getShipmentOrders = (filters = {}) => {
   return new Promise((resolve, reject) => {
      return api.get('merchant/shipment/orders', {params: filters}).then(response => {
         resolve(response.data);
      }).catch(error => {
         toast.error(error.response.data.message);
         reject(error);
      })
   })
}

export const getShipmentWarehouses = () => {
   return new Promise((resolve, reject) => {
      return api.get('merchant/shipment/warehouses').then(response => {
         resolve(response.data);
      }).catch(error => {
         toast.error(error.response.data.message);
         reject(error);
      })
   })
}

export const getAvailableCarriers = (data) => {
   return new Promise((resolve, reject) => {
      return api.post('merchant/shipment/carriers', data).then(response => {
         resolve(response.data);
      }).catch(error => {
         toast.error(error.response.data.message);
         reject(error);
      })
   })
}

export const bookOrders = (data) => {
   return new Promise((resolve, reject) => {
      return api.post('merchant/shipment/book', data).then(response => {
         toast.success(response.data.message);
         resolve(response.data);
      }).catch(error => {
         toast.error(error.response.data.message);
         reject(error);
      })
   })
}

export const rebookOrders = (data) => {
   return new Promise((resolve, reject) => {
      return api.post('merchant/shipment/rebook', data).then(response => {
         toast.success(response.data.message);
         resolve(response.data);
      }).catch(error => {
         toast.error(error.response.data.message);
         reject(error);
      })
   })
}

export const cancelOrders = (data) => {
   return new Promise((resolve, reject) => {
      return api.post('merchant/shipment/cancel', data).then(response => {
         resolve(response.data);
      }).catch(error => {
         toast.error(error.response.data.message);
         reject(error);
      })
   })
}

export const reverseOrders = (data) => {
   return new Promise((resolve, reject) => {
      return api.post('merchant/shipment/reverse', data).then(response => {
         toast.success(response.data.message);
         resolve(response.data);
      }).catch(error => {
         toast.error(error.response.data.message);
         reject(error);
      })
   })
}

export const getSlips = (data) => {
   return new Promise((resolve, reject) => {
      return api.post('merchant/shipment/slips', data).then(response => {
         resolve(response.data);
      }).catch(error => {
         toast.error(error.response.data.message);
         reject(error);
      })
   })
}

export const getTrackingStatus = (filters) => {
   return new Promise((resolve, reject) => {
      return api.get('merchant/shipment/tracking', {params: filters}).then(response => {
         resolve(response.data);
      }).catch(error => {
         toast.error(error.response.data.message);
         reject(error);
      })
   })
}

export const getManifests = (data) => {
   return new Promise((resolve, reject) => {
      return api.post('merchant/shipment/manifests', data).then(response => {
         resolve(response.data);
      }).catch(error => {
         toast.error(error.response.data.message);
         reject(error);
      })
   })
}

export const getBookingShipmentProgress = () => {
   return new Promise((resolve, reject) => {
      return api.get('merchant/shipment/booking-progress').then(response => {
         resolve(response.data);
      }).catch(error => {
         toast.error(error.response.data.message);
         reject(error);
      })
   })
}