import {combineReducers} from 'redux';
import AuthReducer from 'redux/reducers/AuthReducer';
import ConfigReducer from 'redux/reducers/ConfigReducer';

const rootReducer = combineReducers({
    auth: AuthReducer,
    config: ConfigReducer
});

export default rootReducer;