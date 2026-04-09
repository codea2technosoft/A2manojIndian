import {
    LOGIN,
    REGISTER,
    GET_AUTH_USER,
    UPDATE_AUTH_USER,
    LOGOUT
} from 'redux/actions/types';
import { getAuthUser, login, register, updateAuthUser } from "requests/auth";
import { removeCookie, setCookie } from "utils/cookie";
import { toast } from 'react-toast';

export const loginAction = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return login(data).then(response => {
            dispatch({ type: LOGIN, payload: response.data });
            setCookie(process.env.REACT_APP_TOKEN_NAME, response.data.access_token, 1);
            resolve(response.data);
        }).catch(err => {
            reject(err);
        })
    })
}


export const logoutAction = () => (dispatch) => {
    dispatch({ type: LOGOUT });
    removeCookie(process.env.REACT_APP_TOKEN_NAME);
}

export const registerAction = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return register(data).then(response => {
            dispatch({ type: REGISTER, payload: response.data });
            setCookie(process.env.REACT_APP_TOKEN_NAME, response.data.access_token, 1);
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        })
    })
}

export const getAuthUserAction = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        return getAuthUser().then(response => {
            dispatch({ type: GET_AUTH_USER, payload: response.data });
            setCookie(process.env.REACT_APP_TOKEN_NAME, response.data.access_token, 1);
            resolve(response.data);
        }).catch(err => {
            reject(err);
        })
    })
}

export const updateAuthUserAction = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return updateAuthUser(data).then(response => {
            dispatch({ type: UPDATE_AUTH_USER, payload: response.data });
            resolve(response.data);
        }).catch(err => {
            reject(err);
        })
    })
}