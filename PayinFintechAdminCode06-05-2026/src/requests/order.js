import api from "utils/api";
import { toast } from "react-toast";

/**
 * Order API
 */

export const exportOrders = (query) => {
  return new Promise((resolve, reject) => {
    return api
      .post("/admin/summary/export-tansaction-list", {}, { params: query })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const exportOrdersPayout = (query) => {
  return new Promise((resolve, reject) => {
    return api
      .post(
        "/admin/summary/export-payout-tansaction-list",
        {},
        { params: query },
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};



export const exportOrdersPayoutSecond = async (query) => {
  const response = await api.get(
    "/admin/partner/payout-partners-list-accountwaise-second",
    {
      params: query,
    }
  );

  return response.data;
};

/**
 * Settlements
 * @param {*} query
 * @returns
 */

export const getSettlements = (query) => {
  return new Promise((resolve, reject) => {
    return api
      .get("/manager/orders/settlements", { params: query })

      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createSettlement = (data) => {
  return new Promise((resolve, reject) => {
    return api
      .post("/manager/orders/settlements", data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateSettlement = (id, data) => {
  return new Promise((resolve, reject) => {
    return api
      .put(`/manager/orders/settlements/${id}`, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Transjaction order

export const updateOrderDetail = (id, data) => {
  return new Promise((resolve, reject) => {
    return api
      .put(`/admin/partner/transaction/${id}`, data)
      .then((response) => {
        toast.success("Update order successfully");
        resolve(response.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        reject(err);
      });
  });
};
export const updateOrderPayoutDetail = (id, data) => {
  return new Promise((resolve, reject) => {
    return api
      .put(`/merchant/orders/payout/${id}`, data)
      .then((response) => {
        toast.success("Update order successfully");
        resolve(response.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        reject(err);
      });
  });
};

export const getOrderDetail = (id) => {
  return new Promise((resolve, reject) => {
    return api
      .get(`/merchant/orders/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getOrders = (query) => {
  return new Promise((resolve, reject) => {
    return api
      .get("/admin/partner/transactionlist", { params: query })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getWalletPendingreport = (query, idname) => {
  return new Promise((resolve, reject) => {
    return api
      .get(`/admin/partner/pending/${idname}`, { params: query })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getWalletFailedreport = (query, idname) => {
  return new Promise((resolve, reject) => {
    return api
      .get(`/admin/partner/faild/${idname}`, { params: query })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getWalletSuccessreport = (query, idname) => {
  return new Promise((resolve, reject) => {
    return api
      .get(`/admin/partner/success/${idname}`, { params: query })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
////////////manualsettlement new apis

export const getManualSettlementsPayinListsreport = (query, idname) => {
  return new Promise((resolve, reject) => {
    return api
      .get(`/admin/partner/Payin-Manual-Settlement-List/${idname}`, {
        params: query,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getManualSettlementsPayoutreport = (query, idname) => {
  return new Promise((resolve, reject) => {
    return api
      .get(`/admin/partner/Payout-Manual-Settlement-List/${idname}`, {
        params: query,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
