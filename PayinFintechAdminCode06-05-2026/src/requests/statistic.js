import api from "utils/api";

export const getPartnerSummary = (filters) => {
  return new Promise((resolve, reject) => {
    return api
      .get("/manager/summary/partners", { params: filters })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getOverviewSummary = (filter) => {
  return new Promise((resolve, reject) => {
    return api
      .get("/admin/summary/commission?per_page=10&page=1", { params: filter })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getSettlementSummary = () => {
  return new Promise((resolve, reject) => {
    return api
      .get("/partner/summary/settlements")
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getTransactionSummary = () => {
  return new Promise((resolve, reject) => {
    return api
      .get("/partner/summary/transactions")
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getOverviewadminSummary = (filter) => {
  return new Promise((resolve, reject) => {
    return api
      .get("/admin/summary/overview-admin", { params: filter })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const getOverviewadminSummaryMerchant = () => {
  return new Promise((resolve, reject) => {
    return api
      .get("/admin/summary/overview-admin-merchant-list")
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getOverviewadminmerchantList = () => {
  return new Promise((resolve, reject) => {
    return api
      .get("/admin/summary/overview-admin-merchant-list")
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getOverviewadminSummaryPayin = (filter) => {
  return new Promise((resolve, reject) => {
    return api
      .get("/admin/summary/overview-admin-payin", { params: filter })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const payoutgetPartnerSummary = (filters) => {
  return new Promise((resolve, reject) => {
    return api
      .get("/admin/partner/payout-partners", { params: filters })
      .then((response) => {
        console.warn(response.data);
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};



export const payoutgetPartnerSummarySecond = (filters) => {
  return new Promise((resolve, reject) => {
    return api
      .get("/admin/partner/payout-partners-list-accountwaise-second", { params: filters })
      .then((response) => {
        console.warn(response.data);
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const payingetPartnerSummary = (filters) => {
  return new Promise((resolve, reject) => {
    return api
      .get("/admin/partner/payin-partners", { params: filters })
      .then((response) => {
        console.warn(response.data);
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const payingetPartnerSummaryExport = (filters) => {
  return new Promise((resolve, reject) => {
    return api
      .get("/admin/summary/export-tansaction-payinAdminExport-list", {
        params: filters,
      })
      .then((response) => {
        console.warn(response.data);
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
