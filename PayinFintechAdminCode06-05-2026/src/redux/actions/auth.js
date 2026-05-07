import { 
    LOGIN, 
    GET_AUTH_USER,
    LOGOUT
} from 'redux/actions/types';
import { getAuthUser, login } from "requests/auth";
import { setCookie, removeCookie } from "utils/cookie";

export const loginAction = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return login(data).then(response => {
            dispatch({ type: LOGIN, payload: response.data });
            setCookie(process.env.REACT_APP_TOKEN_NAME, response.data.access_token, 1 / 24);
            resolve(response.data);
        }).catch(err => {
            reject(err);
        })
    })
}

export const getAuthUserAction = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        return getAuthUser().then(response => {
            dispatch({ type: GET_AUTH_USER, payload: response.data });
            setCookie(process.env.REACT_APP_TOKEN_NAME, response.data.access_token, 1 / 24);
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