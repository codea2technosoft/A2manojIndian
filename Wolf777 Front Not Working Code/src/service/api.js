import { makeEncryptedRequest } from '../utils/encryption';

// const API_BASE = process.env.REACT_APP_BACKEND_LOCAL_API;

// const nodeMode = process.env.NODE_ENV;
// const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
// const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;

// const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

  const baseUrl = process.env.REACT_APP_BACKEND_API;


// // Slider API
// export const sliderAPI = {
//   getSliders: () => makeEncryptedRequest(`${API_BASE}/sliders`, {}),
//   getSliderById: (id) => makeEncryptedRequest(`${API_BASE}/sliders/${id}`, { id })
// };

// // Settings API
// export const settingsAPI = {
//   getSettings: () => makeEncryptedRequest(`${API_BASE}/settings`, {})
// };

// Slider API
export const sliderAPI = {
  getSliders: () => makeEncryptedRequest(`${baseUrl}/sliders`),
  getSliderById: (id) => makeEncryptedRequest(`${baseUrl}/sliders/${id}`),
};

// Settings API
export const settingsAPI = {
  getSettings: () => makeEncryptedRequest(`${baseUrl}/settings`),
};

export const headermenu = {
  getMenus: () => makeEncryptedRequest(`${baseUrl}/menu`, {}, "POST"),
};


