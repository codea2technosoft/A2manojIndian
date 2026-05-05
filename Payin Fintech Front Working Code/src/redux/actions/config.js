import { 
    GET_CONFIG,
    SET_CONFIG
} from 'redux/actions/types';
import { getConfig } from "requests/config";

export const getConfigAction = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        return getConfig().then(response => {
            dispatch({ type: GET_CONFIG, payload: response.data.config });
            resolve(response.data);
        }).catch(err => {
            reject(err);
        })
    })
}

export const setConfigAction = (data) => (dispatch) => {
    dispatch({ type: SET_CONFIG, payload: data });
}