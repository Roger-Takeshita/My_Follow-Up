import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Route component={App} />
        </Router>
    </Provider>,
    document.getElementById('root')
);
