import { createStore, combineReducers, applyMiddleware } from 'redux';
import userReducer from './redux/user';
import resumeReducer from './redux/resume';
import logger from 'redux-logger';

const reducers = combineReducers({
    user: userReducer,
    resumes: resumeReducer
});

const store = createStore(reducers, applyMiddleware(logger));

export default store;
