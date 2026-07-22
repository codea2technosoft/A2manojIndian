

import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let permissionsLoaded = false;  

API.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const userType = localStorage.getItem("userType");
    const userId = localStorage.getItem("userId");

    if (userType === "subadmin" && !permissionsLoaded) {
      permissionsLoaded = true;
      try {
        const res = await API.get(`/sub-admin-permissions-list/${userId}`);
        if (res.data?.success && res.data?.data) {
          localStorage.setItem("permissions", JSON.stringify(res.data.data));
        }
      } catch (err) {
        console.error("Permission refresh failed:", err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
