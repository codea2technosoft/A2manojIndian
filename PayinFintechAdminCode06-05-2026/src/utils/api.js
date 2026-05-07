import axios from 'axios';
import {
    getCookie,
    removeCookie
} from 'utils/cookie';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
    }
});

api.interceptors.request.use(function (config) {
    let accessToken = getCookie(process.env.REACT_APP_TOKEN_NAME);
    // Do something before request is sent
    if (accessToken) {
        config.headers.common['Authorization'] = "Bearer " + accessToken
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            removeCookie(process.env.REACT_APP_TOKEN_NAME)
            let message = "Session expired";
            if (error.response.data.message) {
                message = error.response.data.message;
            }
            console.log(message);

            if (['/login'].indexOf(window.location.pathname) < 0) {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error);
    }
);

export default api;