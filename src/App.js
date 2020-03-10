import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import NewApplicationPage from './pages/NewApplicationPage/NewApplicationPage';

function App() {
    return (
        <div className="App">
            <Navbar />
            <main>
                <Switch>
                    <Route
                        exact
                        path="/new"
                        render={(props) => <NewApplicationPage {...props} />}
                    />
                    <Route
                        exact
                        path="/login"
                        render={({ history }) => (
                            <LoginPage history={history} />
                        )}
                    />
                    <Route
                        exact
                        path="/signup"
                        render={({ history }) => (
                            <SignupPage history={history} />
                        )}
                    />
                    <Route
                        exact
                        path="/"
                        render={(props) => <HomePage {...props} />}
                    />
                    <Route render={() => <Redirect to={{ pathname: '/' }} />} />
                </Switch>
            </main>
            <footer>
                <div>Footer</div>
            </footer>
        </div>
    );
}

export default App;
