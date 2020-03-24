import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './css/App.css';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import NewApplicationPage from './pages/NewApplicationPage/NewApplicationPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ResumesPage from './pages/ResumesPage/ResumesPage';
import userService from './utils/userService';
import apiService from './utils/apiService';
import GitHubIcon from '@material-ui/icons/GitHub';
import { connect } from 'react-redux';
import { setResumes } from './redux/resume';
import { setApplications } from './redux/application';

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
            <Route
                exact
                path="/profile"
                render={({ history }) => <ProfilePage history={history} />}
            />
            <Route
                exact
                path="/resumes"
                render={({ history }) => <ResumesPage history={history} />}
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

    useEffect(() => {
        async function getData() {
            if (props.userFirstName) {
                const [resumes, applications] = await Promise.all([
                    apiService.getData('/api/resumes'),
                    apiService.getData('/api/applications')
                ]);
                await props.setApplications(applications);
                await props.setResumes(resumes);
            }
        }
        getData();
    }, [props.userFirstName]);

    return (
        <div className="App">
            <Navbar history={props.history} />
            <main>{pages}</main>
            <footer>
                <div>
                    <a href="https://github.com/roger-takeshita" target="blank">
                        <span>Developed by</span>&nbsp;Roger Takeshita&nbsp;
                        <GitHubIcon />
                    </a>
                </div>
            </footer>
        </div>
    );
}

const mapStateToProps = (state) => ({
    userFirstName: state.user ? state.user.firstName : ''
});

const mapsDispatchToProps = (dispatch) => ({
    setResumes: (data) => dispatch(setResumes(data)),
    setApplications: (data) => dispatch(setApplications(data))
});

export default connect(mapStateToProps, mapsDispatchToProps)(App);
