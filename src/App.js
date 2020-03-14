import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './css/App.css';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import NewApplicationPage from './pages/NewApplicationPage/NewApplicationPage';
import userService from './utils/userService';

function App(props) {
    let pages = userService.getUser() ? (
        <Switch>
            <Route
                exact
                path="/new"
                render={({ history }) => (
                    <NewApplicationPage history={history} />
                )}
            />
            <Route exact path="/" render={() => <HomePage />} />
            <Route render={() => <Redirect to={{ pathname: '/' }} />} />
        </Switch>
    ) : (
        <Switch>
            <Route
                exact
                path="/login"
                render={({ history }) => <LoginPage history={history} />}
            />
            <Route
                exact
                path="/signup"
                render={({ history }) => <SignupPage history={history} />}
            />
            <Route exact path="/" render={() => <HomePage />} />
            <Route render={() => <Redirect to={{ pathname: '/login' }} />} />
        </Switch>
    );

    return (
        <div className="App">
            <Navbar history={props.history} />
            <main>{pages}</main>
            <footer>
                <div>Footer</div>
            </footer>
        </div>
    );
}

export default App;
