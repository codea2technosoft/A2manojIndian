import {
    GET_CONFIG,
    SAVE_CONFIG
} from 'redux/actions/types';

const INIT_STATE = {};

const configReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_CONFIG: {
            return action.payload;
        }
        case SAVE_CONFIG: {
            return action.payload;
        }
        default: {
            return { ...state };
        }
    }
}

export default configReducer;