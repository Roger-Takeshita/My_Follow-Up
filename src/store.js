import { createStore, combineReducers, applyMiddleware } from 'redux';
import userReducer from './redux/user';
import resumeReducer from './redux/resume';
import applicationReducer from './redux/application';
import logger from 'redux-logger';

const reducers = combineReducers({
    user: userReducer,
    resume: resumeReducer,
    application: applicationReducer
});

const store = createStore(reducers, applyMiddleware(logger));

export default store;
