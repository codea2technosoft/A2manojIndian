import { 
    GET_CONFIG,
    SAVE_CONFIG
} from 'redux/actions/types';
import { getConfig, saveConfig } from "requests/config";

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

export const saveConfigAction = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return saveConfig(data).then(response => {
            dispatch({ type: SAVE_CONFIG, payload: response.data.config });
            resolve(response.data);
        }).catch(err => {
            reject(err);
        })
    })
}