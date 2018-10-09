import { combineReducers } from 'redux';
import loginReducer from 'containers/Login/login.reducer';



export default combineReducers({
    login: loginReducer
});