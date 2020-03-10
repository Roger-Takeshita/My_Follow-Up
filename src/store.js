import { createStore, combineReducers, applyMiddleware } from 'redux';
import userReducer from './redux/user';
import logger from 'redux-logger';

const rootReducer = combineReducers({
    userReducer
});

const store = createStore(rootReducer, applyMiddleware(logger));

export default store;
