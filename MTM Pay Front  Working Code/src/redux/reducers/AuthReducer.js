import {
    LOGIN,
    REGISTER,
    GET_AUTH_USER,
    UPDATE_AUTH_USER,
    LOGOUT
} from 'redux/actions/types';

const INIT_STATE = {
    authUser: null
};

const authReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LOGIN: {
            return { ...state, authUser: action.payload.user };
        }
        case REGISTER: {
            return { ...state, authUser: action.payload.user };
        }
        case GET_AUTH_USER: {
            return { ...state, authUser: action.payload.user };
        }
        case UPDATE_AUTH_USER: {
            return { ...state, authUser: action.payload.user };
        }
        case LOGOUT: {
            return { ...state, authUser: null };
        }
        default: {
            return { ...state };
        }
    }
}

export default authReducer;