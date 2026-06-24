// import axios from "axios";

// const API = axios.create({
//   baseURL: process.env.REACT_APP_API_URL,
//   headers: {
//     "Content-Type": "application/json",
    
//   },
// });

// // Token automatically add karne ke liye
// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Auto logout on token expiry
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.clear();
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );
// export default API;


import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================================
// ⭐ LOAD SUBADMIN PERMISSIONS ON REFRESH
// =========================================
let permissionsLoaded = false;  // ensures one-time execution per refresh

API.interceptors.request.use(
  async (config) => {
    // 🟢 Token add karo
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🟢 SUBADMIN HO TABHI CALL KARO
    const userType = localStorage.getItem("userType");
    const userId = localStorage.getItem("userId");

    if (userType === "subadmin" && !permissionsLoaded) {
      permissionsLoaded = true; // prevent multiple API hits on same refresh

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

// =========================================
// ⭐ AUTO LOGOUT ON TOKEN EXPIRE
// =========================================
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
