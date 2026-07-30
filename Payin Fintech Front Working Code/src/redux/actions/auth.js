// import {
//     LOGIN,
//     REGISTER,
//     GET_AUTH_USER,
//     UPDATE_AUTH_USER,
//     LOGOUT
// } from 'redux/actions/types';
// import { getAuthUser, login, register, updateAuthUser } from "requests/auth";
// import { removeCookie, setCookie } from "utils/cookie";
// import { toast } from 'react-toast';

// export const loginAction = (data) => (dispatch) => {
//     return new Promise((resolve, reject) => {
//         return login(data).then(response => {
//             dispatch({ type: LOGIN, payload: response.data });
//             setCookie(process.env.REACT_APP_TOKEN_NAME, response.data.access_token, 1);
//             resolve(response.data);
//         }).catch(err => {
//             reject(err);
//         })
//     })
// }


// export const logoutAction = () => (dispatch) => {
//     dispatch({ type: LOGOUT });
//     removeCookie(process.env.REACT_APP_TOKEN_NAME);
// }

// export const registerAction = (data) => (dispatch) => {
//     return new Promise((resolve, reject) => {
//         return register(data).then(response => {
//             dispatch({ type: REGISTER, payload: response.data });
//             setCookie(process.env.REACT_APP_TOKEN_NAME, response.data.access_token, 1);
//             resolve(response.data);
//         }).catch(err => {
//             toast.error(err.response.data.message);
//             reject(err);
//         })
//     })
// }

// export const getAuthUserAction = () => (dispatch) => {
//     return new Promise((resolve, reject) => {
//         return getAuthUser().then(response => {
//             dispatch({ type: GET_AUTH_USER, payload: response.data });
//             if (response.data?.access_token) {
//                     localStorage.setItem(
//                         "access_token",
//                         response.data.access_token
//                     );
//                 }

//             // setCookie(process.env.REACT_APP_TOKEN_NAME, response.data.access_token, 1);
//             resolve(response.data);
//         }).catch(err => {
//             reject(err);
//         })
//     })
// }

// export const updateAuthUserAction = (data) => (dispatch) => {
//     return new Promise((resolve, reject) => {
//         return updateAuthUser(data).then(response => {
//             dispatch({ type: UPDATE_AUTH_USER, payload: response.data });
//             resolve(response.data);
//         }).catch(err => {
//             reject(err);
//         })
//     })
// }


import {
    LOGIN,
    REGISTER,
    GET_AUTH_USER,
    UPDATE_AUTH_USER,
    LOGOUT
} from 'redux/actions/types';
import { getAuthUser, login, register, updateAuthUser } from "requests/auth";
import { removeCookie, setCookie, getCookie } from "utils/cookie";
import { toast } from 'react-toast';

export const loginAction = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return login(data).then(response => {
            dispatch({ type: LOGIN, payload: response.data });
            
            // ✅ FIX 1: Token cookie me store karo
            const token = response.data?.access_token || response.data?.token;
            if (token) {
                setCookie(process.env.REACT_APP_TOKEN_NAME, token, 1);
                // ✅ FIX 2: LocalStorage me bhi store karo (backup)
                localStorage.setItem(process.env.REACT_APP_TOKEN_NAME, token);
                // ✅ FIX 3: SessionStorage me bhi (extra backup)
                sessionStorage.setItem(process.env.REACT_APP_TOKEN_NAME, token);
            }
            
            resolve(response.data);
        }).catch(err => {
            reject(err);
        })
    })
}

export const logoutAction = () => (dispatch) => {
    dispatch({ type: LOGOUT });
    // ✅ FIX 4: Saari jagah se clear karo
    removeCookie(process.env.REACT_APP_TOKEN_NAME);
    localStorage.removeItem(process.env.REACT_APP_TOKEN_NAME);
    sessionStorage.removeItem(process.env.REACT_APP_TOKEN_NAME);
}

export const registerAction = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return register(data).then(response => {
            dispatch({ type: REGISTER, payload: response.data });
            
            // ✅ FIX 5: Register me bhi same logic
            const token = response.data?.access_token || response.data?.token;
            if (token) {
                setCookie(process.env.REACT_APP_TOKEN_NAME, token, 1);
                localStorage.setItem(process.env.REACT_APP_TOKEN_NAME, token);
                sessionStorage.setItem(process.env.REACT_APP_TOKEN_NAME, token);
            }
            
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response?.data?.message || 'Registration failed');
            reject(err);
        })
    })
}

export const getAuthUserAction = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        return getAuthUser().then(response => {
            dispatch({ type: GET_AUTH_USER, payload: response.data });
            
            // ✅ FIX 6: Yeh localStorage wala line hatado
            // ❌ REMOVE: localStorage.setItem("access_token", response.data.access_token);
            
            // ✅ FIX 7: Cookie me set karo agar token aaye
            const token = response.data?.access_token || response.data?.token;
            if (token) {
                setCookie(process.env.REACT_APP_TOKEN_NAME, token, 1);
                localStorage.setItem(process.env.REACT_APP_TOKEN_NAME, token);
                sessionStorage.setItem(process.env.REACT_APP_TOKEN_NAME, token);
            }
            
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